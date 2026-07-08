const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    // ── Link to User account ──────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },

    // ── Professional Info ─────────────────────
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    designation: {
      type: String,
      trim: true,
      default: "Assistant Professor",
      enum: [
        "Lecturer",
        "Assistant Professor",
        "Associate Professor",
        "Professor",
        "Head of Department",
        "Principal",
        "Other",
      ],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    subjects: [
      {
        type: String,
        trim: true,
      },
    ],
    qualification: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number, // Years of experience
      min: [0, "Experience cannot be negative"],
    },
    officeRoom: {
      type: String,
      trim: true,
    },
    officeHours: {
      type: String,
      trim: true,
    },
    joiningDate: {
      type: Date,
    },

    // ── College / Institution ─────────────────
    college: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Statistics (denormalised for fast reads) ─
    stats: {
      totalSessionsCreated: { type: Number, default: 0 },
      totalStudentsManaged: { type: Number, default: 0 },
      averageAttendance: { type: Number, default: 0 }, // %
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
teacherSchema.index({ user: 1 });
teacherSchema.index({ employeeId: 1 });
teacherSchema.index({ department: 1 });

// ─────────────────────────────────────────
// Virtuals
// ─────────────────────────────────────────
teacherSchema.virtual("experienceLabel").get(function () {
  if (!this.experience) return "Not specified";
  return `${this.experience} year${this.experience !== 1 ? "s" : ""}`;
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
