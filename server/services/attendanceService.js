const crypto = require("crypto");
const AttendanceSession = require("../models/AttendanceSession");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
const { AppError } = require("../middleware/errorMiddleware");

// ─────────────────────────────────────────
// Haversine — distance in metres between
// two lat/lng coordinate pairs
// ─────────────────────────────────────────
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // Earth radius in metres
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─────────────────────────────────────────
// Fetch active sessions near a student
// ─────────────────────────────────────────
const getActiveSessions = async (filters = {}) => {
  const query = { status: "active" };
  if (filters.subject) query.subject = new RegExp(filters.subject, "i");
  if (filters.date) {
    const day = new Date(filters.date);
    query.date = {
      $gte: new Date(day.setHours(0, 0, 0, 0)),
      $lte: new Date(day.setHours(23, 59, 59, 999)),
    };
  }

  const sessions = await AttendanceSession.find(query)
    .populate("teacher", "firstName lastName avatar")
    .sort({ createdAt: -1 });

  return sessions;
};

// ─────────────────────────────────────────
// Validate QR token from scanned QR code
// ─────────────────────────────────────────
const validateQRToken = async (rawToken) => {
  // Hash the submitted token to compare with stored hash
  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const session = await AttendanceSession.findOne({ qrTokenHash: hash }).select(
    "+qrToken +qrTokenHash",
  );

  if (!session)
    throw new AppError(
      "Invalid QR code. This does not belong to any active session.",
      400,
    );

  if (session.status !== "active") {
    throw new AppError(
      `This session is currently ${session.status}. Attendance cannot be marked.`,
      400,
    );
  }

  if (!session.isQRValid) {
    throw new AppError(
      "This QR code has expired. Please ask your teacher to refresh it.",
      400,
    );
  }

  return session;
};

// ─────────────────────────────────────────
// Verify student location against classroom
// ─────────────────────────────────────────
const verifyLocation = async (sessionId, studentLat, studentLng) => {
  const session = await AttendanceSession.findById(sessionId);
  if (!session) throw new AppError("Session not found.", 404);

  const [classroomLng, classroomLat] = session.location.coordinates;

  const distance = haversineDistance(
    classroomLat,
    classroomLng,
    parseFloat(studentLat),
    parseFloat(studentLng),
  );

  const withinRadius = distance <= session.radius;

  return {
    distance: Math.round(distance),
    radius: session.radius,
    withinRadius,
    classroomCoords: { lat: classroomLat, lng: classroomLng },
    studentCoords: { lat: parseFloat(studentLat), lng: parseFloat(studentLng) },
  };
};

