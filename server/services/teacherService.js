const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Notification = require("../models/Notification");
const { AppError } = require("../middleware/errorMiddleware");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../middleware/uploadMiddleware");

// ─────────────────────────────────────────
// Profile
// ─────────────────────────────────────────

const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  const profile = await Teacher.findOne({ user: userId });
  if (!profile) throw new AppError("Teacher profile not found.", 404);
  return { user, profile };
};

const updateProfile = async (userId, userData, teacherData) => {
  // Fields allowed to change on User doc
  const userAllowed = ["firstName", "lastName", "phone"];
  const userUpdates = {};
  userAllowed.forEach((f) => {
    if (userData[f] !== undefined) userUpdates[f] = userData[f];
  });

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: userUpdates },
    { new: true, runValidators: true },
  ).select("-password");

  // Fields allowed to change on Teacher doc
  const teacherAllowed = [
    "designation",
    "department",
    "subjects",
    "qualification",
    "experience",
    "officeRoom",
    "officeHours",
    "college",
    "gender",
    "dateOfBirth",
    "address.street",
    "address.city",
    "address.state",
    "address.country",
    "address.zip",
  ];
  const teacherUpdates = {};
  teacherAllowed.forEach((f) => {
    const key = f.includes(".") ? f : f;
    if (teacherData[key] !== undefined) teacherUpdates[key] = teacherData[key];
  });

  // Handle nested address
  if (teacherData.address) {
    teacherUpdates.address = teacherData.address;
  }

  const profile = await Teacher.findOneAndUpdate(
    { user: userId },
    { $set: teacherUpdates },
    { new: true, runValidators: true },
  );

  return { user, profile };
};

const uploadAvatar = async (userId, fileBuffer) => {
  const user = await User.findById(userId);

  // Delete old avatar from Cloudinary
  if (user.avatar?.public_id) {
    await deleteFromCloudinary(user.avatar.public_id);
  }

  const result = await uploadToCloudinary(
    fileBuffer,
    `geoattend/avatars/teachers`,
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
  if (filters.isRead !== undefined) query.isRead = filters.isRead === "true";

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
  const notif = await Notification.findOne({ _id: notifId, recipient: userId });
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
// Settings (stored on User doc for now)
// ─────────────────────────────────────────

const getSettings = async (userId) => {
  const user = await User.findById(userId).select("twoFactorEnabled");
  // Settings are mostly managed on the frontend with localStorage
  // and synced to DB when backend preferences are implemented.
  return {
    twoFactorEnabled: user?.twoFactorEnabled || false,
    emailNotifications: true,
    attendanceAlerts: true,
    sessionReminders: true,
    weeklyReport: true,
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
