const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    // ── Who this OTP belongs to ───────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    // ── The OTP (hashed — never store raw) ────
    hashedOTP: {
      type: String,
      required: [true, "Hashed OTP is required"],
      select: false,
    },

    // ── Purpose ───────────────────────────────
    purpose: {
      type: String,
      enum: [
        "email_verification",
        "phone_verification",
        "password_reset",
        "two_factor_auth",
        "login",
      ],
      required: [true, "OTP purpose is required"],
    },

    // ── Delivery ──────────────────────────────
    channel: {
      type: String,
      enum: ["email", "sms"],
      default: "email",
    },
    deliveredTo: {
      type: String, // Email address or phone number
      trim: true,
    },

    // ── Lifecycle ─────────────────────────────
    expiresAt: {
      type: Date,
      required: [true, "Expiry time is required"],
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedAt: Date,

    // ── Attempt Tracking (prevent brute force) ─
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
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

// TTL index — MongoDB automatically deletes expired OTP documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.index({ user: 1, purpose: 1, isUsed: 1 });

// ─────────────────────────────────────────
// Virtuals
// ─────────────────────────────────────────
otpSchema.virtual("isExpired").get(function () {
  return this.expiresAt < Date.now();
});

otpSchema.virtual("isMaxAttemptsReached").get(function () {
  return this.attempts >= this.maxAttempts;
});

otpSchema.virtual("remainingAttempts").get(function () {
  return Math.max(this.maxAttempts - this.attempts, 0);
});

// ─────────────────────────────────────────
// Instance Methods
// ─────────────────────────────────────────

/** Verify a raw OTP string against the stored hash */
otpSchema.methods.verify = function (rawOTP) {
  const crypto = require("crypto");
  const hash = crypto.createHash("sha256").update(rawOTP).digest("hex");
  return hash === this.hashedOTP;
};

/** Mark OTP as consumed */
otpSchema.methods.markUsed = async function () {
  this.isUsed = true;
  this.usedAt = new Date();
  await this.save({ validateBeforeSave: false });
};

/** Increment attempt counter */
otpSchema.methods.incrementAttempts = async function () {
  this.attempts += 1;
  await this.save({ validateBeforeSave: false });
};

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
