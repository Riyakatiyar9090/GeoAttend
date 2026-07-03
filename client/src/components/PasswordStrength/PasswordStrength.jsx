import { motion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";
import "./PasswordStrength.css";

const checks = [
  { key: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { key: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { key: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
  {
    key: "special",
    label: "One special character",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

export function getPasswordScore(password) {
  return checks.filter((c) => c.test(password)).length;
}

export default function PasswordStrength({ password }) {
  if (!password) return null;

  const score = getPasswordScore(password);
  const level = score <= 2 ? "weak" : score <= 4 ? "medium" : "strong";
  const labelMap = { weak: "Weak", medium: "Medium", strong: "Strong" };

  return (
    <motion.div
      className="password-strength"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3 }}
    >
      <div className="strength-bar-track">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`strength-bar ${i < (level === "weak" ? 1 : level === "medium" ? 2 : 3) ? `active-${level}` : ""}`}
          />
        ))}
      </div>
      <span className={`strength-label label-${level}`}>{labelMap[level]}</span>

      <ul className="strength-checklist">
        {checks.map((c) => {
          const passed = c.test(password);
          return (
            <li key={c.key} className={passed ? "check-passed" : ""}>
              {passed ? <FiCheck /> : <FiX />}
              {c.label}
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
