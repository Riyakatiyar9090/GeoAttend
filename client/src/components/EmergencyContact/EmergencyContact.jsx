import { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiPhone, FiMail, FiHeart } from "react-icons/fi";
import "./EmergencyContact.css";

export default function EmergencyContact({ student }) {
  const [form, setForm] = useState({
    name: student.guardianName,
    relation: student.guardianRelation,
    phone: student.guardianPhone,
    email: student.guardianEmail,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <motion.div
      className="ec-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>
        <FiHeart /> Emergency Contact
      </h3>
      <p className="ec-subtitle">Guardian or parent contact information.</p>

      <div className="ec-grid">
        {[
          { key: "name", label: "Guardian Name", icon: <FiUser /> },
          { key: "relation", label: "Relationship", icon: <FiHeart /> },
          { key: "phone", label: "Phone Number", icon: <FiPhone /> },
          { key: "email", label: "Email Address", icon: <FiMail /> },
        ].map((f) => (
          <div key={f.key} className="ec-field">
            <label>{f.label}</label>
            <div className="ec-input-wrapper">
              <span className="ec-field-icon">{f.icon}</span>
              <input
                type="text"
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className="ec-save-btn"
        onClick={() => alert("Saved — backend pending")}
      >
        Save Contact
      </button>
    </motion.div>
  );
}
