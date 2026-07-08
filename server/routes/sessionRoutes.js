const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const {
  validateCreateSession,
  validateUpdateSession,
  validateSessionId,
} = require("../middleware/validationMiddleware");

// All session routes require authentication and teacher role
router.use(protect, restrictTo("teacher"));

// ── CRUD ──────────────────────────────────

/**
 * POST   /api/v1/sessions          — Create session
 * GET    /api/v1/sessions          — List teacher's sessions (filters via query)
 */
router
  .route("/")
  .post(validateCreateSession, ctrl.createSession)
  .get(ctrl.getSessions);

/**
 * GET    /api/v1/sessions/:sessionId   — Get single session
 * PUT    /api/v1/sessions/:sessionId   — Update session
 * DELETE /api/v1/sessions/:sessionId   — Delete session (draft only)
 */
router
  .route("/:sessionId")
  .get(validateSessionId, ctrl.getSession)
  .put(validateUpdateSession, ctrl.updateSession)
  .delete(validateSessionId, ctrl.deleteSession);

// ── Lifecycle ─────────────────────────────
router.patch("/:sessionId/start", validateSessionId, ctrl.startSession);
router.patch("/:sessionId/pause", validateSessionId, ctrl.pauseSession);
router.patch("/:sessionId/resume", validateSessionId, ctrl.resumeSession);
router.patch("/:sessionId/end", validateSessionId, ctrl.endSession);
router.patch("/:sessionId/extend", validateSessionId, ctrl.extendSession);

// ── QR ────────────────────────────────────
router.get("/:sessionId/qr", validateSessionId, ctrl.getQRCode);

// ── Live & Reporting ──────────────────────
router.get("/:sessionId/live", validateSessionId, ctrl.getLiveAttendance);
router.get("/:sessionId/report", validateSessionId, ctrl.getSessionReport);

// ── Manual attendance override ────────────
router.patch(
  "/:sessionId/attendance/:attendanceId/manual",
  validateSessionId,
  ctrl.manualMarkAttendance,
);

module.exports = router;
