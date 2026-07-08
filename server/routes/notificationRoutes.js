const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const {
  validateNotificationFilters,
  validateNotifId,
  validateMarkManyRead,
  validateDeleteMany,
  validateSendAnnouncement,
} = require("../middleware/validationMiddleware");

// All notification routes require authentication
router.use(protect);

// ═════════════════════════════════════════
// SHARED ROUTES — Student + Teacher + Admin
// ═════════════════════════════════════════

/**
 * GET /api/v1/notifications
 * Fetch paginated notifications for the logged-in user.
 *
 * Query params (all optional):
 *   page         {number}  default 1
 *   limit        {number}  default 20, max 100
 *   category     {string}  attendance|sessions|students|announcements|system|security
 *   isRead       {string}  true|false
 *   priority     {string}  low|normal|high|urgent
 *   sort         {string}  newest (default) | oldest
 *   search       {string}  full-text search on title + message
 *   startDate    {string}  ISO 8601
 *   endDate      {string}  ISO 8601
 */
router.get("/", validateNotificationFilters, ctrl.getNotifications);

/**
 * GET /api/v1/notifications/unread-count
 * Returns { total, attendance, sessions, students, announcements, system, security }
 * Polled by the navbar every 60s.
 */
router.get("/unread-count", ctrl.getUnreadCount);

/**
 * GET /api/v1/notifications/stats
 * Notification statistics for the analytics charts.
 */
router.get("/stats", ctrl.getStats);

/**
 * PATCH /api/v1/notifications/read-all
 * Mark all notifications as read.
 * Optional query param: ?category=attendance
 */
router.patch("/read-all", ctrl.markAllAsRead);

/**
 * PATCH /api/v1/notifications/read-many
 * Body: { ids: ["notifId1", "notifId2"] }
 * Mark a specific list of notifications as read.
 */
router.patch("/read-many", validateMarkManyRead, ctrl.markManyAsRead);

/**
 * DELETE /api/v1/notifications/delete-read
 * Delete all read notifications.
 * Optional query param: ?category=system
 */
router.delete("/delete-read", ctrl.deleteAllRead);

/**
 * DELETE /api/v1/notifications/delete-many
 * Body: { ids: ["notifId1", "notifId2"] }
 * Delete a specific list of notifications.
 */
router.delete("/delete-many", validateDeleteMany, ctrl.deleteManyNotifications);

/**
 * GET /api/v1/notifications/:notifId
 * Fetch a single notification.
 */
router.get("/:notifId", validateNotifId, ctrl.getNotification);

/**
 * PATCH /api/v1/notifications/:notifId/read
 * Mark a single notification as read.
 */
router.patch("/:notifId/read", validateNotifId, ctrl.markAsRead);

/**
 * DELETE /api/v1/notifications/:notifId
 * Delete a single notification.
 */
router.delete("/:notifId", validateNotifId, ctrl.deleteNotification);

// ═════════════════════════════════════════
// TEACHER + ADMIN ROUTES — Send notifications
// ═════════════════════════════════════════

/**
 * POST /api/v1/notifications/announce
 * Broadcast an announcement to students, teachers or all.
 * Body: {
 *   title, message,
 *   targetRole: 'student' | 'teacher' | 'all',
 *   targetUserIds?: string[],   ← optional: send to specific users
 *   priority?: 'low'|'normal'|'high'|'urgent',
 *   actionUrl?: string
 * }
 */
router.post(
  "/announce",
  restrictTo("teacher", "admin"),
  validateSendAnnouncement,
  ctrl.sendAnnouncement,
);

/**
 * POST /api/v1/notifications/attendance-alert
 * Send a low-attendance warning to a specific student.
 * Body: { studentId, subject, percentage, classesNeeded? }
 */
router.post(
  "/attendance-alert",
  restrictTo("teacher", "admin"),
  ctrl.sendAttendanceAlert,
);

/**
 * POST /api/v1/notifications/session-alert
 * Notify students when a session starts or ends.
 * Body: { sessionId, type: 'started' | 'ended' }
 */
router.post(
  "/session-alert",
  restrictTo("teacher", "admin"),
  ctrl.sendSessionAlert,
);

module.exports = router;
