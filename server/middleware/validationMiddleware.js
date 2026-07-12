const {
  body,
  param,
  query,
  validationResult,
} = require("express-validator"); /**
 * Run after validation chains — if any errors exist, respond 422
 * with a clean array of field → message pairs.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─────────────────────────────────────────
// Reusable field validators
// ─────────────────────────────────────────

const emailField = (field = "email") =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail();

const passwordField = (field = "password") =>
  body(field)
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character");

const otpField = (field = "otp") =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits")
    .isNumeric()
    .withMessage("OTP must contain digits only");

const nameField = (field, label) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${label} is required`)
    .isLength({ min: 2, max: 50 })
    .withMessage(`${label} must be between 2 and 50 characters`)
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage(`${label} can only contain letters and spaces`);

// ─────────────────────────────────────────
// Validation chains per endpoint
// ─────────────────────────────────────────

const validateStudentRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  emailField(),

  passwordField(),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("rollNumber").trim().notEmpty().withMessage("Roll number is required"),

  body("branch").trim().notEmpty().withMessage("Branch is required"),

  body("year").trim().notEmpty().withMessage("Year is required"),

  handleValidationErrors,
];

const validateTeacherRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  emailField(),

  passwordField(),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("employeeId").trim().notEmpty().withMessage("Employee ID is required"),

  body("department").trim().notEmpty().withMessage("Department is required"),

  body("designation").trim().notEmpty().withMessage("Designation is required"),

  handleValidationErrors,
];

const validateForgotPassword = [emailField(), handleValidationErrors];

const validateResetPassword = [
  emailField(),
  otpField(),
  passwordField("newPassword"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  handleValidationErrors,
];

const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  passwordField("newPassword"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword)
        throw new Error("Passwords do not match");
      return true;
    }),
  handleValidationErrors,
];
const validateCreateSession = [
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ max: 100 })
    .withMessage("Subject must be at most 100 characters"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO date"),
  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Start time must be in HH:MM format"),
  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("End time must be in HH:MM format"),
  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),
  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),
  body("radius")
    .optional()
    .isFloat({ min: 5, max: 500 })
    .withMessage("Radius must be between 5 and 500 metres"),
  body("sessionType")
    .optional()
    .isIn(["theory", "lab", "tutorial"])
    .withMessage("Invalid session type"),
  handleValidationErrors,
];

const validateUpdateSession = [
  param("sessionId").isMongoId().withMessage("Invalid session ID"),
  body("subject").optional().trim().isLength({ max: 100 }),
  body("startTime")
    .optional()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("Start time must be in HH:MM format"),
  body("endTime")
    .optional()
    .matches(/^\d{2}:\d{2}$/)
    .withMessage("End time must be in HH:MM format"),
  body("radius").optional().isFloat({ min: 5, max: 500 }),
  body("sessionType").optional().isIn(["theory", "lab", "tutorial"]),
  handleValidationErrors,
];

const validateSessionId = [
  param("sessionId").isMongoId().withMessage("Invalid session ID"),
  handleValidationErrors,
];

const validateUpdateProfile = [
  body("firstName").optional().trim().isLength({ min: 2, max: 50 }),
  body("lastName").optional().trim().isLength({ min: 2, max: 50 }),
  body("phone")
    .optional()
    .matches(/^\+?[\d\s\-]{7,15}$/),
  body("department").optional().trim().isLength({ max: 100 }),
  body("designation")
    .optional()
    .isIn([
      "Lecturer",
      "Assistant Professor",
      "Associate Professor",
      "Professor",
      "Head of Department",
      "Principal",
      "Other",
    ]),
  body("experience").optional().isInt({ min: 0, max: 60 }),
  handleValidationErrors,
];
// ── Append these to the existing validationMiddleware.js exports ──

const validateMarkAttendance = [
  body("sessionId")
    .notEmpty()
    .withMessage("Session ID is required")
    .isMongoId()
    .withMessage("Invalid session ID"),
  body("qrToken")
    .notEmpty()
    .withMessage("QR token is required")
    .isString()
    .withMessage("QR token must be a string"),
  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude value"),
  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude value"),
  handleValidationErrors,
];

const validateVerifyLocation = [
  body("sessionId")
    .notEmpty()
    .withMessage("Session ID is required")
    .isMongoId()
    .withMessage("Invalid session ID"),
  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude value"),
  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude value"),
  handleValidationErrors,
];

const validateQRScan = [
  body("qrToken")
    .notEmpty()
    .withMessage("QR token is required")
    .isString()
    .withMessage("QR token must be a string"),
  handleValidationErrors,
];

const validateStudentUpdateProfile = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("phone")
    .optional()
    .trim()
    .matches(/^\+?[\d\s\-]{7,15}$/)
    .withMessage("Invalid phone number"),
  body("branch")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Branch must be at most 100 characters"),
  body("semester")
    .optional()
    .isIn(["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"])
    .withMessage("Invalid semester"),
  body("section")
    .optional()
    .trim()
    .isLength({ max: 5 })
    .withMessage("Section must be at most 5 characters"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other", "prefer_not_to_say"])
    .withMessage("Invalid gender"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),
  body("emergencyContact.phone")
    .optional()
    .matches(/^\+?[\d\s\-]{7,15}$/)
    .withMessage("Invalid emergency contact phone"),
  body("emergencyContact.email")
    .optional()
    .isEmail()
    .withMessage("Invalid emergency contact email"),
  handleValidationErrors,
];

const validateAttendanceFilters = [
  query("status")
    .optional()
    .isIn(["present", "absent", "late", "excused"])
    .withMessage("Invalid status filter"),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO date"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  handleValidationErrors,
];

const validateAttendanceId = [
  param("attendanceId").isMongoId().withMessage("Invalid attendance record ID"),
  handleValidationErrors,
];
// ── Append these to the exports in validationMiddleware.js ──

const validateQRPayload = [
  body("qrPayload")
    .notEmpty()
    .withMessage("QR payload is required")
    .isString()
    .withMessage("QR payload must be a string")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Invalid QR payload length"),
  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required for QR attendance")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required for QR attendance")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
  handleValidationErrors,
];

const validateQRSessionId = [
  param("sessionId")
    .notEmpty()
    .withMessage("Session ID is required")
    .isMongoId()
    .withMessage("Invalid session ID format"),
  handleValidationErrors,
];
const validateLocationVerification = [
  body("sessionId")
    .notEmpty()
    .withMessage("Session ID is required")
    .isMongoId()
    .withMessage("Invalid session ID format"),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a decimal number between -90 and 90"),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a decimal number between -180 and 180"),

  body("accuracy")
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage("GPS accuracy must be a positive number in metres"),

  handleValidationErrors,
];
const validateUpdateClassroomLocation = [
  param("sessionId").isMongoId().withMessage("Invalid session ID format"),

  body("latitude")
    .notEmpty()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("longitude")
    .notEmpty()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),

  body("radius")
    .optional()
    .isFloat({ min: 5, max: 500 })
    .withMessage("Radius must be between 5 and 500 metres"),

  handleValidationErrors,
];
const validateBatchVerify = [
  body("sessionId")
    .notEmpty()
    .withMessage("Session ID is required")
    .isMongoId()
    .withMessage("Invalid session ID"),

  body("submissions")
    .isArray({ min: 1, max: 200 })
    .withMessage("Submissions must be an array of 1–200 entries"),

  body("submissions.*.studentUserId")
    .isMongoId()
    .withMessage("Each submission must have a valid studentUserId"),

  body("submissions.*.lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Each submission must have a valid latitude"),

  body("submissions.*.lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Each submission must have a valid longitude"),

  handleValidationErrors,
];
const validateSessionIdParam = [
  param("sessionId").isMongoId().withMessage("Invalid session ID format"),
  handleValidationErrors,
];
const validateNotificationFilters = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("category")
    .optional()
    .isIn([
      "attendance",
      "sessions",
      "students",
      "announcements",
      "system",
      "security",
    ])
    .withMessage("Invalid category filter"),
  query("isRead")
    .optional()
    .isIn(["true", "false"])
    .withMessage("isRead must be true or false"),
  query("priority")
    .optional()
    .isIn(["low", "normal", "high", "urgent"])
    .withMessage("Invalid priority"),
  query("sort")
    .optional()
    .isIn(["newest", "oldest"])
    .withMessage("sort must be newest or oldest"),
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid ISO date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid ISO date"),
  handleValidationErrors,
];
const validateNotifId = [
  param("notifId").isMongoId().withMessage("Invalid notification ID"),
  handleValidationErrors,
];

const validateMarkManyRead = [
  body("ids")
    .isArray({ min: 1, max: 100 })
    .withMessage("ids must be an array of 1–100 notification IDs"),
  body("ids.*")
    .isMongoId()
    .withMessage("Each ID must be a valid MongoDB ObjectId"),
  handleValidationErrors,
];
const validateDeleteMany = [
  body("ids")
    .isArray({ min: 1, max: 100 })
    .withMessage("ids must be an array of 1–100 notification IDs"),
  body("ids.*")
    .isMongoId()
    .withMessage("Each ID must be a valid MongoDB ObjectId"),
  handleValidationErrors,
];
const validateSendAnnouncement = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Announcement title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be at most 100 characters"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Announcement message is required")
    .isLength({ max: 500 })
    .withMessage("Message must be at most 500 characters"),
  body("targetRole")
    .notEmpty()
    .withMessage("Target role is required")
    .isIn(["student", "teacher", "all"])
    .withMessage("targetRole must be student, teacher or all"),
  body("targetUserIds")
    .optional()
    .isArray()
    .withMessage("targetUserIds must be an array"),
  body("targetUserIds.*")
    .optional()
    .isMongoId()
    .withMessage("Each targetUserId must be a valid ObjectId"),
  body("priority")
    .optional()
    .isIn(["low", "normal", "high", "urgent"])
    .withMessage("Invalid priority"),
  body("actionUrl").optional().isString().isLength({ max: 200 }),
  handleValidationErrors,
];
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),

  body("role")
    .isIn(["student", "teacher", "admin"])
    .withMessage("Invalid role"),

  handleValidationErrors,
];
const validateVerifyOTP = [
  emailField(),

  otpField(),

  body("purpose")
    .notEmpty()
    .withMessage("Purpose is required")
    .isIn(["email_verification", "password_reset"])
    .withMessage("Invalid OTP purpose"),

  handleValidationErrors,
];
const validateResendOTP = [
  emailField(),

  body("purpose")
    .notEmpty()
    .withMessage("Purpose is required")
    .isIn(["email_verification", "password_reset"])
    .withMessage("Invalid OTP purpose"),

  handleValidationErrors,
];

module.exports = {
  validateStudentRegister,
  validateTeacherRegister,
  validateLogin,
  validateVerifyOTP,
  validateResendOTP,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  handleValidationErrors,
  validateCreateSession,
  validateUpdateSession,
  validateSessionId,
  validateUpdateProfile,
  validateMarkAttendance,
  validateVerifyLocation,
  validateQRScan,
  validateStudentUpdateProfile,
  validateAttendanceFilters,
  validateAttendanceId,
  validateQRPayload,
  validateQRSessionId,
  validateLocationVerification,
  validateUpdateClassroomLocation,
  validateBatchVerify,
  validateSessionIdParam,
  validateNotificationFilters,
  validateNotifId,
  validateMarkManyRead,
  validateDeleteMany,
  validateSendAnnouncement,
};
