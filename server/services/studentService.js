const User = require("../models/User");
const Student = require("../models/Student");
const Notification = require("../models/Notification");
const { AppError } = require("../middleware/errorMiddleware");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../middleware/uploadMiddleware");

// ─────────────────────────────────────────
// Profile
// ─────────────────────────────────────────

/**
 * Get full student profile — User doc + Student profile doc.
 */
const getProfile = async (userId) => {
  const [user, profile] = await Promise.all([
    User.findById(userId).select("-password"),
    Student.findOne({ user: userId }),
  ]);

  if (!profile) throw new AppError("Student profile not found.", 404);
  return { user, profile };
};

/**
 * Update personal info on both User and Student documents.
 * Only whitelisted fields are allowed.
 */
const updateProfile = async (userId, userData, studentData) => {
  // User-level fields
  const userAllowed = ["firstName", "lastName", "phone"];
  const userUpdates = {};
  userAllowed.forEach((f) => {
    if (userData[f] !== undefined) userUpdates[f] = userData[f];
  });

  // Student-level fields
  const studentAllowed = [
    "course",
    "branch",
    "semester",
    "section",
    "college",
    "department",
    "admissionYear",
    "graduationYear",
    "gender",
    "dateOfBirth",
  ];
  const studentUpdates = {};
  studentAllowed.forEach((f) => {
    if (studentData[f] !== undefined) studentUpdates[f] = studentData[f];
  });
  if (studentData.address) studentUpdates.address = studentData.address;
  if (studentData.emergencyContact)
    studentUpdates.emergencyContact = studentData.emergencyContact;

  const [user, profile] = await Promise.all([
    User.findByIdAndUpdate(
      userId,
      { $set: userUpdates },
      { new: true, runValidators: true },
    ).select("-password"),
    Student.findOneAndUpdate(
      { user: userId },
      { $set: studentUpdates },
      { new: true, runValidators: true },
    ),
  ]);

  return { user, profile };
};

/**
 * Upload / replace profile avatar on Cloudinary.
 */
const uploadAvatar = async (userId, fileBuffer) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  // Remove old image from Cloudinary
  if (user.avatar?.public_id) {
    await deleteFromCloudinary(user.avatar.public_id);
  }

  const result = await uploadToCloudinary(
    fileBuffer,
    "geoattend/avatars/students",
  );

  user.avatar = { public_id: result.public_id, url: result.secure_url };
  await user.save({ validateBeforeSave: false });

  return user.avatar;
};

// ─────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────

const getNotifications = async (userId, filters = {}) => {
  const query = { recipient: userId };
  if (filters.category) query.category = filters.category;
  if (filters.isRead !== undefined) {
    query.isRead = filters.isRead === "true";
  }

  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(query),
    Notification.unreadCount(userId),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  };
};

const markNotificationRead = async (notifId, userId) => {
  const notif = await Notification.findOne({
    _id: notifId,
    recipient: userId,
  });
  if (!notif) throw new AppError("Notification not found.", 404);
  await notif.markAsRead();
  return notif;
};

const markAllNotificationsRead = async (userId) => {
  const result = await Notification.markAllReadForUser(userId);
  return result.modifiedCount;
};

const deleteNotification = async (notifId, userId) => {
  const notif = await Notification.findOneAndDelete({
    _id: notifId,
    recipient: userId,
  });
  if (!notif) throw new AppError("Notification not found.", 404);
  return true;
};

// ─────────────────────────────────────────
// Settings
// ─────────────────────────────────────────

const getSettings = async (userId) => {
  const user = await User.findById(userId).select("twoFactorEnabled");
  return {
    twoFactorEnabled: user?.twoFactorEnabled || false,
    emailNotifications: true,
    attendanceAlerts: true,
    classReminders: true,
    lowAttendanceWarning: true,
    examNotifications: true,
    announcements: true,
    defaultView: "subject-wise",
    weeklyGoal: 90,
    showStreak: true,
    autoRefresh: true,
  };
};

const updateSettings = async (userId, settings) => {
  const allowed = ["twoFactorEnabled"];
  const updates = {};
  allowed.forEach((f) => {
    if (settings[f] !== undefined) updates[f] = settings[f];
  });

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true },
  ).select("twoFactorEnabled");

  return user;
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getSettings,
  updateSettings,
};
