const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/qrAttendanceController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const {
  validateQRPayload,
  validateQRSessionId,
} = require("../middleware/validationMiddleware");

// ═════════════════════════════════════════
// TEACHER ROUTES — Generate / refresh QR
// ═════════════════════════════════════════

/**
 * POST /api/v1/qr/generate/:sessionId
 * Generate initial QR code for a session that was just started.
 * Returns: dataURL (base64 PNG), expiresAt, expiresInSeconds
 */
router.post(
  "/generate/:sessionId",
  protect,
  restrictTo("teacher"),
  validateQRSessionId,
  ctrl.generateQR,
);

/**
 * PUT /api/v1/qr/refresh/:sessionId
 * Force-regenerate QR — old token instantly invalidated.
 * Polled by the teacher's frontend every N seconds.
 * Returns: dataURL, expiresAt, expiresInSeconds
 */
router.put(
  "/refresh/:sessionId",
  protect,
  restrictTo("teacher"),
  validateQRSessionId,
  ctrl.refreshQR,
);

/**
 * GET /api/v1/qr/status/:sessionId
 * Lightweight expiry check — no image generation.
 * Used by the frontend countdown timer.
 * Returns: secondsUntilExpiry, qrIsExpired, stats
 */
router.get(
  "/status/:sessionId",
  protect,
  restrictTo("teacher"),
  validateQRSessionId,
  ctrl.getQRStatus,
);

// ═════════════════════════════════════════
// STUDENT ROUTES — Scan and submit
// ═════════════════════════════════════════

/**
 * POST /api/v1/qr/validate
 * Step 1 — Run all checks, return session preview.
 * Does NOT save an attendance record.
 * Body: { qrPayload, latitude, longitude }
 */
router.post(
  "/validate",
  protect,
  restrictTo("student"),
  validateQRPayload,
  ctrl.validateQR,
);

/**
 * POST /api/v1/qr/submit
 * Step 2 — Re-validate then save attendance record.
 * Body: { qrPayload, latitude, longitude }
 */
router.post(
  "/submit",
  protect,
  restrictTo("student"),
  validateQRPayload,
  ctrl.submitAttendance,
);

/**
 * POST /api/v1/qr/scan
 * One-shot endpoint — validate + save in a single request.
 * Use when no confirm step is needed between scan and record.
 * Body: { qrPayload, latitude, longitude }
 */
router.post(
  "/scan",
  protect,
  restrictTo("student"),
  validateQRPayload,
  ctrl.scanAndSubmit,
);

module.exports = router;
