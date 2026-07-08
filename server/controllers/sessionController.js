const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const { AppError } = require("../middleware/errorMiddleware");
const sessionService = require("../services/sessionService");
const qrService = require("../services/qrService");
const analyticsService = require("../services/analyticsService");

// ─────────────────────────────────────────
// @route   POST /api/v1/sessions
// @access  Private — Teacher
// ─────────────────────────────────────────
const createSession = asyncHandler(async (req, res) => {
  const session = await sessionService.createSession(req.user._id, req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Attendance session created successfully.",
    data: { session },
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/sessions
// @access  Private — Teacher
// ─────────────────────────────────────────
const getSessions = asyncHandler(async (req, res) => {
  const result = await sessionService.getTeacherSessions(
    req.user._id,
    req.query,
  );

  sendResponse(res, {
    message: "Sessions fetched successfully.",
    data: result.sessions,
    meta: result.pagination,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/sessions/:sessionId
// @access  Private — Teacher
// ─────────────────────────────────────────
const getSession = asyncHandler(async (req, res) => {
  const { AttendanceSession } = require("../models/AttendanceSession");
  const session = await require("../models/AttendanceSession").findOne({
    _id: req.params.sessionId,
    teacher: req.user._id,
  });

  if (!session) throw new AppError("Session not found or access denied.", 404);

  sendResponse(res, { message: "Session fetched.", data: { session } });
});

// ─────────────────────────────────────────
// @route   PUT /api/v1/sessions/:sessionId
// @access  Private — Teacher
// ─────────────────────────────────────────
const updateSession = asyncHandler(async (req, res) => {
  const session = await sessionService.updateSession(
    req.params.sessionId,
    req.user._id,
    req.body,
  );

  sendResponse(res, {
    message: "Session updated successfully.",
    data: { session },
  });
});

// ─────────────────────────────────────────
// @route   DELETE /api/v1/sessions/:sessionId
// @access  Private — Teacher
// ─────────────────────────────────────────
const deleteSession = asyncHandler(async (req, res) => {
  await sessionService.deleteSession(req.params.sessionId, req.user._id);
  sendResponse(res, { message: "Session deleted successfully." });
});

// ─────────────────────────────────────────
// @route   PATCH /api/v1/sessions/:sessionId/start
// @access  Private — Teacher
// ─────────────────────────────────────────
const startSession = asyncHandler(async (req, res) => {
  const { session, qr } = await sessionService.startSession(
    req.params.sessionId,
    req.user._id,
  );

  sendResponse(res, {
    message: "Session started. QR code is ready for students.",
    data: { session, qr },
  });
});

// ─────────────────────────────────────────
// @route   PATCH /api/v1/sessions/:sessionId/pause
// @access  Private — Teacher
// ─────────────────────────────────────────
const pauseSession = asyncHandler(async (req, res) => {
  const session = await sessionService.pauseSession(
    req.params.sessionId,
    req.user._id,
  );
  sendResponse(res, { message: "Session paused.", data: { session } });
});

// ─────────────────────────────────────────
// @route   PATCH /api/v1/sessions/:sessionId/resume
// @access  Private — Teacher
// ─────────────────────────────────────────
const resumeSession = asyncHandler(async (req, res) => {
  const { session, qr } = await sessionService.resumeSession(
    req.params.sessionId,
    req.user._id,
  );
  sendResponse(res, { message: "Session resumed.", data: { session, qr } });
});

// ─────────────────────────────────────────
// @route   PATCH /api/v1/sessions/:sessionId/end
// @access  Private — Teacher
// ─────────────────────────────────────────
const endSession = asyncHandler(async (req, res) => {
  const session = await sessionService.endSession(
    req.params.sessionId,
    req.user._id,
  );
  sendResponse(res, {
    message: "Session closed successfully. Attendance has been recorded.",
    data: { session },
  });
});

// ─────────────────────────────────────────
// @route   PATCH /api/v1/sessions/:sessionId/extend
// @access  Private — Teacher
// ─────────────────────────────────────────
const extendSession = asyncHandler(async (req, res) => {
  const { extraMinutes = 15 } = req.body;
  const session = await sessionService.extendSession(
    req.params.sessionId,
    req.user._id,
    extraMinutes,
  );
  sendResponse(res, {
    message: `Session extended by ${extraMinutes} minutes.`,
    data: { session },
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/sessions/:sessionId/qr
// @access  Private — Teacher
// ─────────────────────────────────────────
const getQRCode = asyncHandler(async (req, res) => {
  const qr = await qrService.refreshSessionQR(
    req.params.sessionId,
    req.user._id,
  );
  sendResponse(res, {
    message: "QR code generated.",
    data: { qr },
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/sessions/:sessionId/live
// @access  Private — Teacher
// ─────────────────────────────────────────
const getLiveAttendance = asyncHandler(async (req, res) => {
  const data = await sessionService.getLiveAttendance(
    req.params.sessionId,
    req.user._id,
  );
  sendResponse(res, {
    message: "Live attendance fetched.",
    data,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/sessions/:sessionId/report
// @access  Private — Teacher
// ─────────────────────────────────────────
const getSessionReport = asyncHandler(async (req, res) => {
  const report = await analyticsService.getSessionReport(
    req.params.sessionId,
    req.user._id,
  );
  if (!report) throw new AppError("Session not found.", 404);

  sendResponse(res, {
    message: "Session report fetched.",
    data: report,
  });
});

// ─────────────────────────────────────────
// @route   PATCH /api/v1/sessions/:sessionId/attendance/:attendanceId/manual
// @access  Private — Teacher
// ─────────────────────────────────────────
const manualMarkAttendance = asyncHandler(async (req, res) => {
  const Attendance = require("../models/Attendance");
  const { status, reason } = req.body;

  if (!["present", "absent", "late", "excused"].includes(status)) {
    throw new AppError("Invalid status value.", 400);
  }

  const record = await Attendance.findOneAndUpdate(
    { _id: req.params.attendanceId, session: req.params.sessionId },
    {
      $set: {
        status,
        isManual: true,
        manuallyMarkedBy: req.user._id,
        manualReason: reason || "",
      },
    },
    { new: true },
  ).populate("student", "firstName lastName email");

  if (!record) throw new AppError("Attendance record not found.", 404);

  sendResponse(res, {
    message: `Attendance manually marked as ${status}.`,
    data: { record },
  });
});

module.exports = {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  startSession,
  pauseSession,
  resumeSession,
  endSession,
  extendSession,
  getQRCode,
  getLiveAttendance,
  getSessionReport,
  manualMarkAttendance,
};
