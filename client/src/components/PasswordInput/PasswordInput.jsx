import { useState, useEffect } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import "./PasswordInput.css";

export default function PasswordInput({
  label,
  value,
  onChange,
  name,
  error,
  disabled,
}) {
  const [visible, setVisible] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const handleKeyUp = (e) => {
    if (typeof e.getModifierState === "function") {
      setCapsLock(e.getModifierState("CapsLock"));
    }
  };

  useEffect(() => {
    if (!value) setCapsLock(false);
  }, [value]);

  return (
    <div className="input-group">
      <div
        className={`input-wrapper ${error ? "input-error" : ""} ${value ? "has-value" : ""}`}
      >
        <span className="input-icon">
          <FiLock />
        </span>
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          onKeyUp={handleKeyUp}
          disabled={disabled}
          autoComplete="current-password"
          placeholder=" "
        />
        <label>{label}</label>
        <button
          type="button"
          className="toggle-visibility"
          onClick={() => setVisible(!visible)}
          tabIndex={-1}
        >
          {visible ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      {capsLock && (
        <motion.p
          className="caps-lock-warning"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⚠ Caps Lock is on
        </motion.p>
      )}

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
