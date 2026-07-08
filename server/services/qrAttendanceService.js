const crypto = require("crypto");
const AttendanceSession = require("../models/AttendanceSession");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { AppError } = require("../middleware/errorMiddleware");
const {
  generateSecureToken,
  hashToken,
  buildQRPayload,
  renderQRDataURL,
  renderQRBuffer,
  parseQRPayload,
} = require("../utils/qrGenerator");

// ─────────────────────────────────────────
// Haversine — distance in metres
// ─────────────────────────────────────────
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─────────────────────────────────────────
// TEACHER — Generate QR for a session
// ─────────────────────────────────────────

/**
 * Generate (or regenerate) a QR code for an active session.
 *
 * Flow:
 *   1. Validate teacher owns this session and it is active.
 *   2. Generate a new secure raw token.
 *   3. Hash the token → store hash in DB.
 *   4. Set expiresAt = now + refresh interval.
 *   5. Render QR PNG as data-URL.
 *   6. Return data-URL + expiry metadata to teacher.
 *
 * The raw token is NEVER stored in DB — only its SHA-256 hash.
 * This means even a database leak cannot be used to forge attendance.
 */
const generateQR = async (sessionId, teacherId) => {
  // ── 1. Load and authorise ──
  const session = await AttendanceSession.findById(sessionId).select(
    "+qrToken +qrTokenHash",
  );

  if (!session) {
    throw new AppError("Session not found.", 404);
  }

  if (session.teacher.toString() !== teacherId.toString()) {
    throw new AppError("Access denied. You do not own this session.", 403);
  }

  if (!["active", "extended"].includes(session.status)) {
    throw new AppError(
      `QR cannot be generated for a ${session.status} session. Start the session first.`,
      400,
    );
  }

  // ── 2. Generate token ──
  const rawToken = generateSecureToken(32); // 64-char hex
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(
    Date.now() + (session.qrRefreshInterval || 60) * 1000,
  );

  // ── 3. Persist hash + expiry ──
  session.qrTokenHash = tokenHash;
  session.qrToken = null; // Never store raw token
  session.qrExpiresAt = expiresAt;
  await session.save({ validateBeforeSave: false });

  // ── 4. Build QR payload and render ──
  const payload = buildQRPayload({
    sessionId: session._id,
    rawToken,
    expiresAt,
    sessionCode: session.sessionCode,
    subject: session.subject,
  });

  const [dataURL, buffer] = await Promise.all([
    renderQRDataURL(payload, 400),
    renderQRBuffer(payload, 400),
  ]);

  return {
    qr: {
      dataURL,
      expiresAt,
      expiresInSeconds: session.qrRefreshInterval || 60,
      sessionCode: session.sessionCode,
      subject: session.subject,
      refreshInterval: session.qrRefreshInterval || 60,
    },
    // Buffer available if you want to upload to Cloudinary
    buffer,
  };
};

/**
 * Refresh QR — shorthand alias called every N seconds
 * from the teacher's live session page.
 */
const refreshQR = async (sessionId, teacherId) =>
  generateQR(sessionId, teacherId);

// ─────────────────────────────────────────
// STUDENT — Validate the scanned QR payload
// ─────────────────────────────────────────

/**
 * Full validation chain run when a student submits a scanned QR.
 *
 * Validates (in order):
 *   1. QR payload structure is valid JSON with required fields.
 *   2. Student account exists and is active.
 *   3. Session exists and is active.
 *   4. Token has not expired (client-side exp + DB qrExpiresAt double-check).
 *   5. Token hash matches the one stored in DB.
 *   6. Teacher exists and is active.
 *   7. Duplicate attendance check.
 *   8. Location is within allowed radius (if required).
 *
 * Returns a validated result object — the controller then saves the record.
 */
