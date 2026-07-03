import { motion } from "framer-motion";
import "./Input.css";

export default function Input({
  icon,
  label,
  type = "text",
  value,
  onChange,
  name,
  error,
  disabled,
  autoComplete,
}) {
  return (
    <div className="input-group">
      <div
        className={`input-wrapper ${error ? "input-error" : ""} ${value ? "has-value" : ""}`}
      >
        <span className="input-icon">{icon}</span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder=" "
        />
        <label>{label}</label>
        <span className="input-focus-line" />
      </div>
      {error && (
        <motion.p
          className="input-error-text"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
          transition={{ duration: 0.4 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
