const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name must be at most 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-]{7,15}$/, "Please provide a valid phone number"],
    },

    // ── Role & Status ─────────────────────────
    role: {
      type: String,
      enum: {
        values: ["student", "teacher", "admin"],
        message: "Role must be student, teacher or admin",
      },
      required: [true, "Role is required"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked", "pending"],
      default: "pending", // Pending until email verified
    },

    // ── Password ──────────────────────────────
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never return password in queries
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // ── Profile Image (Cloudinary) ────────────
    avatar: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },

    // ── Email / Phone Verification ────────────
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },

    // ── Login Tracking ────────────────────────
    lastLogin: { type: Date, default: null },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },

    // ── Two-Factor Auth ───────────────────────
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },

    // ── Profile reference (populated separately) ─
    // One-to-one pointer to Teacher or Student doc
    profileRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "profileModel",
    },
    profileModel: {
      type: String,
      enum: ["Teacher", "Student"],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ createdAt: -1 });

// ─────────────────────────────────────────
// Virtuals
// ─────────────────────────────────────────
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.virtual("avatarUrl").get(function () {
  return this.avatar?.url || null;
});

// ─────────────────────────────────────────
// Pre-save middleware — hash password
// ─────────────────────────────────────────
userSchema.pre("save", async function () {
  // Only hash when password field is modified
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);

  // Update passwordChangedAt only when updating password
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
});

// ─────────────────────────────────────────
// Instance Methods
// ─────────────────────────────────────────

/** Compare plain-text password against hashed version */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/** Generate signed JWT */
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { id: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" },
  );
};

/** Check if password was changed after a JWT was issued */
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtTimestamp < changedAt;
  }
  return false;
};

/** Generate a password-reset token (hashed version stored in DB) */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken; // Return raw token to send via email
};

/** Increment failed login attempts and optionally lock account */
userSchema.methods.incrementLoginAttempts = async function () {
  const MAX_ATTEMPTS = 5;
  const LOCK_DURATION = 30 * 60 * 1000; // 30 minutes

  this.loginAttempts += 1;

  if (this.loginAttempts >= MAX_ATTEMPTS) {
    this.lockUntil = new Date(Date.now() + LOCK_DURATION);
    this.loginAttempts = 0; // Reset counter after locking
  }

  await this.save({ validateBeforeSave: false });
};

/** Reset login attempts on successful authentication */
userSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