const validateQRScan = async ({
  rawQRPayload, // Raw string from QR scanner
  studentUserId,
  studentLat,
  studentLng,
  deviceInfo,
}) => {
  // ── 1. Parse QR payload ──
  const payload = parseQRPayload(rawQRPayload);

  if (!payload) {
    throw new AppError(
      "Invalid QR code format. This QR does not belong to GeoAttend.",
      400,
    );
  }

  const { sid: sessionId, tok: rawToken, exp: expMs } = payload;

  // ── 2. Client-side expiry pre-check (fast fail before DB hit) ──
  if (Date.now() > expMs) {
    throw new AppError(
      "This QR code has expired. Please ask your teacher to refresh it.",
      400,
    );
  }

  // ── 3. Validate student ──
  const student = await User.findById(studentUserId).select(
    "_id status role firstName lastName email",
  );

  if (!student) {
    throw new AppError("Student account not found.", 404);
  }
  if (student.role !== "student") {
    throw new AppError("Only students can mark attendance via QR.", 403);
  }
  if (student.status === "blocked") {
    throw new AppError(
      "Your account has been blocked. Contact your administrator.",
      403,
    );
  }
  if (student.status !== "active") {
    throw new AppError(
      "Your account is not active. Please verify your email first.",
      403,
    );
  }

  // ── 4. Load session ──
  const session = await AttendanceSession.findById(sessionId)
    .select("+qrTokenHash")
    .populate("teacher", "_id firstName lastName email status");

  if (!session) {
    throw new AppError(
      "Session not found. The QR may belong to a deleted session.",
      404,
    );
  }

  // ── 5. Validate session status ──
  if (session.status === "closed") {
    throw new AppError("This attendance session has been closed.", 400);
  }
  if (session.status === "paused") {
    throw new AppError(
      "This session is currently paused. Please wait for your teacher to resume it.",
      400,
    );
  }
  if (session.status === "draft") {
    throw new AppError("This session has not been started yet.", 400);
  }
  if (!["active", "extended"].includes(session.status)) {
    throw new AppError(
      `Session is ${session.status}. Attendance cannot be marked now.`,
      400,
    );
  }

  // ── 6. Validate QR expiry (DB-side double-check) ──
  if (!session.qrExpiresAt || session.qrExpiresAt < new Date()) {
    throw new AppError(
      "QR code has expired on the server. Ask your teacher to refresh it.",
      400,
    );
  }

  // ── 7. Verify token hash ──
  if (!session.qrTokenHash) {
    throw new AppError(
      "No active QR token for this session. Please scan the latest QR code.",
      400,
    );
  }

  const submittedHash = hashToken(rawToken);
  const isValidToken = crypto.timingSafeEqual(
    Buffer.from(submittedHash, "hex"),
    Buffer.from(session.qrTokenHash, "hex"),
  );

  if (!isValidToken) {
    throw new AppError(
      "QR token is invalid or has been refreshed. Please scan the current QR code.",
      400,
    );
  }

  // ── 8. Validate teacher ──
  if (!session.teacher) {
    throw new AppError("Session teacher not found.", 404);
  }
  if (
    session.teacher.status === "blocked" ||
    session.teacher.status === "inactive"
  ) {
    throw new AppError("The session teacher account is inactive.", 403);
  }

  // ── 9. Duplicate attendance check ──
  const existingRecord = await Attendance.findOne({
    session: sessionId,
    student: studentUserId,
  });

  if (existingRecord) {
    // Increment duplicate stat (non-blocking)
    AttendanceSession.findByIdAndUpdate(sessionId, {
      $inc: { "stats.duplicateAttempts": 1 },
    }).catch(() => {});

    if (["present", "late"].includes(existingRecord.status)) {
      return {
        valid: true,
        alreadyMarked: true,
        existingRecord,
        session,
        student,
        message: "Attendance for this session has already been recorded.",
      };
    }

    throw new AppError(
      "Attendance for this session has already been submitted.",
      409,
    );
  }

  // ── 10. Location verification ──
  let locationVerified = false;
  let distanceFromClassroom = null;
  let isSuspicious = false;
  let suspicionReason = "";

  if (session.requireLocationVerification) {
    if (!studentLat || !studentLng) {
      throw new AppError(
        "Location data is required for this session. Please enable GPS and try again.",
        400,
      );
    }

    const [classLng, classLat] = session.location.coordinates;
    const distance = haversineDistance(
      classLat,
      classLng,
      parseFloat(studentLat),
      parseFloat(studentLng),
    );

    distanceFromClassroom = Math.round(distance);
    locationVerified = distance <= session.radius;

    if (!locationVerified) {
      isSuspicious = true;
      suspicionReason = "outside_radius";

      // Log outside-radius attempt (non-blocking)
      AttendanceSession.findByIdAndUpdate(sessionId, {
        $inc: { "stats.outsideRadius": 1 },
      }).catch(() => {});

      throw new AppError(
        `Location verification failed. You are ${distanceFromClassroom}m from the classroom (allowed radius: ${session.radius}m). Please move closer and try again.`,
        400,
      );
    }
  } else {
    // Session does not require location
    locationVerified = true;
  }

  // ── 11. Late-entry window check ──
  const now = new Date();
  const [endH, endM] = (session.endTime || "23:59").split(":").map(Number);
  const sessionEndDateTime = new Date(session.date);
  sessionEndDateTime.setHours(endH, endM, 0, 0);

  let isLate = false;

  if (now > sessionEndDateTime) {
    if (!session.allowLateEntry) {
      throw new AppError(
        "The attendance window for this session has closed.",
        400,
      );
    }

    const lateDeadline = new Date(sessionEndDateTime);
    lateDeadline.setMinutes(
      lateDeadline.getMinutes() + (session.lateEntryDuration || 10),
    );

    if (now > lateDeadline) {
      throw new AppError(
        "The late-entry window has also closed. Attendance can no longer be marked.",
        400,
      );
    }

    isLate = true;
  }

  // ── All checks passed ──
  return {
    valid: true,
    alreadyMarked: false,
    session,
    student,
    locationVerified,
    distanceFromClassroom,
    isLate,
    isSuspicious,
    suspicionReason,
    deviceInfo,
  };
};

