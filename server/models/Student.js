const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // ── Link to User account ──────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },

    // ── Academic Details ──────────────────────
    enrollmentNo: {
      type: String,
      required: [true, "Enrollment number is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    rollNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    registrationNo: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allow null — sparse index skips null values
    },
    course: {
      type: String,
      trim: true,
      default: "B.Tech",
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    semester: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"],
    },
    section: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [5, "Section must be at most 5 characters"],
    },
    batch: {
      type: String,
      trim: true,
      // e.g. "2021–2025"
    },
    admissionYear: {
      type: Number,
      min: [2000, "Invalid admission year"],
      max: [
        new Date().getFullYear() + 1,
        "Admission year cannot be in the future",
      ],
    },
    graduationYear: {
      type: Number,
    },
    college: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Emergency Contact ─────────────────────
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },

    // ── Attendance Statistics (denormalised) ──
    attendanceStats: {
      overallPercentage: { type: Number, default: 0, min: 0, max: 100 },
      totalClassesHeld: { type: Number, default: 0 },
      totalClassesAttended: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 }, // Consecutive days present
      longestStreak: { type: Number, default: 0 },
      lastAttendanceDate: { type: Date, default: null },
    },

    // ── Personal Details ──────────────────────
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    dateOfBirth: Date,
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: "India" },
      zip: { type: String, trim: true },
    },
    // ── ID Document (Cloudinary) ──────────────
    idDocument: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
      format: { type: String, default: null }, // 'jpg' | 'png' | 'pdf'
      uploadedAt: { type: Date, default: null },
      fileName: { type: String, default: null },
      fileSizeMB: { type: Number, default: null },
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
studentSchema.index({ user: 1 });
studentSchema.index({ enrollmentNo: 1 });
studentSchema.index({ branch: 1, semester: 1, section: 1 });
studentSchema.index({ "attendanceStats.overallPercentage": 1 });

// ─────────────────────────────────────────
// Virtuals
// ─────────────────────────────────────────

/** True if student is below the 75% attendance threshold */
studentSchema.virtual("isAtRisk").get(function () {
  return this.attendanceStats.overallPercentage < 75;
});

/** How many more classes needed to reach 75% */
studentSchema.virtual("classesNeededFor75").get(function () {
  const { totalClassesHeld, totalClassesAttended } = this.attendanceStats;
  if (totalClassesAttended / (totalClassesHeld || 1) >= 0.75) return 0;
  // x = additional classes to attend (present in all of them)
  // (attended + x) / (held + x) = 0.75
  const x = Math.ceil((0.75 * totalClassesHeld - totalClassesAttended) / 0.25);
  return Math.max(x, 0);
});

// ─────────────────────────────────────────
// Instance method — recompute stats
// Called after each attendance record is saved
// ─────────────────────────────────────────
studentSchema.methods.recalculateAttendance = async function () {
  const Attendance = mongoose.model("Attendance");
  const records = await Attendance.find({ student: this._id });

  const held = records.length;
  const attended = records.filter((r) => r.status === "present").length;

  this.attendanceStats.totalClassesHeld = held;
  this.attendanceStats.totalClassesAttended = attended;
  this.attendanceStats.overallPercentage =
    held > 0 ? Math.round((attended / held) * 100) : 0;

  await this.save({ validateBeforeSave: false });
};

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
