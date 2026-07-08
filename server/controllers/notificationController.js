const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const { AppError } = require("../middleware/errorMiddleware");
const notificationService = require("../services/notificationService");
const templates = require("../utils/notificationTemplates");

// ═════════════════════════════════════════
// SHARED — Any authenticated user
// ═════════════════════════════════════════

// ─────────────────────────────────────────
// @route   GET /api/v1/notifications
// @desc    Get paginated notifications for the logged-in user
//          with full filtering, sorting and search.
// @access  Private
// ─────────────────────────────────────────
const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotifications(
    req.user._id,
    req.query,
  );

  sendResponse(res, {
    message: result.notifications.length
      ? "Notifications fetched."
      : "No notifications found.",
    data: result.notifications,
    meta: {
      unreadCount: result.unreadCount,
      pagination: result.pagination,
    },
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/notifications/unread-count
// @desc    Lightweight unread count broken down by category.
//          Polled by the navbar bell every 60 seconds.
// @access  Private
// ─────────────────────────────────────────
const getUnreadCount = asyncHandler(async (req, res) => {
  const counts = await notificationService.getUnreadCounts(req.user._id);

  sendResponse(res, {
    message: `You have ${counts.total} unread notification(s).`,
    data: counts,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/notifications/stats
// @desc    Analytics stats — pie + bar chart data for notification page.
// @access  Private
// ─────────────────────────────────────────
const getStats = asyncHandler(async (req, res) => {
  const stats = await notificationService.getNotificationStats(req.user._id);

  sendResponse(res, {
    message: "Notification statistics fetched.",
    data: stats,
  });
});

// ─────────────────────────────────────────
// @route   GET /api/v1/notifications/:notifId
// @desc    Get single notification detail.
// @access  Private
// ─────────────────────────────────────────
const getNotification = asyncHandler(async (req, res) => {
  const notif = await notificationService.getNotification(
    req.params.notifId,
    req.user._id,
  );

  sendResponse(res, {
    message: "Notification fetched.",
    data: { notification: notif },
  });
});

// ─────────────────────────────────────────
// @route   PATCH /api/v1/notifications/:notifId/read
// @desc    Mark a single notification as read.
// @access  Private
// ─────────────────────────────────────────
const markAsRead = asyncHandler(async (req, res) => {
  const notif = await notificationService.markAsRead(
    req.params.notifId,
    req.user._id,
  );

  sendResponse(res, {
    message: "Notification marked as read.",
    data: {
      notification: {
        _id: notif._id,
        isRead: notif.isRead,
        readAt: notif.readAt,
      },
    },
  });
});

// ─────────────────────────────────────────
// @route   PATCH /api/v1/notifications/read-all
// @desc    Mark all notifications as read (optionally scoped to a category).
//          Query param: ?category=attendance
// @access  Private
// ─────────────────────────────────────────
const markAllAsRead = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const count = await notificationService.markAllAsRead(req.user._id, {
    category,
  });

  sendResponse(res, {
    message:
      count > 0
        ? `${count} notification(s) marked as read.`
        : "All notifications were already read.",
    data: { modifiedCount: count },
  });
});

// ─────────────────────────────────────────
// @route   PATCH /api/v1/notifications/read-many
// @desc    Mark a specific list of notification IDs as read.
//          Body: { ids: ["id1", "id2"] }
// @access  Private
// ─────────────────────────────────────────
const markManyAsRead = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const count = await notificationService.markManyAsRead(ids, req.user._id);

  sendResponse(res, {
    message: `${count} notification(s) marked as read.`,
    data: { modifiedCount: count },
  });
});

// ─────────────────────────────────────────
// @route   DELETE /api/v1/notifications/:notifId
// @desc    Delete a single notification.
// @access  Private
// ─────────────────────────────────────────
const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(
    req.params.notifId,
    req.user._id,
  );

  sendResponse(res, { message: "Notification deleted successfully." });
});

// ─────────────────────────────────────────
// @route   DELETE /api/v1/notifications/delete-read
// @desc    Delete all read notifications (optionally scoped to category).
//          Query param: ?category=system
// @access  Private
// ─────────────────────────────────────────
const deleteAllRead = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const count = await notificationService.deleteAllRead(req.user._id, category);

  sendResponse(res, {
    message:
      count > 0
        ? `${count} read notification(s) deleted.`
        : "No read notifications to delete.",
    data: { deletedCount: count },
  });
});

// ─────────────────────────────────────────
// @route   DELETE /api/v1/notifications/delete-many
// @desc    Delete a specific list of notification IDs.
//          Body: { ids: ["id1", "id2"] }
// @access  Private
// ─────────────────────────────────────────
const deleteManyNotifications = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const count = await notificationService.deleteManyNotifications(
    ids,
    req.user._id,
  );

  sendResponse(res, {
    message: `${count} notification(s) deleted.`,
    data: { deletedCount: count },
  });
});

// ═════════════════════════════════════════
// TEACHER — Send notifications to students
// ═════════════════════════════════════════

