const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // ── Recipient ─────────────────────────────
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient is required"],
    },
    recipientRole: {
      type: String,
      enum: ["student", "teacher", "admin"],
    },

    // ── Sender (null = system) ────────────────
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Content ───────────────────────────────
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: [100, "Title must be at most 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: [500, "Message must be at most 500 characters"],
    },

    // ── Category ──────────────────────────────
    type: {
      type: String,
      enum: [
        "attendance_marked",
        "attendance_missed",
        "low_attendance_warning",
        "session_started",
        "session_closed",
        "session_expiring",
        "qr_refreshed",
        "qr_scan_failed",
        "location_failed",
        "new_student_joined",
        "student_request",
        "faculty_announcement",
        "assignment_reminder",
        "exam_schedule",
        "holiday_notice",
        "system_update",
        "security_alert",
        "account_verified",
        "password_changed",
        "achievement_unlocked",
        "report_ready",
        "general",
      ],
      default: "general",
    },
    category: {
      type: String,
      enum: [
        "attendance",
        "sessions",
        "students",
        "announcements",
        "system",
        "security",
      ],
      default: "system",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },

    // ── Read Status ───────────────────────────
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },

    // ── Action Link ───────────────────────────
    // Frontend route to navigate to on click
    actionUrl: {
      type: String,
      default: null,
    },

    // ── Related Documents (flexible reference) ─
    relatedDocument: {
      docId: { type: mongoose.Schema.Types.ObjectId },
      docModel: {
        type: String,
        enum: ["AttendanceSession", "Attendance", "User", "Student", "Teacher"],
      },
    },

    // ── Delivery ──────────────────────────────
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
    },
    emailSent: { type: Boolean, default: false },
    pushSent: { type: Boolean, default: false },

    // ── Scheduling ────────────────────────────
    scheduledAt: { type: Date, default: null }, // null = send immediately
    expiresAt: { type: Date, default: null }, // null = no expiry
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, category: 1 });
notificationSchema.index({ createdAt: -1 });

// TTL — auto-delete notifications older than 90 days
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60, name: "notification_ttl" },
);

// ─────────────────────────────────────────
// Virtuals
// ─────────────────────────────────────────
notificationSchema.virtual("isExpired").get(function () {
  return this.expiresAt && this.expiresAt < Date.now();
});

notificationSchema.virtual("timeAgo").get(function () {
  const diff = Date.now() - this.createdAt.getTime();
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (secs < 60) return `${secs}s ago`;
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
});

// ─────────────────────────────────────────
// Instance Methods
// ─────────────────────────────────────────

/** Mark notification as read */
notificationSchema.methods.markAsRead = async function () {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    await this.save({ validateBeforeSave: false });
  }
};

// ─────────────────────────────────────────
// Static Methods
// ─────────────────────────────────────────

/** Mark all unread notifications for a user as read */
notificationSchema.statics.markAllReadForUser = async function (userId) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } },
  );
};

/** Get unread count for a user */
notificationSchema.statics.unreadCount = async function (userId) {
  return this.countDocuments({ recipient: userId, isRead: false });
};

/** Create and save a notification in one call */
notificationSchema.statics.send = async function (payload) {
  return this.create(payload);
};

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
