const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const { AppError } = require("../middleware/errorMiddleware");
const locationService = require("../services/locationService");
const { analyseLocation } = require("../utils/haversine");

// ═════════════════════════════════════════
// STUDENT CONTROLLERS
// ═════════════════════════════════════════

// ─────────────────────────────────────────
// @route   POST /api/v1/location/verify
// @desc    Verify student GPS against session classroom location.
//          Pure check — does NOT save any record.
// @access  Private — Student
// ─────────────────────────────────────────
const verifyLocation = asyncHandler(async (req, res) => {
  const { sessionId, latitude, longitude, accuracy } = req.body;

  const result = await locationService.verifyStudentLocation(
    sessionId,
    parseFloat(latitude),
    parseFloat(longitude),
    req.user._id,
  );

  // Attach GPS accuracy reported by the device (optional metadata)
  const responseData = {
    ...result,
    ...(accuracy !== undefined && { gpsAccuracy: parseFloat(accuracy) }),
  };

  // Choose HTTP status based on result
  // 200 = check ran, 422 = structurally valid request but rejected by logic
  const statusCode = result.withinRadius ? 200 : 200; // Always 200 — let `verified` flag drive frontend

  sendResponse(res, {
    statusCode,
    message: result.message,
    data: responseData,
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/location/verify-and-record
// @desc    Verify location AND update the Attendance record.
//          Use when GPS is submitted separately from QR.
// @access  Private — Student
// ─────────────────────────────────────────
const verifyAndRecord = asyncHandler(async (req, res) => {
  const { sessionId, latitude, longitude } = req.body;

  const { verificationResult, attendanceRecord } =
    await locationService.verifyAndRecord(
      sessionId,
      req.user._id,
      parseFloat(latitude),
      parseFloat(longitude),
    );

  sendResponse(res, {
    statusCode: 200,
    message: verificationResult.verified
      ? `✅ Location verified and attendance record updated.`
      : `❌ Location rejected — attendance record flagged.`,
    data: {
      verification: verificationResult,
      attendanceRecord: attendanceRecord
        ? {
            _id: attendanceRecord._id,
            status: attendanceRecord.status,
            locationVerified: attendanceRecord.locationVerified,
            distanceFromClassroom: attendanceRecord.distanceFromClassroom,
          }
        : null,
    },
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/location/session/:sessionId
// @desc    Get classroom location for a session.
//          Used by student to render classroom pin on map.
// @access  Private — Student
// ─────────────────────────────────────────
const getSessionLocation = asyncHandler(async (req, res) => {
  const location = await locationService.getSessionLocation(
    req.params.sessionId,
  );

  sendResponse(res, {
    message: "Session location fetched.",
    data: location,
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/location/calculate-distance
// @desc    Public utility — calculate distance between two points.
//          Used by the frontend map preview before joining a session.
// @access  Private — Student or Teacher
// ─────────────────────────────────────────
const calculateDistance = asyncHandler(async (req, res) => {
  const { fromLat, fromLng, toLat, toLng, radius } = req.body;

  // Validate all four coordinates
  locationService.assertValidCoordinates(
    parseFloat(fromLat),
    parseFloat(fromLng),
  );
  locationService.assertValidCoordinates(parseFloat(toLat), parseFloat(toLng));

  const analysis = analyseLocation(
    {
      lat: parseFloat(toLat),
      lng: parseFloat(toLng),
      radius: parseFloat(radius) || 30,
    },
    { lat: parseFloat(fromLat), lng: parseFloat(fromLng) },
  );

  sendResponse(res, {
    message: `Distance calculated: ${analysis.distance}m`,
    data: {
      distanceMetres: analysis.distance,
      withinRadius: analysis.withinRadius,
      radius: analysis.radius,
      overshoot: analysis.overshoot,
      accuracy: analysis.accuracy,
      bearing: analysis.bearing,
      compassDirection: analysis.compassDirection,
      fromCoordinates: { lat: parseFloat(fromLat), lng: parseFloat(fromLng) },
      toCoordinates: { lat: parseFloat(toLat), lng: parseFloat(toLng) },
    },
  });
});

// ═════════════════════════════════════════
// TEACHER CONTROLLERS
// ═════════════════════════════════════════

// ─────────────────────────────────────────
// @route   PUT /api/v1/location/session/:sessionId
// @desc    Update classroom location (lat, lng, radius) for a session.
// @access  Private — Teacher
// ─────────────────────────────────────────
const updateClassroomLocation = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { latitude, longitude, radius } = req.body;

  const result = await locationService.updateClassroomLocation(
    sessionId,
    req.user._id,
    parseFloat(latitude),
    parseFloat(longitude),
    radius !== undefined ? parseFloat(radius) : undefined,
  );

  sendResponse(res, {
    statusCode: 200,
    message: result.message,
    data: result,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/location/session/:sessionId/suspicious
// @desc    Get all attendance records where location was suspicious.
// @access  Private — Teacher
// ─────────────────────────────────────────
const getSuspiciousRecords = asyncHandler(async (req, res) => {
  const report = await locationService.getSuspiciousLocationRecords(
    req.params.sessionId,
    req.user._id,
  );

  sendResponse(res, {
    message:
      report.suspiciousCount > 0
        ? `${report.suspiciousCount} suspicious location record(s) found.`
        : "No suspicious location records for this session.",
    data: report,
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/location/batch-verify
// @desc    Batch location check for multiple students.
//          Teacher can validate exported GPS submissions offline.
// @access  Private — Teacher
// ─────────────────────────────────────────
const batchVerifyLocations = asyncHandler(async (req, res) => {
  const { sessionId, submissions } = req.body;

  const result = await locationService.batchVerifyLocations(
    sessionId,
    submissions,
  );

  sendResponse(res, {
    message: `Batch verification complete — ${result.summary.verified}/${result.summary.total} passed.`,
    data: result,
  });
});

// ═════════════════════════════════════════
// SHARED CONTROLLERS
// ═════════════════════════════════════════

// ─────────────────────────────────────────
// @route   GET /api/v1/location/ping
// @desc    Health check — confirm location service is running.
// @access  Private
// ─────────────────────────────────────────
const pingLocationService = asyncHandler(async (req, res) => {
  sendResponse(res, {
    message: "Location service is operational.",
    data: {
      service: "GPS Location Verification",
      algorithm: "Haversine Formula",
      earthRadius: "6,371,000 metres",
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = {
  verifyLocation,
  verifyAndRecord,
  getSessionLocation,
  calculateDistance,
  updateClassroomLocation,
  getSuspiciousRecords,
  batchVerifyLocations,
  pingLocationService,
};
