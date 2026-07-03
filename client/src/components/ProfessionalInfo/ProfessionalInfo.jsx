import { useState } from "react";
import { motion } from "framer-motion";
import "./ProfessionalInfo.css";

export default function ProfessionalInfo({ teacher }) {
  const [form, setForm] = useState({
    department: teacher.department,
    subjects: teacher.subjects,
    qualification: teacher.qualification,
    experience: teacher.experience,
    officeRoom: teacher.officeRoom,
    officeHours: teacher.officeHours,
    joiningDate: teacher.joiningDate,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <motion.div
      className="pi-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3>Professional Information</h3>
      <p className="pi-subtitle">Details about your teaching profile.</p>

      <div className="pi-grid">
        {[
          { key: "department", label: "Department", type: "text" },
          { key: "subjects", label: "Subjects Taught", type: "text" },
          { key: "qualification", label: "Qualification", type: "text" },
          { key: "experience", label: "Experience", type: "text" },
          { key: "officeRoom", label: "Office Room", type: "text" },
          { key: "officeHours", label: "Office Hours", type: "text" },
          { key: "joiningDate", label: "Joining Date", type: "text" },
        ].map((f) => (
          <div key={f.key} className="pif-field">
            <label>{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        className="pif-save-btn"
        onClick={() => alert("Saved — backend pending")}
      >
        Save Professional Info
      </button>
    </motion.div>
  );
}
