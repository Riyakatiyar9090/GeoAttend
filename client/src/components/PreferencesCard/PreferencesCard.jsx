import { useState } from "react";
import { motion } from "framer-motion";
import "./PreferencesCard.css";

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="pref-toggle-row">
      <div>
        <strong>{label}</strong>
        {desc && <p>{desc}</p>}
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

export default function PreferencesCard() {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    attendanceNotifications: true,
    browserNotifications: false,
    darkMode: false,
  });
  const [language, setLanguage] = useState("English");

  const set = (k, v) => setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <motion.div
      className="pref-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <h3>Account Preferences</h3>

      <div className="pref-field">
        <label>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Hindi</option>
          <option>Tamil</option>
        </select>
      </div>

      <div className="pref-toggles">
        <ToggleRow
          label="Email Notifications"
          desc="Receive updates and alerts via email."
          checked={prefs.emailNotifications}
          onChange={(v) => set("emailNotifications", v)}
        />
        <ToggleRow
          label="Attendance Notifications"
          desc="Get notified on session and attendance events."
          checked={prefs.attendanceNotifications}
          onChange={(v) => set("attendanceNotifications", v)}
        />
        <ToggleRow
          label="Browser Notifications"
          desc="Receive push notifications in your browser."
          checked={prefs.browserNotifications}
          onChange={(v) => set("browserNotifications", v)}
        />
        <ToggleRow
          label="Dark Mode"
          desc="Switch to a darker theme (coming soon)."
          checked={prefs.darkMode}
          onChange={(v) => set("darkMode", v)}
        />
      </div>

      <button
        className="pref-save-btn"
        onClick={() => alert("Preferences saved — backend pending")}
      >
        Save Preferences
      </button>
    </motion.div>
  );
}
