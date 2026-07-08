const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const { AppError } = require("../middleware/errorMiddleware");
const qrAttendanceService = require("../services/qrAttendanceService");

// ═════════════════════════════════════════
// TEACHER CONTROLLERS
// ═════════════════════════════════════════

// ─────────────────────────────────────────
// @route   POST /api/v1/qr/generate/:sessionId
// @desc    Generate (or regenerate) QR code for a session
// @access  Private — Teacher only
// ─────────────────────────────────────────
const generateQR = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const teacherId = req.user._id;

  const { qr } = await qrAttendanceService.generateQR(sessionId, teacherId);

  sendResponse(res, {
    statusCode: 200,
    message: "QR code generated successfully.",
    data: {
      sessionId,
      ...qr,
    },
  });
});

// ─────────────────────────────────────────
// @route   PUT /api/v1/qr/refresh/:sessionId
// @desc    Force-refresh the QR code (new token, new expiry)
// @access  Private — Teacher only
// ─────────────────────────────────────────
const refreshQR = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const teacherId = req.user._id;

  const { qr } = await qrAttendanceService.refreshQR(sessionId, teacherId);

  sendResponse(res, {
    statusCode: 200,
    message: "QR code refreshed. The previous QR is now invalid.",
    data: {
      sessionId,
      ...qr,
    },
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/qr/status/:sessionId
// @desc    Get QR expiry status without regenerating
// @access  Private — Teacher only
// ─────────────────────────────────────────
const getQRStatus = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const teacherId = req.user._id;

  const status = await qrAttendanceService.getQRStatus(sessionId, teacherId);

  sendResponse(res, {
    statusCode: 200,
    message: status.qrIsExpired
      ? "QR code has expired. Generate a new one."
      : `QR code is active. Expires in ${status.secondsUntilExpiry}s.`,
    data: status,
  });
});

// ═════════════════════════════════════════
// STUDENT CONTROLLERS
// ═════════════════════════════════════════

