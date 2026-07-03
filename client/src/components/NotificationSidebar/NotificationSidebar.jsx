import { motion } from "framer-motion";
import { FiClock, FiBell, FiCalendar } from "react-icons/fi";
import "./NotificationSidebar.css";

const todayActivity = [
  { icon: "✅", text: "56 students marked present", time: "10:15 AM" },
  { icon: "🚀", text: "Session GA-103 started", time: "11:00 AM" },
  { icon: "🔴", text: "Karan Patel absent alert", time: "11:08 AM" },
  { icon: "🏁", text: "Session GA-101 ended", time: "11:55 AM" },
];

const upcomingSessions = [
  { subject: "Software Engineering", time: "12:00 PM", room: "Room 301" },
  { subject: "Computer Networks", time: "2:00 PM", room: "Lab 3" },
];

const recentAlerts = [
  { text: "Tanya Roy — 3rd absence", tone: "danger" },
  { text: "CSE-B attendance below 70%", tone: "warning" },
  { text: "Location spoof detected", tone: "danger" },
];

export default function NotificationSidebar({ onMarkAllRead }) {
  return (
    <div className="notification-sidebar">
      <motion.div
        className="nsb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>
          <FiClock /> Today's Activity
        </h3>
        <div className="nsb-activity-list">
          {todayActivity.map((a, i) => (
            <div key={i} className="nsb-activity-row">
              <span className="nsb-act-emoji">{a.icon}</span>
              <div>
                <p>{a.text}</p>
                <span>{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="nsb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>
          <FiCalendar /> Upcoming Sessions
        </h3>
        <div className="nsb-sessions-list">
          {upcomingSessions.map((s, i) => (
            <div key={i} className="nsb-session-row">
              <span className="nsb-session-dot" />
              <div>
                <strong>{s.subject}</strong>
                <span>
                  {s.time} · {s.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="nsb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>
          <FiBell /> Recent Alerts
        </h3>
        <div className="nsb-alerts-list">
          {recentAlerts.map((a, i) => (
            <div key={i} className={`nsb-alert-row nsb-${a.tone}`}>
              {a.text}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="nsb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3>Quick Actions</h3>
        <div className="nsb-quick-actions">
          <button className="nsb-qa-btn primary" onClick={onMarkAllRead}>
            Mark All as Read
          </button>
          <button
            className="nsb-qa-btn"
            onClick={() => alert("Settings — backend pending")}
          >
            Notification Settings
          </button>
          <button
            className="nsb-qa-btn"
            onClick={() => alert("Export — backend pending")}
          >
            Export Notifications
          </button>
        </div>
      </motion.div>
    </div>
  );
}
