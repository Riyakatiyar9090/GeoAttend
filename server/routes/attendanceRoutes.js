const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/attendanceController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const {
  validateMarkAttendance,
  validateVerifyLocation,
  validateQRScan,
  validateAttendanceFilters,
  validateAttendanceId,
} = require("../middleware/validationMiddleware");

// All attendance routes require authentication + student role
router.use(protect, restrictTo("student"));

/**
 * GET  /api/v1/attendance/active-sessions
 * Query params: subject, date
 * Returns all currently live sessions the student can join
 */
router.get("/active-sessions", ctrl.getActiveSessions);

/**
 * GET  /api/v1/attendance/summary
 * Quick stats: overall %, present, absent, classes needed
 */
router.get("/summary", ctrl.getAttendanceSummary);

/**
 * GET  /api/v1/attendance/history
 * Query: status, subject, startDate, endDate, page, limit, sort
 */
router.get("/history", validateAttendanceFilters, ctrl.getAttendanceHistory);

/**
 * GET  /api/v1/attendance/:attendanceId
 * Full detail of a single attendance record
 */
router.get("/:attendanceId", validateAttendanceId, ctrl.getAttendanceDetail);

/**
 * POST /api/v1/attendance/validate-qr
 * Body: { qrToken }
 * Validate the QR payload before attempting to mark attendance
 */
router.post("/validate-qr", validateQRScan, ctrl.validateQR);

/**
 * POST /api/v1/attendance/verify-location
 * Body: { sessionId, latitude, longitude }
 * Check if student is within the classroom radius
 */
router.post("/verify-location", validateVerifyLocation, ctrl.verifyLocation);

/**
 * POST /api/v1/attendance/mark
 * Body: { sessionId, qrToken, latitude, longitude }
 * Full attendance marking flow (QR + location + duplicate check)
 */
router.post("/mark", validateMarkAttendance, ctrl.markAttendance);

module.exports = router;
