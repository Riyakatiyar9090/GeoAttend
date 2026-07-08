const Attendance = require("../models/Attendance");
const AttendanceSession = require("../models/AttendanceSession");
const Student = require("../models/Student");

/**
 * Student dashboard — summary cards + recent activity.
 */
const getStudentDashboard = async (userId) => {
  const student = await Student.findOne({ user: userId });

  const [allRecords, todayRecords, recentRecords, activeSessions] =
    await Promise.all([
      Attendance.find({ student: userId }),
      Attendance.find({
        student: userId,
        markedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }).populate("session", "subject startTime endTime roomNumber"),
      Attendance.find({ student: userId })
        .sort({ markedAt: -1 })
        .limit(5)
        .populate("session", "subject startTime endTime date"),
      AttendanceSession.find({ status: "active" })
        .populate("teacher", "firstName lastName")
        .sort({ createdAt: -1 })
        .limit(3),
    ]);

  const present = allRecords.filter((r) => r.status === "present").length;
  const late = allRecords.filter((r) => r.status === "late").length;
  const absent = allRecords.filter((r) => r.status === "absent").length;
  const total = allRecords.length;
  const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  return {
    stats: {
      overallAttendance: pct,
      totalClasses: total,
      present: present + late,
      absent,
      currentStreak: student?.attendanceStats?.currentStreak || 0,
      longestStreak: student?.attendanceStats?.longestStreak || 0,
      activeSessionsCount: activeSessions.length,
    },
    todayRecords,
    recentActivity: recentRecords,
    activeSessions,
  };
};

/**
 * Full analytics — trends, subject breakdown, heatmap, achievements.
 */
const getStudentAnalytics = async (userId) => {
  const student = await Student.findOne({ user: userId });

  // Monthly trend — last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await Attendance.aggregate([
    {
      $match: {
        student: userId,
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
          $sum: { $cond: [{ $in: ["$status", ["present", "late"]] }, 1, 0] },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
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
  ]);

  // Subject-wise breakdown
  const subjectBreakdown = await Attendance.aggregate([
    { $match: { student: userId } },
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
        present: {
          $sum: { $cond: [{ $in: ["$status", ["present", "late"]] }, 1, 0] },
        },
        absent: {
          $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
        },
        late: {
          $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] },
        },
        faculty: { $first: "$sessionDoc.teacher" },
      },
    },
    {
      $project: {
        subject: "$_id",
        total: 1,
        present: 1,
        absent: 1,
        late: 1,
        pct: {
          $round: [
            { $multiply: [{ $divide: ["$present", "$total"] }, 100] },
            1,
          ],
        },
        status: {
          $switch: {
            branches: [
              {
                case: { $gte: [{ $divide: ["$present", "$total"] }, 0.9] },
                then: "Excellent",
              },
              {
                case: { $gte: [{ $divide: ["$present", "$total"] }, 0.75] },
                then: "Good",
              },
              {
                case: { $gte: [{ $divide: ["$present", "$total"] }, 0.6] },
                then: "Warning",
              },
            ],
            default: "Critical",
          },
        },
      },
    },
    { $sort: { pct: -1 } },
  ]);

  // Daily trend — last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const dailyTrend = await Attendance.aggregate([
    {
      $match: {
        student: userId,
        markedAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$markedAt" } },
        total: { $sum: 1 },
        present: {
          $sum: { $cond: [{ $in: ["$status", ["present", "late"]] }, 1, 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        date: "$_id",
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
  ]);

  // Pie — overall distribution
  const allRecords = await Attendance.find({ student: userId });
  const pieData = {
    present: allRecords.filter((r) => r.status === "present").length,
    late: allRecords.filter((r) => r.status === "late").length,
    absent: allRecords.filter((r) => r.status === "absent").length,
  };

  // Attendance goal progress
  const total = allRecords.length;
  const attended = pieData.present + pieData.late;
  const current = total > 0 ? Math.round((attended / total) * 100) : 0;
  const goal = 90;
  // Classes needed to reach goal
  let classesNeeded = 0;
  if (current < goal && total > 0) {
    classesNeeded = Math.max(
      Math.ceil((goal * total - attended * 100) / (100 - goal)),
      0,
    );
  }

  return {
    overview: {
      overallPct: current,
      goal,
      classesNeeded,
      streak: student?.attendanceStats?.currentStreak || 0,
      longestStreak: student?.attendanceStats?.longestStreak || 0,
    },
    monthlyTrend,
    subjectBreakdown,
    dailyTrend,
    pieData,
  };
};

module.exports = { getStudentDashboard, getStudentAnalytics };