// ─────────────────────────────────────────
// @route   POST /api/v1/notifications/announce
// @desc    Teacher broadcasts an announcement to students or all users.
//          Body: { title, message, targetRole, targetUserIds?, priority?, actionUrl? }
// @access  Private — Teacher / Admin
// ─────────────────────────────────────────
const sendAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, targetRole, targetUserIds, priority, actionUrl } =
    req.body;

  const User = require("../models/User");

  let count = 0;

  if (targetUserIds?.length) {
    // Send to specific users
    const payloads = targetUserIds.map((id) =>
      templates.announcement({
        recipientId: id,
        recipientRole: targetRole === "all" ? undefined : targetRole,
        senderId: req.user._id,
        announcementTitle: title,
        body: message,
        actionUrl,
      }),
    );
    count = await notificationService.broadcast(payloads);
  } else if (targetRole === "all") {
    // Broadcast to both students and teachers
    const users = await User.find({
      role: { $in: ["student", "teacher"] },
      status: "active",
    }).select("_id role");

    const payloads = users.map((u) =>
      templates.announcement({
        recipientId: u._id,
        recipientRole: u.role,
        senderId: req.user._id,
        announcementTitle: title,
        body: message,
        actionUrl,
      }),
    );
    count = await notificationService.broadcast(payloads);
  } else {
    // Broadcast to a role
    count = await notificationService.broadcastToRole(
      targetRole,
      templates.announcement,
      {
        senderId: req.user._id,
        recipientRole: targetRole,
        announcementTitle: title,
        body: message,
        actionUrl,
      },
    );
  }

  sendResponse(res, {
    statusCode: 201,
    message: `Announcement sent to ${count} user(s).`,
    data: { sentCount: count },
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/notifications/attendance-alert
// @desc    Send a low attendance alert to a specific student.
//          Body: { studentId, subject, percentage, classesNeeded }
// @access  Private — Teacher
// ─────────────────────────────────────────
const sendAttendanceAlert = asyncHandler(async (req, res) => {
  const { studentId, subject, percentage, classesNeeded } = req.body;

  if (!studentId || !subject || percentage === undefined) {
    throw new AppError("studentId, subject and percentage are required.", 400);
  }

  const User = require("../models/User");
  const student = await User.findById(studentId).select("_id status role");
  if (!student || student.role !== "student") {
    throw new AppError("Student not found.", 404);
  }

  await notificationService.send(
    templates.lowAttendanceWarning({
      recipientId: studentId,
      recipientRole: "student",
      senderId: req.user._id,
      subject,
      percentage,
      classesNeeded: classesNeeded || 0,
    }),
  );

  sendResponse(res, {
    statusCode: 201,
    message: `Low attendance alert sent to student.`,
  });
});

// ─────────────────────────────────────────
// @route   POST /api/v1/notifications/session-alert
// @desc    Notify students that a session has started or ended.
//          Body: { sessionId, type: 'started' | 'ended' }
// @access  Private — Teacher
// ─────────────────────────────────────────
const sendSessionAlert = asyncHandler(async (req, res) => {
  const { sessionId, type } = req.body;

  if (!["started", "ended"].includes(type)) {
    throw new AppError("type must be 'started' or 'ended'.", 400);
  }

  const AttendanceSession = require("../models/AttendanceSession");
  const Attendance = require("../models/Attendance");
  const User = require("../models/User");

  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: req.user._id,
  });

  if (!session) throw new AppError("Session not found or access denied.", 404);

  // Get all unique students for this section/department
  const query = { role: "student", status: "active" };
  const students = await User.find(query).select("_id");

  let count = 0;

  if (type === "started") {
    const payloads = students.map((s) =>
      templates.sessionStarted({
        recipientId: s._id,
        recipientRole: "student",
        senderId: req.user._id,
        subject: session.subject,
        sessionCode: session.sessionCode,
        roomNumber: session.roomNumber,
      }),
    );
    count = await notificationService.broadcast(payloads);
  } else {
    // Ended — notify only students who were in this session
    const attendedStudentIds = await Attendance.find({
      session: sessionId,
    }).distinct("student");

    const payloads = attendedStudentIds.map((id) =>
      templates.sessionClosed({
        recipientId: id,
        recipientRole: "student",
        senderId: req.user._id,
        subject: session.subject,
        sessionCode: session.sessionCode,
        presentCount: session.stats.presentCount,
        totalCount: session.stats.totalStudents,
      }),
    );
    count = await notificationService.broadcast(payloads);
  }

  sendResponse(res, {
    statusCode: 201,
    message: `Session ${type} alert sent to ${count} student(s).`,
    data: { sentCount: count },
  });
});

module.exports = {
  // Shared
  getNotifications,
  getUnreadCount,
  getStats,
  getNotification,
  markAsRead,
  markAllAsRead,
  markManyAsRead,
  deleteNotification,
  deleteAllRead,
  deleteManyNotifications,
  // Teacher
  sendAnnouncement,
  sendAttendanceAlert,
  sendSessionAlert,
};
