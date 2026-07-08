import { useState } from "react";
import { motion } from "framer-motion";
import "./AcademicInfo.css";

export default function AcademicInfo({ student }) {
  const [form, setForm] = useState({
    enrollmentNo: student.enrollmentNo,
    course: student.course,
    branch: student.branch,
    semester: student.semester,
    section: student.section,
    batch: student.batch,
    rollNumber: student.rollNumber,
    college: student.college,
    admissionYear: student.admissionYear,
    graduationYear: student.graduationYear,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const fields = [
    { key: "enrollmentNo", label: "Enrollment Number" },
    { key: "course", label: "Course" },
    { key: "branch", label: "Branch" },
    { key: "semester", label: "Semester" },
    { key: "section", label: "Section" },
    { key: "batch", label: "Batch" },
    { key: "rollNumber", label: "Roll Number" },
    { key: "college", label: "College Name" },
    { key: "admissionYear", label: "Admission Year" },
    { key: "graduationYear", label: "Expected Graduation" },
  ];

  return (
    <motion.div
      className="ai-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3>Academic Information</h3>
      <p className="ai-subtitle">Your enrollment and academic details.</p>

      <div className="ai-grid">
        {fields.map((f) => (
          <div key={f.key} className="ai-field">
            <label>{f.label}</label>
            <input
              type="text"
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        className="ai-save-btn"
        onClick={() => alert("Saved — backend pending")}
      >
        Save Academic Info
      </button>
    </motion.div>
  );
}
