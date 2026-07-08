const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/teacherController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const { validateUpdateProfile } = require("../middleware/validationMiddleware");

// All teacher routes require authentication + teacher role
router.use(protect, restrictTo("teacher"));

// ── Dashboard & Analytics ─────────────────
router.get("/dashboard", ctrl.getDashboard);
router.get("/analytics", ctrl.getAnalytics);

// ── Profile ───────────────────────────────
router.get("/profile", ctrl.getProfile);
router.put("/profile", validateUpdateProfile, ctrl.updateProfile);
router.post(
  "/profile/avatar",
  upload.single("avatar"), // multer parses the multipart field
  ctrl.uploadAvatar,
);

// ── Notifications ─────────────────────────
router.get("/notifications", ctrl.getNotifications);
router.patch("/notifications/read-all", ctrl.markAllNotificationsRead);
router.patch("/notifications/:notifId/read", ctrl.markNotificationRead);
router.delete("/notifications/:notifId", ctrl.deleteNotification);

// ── Settings ──────────────────────────────
router.get("/settings", ctrl.getSettings);
router.put("/settings", ctrl.updateSettings);

module.exports = router;
