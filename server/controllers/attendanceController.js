const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const { AppError } = require("../middleware/errorMiddleware");
const attendanceService = require("../services/attendanceService");
const Student = require("../models/Student");

// ─────────────────────────────────────────
// @route   GET /api/v1/attendance/active-sessions
// @access  Private — Student
// ─────────────────────────────────────────
const getActiveSessions = asyncHandler(async (req, res) => {
  const sessions = await attendanceService.getActiveSessions(req.query);

  sendResponse(res, {
    message:
      sessions.length > 0
        ? `${sessions.length} active session(s) found.`
        : "No active attendance sessions at the moment.",
    data: { sessions, count: sessions.length },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/attendance/validate-qr
// @access  Private — Student
// ─────────────────────────────────────────
const validateQR = asyncHandler(async (req, res) => {
  const { qrToken } = req.body;

  const session = await attendanceService.validateQRToken(qrToken);

  sendResponse(res, {
    message: "QR code is valid. Please proceed with location verification.",
    data: {
      session: {
        _id: session._id,
        sessionCode: session.sessionCode,
        subject: session.subject,
        className: session.className,
        roomNumber: session.roomNumber,
        startTime: session.startTime,
        endTime: session.endTime,
        radius: session.radius,
        requireLocationVerification: session.requireLocationVerification,
        teacher: session.teacher,
      },
    },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/attendance/verify-location
// @access  Private — Student
// ─────────────────────────────────────────
const verifyLocation = asyncHandler(async (req, res) => {
  const { sessionId, latitude, longitude } = req.body;

  const result = await attendanceService.verifyLocation(
    sessionId,
    latitude,
    longitude,
  );

  sendResponse(res, {
    message: result.withinRadius
      ? `✅ Location verified. You are ${result.distance}m from the classroom.`
      : `❌ Outside radius. You are ${result.distance}m from the classroom (limit: ${result.radius}m).`,
    data: result,
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/attendance/mark
// @access  Private — Student
// ─────────────────────────────────────────
const markAttendance = asyncHandler(async (req, res) => {
  const { sessionId, qrToken, latitude, longitude } = req.body;

  // Resolve student profile _id
  const studentProfile = await Student.findOne({ user: req.user._id }).select(
    "_id",
  );

  const { record, alreadyMarked } = await attendanceService.markAttendance({
    userId: req.user._id,
    studentProfileId: studentProfile?._id,
    sessionId,
    qrToken,
    studentLat: latitude,
    studentLng: longitude,
    deviceInfo: {
      userAgent: req.headers["user-agent"] || "",
      ipAddress: req.ip || req.connection?.remoteAddress || "",
      platform: req.headers["sec-ch-ua-platform"] || "",
    },
  });

  if (alreadyMarked) {
    return sendResponse(res, {
      statusCode: 200,
      message: "Attendance was already recorded for this session.",
      data: { record, alreadyMarked: true },
    });
  }

  sendResponse(res, {
    statusCode: 201,
    message: `🎉 Attendance marked as ${record.status} for ${record.session?.subject || "this session"}.`,
    data: { record },
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/attendance/history
// @access  Private — Student
// ─────────────────────────────────────────
const getAttendanceHistory = asyncHandler(async (req, res) => {
  const result = await attendanceService.getAttendanceHistory(
    req.user._id,
    req.query,
  );

  sendResponse(res, {
    message: "Attendance history fetched.",
    data: result.records,
    meta: result.pagination,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/attendance/:attendanceId
// @access  Private — Student
// ─────────────────────────────────────────
const getAttendanceDetail = asyncHandler(async (req, res) => {
  const record = await attendanceService.getAttendanceDetail(
    req.params.attendanceId,
    req.user._id,
  );

  sendResponse(res, {
    message: "Attendance record fetched.",
    data: { record },
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/attendance/summary
// @access  Private — Student
// ─────────────────────────────────────────
const getAttendanceSummary = asyncHandler(async (req, res) => {
  const Attendance = require("../models/Attendance");

  const allRecords = await Attendance.find({ student: req.user._id });

  const present = allRecords.filter((r) => r.status === "present").length;
  const late = allRecords.filter((r) => r.status === "late").length;
  const absent = allRecords.filter((r) => r.status === "absent").length;
  const total = allRecords.length;
  const attended = present + late;
  const pct = total > 0 ? Math.round((attended / total) * 100) : 0;

  const goal = 90;
  const needed =
    pct < goal && total > 0
      ? Math.max(Math.ceil((goal * total - attended * 100) / (100 - goal)), 0)
      : 0;

  sendResponse(res, {
    message: "Attendance summary fetched.",
    data: {
      totalClasses: total,
      present,
      late,
      absent,
      attended,
      overallPercentage: pct,
      goal,
      classesNeededForGoal: needed,
    },
  });
});

module.exports = {
  getActiveSessions,
  validateQR,
  verifyLocation,
  markAttendance,
  getAttendanceHistory,
  getAttendanceDetail,
  getAttendanceSummary,
};
