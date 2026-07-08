import { motion } from "framer-motion";
import { FiCheckSquare, FiBell, FiCalendar } from "react-icons/fi";
import "./StudentNotificationSidebar.css";

const todayAttendance = [
  { subject: "DBMS", status: "Present", time: "10:03 AM", icon: "✅" },
  {
    subject: "Operating Systems",
    status: "Present",
    time: "11:14 AM",
    icon: "✅",
  },
  { subject: "Computer Networks", status: "Absent", time: "—", icon: "🔴" },
];

const upcomingClasses = [
  { subject: "Software Engineering", time: "12:00 PM", room: "Room 301" },
  { subject: "Web Dev Lab", time: "2:00 PM", room: "Lab 3" },
];

const recentActivity = [
  { text: "Marked present in DBMS", time: "10:03 AM" },
  { text: "QR scan failed in OS — retried", time: "11:01 AM" },
  { text: "Achievement unlocked: 10-Day Streak", time: "9:00 AM" },
];

export default function StudentNotificationSidebar({ onMarkAllRead }) {
  return (
    <div className="snsb-sidebar">
      <motion.div
        className="snsb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>
          <FiCheckSquare /> Today's Attendance
        </h3>
        <div className="snsb-att-list">
          {todayAttendance.map((a, i) => (
            <div key={i} className="snsb-att-row">
              <span className="snsb-att-emoji">{a.icon}</span>
              <div>
                <strong>{a.subject}</strong>
                <span
                  className={
                    a.status === "Present" ? "snsb-present" : "snsb-absent"
                  }
                >
                  {a.status} · {a.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="snsb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>
          <FiCalendar /> Upcoming Classes
        </h3>
        <div className="snsb-class-list">
          {upcomingClasses.map((c, i) => (
            <div key={i} className="snsb-class-row">
              <span className="snsb-class-dot" />
              <div>
                <strong>{c.subject}</strong>
                <span>
                  {c.time} · {c.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="snsb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>Recent Activity</h3>
        <div className="snsb-activity-list">
          {recentActivity.map((a, i) => (
            <div key={i} className="snsb-activity-row">
              <span className="snsb-act-dot" />
              <div>
                <p>{a.text}</p>
                <span>{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="snsb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3>
          <FiBell /> Quick Actions
        </h3>
        <div className="snsb-quick-actions">
          <button className="snsb-qa-btn primary" onClick={onMarkAllRead}>
            Mark All as Read
          </button>
          <button
            className="snsb-qa-btn"
            onClick={() => alert("Settings — backend pending")}
          >
            Notification Settings
          </button>
          <button
            className="snsb-qa-btn"
            onClick={() => alert("Export — backend pending")}
          >
            Export Notifications
          </button>
        </div>
      </motion.div>
    </div>
  );
}
