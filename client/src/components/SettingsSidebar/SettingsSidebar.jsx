import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiHardDrive,
  FiUser,
  FiRefreshCw,
} from "react-icons/fi";
import "./SettingsSidebar.css";

const QUICK_SETTINGS = [
  {
    label: "System Status",
    value: "All Systems Operational",
    icon: <FiCheckCircle />,
    color: "var(--success)",
  },
  {
    label: "Storage Used",
    value: "2.4 GB / 10 GB",
    icon: <FiHardDrive />,
    color: "var(--primary)",
  },
  {
    label: "Account Type",
    value: "Faculty — Premium",
    icon: <FiUser />,
    color: "var(--accent)",
  },
  {
    label: "App Version",
    value: "GeoAttend v2.4.1",
    icon: <FiCheckCircle />,
    color: "var(--secondary)",
  },
  {
    label: "Last Sync",
    value: "Just now",
    icon: <FiRefreshCw />,
    color: "var(--warning)",
  },
];

const SECTIONS = [
  "Appearance",
  "Notifications",
  "Attendance",
  "Security",
  "Privacy",
  "Language",
  "Integrations",
  "Backup",
  "Danger Zone",
];

export default function SettingsSidebar({ activeSection, onSectionClick }) {
  return (
    <div className="settings-sidebar">
      <motion.div
        className="ssb-nav-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Settings</h3>
        <nav className="ssb-nav">
          {SECTIONS.map((s) => (
            <button
              key={s}
              className={`ssb-nav-btn ${activeSection === s ? "ssb-nav-active" : ""}`}
              onClick={() => onSectionClick(s)}
            >
              {s}
            </button>
          ))}
        </nav>
      </motion.div>

      <motion.div
        className="ssb-status-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>System Info</h3>
        <div className="ssb-status-list">
          {QUICK_SETTINGS.map((q) => (
            <div key={q.label} className="ssb-status-row">
              <span className="ssb-status-icon" style={{ color: q.color }}>
                {q.icon}
              </span>
              <div>
                <span className="ssb-status-label">{q.label}</span>
                <strong>{q.value}</strong>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="ssb-storage-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>Storage Usage</h3>
        <p className="ssb-storage-label">2.4 GB used of 10 GB</p>
        <div className="ssb-storage-bar-track">
          <motion.div
            className="ssb-storage-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: "24%" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <div className="ssb-storage-legend">
          {[
            { label: "Sessions", pct: 12, color: "#2563EB" },
            { label: "Reports", pct: 8, color: "#10B981" },
            { label: "Other", pct: 4, color: "#F59E0B" },
          ].map((s) => (
            <div key={s.label} className="ssb-legend-row">
              <i style={{ background: s.color }} />
              <span>{s.label}</span>
              <strong>{s.pct}%</strong>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
