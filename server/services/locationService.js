const AttendanceSession = require("../models/AttendanceSession");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
const { AppError } = require("../middleware/errorMiddleware");
const { analyseLocation, haversineDistance } = require("../utils/haversine");

// ─────────────────────────────────────────
// Sanity-check GPS coordinates
// ─────────────────────────────────────────

/**
 * Validate that coordinate values are physically possible
 * and not default zero values (which indicate GPS failure).
 *
 * @param {number} lat
 * @param {number} lng
 * @throws {AppError} on invalid coordinates
 */
const assertValidCoordinates = (lat, lng) => {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (isNaN(latNum) || isNaN(lngNum)) {
    throw new AppError("Coordinates must be numeric values.", 400);
  }
  if (latNum < -90 || latNum > 90) {
    throw new AppError(
      `Latitude ${latNum} is out of range. Must be between -90 and 90.`,
      400,
    );
  }
  if (lngNum < -180 || lngNum > 180) {
    throw new AppError(
      `Longitude ${lngNum} is out of range. Must be between -180 and 180.`,
      400,
    );
  }

  // Reject exact zero — almost certainly a GPS acquisition failure
  if (latNum === 0 && lngNum === 0) {
    throw new AppError(
      "GPS coordinates (0, 0) are invalid. Please wait for your device to acquire a proper GPS fix.",
      400,
    );
  }

  return { lat: latNum, lng: lngNum };
};

// ─────────────────────────────────────────
// Verify a student's location against a session
// ─────────────────────────────────────────

/**
 * Core location verification:
 *   1. Load session and validate its state.
 *   2. Validate student's GPS coordinates.
 *   3. Run Haversine analysis.
 *   4. Return structured result with guidance.
 *
 * Does NOT create any database record — it is a pure check.
 * Use verifyAndRecord() to persist the verification result.
 *
 * @param {string} sessionId
 * @param {number} studentLat
 * @param {number} studentLng
 * @param {string} [studentUserId]  - Optional; enables student-specific checks
 */
const verifyStudentLocation = async (
  sessionId,
  studentLat,
  studentLng,
  studentUserId,
) => {
  // ── 1. Load session ──
  const session = await AttendanceSession.findById(sessionId).select(
    "subject sessionCode status location radius teacher date startTime endTime requireLocationVerification",
  );

  if (!session) {
    throw new AppError(
      "Session not found. The session ID may be incorrect.",
      404,
    );
  }

  // ── 2. Validate session state ──
  const allowedStatuses = ["active", "extended"];
  if (!allowedStatuses.includes(session.status)) {
    throw new AppError(
      `Location verification is not available — session is ${session.status}.`,
      400,
    );
  }

  // ── 3. Check if location verification is even required ──
  if (!session.requireLocationVerification) {
    return {
      required: false,
      withinRadius: true,
      message: "This session does not require location verification.",
      sessionId,
      subject: session.subject,
      sessionCode: session.sessionCode,
    };
  }

  // ── 4. Validate coordinates ──
  const studentCoords = assertValidCoordinates(studentLat, studentLng);

  // ── 5. Extract classroom coordinates ──
  const [classroomLng, classroomLat] = session.location.coordinates;

  if (classroomLat === 0 && classroomLng === 0) {
    throw new AppError(
      "This session does not have a valid classroom location set. Contact your teacher.",
      400,
    );
  }

  // ── 6. Run Haversine analysis ──
  const analysis = analyseLocation(
    { lat: classroomLat, lng: classroomLng, radius: session.radius },
    { lat: studentCoords.lat, lng: studentCoords.lng },
  );

  // ── 7. Build human-readable guidance message ──
  let message;
  let guidanceMessage;

  if (analysis.withinRadius) {
    message = `✅ Location verified. You are ${analysis.distance}m from the classroom.`;
    guidanceMessage = `You are within the allowed radius of ${session.radius}m.`;
  } else {
    message = `❌ Location rejected. You are ${analysis.distance}m away — the limit is ${session.radius}m.`;
    guidanceMessage =
      `Move approximately ${analysis.overshoot}m closer to the classroom ` +
      `(head ${analysis.compassDirection} — bearing: ${analysis.bearing}°).`;
  }

  // ── 8. Build result ──
  return {
    required: true,
    verified: analysis.withinRadius,
    withinRadius: analysis.withinRadius,

    // Distance analysis
    distance: analysis.distance,
    radius: analysis.radius,
    overshoot: analysis.overshoot,
    accuracy: analysis.accuracy,

    // Navigation guidance (only useful when outside radius)
    bearing: analysis.bearing,
    compassDirection: analysis.compassDirection,
    guidanceMessage,

    // Coordinate data
    classroomCoordinates: analysis.classroomCoordinates,
    studentCoordinates: analysis.studentCoordinates,

    // Session info
    sessionId,
    subject: session.subject,
    sessionCode: session.sessionCode,

    // Messages
    message,
  };
};

// ─────────────────────────────────────────
// Verify location AND update Attendance record
// ─────────────────────────────────────────

/**
 * Run location verification and persist the result
 * onto an existing Attendance record (identified by
 * session + student).
 *
 * Used when the student submits GPS separately from QR scan.
 */
const verifyAndRecord = async (
  sessionId,
  studentUserId,
  studentLat,
  studentLng,
) => {
  const result = await verifyStudentLocation(
    sessionId,
    studentLat,
    studentLng,
    studentUserId,
  );

  // Update existing attendance record if it exists
  const updated = await Attendance.findOneAndUpdate(
    { session: sessionId, student: studentUserId },
    {
      $set: {
        locationVerified: result.verified,
        distanceFromClassroom: result.distance,
        studentLocation: {
          type: "Point",
          coordinates: [parseFloat(studentLng), parseFloat(studentLat)],
        },
        isSuspicious: !result.verified,
        suspicionReason: !result.verified ? "outside_radius" : "",
      },
    },
    { new: true },
  );

  return { verificationResult: result, attendanceRecord: updated };
};

