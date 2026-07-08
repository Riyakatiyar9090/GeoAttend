import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiHardDrive,
  FiUser,
  FiRefreshCw,
  FiInfo,
} from "react-icons/fi";
import "./StudentSettingsSidebar.css";

const SECTIONS = [
  "Appearance",
  "Notifications",
  "Attendance",
  "Security",
  "Privacy",
  "Language",
  "Backup",
  "Danger Zone",
];

const SYSTEM_INFO = [
  {
    icon: <FiCheckCircle />,
    label: "Account Status",
    value: "Active",
    color: "var(--success)",
  },
  {
    icon: <FiHardDrive />,
    label: "Storage Used",
    value: "420 MB / 5 GB",
    color: "var(--primary)",
  },
  {
    icon: <FiUser />,
    label: "Account Type",
    value: "Student",
    color: "var(--accent)",
  },
  {
    icon: <FiCheckCircle />,
    label: "App Version",
    value: "GeoAttend v2.4.1",
    color: "var(--secondary)",
  },
  {
    icon: <FiRefreshCw />,
    label: "Last Sync",
    value: "Just now",
    color: "var(--warning)",
  },
];

const TIPS = [
  "Enable attendance alerts so you never miss a QR session.",
  "Set a weekly goal to build a consistent attendance habit.",
  "Download your data anytime from the Privacy section.",
];

export default function StudentSettingsSidebar({
  activeSection,
  onSectionClick,
}) {
  return (
    <div className="sss-sidebar">
      <motion.div
        className="sss-nav-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Settings</h3>
        <nav className="sss-nav">
          {SECTIONS.map((s) => (
            <button
              key={s}
              className={`sss-nav-btn ${activeSection === s ? "sss-nav-active" : ""}`}
              onClick={() => onSectionClick(s)}
            >
              {s}
            </button>
          ))}
        </nav>
      </motion.div>

      <motion.div
        className="sss-info-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>System Info</h3>
        <div className="sss-info-list">
          {SYSTEM_INFO.map((q) => (
            <div key={q.label} className="sss-info-row">
              <span className="sss-info-icon" style={{ color: q.color }}>
                {q.icon}
              </span>
              <div>
                <span className="sss-info-label">{q.label}</span>
                <strong>{q.value}</strong>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="sss-storage-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>Profile Completion</h3>
        <p className="sss-storage-label">83% of profile is complete</p>
        <div className="sss-bar-track">
          <motion.div
            className="sss-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: "83%" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="sss-storage-tip">Add a profile photo to reach 100%.</p>
      </motion.div>

      <motion.div
        className="sss-tips-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3>
          <FiInfo /> Quick Tips
        </h3>
        <div className="sss-tips-list">
          {TIPS.map((t, i) => (
            <div key={i} className="sss-tip-row">
              <span className="sss-tip-dot" />
              <p>{t}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
