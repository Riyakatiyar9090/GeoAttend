import { useState } from "react";
import { motion } from "framer-motion";
import "./PersonalInfoForm.css";

export default function PersonalInfoForm({ teacher }) {
  const [form, setForm] = useState({
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    phone: teacher.phone,
    gender: teacher.gender,
    dob: teacher.dob,
    address: teacher.address,
    city: teacher.city,
    state: teacher.state,
    country: teacher.country,
    zip: teacher.zip,
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const fields = [
    { key: "firstName", label: "First Name", type: "text", col: 1 },
    { key: "lastName", label: "Last Name", type: "text", col: 1 },
    { key: "email", label: "Email Address", type: "email", col: 2 },
    { key: "phone", label: "Phone Number", type: "tel", col: 1 },
    { key: "dob", label: "Date of Birth", type: "date", col: 1 },
    { key: "address", label: "Address", type: "text", col: 2 },
    { key: "city", label: "City", type: "text", col: 1 },
    { key: "state", label: "State", type: "text", col: 1 },
    { key: "country", label: "Country", type: "text", col: 1 },
    { key: "zip", label: "ZIP Code", type: "text", col: 1 },
  ];

  return (
    <motion.div
      className="pif-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Personal Information</h3>
      <p className="pif-subtitle">Update your personal details.</p>

      <div className="pif-grid">
        {fields.map((f) => (
          <div
            key={f.key}
            className={`pif-field ${f.col === 2 ? "pif-full" : ""}`}
          >
            <label>{f.label}</label>
            {f.key === "gender" ? (
              <select
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            ) : (
              <input
                type={f.type}
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}
          </div>
        ))}
        <div className="pif-field">
          <label>Gender</label>
          <select
            value={form.gender}
            onChange={(e) => set("gender", e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <button
        className="pif-save-btn"
        onClick={() => alert("Saved — backend pending")}
      >
        Save Personal Info
      </button>
    </motion.div>
  );
}
