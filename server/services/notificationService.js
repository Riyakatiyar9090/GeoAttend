const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { AppError } = require("../middleware/errorMiddleware");
const templates = require("../utils/notificationTemplates");

// ─────────────────────────────────────────
// Core send helper
// ─────────────────────────────────────────

/**
 * Create and persist a single notification.
 * Wraps Notification.send() with error isolation so
 * a failed notification never breaks the calling flow.
 *
 * @param {object} payload - Notification template output
 * @returns {Promise<Notification|null>}
 */
const send = async (payload) => {
  try {
    const notif = await Notification.send(payload);
    return notif;
  } catch (err) {
    // Log but do not propagate — notifications are non-critical
    console.error(
      `⚠️  Notification send failed [${payload.type}]:`,
      err.message,
    );
    return null;
  }
};

/**
 * Broadcast a single notification payload to multiple recipients.
 * Uses insertMany for efficiency.
 *
 * @param {object[]} payloads - Array of notification objects
 * @returns {Promise<number>} Number successfully inserted
 */
const broadcast = async (payloads) => {
  if (!payloads?.length) return 0;

  try {
    const result = await Notification.insertMany(payloads, { ordered: false });
    return result.length;
  } catch (err) {
    console.error("⚠️  Broadcast notification error:", err.message);
    return 0;
  }
};

// ─────────────────────────────────────────
// Build paginated query options
// ─────────────────────────────────────────

const buildNotificationQuery = (userId, filters = {}) => {
  const query = { recipient: userId };

  // ── Category filter ──
  const validCategories = [
    "attendance",
    "sessions",
    "students",
    "announcements",
    "system",
    "security",
  ];
  if (filters.category && validCategories.includes(filters.category)) {
    query.category = filters.category;
  }

  // ── Read / unread filter ──
  if (filters.isRead === "true") query.isRead = true;
  else if (filters.isRead === "false") query.isRead = false;

  // ── Priority filter ──
  const validPriorities = ["low", "normal", "high", "urgent"];
  if (filters.priority && validPriorities.includes(filters.priority)) {
    query.priority = filters.priority;
  }

  // ── Type filter ──
  if (filters.type) query.type = filters.type;

  // ── Date range filter ──
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
  }

  // ── Search filter (title + message) ──
  if (filters.search?.trim()) {
    const regex = new RegExp(filters.search.trim(), "i");
    query.$or = [{ title: regex }, { message: regex }];
  }

  return query;
};

// ─────────────────────────────────────────
// Get notifications (paginated + filtered)
// ─────────────────────────────────────────

/**
 * Fetch notifications for a user with full filtering,
 * sorting, pagination and unread count in one round-trip.
 */
const getNotifications = async (userId, filters = {}) => {
  const page = Math.max(parseInt(filters.page, 10) || 1, 1);
  const limit = Math.min(parseInt(filters.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  // Sort order
  const sortOrder = filters.sort === "oldest" ? 1 : -1;
  const sortField = filters.sortBy || "createdAt";
  const validSortFields = ["createdAt", "priority", "isRead"];
  const sort = {
    [validSortFields.includes(sortField) ? sortField : "createdAt"]: sortOrder,
  };

  const query = buildNotificationQuery(userId, filters);

  // Run count + fetch + unread in parallel
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .populate("sender", "firstName lastName avatar role")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
    Notification.unreadCount(userId),
  ]);

  // Attach computed timeAgo on each item
  const enriched = notifications.map((n) => ({
    ...n,
    timeAgo: computeTimeAgo(n.createdAt),
  }));

  return {
    notifications: enriched,
    unreadCount,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

// ─────────────────────────────────────────
// Get single notification
// ─────────────────────────────────────────

const getNotification = async (notifId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(notifId)) {
    throw new AppError("Invalid notification ID.", 400);
  }

  const notif = await Notification.findOne({
    _id: notifId,
    recipient: userId,
  }).populate("sender", "firstName lastName avatar role");

  if (!notif) throw new AppError("Notification not found.", 404);

  return notif;
};

// ─────────────────────────────────────────
// Mark as read
// ─────────────────────────────────────────

const markAsRead = async (notifId, userId) => {
  const notif = await getNotification(notifId, userId);
  await notif.markAsRead();
  return notif;
};

const markAllAsRead = async (userId, filters = {}) => {
  const query = { recipient: userId, isRead: false };

  // Allow scoped mark-all (e.g. mark all attendance notifications read)
  if (filters.category) query.category = filters.category;

  const result = await Notification.updateMany(query, {
    $set: { isRead: true, readAt: new Date() },
  });

  return result.modifiedCount;
};

/**
 * Mark a list of notification IDs as read in one operation.
 */
const markManyAsRead = async (notifIds, userId) => {
  const validIds = notifIds
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  if (!validIds.length)
    throw new AppError("No valid notification IDs provided.", 400);

  const result = await Notification.updateMany(
    { _id: { $in: validIds }, recipient: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } },
  );

  return result.modifiedCount;
};

