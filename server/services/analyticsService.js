const AttendanceSession = require("../models/AttendanceSession");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

/**
 * Build the teacher's main dashboard summary.
 */
const getTeacherDashboard = async (teacherId) => {
  const [totalSessions, activeSessions, todaySessions, allAttendance] =
    await Promise.all([
      AttendanceSession.countDocuments({ teacher: teacherId }),
      AttendanceSession.countDocuments({
        teacher: teacherId,
        status: "active",
      }),
      AttendanceSession.countDocuments({
        teacher: teacherId,
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      }),
      Attendance.find({ teacher: teacherId }),
    ]);

  const present = allAttendance.filter((a) => a.status === "present").length;
  const total = allAttendance.length;
  const avgPct = total > 0 ? Math.round((present / total) * 100) : 0;

  // Recent 5 sessions
  const recentSessions = await AttendanceSession.find({ teacher: teacherId })
    .sort({ createdAt: -1 })
    .limit(5);

  // Today's attendance records
  const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
  const todayAttendance = await Attendance.find({
    teacher: teacherId,
    markedAt: { $gte: startOfDay },
  }).populate("student", "firstName lastName avatar");

  return {
    stats: {
      totalSessions,
      activeSessions,
      todaySessions,
      totalAttendanceRecords: total,
      presentToday: todayAttendance.filter((a) => a.status === "present")
        .length,
      averageAttendance: avgPct,
    },
    recentSessions,
    todayAttendance,
  };
};

/**
 * Per-session attendance report with student breakdown.
 */
const getSessionReport = async (sessionId, teacherId) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  });
  if (!session) return null;

  const records = await Attendance.find({ session: sessionId })
    .populate("student", "firstName lastName email phone avatar")
    .populate(
      "studentProfile",
      "enrollmentNo rollNumber branch semester section",
    )
    .sort({ markedAt: 1 });

  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const suspicious = records.filter((r) => r.isSuspicious).length;
  const total = records.length;

  return {
    session,
    summary: {
      total,
      present,
      absent,
      late,
      suspicious,
      attendancePercentage: total > 0 ? Math.round((present / total) * 100) : 0,
    },
    records,
  };
};

/**
 * Teacher-wide analytics: monthly trends, subject breakdown, at-risk students.
 */
const getTeacherAnalytics = async (teacherId) => {
  // Monthly attendance percentage for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyData = await Attendance.aggregate([
    {
      $match: {
        teacher: teacherId,
        markedAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$markedAt" },
          month: { $month: "$markedAt" },
        },
        total: { $sum: 1 },
        present: {
          $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Subject-wise attendance
  const subjectData = await Attendance.aggregate([
    { $match: { teacher: teacherId } },
    {
      $lookup: {
        from: "attendancesessions",
        localField: "session",
        foreignField: "_id",
        as: "sessionDoc",
      },
    },
    { $unwind: "$sessionDoc" },
    {
      $group: {
        _id: "$sessionDoc.subject",
        total: { $sum: 1 },
        present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
      },
    },
    {
      $project: {
        subject: "$_id",
        total: 1,
        present: 1,
        pct: {
          $round: [
            { $multiply: [{ $divide: ["$present", "$total"] }, 100] },
            1,
          ],
        },
      },
    },
    { $sort: { pct: -1 } },
  ]);

  // At-risk students (below 75%)
  const atRiskStudents = await Student.find({
    "attendanceStats.overallPercentage": { $lt: 75 },
  })
    .populate("user", "firstName lastName email avatar")
    .sort({ "attendanceStats.overallPercentage": 1 })
    .limit(10);

  // Weekly trend — last 8 weeks
  const weeklyTrend = await Attendance.aggregate([
    {
      $match: {
        teacher: teacherId,
        markedAt: { $gte: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: { $week: "$markedAt" },
        total: { $sum: 1 },
        present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return { monthlyData, subjectData, atRiskStudents, weeklyTrend };
};

module.exports = { getTeacherDashboard, getSessionReport, getTeacherAnalytics };