// ─────────────────────────────────────────
// @route   POST /api/v1/qr/validate
// @desc    Validate a scanned QR payload (Step 1 of 2)
//          Run all checks WITHOUT saving attendance yet.
//          Frontend shows session info + asks for location confirmation.
// @access  Private — Student only
// ─────────────────────────────────────────
const validateQR = asyncHandler(async (req, res) => {
  const { qrPayload, latitude, longitude } = req.body;

  const result = await qrAttendanceService.validateQRScan({
    rawQRPayload: qrPayload,
    studentUserId: req.user._id,
    studentLat: latitude,
    studentLng: longitude,
    deviceInfo: {
      userAgent: req.headers["user-agent"] || "",
      ipAddress: req.ip || "",
      platform: req.headers["sec-ch-ua-platform"] || "",
    },
  });

  // If already marked, return early
  if (result.alreadyMarked) {
    return sendResponse(res, {
      statusCode: 200,
      message: "Attendance for this session has already been recorded.",
      data: {
        alreadyMarked: true,
        existingRecord: result.existingRecord,
        session: {
          _id: result.session._id,
          subject: result.session.subject,
          sessionCode: result.session.sessionCode,
        },
      },
    });
  }

  // Return session preview data (shown to student before confirming)
  sendResponse(res, {
    statusCode: 200,
    message: "QR code validated. Please confirm to mark your attendance.",
    data: {
      valid: true,
      preview: {
        session: {
          _id: result.session._id,
          sessionCode: result.session.sessionCode,
          subject: result.session.subject,
          className: result.session.className,
          roomNumber: result.session.roomNumber,
          startTime: result.session.startTime,
          endTime: result.session.endTime,
          date: result.session.date,
          radius: result.session.radius,
          allowLateEntry: result.session.allowLateEntry,
          teacher: {
            name: `${result.session.teacher.firstName} ${result.session.teacher.lastName}`,
            email: result.session.teacher.email,
          },
        },
        locationVerified: result.locationVerified,
        distanceFromClassroom: result.distanceFromClassroom,
        isLate: result.isLate,
      },
    },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/qr/submit
// @desc    Final attendance submission (Step 2 of 2)
//          Runs full validation again, then saves record.
// @access  Private — Student only
// ─────────────────────────────────────────
const submitAttendance = asyncHandler(async (req, res) => {
  const { qrPayload, latitude, longitude } = req.body;

  const deviceInfo = {
    userAgent: req.headers["user-agent"] || "",
    ipAddress: req.ip || req.connection?.remoteAddress || "",
    platform: req.headers["sec-ch-ua-platform"] || "",
  };

  // Re-run full validation (prevents replaying validate→submit with stale data)
  const validationResult = await qrAttendanceService.validateQRScan({
    rawQRPayload: qrPayload,
    studentUserId: req.user._id,
    studentLat: latitude,
    studentLng: longitude,
    deviceInfo,
  });

  // Handle already-marked case gracefully
  if (validationResult.alreadyMarked) {
    return sendResponse(res, {
      statusCode: 200,
      message: "Attendance has already been recorded for this session.",
      data: {
        alreadyMarked: true,
        existingRecord: validationResult.existingRecord,
      },
    });
  }

  // Attach device info and coords for submitAttendance
  validationResult.deviceInfo = deviceInfo;
  validationResult.studentLat = latitude;
  validationResult.studentLng = longitude;

  // Save attendance record
  const { record, attendanceSummary } =
    await qrAttendanceService.submitAttendance(validationResult);

  sendResponse(res, {
    statusCode: 201,
    message: `🎉 Attendance marked as ${attendanceSummary.status === "late" ? "Late" : "Present"} for ${attendanceSummary.subject}.`,
    data: {
      record: {
        _id: record._id,
        status: record.status,
        qrVerified: record.qrVerified,
        locationVerified: record.locationVerified,
        verificationMethod: record.verificationMethod,
        markedAt: record.markedAt,
        isLate: record.isLate,
      },
      attendanceSummary,
    },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/qr/scan
// @desc    Combined one-shot scan endpoint.
//          Validates AND saves in a single request.
//          Use this if the frontend does not have a
//          confirm step between validate and submit.
// @access  Private — Student only
// ─────────────────────────────────────────
const scanAndSubmit = asyncHandler(async (req, res) => {
  const { qrPayload, latitude, longitude } = req.body;

  const deviceInfo = {
    userAgent: req.headers["user-agent"] || "",
    ipAddress: req.ip || "",
    platform: req.headers["sec-ch-ua-platform"] || "",
  };

  const validationResult = await qrAttendanceService.validateQRScan({
    rawQRPayload: qrPayload,
    studentUserId: req.user._id,
    studentLat: latitude,
    studentLng: longitude,
    deviceInfo,
  });

  if (validationResult.alreadyMarked) {
    return sendResponse(res, {
      statusCode: 200,
      message: "Attendance was already recorded.",
      data: {
        alreadyMarked: true,
        existingRecord: validationResult.existingRecord,
      },
    });
  }

  validationResult.deviceInfo = deviceInfo;
  validationResult.studentLat = latitude;
  validationResult.studentLng = longitude;

  const { record, attendanceSummary } =
    await qrAttendanceService.submitAttendance(validationResult);

  sendResponse(res, {
    statusCode: 201,
    message: `Attendance marked as ${record.status}.`,
    data: {
      record: {
        _id: record._id,
        status: record.status,
        qrVerified: record.qrVerified,
        locationVerified: record.locationVerified,
        verificationMethod: record.verificationMethod,
        markedAt: record.markedAt,
        isLate: record.isLate,
      },
      attendanceSummary,
    },
  });
});

module.exports = {
  generateQR,
  refreshQR,
  getQRStatus,
  validateQR,
  submitAttendance,
  scanAndSubmit,
};
