const User = require("../models/User");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const OTP = require("../models/OTP");
const Notification = require("../models/Notification");
const { AppError } = require("../middleware/errorMiddleware");
const generateOTP = require("../utils/generateOTP");
const {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} = require("../config/mailConfig");

// ─────────────────────────────────────────
// OTP helpers
// ─────────────────────────────────────────

/**
 * Create a new OTP document (invalidates any previous OTP for same user+purpose).
 */
const createAndSendOTP = async ({ userId, name, email, purpose }) => {
  // Invalidate any existing unused OTP for same user + purpose
  console.log("========== OTP DEBUG ==========");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Purpose:", purpose);
  console.log("===============================");
  await OTP.deleteMany({ user: userId, purpose, isUsed: false });

  const { otp, hashedOTP, expiresAt } = generateOTP(6);

  await OTP.create({
    user: userId,
    hashedOTP,
    purpose,
    channel: "email",
    deliveredTo: email,
    expiresAt,
  });

  // Send via email
  // Send via email
  if (purpose === "email_verification") {
    await sendOTPEmail({
      name,
      email,
      otp,
      purpose: "verify your email address",
    });
  } else if (purpose === "password_reset") {
    await sendPasswordResetEmail({
      name,
      email,
      otp,
    });
  }

  return otp; // Only returned in development for testing
};

/**
 * Validate a submitted OTP.
 * Returns the OTP document on success, throws AppError on failure.
 */
const validateOTP = async ({ userId, rawOTP, purpose }) => {
  const otpDoc = await OTP.findOne({
    user: userId,
    purpose,
    isUsed: false,
  }).select("+hashedOTP");

  if (!otpDoc)
    throw new AppError(
      "OTP not found or already used. Please request a new one.",
      400,
    );
  if (otpDoc.isExpired)
    throw new AppError("OTP has expired. Please request a new one.", 400);
  if (otpDoc.isMaxAttemptsReached)
    throw new AppError(
      "Too many incorrect attempts. Please request a new OTP.",
      429,
    );

  const isValid = otpDoc.verify(rawOTP);

  if (!isValid) {
    await otpDoc.incrementAttempts();
    const remaining = otpDoc.maxAttempts - otpDoc.attempts;
    throw new AppError(
      `Incorrect OTP. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : "No attempts remaining."}`,
      400,
    );
  }

  await otpDoc.markUsed();
  return otpDoc;
};

// ─────────────────────────────────────────
// Registration
// ─────────────────────────────────────────

/**
 * Register a new student.
 * Creates User + Student profile in a single flow.
 */
const registerStudent = async (data) => {
  const { name, email, password, rollNumber, branch, year } = data;

  // Split full name
  const fullName = name.trim().replace(/\s+/g, " ");

  const firstName = fullName.split(" ")[0];
  const lastName = fullName.split(" ").slice(1).join(" ");

  // Backend default values
  const phone = "";
  const enrollmentNo = rollNumber;
  const semester = year;
  const section = "";
  const college = "";
  const department = branch;

  // 1. Check for duplicate email / enrollment number
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new AppError("An account with this email already exists.", 409);

  const existingStudent = await Student.findOne({
    $or: [{ rollNumber }, { enrollmentNo }],
  });

  if (existingStudent) {
    throw new AppError(
      "A student with this Roll Number/Enrollment Number already exists.",
      409,
    );
  }
  // 2. Create User document
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    role: "student",
    status: "pending", // Active after email verification
    profileModel: "Student",
  });

  // 3. Create Student profile document
  const studentProfile = await Student.create({
    user: user._id,
    enrollmentNo,
    rollNumber,
    branch,
    semester,
    section,
    college,
    department,
  });

  // 4. Link profile back to User
  user.profileRef = studentProfile._id;
  await user.save({ validateBeforeSave: false });

  // 5. Send verification OTP
  await createAndSendOTP({
    userId: user._id,
    name: user.firstName,
    email: user.email,
    purpose: "email_verification",
  });

  return user;
};

