import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import "./ProfileProgress.css";

const CHECKS = [
  { label: "Profile photo uploaded", done: false },
  { label: "Phone number verified", done: true },
  { label: "Department filled in", done: true },
  { label: "Subjects listed", done: true },
  { label: "Office hours set", done: true },
  { label: "Two-factor auth enabled", done: false },
];

export default function ProfileProgress() {
  const done = CHECKS.filter((c) => c.done).length;
  const pct = Math.round((done / CHECKS.length) * 100);
  const circumference = 2 * Math.PI * 36;

  return (
    <motion.div
      className="pp-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Profile Completeness</h3>

      <div className="pp-circle-wrapper">
        <svg width="96" height="96">
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke="rgba(15,23,42,0.07)"
            strokeWidth="7"
            fill="none"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="36"
            stroke="#2563EB"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - (pct / 100) * circumference,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            transform="rotate(-90 48 48)"
          />
        </svg>
        <div className="pp-pct">
          <strong>{pct}%</strong>
          <span>Complete</span>
        </div>
      </div>

      <div className="pp-checks">
        {CHECKS.map((c) => (
          <div
            key={c.label}
            className={`pp-check-row ${c.done ? "pp-done" : "pp-todo"}`}
          >
            <span
              className={`pp-check-icon ${c.done ? "check-yes" : "check-no"}`}
            >
              {c.done ? <FiCheck /> : "○"}
            </span>
            {c.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
