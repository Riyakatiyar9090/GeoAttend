const mongoose = require("mongoose");
const crypto = require("crypto");

const attendanceSessionSchema = new mongoose.Schema(
  {
    // ── Session Identity ──────────────────────
    sessionCode: {
      type: String,
      unique: true,
      // Auto-generated in pre-save hook — e.g. "GA-CS-001"
    },

    // ── Relationships ─────────────────────────
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher reference is required"],
    },
    teacherProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },

    // ── Class Info ────────────────────────────
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    className: {
      type: String,
      trim: true,
      // e.g. "CSE-A"
    },
    section: {
      type: String,
      trim: true,
      uppercase: true,
    },
    semester: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", ""],
      default: "",
    },
    department: {
      type: String,
      trim: true,
    },
    roomNumber: {
      type: String,
      trim: true,
    },
    sessionType: {
      type: String,
      enum: ["theory", "lab", "tutorial"],
      default: "theory",
    },

    // ── Timing ────────────────────────────────
    date: {
      type: Date,
      required: [true, "Session date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
      // Stored as "HH:MM" — e.g. "10:00"
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    duration: {
      type: Number, // Minutes
      min: [5, "Duration must be at least 5 minutes"],
    },

    // ── Geolocation ───────────────────────────
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    radius: {
      type: Number,
      default: 30, // Metres
      min: [5, "Radius must be at least 5 metres"],
      max: [500, "Radius cannot exceed 500 metres"],
    },

    // ── QR Code ───────────────────────────────
    qrToken: {
      type: String,
      select: false, // Raw token never returned
    },
    qrTokenHash: {
      type: String,
      select: false,
    },
    qrExpiresAt: Date,
    qrRefreshInterval: {
      type: Number,
      default: 60, // Seconds between auto-refresh
    },

    // ── Session Status ────────────────────────
    status: {
      type: String,
      enum: ["draft", "active", "paused", "closed", "extended"],
      default: "draft",
    },

    // ── Late Entry ────────────────────────────
    allowLateEntry: {
      type: Boolean,
      default: false,
    },
    lateEntryDuration: {
      type: Number, // Minutes after endTime students can still join
      default: 10,
    },

    // ── Verification Flags ────────────────────
    requireQRVerification: { type: Boolean, default: true },
    requireLocationVerification: { type: Boolean, default: true },

    // ── Statistics (denormalised) ─────────────
    stats: {
      totalStudents: { type: Number, default: 0 },
      presentCount: { type: Number, default: 0 },
      absentCount: { type: Number, default: 0 },
      lateCount: { type: Number, default: 0 },
      outsideRadius: { type: Number, default: 0 },
      duplicateAttempts: { type: Number, default: 0 },
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    closedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─────────────────────────────────────────
// Geospatial index (for $near queries)
// ─────────────────────────────────────────
attendanceSessionSchema.index({ location: "2dsphere" });
attendanceSessionSchema.index({ teacher: 1, status: 1 });
attendanceSessionSchema.index({ date: -1 });
attendanceSessionSchema.index({ sessionCode: 1 });

// ─────────────────────────────────────────
// Pre-save — auto-generate sessionCode
// ─────────────────────────────────────────
attendanceSessionSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  // Format: GA-<YEAR><RANDOM4HEX> e.g. "GA-2026A3F1"
  const year = new Date().getFullYear();
  const suffix = crypto.randomBytes(2).toString("hex").toUpperCase();
  this.sessionCode = `GA-${year}${suffix}`;

  next();
});

// ─────────────────────────────────────────
// Virtuals
// ─────────────────────────────────────────
attendanceSessionSchema.virtual("attendancePercentage").get(function () {
  const { totalStudents, presentCount } = this.stats;
  if (!totalStudents) return 0;
  return Math.round((presentCount / totalStudents) * 100);
});

attendanceSessionSchema.virtual("isLive").get(function () {
  return this.status === "active";
});

attendanceSessionSchema.virtual("isQRValid").get(function () {
  return this.qrExpiresAt && this.qrExpiresAt > Date.now();
});

// ─────────────────────────────────────────
// Instance Methods
// ─────────────────────────────────────────

/** Generate and hash a new QR token for this session */
attendanceSessionSchema.methods.generateQRToken = function () {
  const raw = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  this.qrToken = raw;
  this.qrTokenHash = hash;
  this.qrExpiresAt = new Date(
    Date.now() + (this.qrRefreshInterval || 60) * 1000,
  );

  return raw;
};

/** Verify a submitted QR token against stored hash */
attendanceSessionSchema.methods.verifyQRToken = function (rawToken) {
  if (!rawToken || !this.qrTokenHash) return false;

  const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const isMatch = hash === this.qrTokenHash;
  const notExpired = this.qrExpiresAt && this.qrExpiresAt > Date.now();

  return isMatch && notExpired;
};

const AttendanceSession = mongoose.model(
  "AttendanceSession",
  attendanceSessionSchema,
);
module.exports = AttendanceSession;
