import { motion } from "framer-motion";
import { FiAlertTriangle, FiBell } from "react-icons/fi";
import { LOW_ATTENDANCE } from "../../pages/TeacherAnalytics/analyticsData";
import "./LowAttendanceAlert.css";

export default function LowAttendanceAlert() {
  return (
    <motion.div
      className="low-attendance-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="la-header">
        <h3>
          <FiAlertTriangle /> Students Below 75% Attendance
        </h3>
        <span>{LOW_ATTENDANCE.length} at risk</span>
      </div>

      <div className="la-list">
        {LOW_ATTENDANCE.map((s, i) => (
          <motion.div
            key={s.roll}
            className="la-row"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <span className="la-avatar">{s.name.charAt(0)}</span>
            <div className="la-info">
              <strong>{s.name}</strong>
              <span>
                {s.roll} · {s.subject}
              </span>
            </div>
            <span
              className={`la-pct ${s.pct < 65 ? "pct-critical" : "pct-warning"}`}
            >
              {s.pct}%
            </span>
            <motion.button
              className="la-remind-btn"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => alert(`Reminder sent to ${s.name}`)}
            >
              <FiBell /> Remind
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