// ─────────────────────────────────────────
// STUDENT — Submit attendance after validation
// ─────────────────────────────────────────

/**
 * Create the Attendance record and update session stats.
 * Only called after validateQRScan passes.
 */
const submitAttendance = async (validationResult) => {
  const {
    session,
    student,
    locationVerified,
    distanceFromClassroom,
    isLate,
    isSuspicious,
    suspicionReason,
    deviceInfo,
    studentLat,
    studentLng,
  } = validationResult;

  // Determine verification method
  let verificationMethod = "none";
  const qrVerified = true; // We only reach here if QR was valid
  if (qrVerified && locationVerified) verificationMethod = "qr_and_location";
  else if (qrVerified) verificationMethod = "qr_only";
  else if (locationVerified) verificationMethod = "location_only";

  // Resolve student profile ref
  const studentProfile = await Student.findOne({ user: student._id }).select(
    "_id",
  );

  // Create the attendance record
  const record = await Attendance.create({
    session: session._id,
    student: student._id,
    studentProfile: studentProfile?._id || null,
    teacher: session.teacher._id,
    status: isLate ? "late" : "present",
    qrVerified: true,
    locationVerified,
    verificationMethod,
    studentLocation: {
      type: "Point",
      coordinates: [parseFloat(studentLng || 0), parseFloat(studentLat || 0)],
    },
    distanceFromClassroom,
    markedAt: new Date(),
    isLate,
    isSuspicious,
    suspicionReason: suspicionReason || "",
    deviceInfo: {
      userAgent: deviceInfo?.userAgent || "",
      ipAddress: deviceInfo?.ipAddress || "",
      platform: deviceInfo?.platform || "",
    },
  });

  // Update session stats atomically
  const statField = isLate ? "stats.lateCount" : "stats.presentCount";
  await AttendanceSession.findByIdAndUpdate(
    session._id,
    { $inc: { [statField]: 1, "stats.totalStudents": 1 } },
    { new: false },
  );

  // Send in-app notification to student (non-blocking)
  Notification.send({
    recipient: student._id,
    recipientRole: "student",
    sender: session.teacher._id,
    title: `✅ Attendance Confirmed — ${session.subject}`,
    message: `Your attendance for ${session.subject} (${session.sessionCode}) has been recorded as ${isLate ? "Late" : "Present"}.`,
    type: "attendance_marked",
    category: "attendance",
    priority: "normal",
    actionUrl: `/student/history`,
    relatedDocument: { docId: record._id, docModel: "Attendance" },
  }).catch((err) =>
    console.error("Notification send failed (non-fatal):", err.message),
  );

  // Send notification to teacher about low attendance (non-blocking)
  const sessionAttendance = await Attendance.countDocuments({
    session: session._id,
    status: { $in: ["present", "late"] },
  });
  const sessionTotal = await Attendance.countDocuments({
    session: session._id,
  });
  const livePct =
    sessionTotal > 0 ? Math.round((sessionAttendance / sessionTotal) * 100) : 0;

  if (livePct < 70 && sessionTotal >= 5) {
    Notification.send({
      recipient: session.teacher._id,
      recipientRole: "teacher",
      title: `⚠️ Low Attendance Alert — ${session.subject}`,
      message: `Only ${livePct}% of students have marked attendance in session ${session.sessionCode} so far.`,
      type: "low_attendance_warning",
      category: "attendance",
      priority: "high",
      actionUrl: `/teacher/sessions/${session._id}/live`,
    }).catch(() => {});
  }

  return {
    record,
    attendanceSummary: {
      status: isLate ? "late" : "present",
      subject: session.subject,
      sessionCode: session.sessionCode,
      markedAt: record.markedAt,
      verificationMethod,
      distanceFromClassroom,
      locationVerified,
    },
  };
};

// ─────────────────────────────────────────
// Helpers for teacher — session QR status
// ─────────────────────────────────────────

/**
 * Get current QR status for a session.
 * Returns expiry info without the raw token or hash.
 */
const getQRStatus = async (sessionId, teacherId) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  }).select("qrExpiresAt qrRefreshInterval status sessionCode subject stats");

  if (!session) throw new AppError("Session not found or access denied.", 404);

  const now = new Date();
  const isExpired = !session.qrExpiresAt || session.qrExpiresAt <= now;
  const secondsLeft = isExpired
    ? 0
    : Math.round((session.qrExpiresAt - now) / 1000);

  return {
    sessionId,
    sessionCode: session.sessionCode,
    subject: session.subject,
    status: session.status,
    qrIsExpired: isExpired,
    qrExpiresAt: session.qrExpiresAt,
    secondsUntilExpiry: secondsLeft,
    refreshInterval: session.qrRefreshInterval || 60,
    stats: session.stats,
  };
};

module.exports = {
  generateQR,
  refreshQR,
  validateQRScan,
  submitAttendance,
  getQRStatus,
  haversineDistance,
};