// ─────────────────────────────────────────
// Delete
// ─────────────────────────────────────────

const deleteNotification = async (notifId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(notifId)) {
    throw new AppError("Invalid notification ID.", 400);
  }

  const notif = await Notification.findOneAndDelete({
    _id: notifId,
    recipient: userId,
  });
  if (!notif) throw new AppError("Notification not found.", 404);
  return true;
};

/**
 * Delete all read notifications for a user
 * (or scoped to a category).
 */
const deleteAllRead = async (userId, category) => {
  const query = { recipient: userId, isRead: true };
  if (category) query.category = category;

  const result = await Notification.deleteMany(query);
  return result.deletedCount;
};

/**
 * Delete multiple notifications by ID array.
 */
const deleteManyNotifications = async (notifIds, userId) => {
  const validIds = notifIds
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  if (!validIds.length)
    throw new AppError("No valid notification IDs provided.", 400);

  const result = await Notification.deleteMany({
    _id: { $in: validIds },
    recipient: userId,
  });

  return result.deletedCount;
};

// ─────────────────────────────────────────
// Unread count
// ─────────────────────────────────────────

/**
 * Get unread counts broken down by category.
 * Used by the notification bell badge in the navbar.
 */
const getUnreadCounts = async (userId) => {
  const breakdown = await Notification.aggregate([
    {
      $match: { recipient: new mongoose.Types.ObjectId(userId), isRead: false },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  const counts = {
    total: 0,
    attendance: 0,
    sessions: 0,
    students: 0,
    announcements: 0,
    system: 0,
    security: 0,
  };

  breakdown.forEach(({ _id, count }) => {
    if (_id in counts) counts[_id] = count;
    counts.total += count;
  });

  return counts;
};

// ─────────────────────────────────────────
// Stats (for analytics chart)
// ─────────────────────────────────────────

/**
 * Notification statistics for the analytics section.
 * Returns read/unread pie data + category bar data.
 */
const getNotificationStats = async (userId) => {
  const [readUnread, byCategory, byPriority, recent] = await Promise.all([
    // Read vs unread
    Notification.aggregate([
      { $match: { recipient: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$isRead",
          count: { $sum: 1 },
        },
      },
    ]),
    // By category
    Notification.aggregate([
      { $match: { recipient: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]),
    // By priority
    Notification.aggregate([
      {
        $match: {
          recipient: new mongoose.Types.ObjectId(userId),
          isRead: false,
        },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]),
    // Last 7 days daily activity
    Notification.aggregate([
      {
        $match: {
          recipient: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const readCount = readUnread.find((r) => r._id === true)?.count || 0;
  const unreadCount = readUnread.find((r) => r._id === false)?.count || 0;

  return {
    summary: {
      total: readCount + unreadCount,
      read: readCount,
      unread: unreadCount,
    },
    byCategory,
    byPriority,
    dailyActivity: recent,
  };
};

// ─────────────────────────────────────────
// Broadcast helpers for system-wide events
// ─────────────────────────────────────────

/**
 * Send a notification to ALL users matching a role.
 * Used for system updates, holiday notices, etc.
 *
 * @param {string} role - 'student' | 'teacher' | 'admin'
 * @param {function} templateFn - Template factory function
 * @param {object}   templateArgs - Arguments passed to the template
 */
const broadcastToRole = async (role, templateFn, templateArgs) => {
  const users = await User.find({ role, status: "active" }).select("_id");

  const payloads = users.map((u) =>
    templateFn({ ...templateArgs, recipientId: u._id, recipientRole: role }),
  );

  return broadcast(payloads);
};

/**
 * Send a notification to a specific list of user IDs.
 */
const broadcastToUsers = async (userIds, templateFn, templateArgs) => {
  const payloads = userIds.map((id) =>
    templateFn({ ...templateArgs, recipientId: id }),
  );

  return broadcast(payloads);
};

// ─────────────────────────────────────────
// Utility — human-readable time ago
// ─────────────────────────────────────────

const computeTimeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (secs < 60) return `${secs}s ago`;
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

module.exports = {
  // Core
  send,
  broadcast,
  broadcastToRole,
  broadcastToUsers,
  // CRUD
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  markManyAsRead,
  deleteNotification,
  deleteAllRead,
  deleteManyNotifications,
  // Counts & stats
  getUnreadCounts,
  getNotificationStats,
  // Templates re-export for convenience
  templates,
};