// ─────────────────────────────────────────
// Mark attendance (combined QR + location)
// ─────────────────────────────────────────
const markAttendance = async ({
  userId,
  studentProfileId,
  sessionId,
  qrToken,
  studentLat,
  studentLng,
  deviceInfo,
}) => {
  // 1. Load session
  const session = await AttendanceSession.findById(sessionId).select(
    "+qrToken +qrTokenHash",
  );

  if (!session) throw new AppError("Session not found.", 404);

  // 2. Check session is active
  if (session.status !== "active") {
    throw new AppError(
      `Session is ${session.status}. Attendance cannot be marked now.`,
      400,
    );
  }

  // 3. Prevent duplicate attendance
  const existing = await Attendance.findOne({
    session: sessionId,
    student: userId,
  });

  if (existing) {
    // Increment duplicate attempts on session stats
    await AttendanceSession.findByIdAndUpdate(sessionId, {
      $inc: { "stats.duplicateAttempts": 1 },
    });

    // If already marked present — no need to throw error, just return the record
    if (existing.status === "present" || existing.status === "late") {
      return { record: existing, alreadyMarked: true };
    }

    throw new AppError(
      "Attendance for this session has already been submitted.",
      409,
    );
  }

  // 4. QR verification
  let qrVerified = false;
  if (session.requireQRVerification) {
    qrVerified = session.verifyQRToken(qrToken);
    if (!qrVerified) {
      throw new AppError(
        "Invalid or expired QR code. Please scan the latest QR code.",
        400,
      );
    }
  } else {
    qrVerified = true;
  }

  // 5. Location verification
  let locationVerified = false;
  let distanceFromClass = null;
  let isSuspicious = false;
  let suspicionReason = "";

  if (session.requireLocationVerification && studentLat && studentLng) {
    const locResult = await verifyLocation(sessionId, studentLat, studentLng);
    distanceFromClass = locResult.distance;
    locationVerified = locResult.withinRadius;

    if (!locationVerified) {
      isSuspicious = true;
      suspicionReason = "outside_radius";

      // Update session stats for outside-radius attempts
      await AttendanceSession.findByIdAndUpdate(sessionId, {
        $inc: { "stats.outsideRadius": 1 },
      });

      throw new AppError(
        `Location verification failed. You are ${locResult.distance}m from the classroom (limit: ${locResult.radius}m).`,
        400,
      );
    }
  } else {
    locationVerified = true; // Location not required for this session
  }

  // 6. Determine if late
  const now = new Date();
  const [endH, endM] = (session.endTime || "23:59").split(":").map(Number);
  const sessionEnd = new Date(session.date);
  sessionEnd.setHours(endH, endM, 0, 0);

  let isLate = false;
  if (now > sessionEnd) {
    if (session.allowLateEntry) {
      const lateDeadline = new Date(sessionEnd);
      lateDeadline.setMinutes(
        lateDeadline.getMinutes() + (session.lateEntryDuration || 10),
      );
      if (now <= lateDeadline) {
        isLate = true;
      } else {
        throw new AppError(
          "The late entry window has also closed. Attendance cannot be marked.",
          400,
        );
      }
    } else {
      throw new AppError(
        "The attendance window for this session has closed.",
        400,
      );
    }
  }

  // 7. Determine verification method
  let verificationMethod = "none";
  if (qrVerified && locationVerified) verificationMethod = "qr_and_location";
  else if (qrVerified) verificationMethod = "qr_only";
  else if (locationVerified) verificationMethod = "location_only";

  // 8. Create attendance record
  const record = await Attendance.create({
    session: sessionId,
    student: userId,
    studentProfile: studentProfileId,
    teacher: session.teacher,
    status: isLate ? "late" : "present",
    qrVerified,
    locationVerified,
    verificationMethod,
    studentLocation: {
      type: "Point",
      coordinates: [parseFloat(studentLng || 0), parseFloat(studentLat || 0)],
    },
    distanceFromClassroom: distanceFromClass,
    markedAt: now,
    isLate,
    isSuspicious,
    suspicionReason,
    deviceInfo: {
      userAgent: deviceInfo?.userAgent || "",
      ipAddress: deviceInfo?.ipAddress || "",
      platform: deviceInfo?.platform || "",
    },
  });

  // 9. Update session stats atomically
  const incField = isLate ? "stats.lateCount" : "stats.presentCount";
  await AttendanceSession.findByIdAndUpdate(sessionId, {
    $inc: { [incField]: 1, "stats.totalStudents": 1 },
  });

  // 10. Send notification to student
  await Notification.send({
    recipient: userId,
    recipientRole: "student",
    sender: session.teacher,
    title: `Attendance Marked — ${session.subject}`,
    message: `Your attendance for ${session.subject} (Session: ${session.sessionCode}) has been recorded as ${isLate ? "Late" : "Present"}.`,
    type: "attendance_marked",
    category: "attendance",
    priority: "normal",
    actionUrl: `/student/history`,
    relatedDocument: { docId: record._id, docModel: "Attendance" },
  });

  return { record, alreadyMarked: false };
};

// ─────────────────────────────────────────
// Get student's attendance history
// ─────────────────────────────────────────
const getAttendanceHistory = async (userId, filters = {}) => {
  const query = { student: userId };

  if (filters.status) query.status = filters.status;
  if (filters.subject) {
    // Join via session to filter by subject
    const sessions = await AttendanceSession.find({
      subject: new RegExp(filters.subject, "i"),
    }).select("_id");
    query.session = { $in: sessions.map((s) => s._id) };
  }
  if (filters.startDate || filters.endDate) {
    query.markedAt = {};
    if (filters.startDate) query.markedAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.markedAt.$lte = new Date(filters.endDate);
  }

  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const sortField = filters.sort === "oldest" ? 1 : -1;

  const [records, total] = await Promise.all([
    Attendance.find(query)
      .populate(
        "session",
        "subject className section roomNumber startTime endTime date sessionCode sessionType",
      )
      .populate("teacher", "firstName lastName avatar")
      .sort({ markedAt: sortField })
      .skip(skip)
      .limit(limit),
    Attendance.countDocuments(query),
  ]);

  return {
    records,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  };
};

// ─────────────────────────────────────────
// Get single attendance record detail
// ─────────────────────────────────────────
const getAttendanceDetail = async (recordId, userId) => {
  const record = await Attendance.findOne({ _id: recordId, student: userId })
    .populate(
      "session",
      "subject className section roomNumber startTime endTime date sessionCode sessionType location radius",
    )
    .populate("teacher", "firstName lastName avatar email")
    .populate(
      "studentProfile",
      "enrollmentNo rollNumber branch semester section",
    );

  if (!record) throw new AppError("Attendance record not found.", 404);
  return record;
};

module.exports = {
  getActiveSessions,
  validateQRToken,
  verifyLocation,
  markAttendance,
  getAttendanceHistory,
  getAttendanceDetail,
  haversineDistance,
};