/**
 * Register a new teacher.
 */
const registerTeacher = async (data) => {
  const { name, email, password, employeeId, department, designation } = data;

  // Split full name
  const fullName = name.trim().replace(/\s+/g, " ");

  const firstName = fullName.split(" ")[0];
  const lastName = fullName.split(" ").slice(1).join(" ");

  // Backend defaults
  const phone = "";
  const qualification = "";
  const college = "";
  const subjects = [];

  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new AppError("An account with this email already exists.", 409);

  const existingEmployee = await Teacher.findOne({ employeeId });
  if (existingEmployee)
    throw new AppError("This Employee ID is already registered.", 409);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    role: "teacher",
    status: "pending",
    profileModel: "Teacher",
  });

  const teacherProfile = await Teacher.create({
    user: user._id,
    employeeId,
    department,
    designation: designation || "Assistant Professor",
    subjects: subjects || [],
    qualification,
    college,
  });

  user.profileRef = teacherProfile._id;
  await user.save({ validateBeforeSave: false });

  await createAndSendOTP({
    userId: user._id,
    name: user.firstName,
    email: user.email,
    purpose: "email_verification",
  });

  return user;
};

// ─────────────────────────────────────────
// Login
// ─────────────────────────────────────────

/**
 * Authenticate a user and return the user document.
 * Throws descriptive AppErrors on every failure case.
 */
const loginUser = async ({ email, password, role }) => {
  // 1. Find user — explicitly select password (it's select:false by default)
  const user = await User.findOne({ email, role }).select("+password");

  if (!user) throw new AppError("Invalid email or password.", 401);

  // 2. Check account lock
  if (user.isLocked) {
    const unlockTime = new Date(user.lockUntil).toLocaleTimeString();
    throw new AppError(
      `Account temporarily locked. Try again after ${unlockTime}.`,
      423,
    );
  }

  // 3. Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incrementLoginAttempts();
    throw new AppError("Invalid email or password.", 401);
  }

  // 4. Check email verification
  if (!user.isEmailVerified) {
    // Re-send OTP silently
    await createAndSendOTP({
      userId: user._id,
      name: user.firstName,
      email: user.email,
      purpose: "email_verification",
    });
    throw new AppError(
      "Email not verified. A new OTP has been sent to your email address.",
      403,
    );
  }

  // 5. Check account status
  if (user.status === "blocked") {
    throw new AppError(
      "Your account has been blocked. Please contact support.",
      403,
    );
  }
  if (user.status === "inactive") {
    throw new AppError(
      "Your account is inactive. Please contact your administrator.",
      403,
    );
  }

  // 6. Reset failed attempts + update lastLogin
  await user.resetLoginAttempts();

  return user;
};

// ─────────────────────────────────────────
// Password Reset
// ─────────────────────────────────────────

/**
 * Initiate forgot-password — send OTP to registered email.
 */
const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });

  // Security: always respond with success even if email not found
  // (prevents user enumeration attacks)
  if (!user) return;

  await createAndSendOTP({
    userId: user._id,
    name: user.firstName,
    email: user.email,
    purpose: "password_reset",
  });
};

/**
 * Reset password after OTP is verified.
 */
const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("No account found with this email.", 404);

  await validateOTP({
    userId: user._id,
    rawOTP: otp,
    purpose: "password_reset",
  });

  user.password = newPassword; // Pre-save hook hashes it
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  await sendPasswordChangedEmail({
    name: user.firstName,
    email: user.email,
  });

  // Notify user
  await Notification.send({
    recipient: user._id,
    recipientRole: user.role,
    title: "Password Changed",
    message: "Your GeoAttend password was successfully changed.",
    type: "password_changed",
    category: "security",
    priority: "high",
  });
};

module.exports = {
  createAndSendOTP,
  validateOTP,
  registerStudent,
  registerTeacher,
  loginUser,
  forgotPassword,
  resetPassword,
};
