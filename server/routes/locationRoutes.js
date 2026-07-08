const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/locationController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const {
  validateLocationVerification,
  validateUpdateClassroomLocation,
  validateBatchVerify,
  validateSessionIdParam,
} = require("../middleware/validationMiddleware");

// All location routes require authentication
router.use(protect);

// ─────────────────────────────────────────
// Health check
// ─────────────────────────────────────────

/**
 * GET /api/v1/location/ping
 * Confirm location service is up.
 */
router.get("/ping", ctrl.pingLocationService);

// ─────────────────────────────────────────
// Shared — Student + Teacher
// ─────────────────────────────────────────

/**
 * POST /api/v1/location/calculate-distance
 * Body: { fromLat, fromLng, toLat, toLng, radius? }
 * Calculate distance between any two coordinate pairs.
 * Used by the map preview on both teacher and student pages.
 */
router.post(
  "/calculate-distance",
  restrictTo("student", "teacher", "admin"),
  ctrl.calculateDistance,
);

// ─────────────────────────────────────────
// Student routes
// ─────────────────────────────────────────

/**
 * POST /api/v1/location/verify
 * Body: { sessionId, latitude, longitude, accuracy? }
 * Run Haversine check — does NOT save to DB.
 * Use before marking attendance to preview whether the student qualifies.
 */
router.post(
  "/verify",
  restrictTo("student"),
  validateLocationVerification,
  ctrl.verifyLocation,
);

/**
 * POST /api/v1/location/verify-and-record
 * Body: { sessionId, latitude, longitude }
 * Verify location AND update the existing Attendance record.
 * Use when GPS is submitted after QR scan in a two-step flow.
 */
router.post(
  "/verify-and-record",
  restrictTo("student"),
  validateLocationVerification,
  ctrl.verifyAndRecord,
);

/**
 * GET /api/v1/location/session/:sessionId
 * Get classroom lat/lng/radius for a session.
 * Feeds the student's Leaflet map with the classroom pin.
 */
router.get(
  "/session/:sessionId",
  restrictTo("student", "teacher"),
  validateSessionIdParam,
  ctrl.getSessionLocation,
);

// ─────────────────────────────────────────
// Teacher routes
// ─────────────────────────────────────────

/**
 * PUT /api/v1/location/session/:sessionId
 * Body: { latitude, longitude, radius? }
 * Update classroom GPS pin (allowed while draft or active).
 */
router.put(
  "/session/:sessionId",
  restrictTo("teacher"),
  validateUpdateClassroomLocation,
  ctrl.updateClassroomLocation,
);

/**
 * GET /api/v1/location/session/:sessionId/suspicious
 * Return all attendance records where student was outside
 * the radius or the location was flagged as suspicious.
 */
router.get(
  "/session/:sessionId/suspicious",
  restrictTo("teacher"),
  validateSessionIdParam,
  ctrl.getSuspiciousRecords,
);

/**
 * POST /api/v1/location/batch-verify
 * Body: { sessionId, submissions: [{ studentUserId, lat, lng }] }
 * Bulk-validate up to 200 GPS submissions against a single session.
 */
router.post(
  "/batch-verify",
  restrictTo("teacher", "admin"),
  validateBatchVerify,
  ctrl.batchVerifyLocations,
);

module.exports = router;
