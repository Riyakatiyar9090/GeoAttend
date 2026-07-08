const AttendanceSession = require("../models/AttendanceSession");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");
const { AppError } = require("../middleware/errorMiddleware");
const qrService = require("./qrService");

// ─────────────────────────────────────────
// Create session
// ─────────────────────────────────────────
const createSession = async (teacherId, data) => {
  const {
    subject,
    className,
    section,
    semester,
    department,
    roomNumber,
    sessionType,
    date,
    startTime,
    endTime,
    duration,
    latitude,
    longitude,
    radius,
    allowLateEntry,
    lateEntryDuration,
    requireQRVerification,
    requireLocationVerification,
    notes,
    qrRefreshInterval,
  } = data;

  const session = await AttendanceSession.create({
    teacher: teacherId,
    subject,
    className,
    section,
    semester,
    department,
    roomNumber,
    sessionType,
    date: new Date(date),
    startTime,
    endTime,
    duration: duration || 60,
    location: {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    },
    radius: radius || 30,
    allowLateEntry: allowLateEntry ?? false,
    lateEntryDuration: lateEntryDuration ?? 10,
    requireQRVerification: requireQRVerification ?? true,
    requireLocationVerification: requireLocationVerification ?? true,
    notes,
    qrRefreshInterval: qrRefreshInterval || 60,
    status: "draft",
  });

  return session;
};

// ─────────────────────────────────────────
// Update session (only while in draft)
// ─────────────────────────────────────────
const updateSession = async (sessionId, teacherId, updates) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  });
  if (!session) throw new AppError("Session not found or access denied.", 404);

  if (session.status === "closed") {
    throw new AppError("A closed session cannot be edited.", 400);
  }

  // Prevent changing location after session is active
  if (session.status === "active" && (updates.latitude || updates.longitude)) {
    throw new AppError(
      "Location cannot be changed while the session is live.",
      400,
    );
  }

  const allowedFields = [
    "subject",
    "className",
    "section",
    "semester",
    "department",
    "roomNumber",
    "sessionType",
    "date",
    "startTime",
    "endTime",
    "duration",
    "radius",
    "allowLateEntry",
    "lateEntryDuration",
    "requireQRVerification",
    "requireLocationVerification",
    "notes",
    "qrRefreshInterval",
  ];

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) session[field] = updates[field];
  });

  if (updates.latitude && updates.longitude) {
    session.location = {
      type: "Point",
      coordinates: [
        parseFloat(updates.longitude),
        parseFloat(updates.latitude),
      ],
    };
  }

  await session.save();
  return session;
};

// ─────────────────────────────────────────
// Delete session (only draft)
// ─────────────────────────────────────────
const deleteSession = async (sessionId, teacherId) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  });
  if (!session) throw new AppError("Session not found or access denied.", 404);

  if (session.status !== "draft") {
    throw new AppError("Only draft sessions can be deleted.", 400);
  }

  await session.deleteOne();
  return true;
};

// ─────────────────────────────────────────
// Start session (draft → active + generate QR)
// ─────────────────────────────────────────
const startSession = async (sessionId, teacherId) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  });
  if (!session) throw new AppError("Session not found or access denied.", 404);

  if (session.status !== "draft") {
    throw new AppError(
      `Session is already ${session.status}. Only draft sessions can be started.`,
      400,
    );
  }

  session.status = "active";
  await session.save({ validateBeforeSave: false });

  // Generate initial QR
  const qr = await qrService.generateSessionQR(sessionId);

  return { session, qr };
};

// ─────────────────────────────────────────
// Pause / Resume session
// ─────────────────────────────────────────
const pauseSession = async (sessionId, teacherId) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  });
  if (!session) throw new AppError("Session not found.", 404);
  if (session.status !== "active")
    throw new AppError("Only active sessions can be paused.", 400);

  session.status = "paused";
  await session.save({ validateBeforeSave: false });
  return session;
};

const resumeSession = async (sessionId, teacherId) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  });
  if (!session) throw new AppError("Session not found.", 404);
  if (session.status !== "paused")
    throw new AppError("Only paused sessions can be resumed.", 400);

  session.status = "active";
  await session.save({ validateBeforeSave: false });

  const qr = await qrService.generateSessionQR(sessionId);
  return { session, qr };
};

// ─────────────────────────────────────────
// End / Close session
// ─────────────────────────────────────────
const endSession = async (sessionId, teacherId) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  });
  if (!session) throw new AppError("Session not found or access denied.", 404);

  if (!["active", "paused"].includes(session.status)) {
    throw new AppError("Only active or paused sessions can be closed.", 400);
  }

  // Final stats tally
  const records = await Attendance.find({ session: sessionId });
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;

  session.status = "closed";
  session.closedAt = new Date();
  session.stats.presentCount = present;
  session.stats.absentCount = absent;
  session.stats.lateCount = late;
  session.stats.totalStudents = records.length;

  await session.save({ validateBeforeSave: false });
  return session;
};

// ─────────────────────────────────────────
// Extend session (add minutes)
// ─────────────────────────────────────────
const extendSession = async (sessionId, teacherId, extraMinutes = 15) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  });
  if (!session) throw new AppError("Session not found.", 404);
  if (!["active", "paused"].includes(session.status)) {
    throw new AppError("Only active or paused sessions can be extended.", 400);
  }

  session.duration = (session.duration || 60) + extraMinutes;
  session.status = "extended";
  await session.save({ validateBeforeSave: false });
  return session;
};

// ─────────────────────────────────────────
// Get all sessions for a teacher
// ─────────────────────────────────────────
const getTeacherSessions = async (teacherId, filters = {}) => {
  const query = { teacher: teacherId };

  if (filters.status) query.status = filters.status;
  if (filters.subject) query.subject = new RegExp(filters.subject, "i");
  if (filters.date) {
    const day = new Date(filters.date);
    query.date = {
      $gte: new Date(day.setHours(0, 0, 0, 0)),
      $lte: new Date(day.setHours(23, 59, 59, 999)),
    };
  }

  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [sessions, total] = await Promise.all([
    AttendanceSession.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AttendanceSession.countDocuments(query),
  ]);

  return {
    sessions,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  };
};

// ─────────────────────────────────────────
// Live attendance feed for a session
// ─────────────────────────────────────────
const getLiveAttendance = async (sessionId, teacherId) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  });
  if (!session) throw new AppError("Session not found or access denied.", 404);

  const records = await Attendance.find({ session: sessionId })
    .populate("student", "firstName lastName email avatar")
    .populate(
      "studentProfile",
      "enrollmentNo rollNumber branch semester section",
    )
    .sort({ markedAt: -1 });

  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const suspicious = records.filter((r) => r.isSuspicious).length;

  return {
    session,
    records,
    summary: { present, absent, late, suspicious, total: records.length },
  };
};

module.exports = {
  createSession,
  updateSession,
  deleteSession,
  startSession,
  pauseSession,
  resumeSession,
  endSession,
  extendSession,
  getTeacherSessions,
  getLiveAttendance,
};
