import { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiShield, FiMonitor } from "react-icons/fi";
import { getPasswordScore } from "../PasswordStrength/PasswordStrength";
import PasswordStrength from "../PasswordStrength/PasswordStrength";
import "./SecuritySettings.css";

function ToggleField({ label, desc, checked, onChange }) {
  return (
    <div className="ss-toggle-row">
      <div>
        <strong>{label}</strong>
        <p>{desc}</p>
      </div>
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="switch-slider" />
      </label>
    </div>
  );
}

export default function SecuritySettings() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [twoFA, setTwoFA] = useState(false);

  const sessions = [
    {
      device: "Chrome on Windows 11",
      location: "New Delhi, India",
      current: true,
    },
    {
      device: "Mobile – Android",
      location: "New Delhi, India",
      current: false,
    },
  ];

  return (
    <motion.div
      className="ss-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3>
        <FiShield /> Account Security
      </h3>

      <div className="ss-section">
        <h4>Change Password</h4>
        {["current", "newPass", "confirm"].map((k) => (
          <div key={k} className="ss-field">
            <label>
              {k === "current"
                ? "Current Password"
                : k === "newPass"
                  ? "New Password"
                  : "Confirm New Password"}
            </label>
            <div className="ss-input-wrapper">
              <input
                type={show[k] ? "text" : "password"}
                value={form[k]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [k]: e.target.value }))
                }
                placeholder="••••••••"
              />
              <button
                type="button"
                className="ss-eye-btn"
                onClick={() => setShow((p) => ({ ...p, [k]: !p[k] }))}
              >
                {show[k] ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {k === "newPass" && form.newPass && (
              <PasswordStrength password={form.newPass} />
            )}
          </div>
        ))}
        <button
          className="ss-update-btn"
          disabled={
            !form.current ||
            !form.newPass ||
            form.newPass !== form.confirm ||
            getPasswordScore(form.newPass) <= 2
          }
          onClick={() => alert("Password updated — backend pending")}
        >
          Update Password
        </button>
      </div>

      <div className="ss-section">
        <ToggleField
          label="Two-Factor Authentication"
          desc="Add an extra layer of security to your account."
          checked={twoFA}
          onChange={setTwoFA}
        />
      </div>

      <div className="ss-section">
        <h4>
          <FiMonitor /> Active Sessions
        </h4>
        {sessions.map((s, i) => (
          <div key={i} className="ss-session-row">
            <div>
              <strong>{s.device}</strong>
              <span>{s.location}</span>
            </div>
            {s.current ? (
              <span className="ss-current-badge">Current</span>
            ) : (
              <button
                className="ss-revoke-btn"
                onClick={() => alert("Revoked — backend pending")}
              >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
