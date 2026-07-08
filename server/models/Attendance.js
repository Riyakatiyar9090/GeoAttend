const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    // ── Core Relationships ────────────────────
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttendanceSession",
      required: [true, "Session reference is required"],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    studentProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher reference is required"],
    },

    // ── Status ────────────────────────────────
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      default: "absent",
    },

    // ── Verification ──────────────────────────
    qrVerified: { type: Boolean, default: false },
    locationVerified: { type: Boolean, default: false },

    verificationMethod: {
      type: String,
      enum: ["qr_and_location", "qr_only", "location_only", "manual", "none"],
      default: "none",
    },

    // ── Student Location at Check-in ──────────
    studentLocation: {
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
    distanceFromClassroom: {
      type: Number, // Metres
      min: 0,
    },

    // ── Timing ────────────────────────────────
    markedAt: {
      type: Date,
      default: Date.now,
    },
    isLate: {
      type: Boolean,
      default: false,
    },

    // ── Device / Security ─────────────────────
    deviceInfo: {
      userAgent: { type: String },
      ipAddress: { type: String },
      platform: { type: String },
    },

    // ── Flags ─────────────────────────────────
    isSuspicious: {
      type: Boolean,
      default: false,
    },
    suspicionReason: {
      type: String,
      enum: [
        "outside_radius",
        "location_spoof_suspected",
        "duplicate_attempt",
        "expired_qr",
        "invalid_qr",
        "",
      ],
      default: "",
    },
    isDuplicate: {
      type: Boolean,
      default: false,
    },

    // ── Manual Override ───────────────────────
    isManual: { type: Boolean, default: false },
    manuallyMarkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    manualReason: String,

    notes: {
      type: String,
      maxlength: [300, "Notes cannot exceed 300 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ─────────────────────────────────────────
// Compound unique index — one record per student per session
// ─────────────────────────────────────────
attendanceSchema.index(
  { session: 1, student: 1 },
  { unique: true, name: "unique_student_per_session" },
);

attendanceSchema.index({ student: 1, markedAt: -1 });
attendanceSchema.index({ session: 1, status: 1 });
attendanceSchema.index({ teacher: 1, markedAt: -1 });
attendanceSchema.index({ studentLocation: "2dsphere" });
attendanceSchema.index({ isSuspicious: 1 });

// ─────────────────────────────────────────
// Virtuals
// ─────────────────────────────────────────
attendanceSchema.virtual("isWithinRadius").get(function () {
  // Populated only when session is loaded
  return this.locationVerified;
});

// ─────────────────────────────────────────
// Post-save — update student's attendance stats
// ─────────────────────────────────────────
attendanceSchema.post("save", async function () {
  try {
    const Student = mongoose.model("Student");
    const student = await Student.findOne({ user: this.student });
    if (student) await student.recalculateAttendance();
  } catch (err) {
    console.error(
      "⚠️  Failed to recalculate student attendance stats:",
      err.message,
    );
  }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