// ─────────────────────────────────────────
// Batch verification — check multiple students
// (used by admin analytics)
// ─────────────────────────────────────────

/**
 * Given an array of { studentUserId, lat, lng } entries
 * and a single session, return a verification result
 * for each student.
 */
const batchVerifyLocations = async (sessionId, submissions) => {
  const session = await AttendanceSession.findById(sessionId).select(
    "location radius subject sessionCode",
  );

  if (!session) throw new AppError("Session not found.", 404);

  const [classroomLng, classroomLat] = session.location.coordinates;

  const results = submissions.map((sub) => {
    try {
      const { lat, lng } = assertValidCoordinates(sub.lat, sub.lng);
      const analysis = analyseLocation(
        { lat: classroomLat, lng: classroomLng, radius: session.radius },
        { lat, lng },
      );
      return {
        studentUserId: sub.studentUserId,
        success: true,
        ...analysis,
      };
    } catch (err) {
      return {
        studentUserId: sub.studentUserId,
        success: false,
        error: err.message,
      };
    }
  });

  const verified = results.filter((r) => r.success && r.withinRadius).length;
  const rejected = results.filter((r) => r.success && !r.withinRadius).length;
  const errored = results.filter((r) => !r.success).length;

  return {
    sessionId,
    subject: session.subject,
    sessionCode: session.sessionCode,
    summary: {
      total: submissions.length,
      verified,
      rejected,
      errored,
    },
    results,
  };
};

// ─────────────────────────────────────────
// Get classroom location from a session
// (for displaying on student's map)
// ─────────────────────────────────────────

const getSessionLocation = async (sessionId) => {
  const session = await AttendanceSession.findById(sessionId)
    .select(
      "location radius subject sessionCode status requireLocationVerification teacher",
    )
    .populate("teacher", "firstName lastName");

  if (!session) throw new AppError("Session not found.", 404);

  const [lng, lat] = session.location.coordinates;

  return {
    sessionId,
    subject: session.subject,
    sessionCode: session.sessionCode,
    status: session.status,
    requireLocationVerification: session.requireLocationVerification,
    classroom: {
      lat,
      lng,
      radius: session.radius,
      radiusLabel: `${session.radius}m`,
    },
    teacher: {
      name: `${session.teacher?.firstName || ""} ${session.teacher?.lastName || ""}`.trim(),
    },
  };
};

// ─────────────────────────────────────────
// Teacher: update classroom location
// ─────────────────────────────────────────

/**
 * Allow a teacher to update the classroom GPS pin
 * while the session is in draft or active state.
 */
const updateClassroomLocation = async (
  sessionId,
  teacherId,
  lat,
  lng,
  radius,
) => {
  const coords = assertValidCoordinates(lat, lng);

  if (radius !== undefined) {
    const r = parseFloat(radius);
    if (isNaN(r) || r < 5 || r > 500) {
      throw new AppError("Radius must be between 5 and 500 metres.", 400);
    }
  }

  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  });

  if (!session) throw new AppError("Session not found or access denied.", 404);

  if (session.status === "closed") {
    throw new AppError("Cannot update location of a closed session.", 400);
  }

  session.location = {
    type: "Point",
    coordinates: [coords.lng, coords.lat],
  };
  if (radius !== undefined) {
    session.radius = parseFloat(radius);
  }

  await session.save({ validateBeforeSave: false });

  return {
    sessionId,
    updatedLocation: {
      lat: coords.lat,
      lng: coords.lng,
      radius: session.radius,
    },
    message: "Classroom location updated successfully.",
  };
};

// ─────────────────────────────────────────
// Suspicious location report for a session
// ─────────────────────────────────────────

/**
 * Returns all attendance records where the student
 * was outside the radius or location was flagged suspicious.
 */
const getSuspiciousLocationRecords = async (sessionId, teacherId) => {
  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: teacherId,
  }).select("subject sessionCode location radius");

  if (!session) throw new AppError("Session not found or access denied.", 404);

  const records = await Attendance.find({
    session: sessionId,
    isSuspicious: true,
  })
    .populate("student", "firstName lastName email")
    .populate("studentProfile", "enrollmentNo rollNumber branch")
    .select(
      "student studentProfile status distanceFromClassroom " +
        "studentLocation suspicionReason markedAt deviceInfo",
    );

  const [classLng, classLat] = session.location.coordinates;

  const enriched = records.map((r) => {
    const [stuLng, stuLat] = r.studentLocation?.coordinates || [0, 0];
    const distance = haversineDistance(classLat, classLng, stuLat, stuLng);

    return {
      attendanceId: r._id,
      student: r.student,
      studentProfile: r.studentProfile,
      status: r.status,
      suspicionReason: r.suspicionReason,
      distanceRecorded: r.distanceFromClassroom,
      distanceRecalculated: Math.round(distance),
      studentCoordinates: { lat: stuLat, lng: stuLng },
      markedAt: r.markedAt,
      deviceInfo: r.deviceInfo,
    };
  });

  return {
    sessionId,
    subject: session.subject,
    sessionCode: session.sessionCode,
    classroomCoords: { lat: classLat, lng: classLng },
    radius: session.radius,
    suspiciousCount: enriched.length,
    records: enriched,
  };
};

module.exports = {
  assertValidCoordinates,
  verifyStudentLocation,
  verifyAndRecord,
  batchVerifyLocations,
  getSessionLocation,
  updateClassroomLocation,
  getSuspiciousLocationRecords,
};
