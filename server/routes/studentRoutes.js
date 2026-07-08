const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const {
  validateStudentUpdateProfile,
} = require("../middleware/validationMiddleware");

// All student routes require auth + student role
router.use(protect, restrictTo("student"));

// ── Dashboard & Analytics ─────────────────
router.get("/dashboard", ctrl.getDashboard);
router.get("/analytics", ctrl.getAnalytics);

// ── Profile ───────────────────────────────
router.get("/profile", ctrl.getProfile);
router.put("/profile", validateStudentUpdateProfile, ctrl.updateProfile);
router.post("/profile/avatar", upload.single("avatar"), ctrl.uploadAvatar);

// ── Notifications ─────────────────────────
router.get("/notifications", ctrl.getNotifications);
router.patch("/notifications/read-all", ctrl.markAllNotificationsRead);
router.patch("/notifications/:notifId/read", ctrl.markNotificationRead);
router.delete("/notifications/:notifId", ctrl.deleteNotification);

// ── Settings ──────────────────────────────
router.get("/settings", ctrl.getSettings);
router.put("/settings", ctrl.updateSettings);

module.exports = router;
