import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiClock, FiMapPin } from "react-icons/fi";
import { TIMELINE_EVENTS } from "../../pages/StudentAnalytics/analyticsStudentData";
import "./StudentAttendanceTimeline.css";

const statusIcon = {
  Present: <FiCheckCircle />,
  Absent: <FiXCircle />,
  Late: <FiClock />,
};
const statusColor = {
  Present: "var(--success)",
  Absent: "var(--danger)",
  Late: "var(--warning)",
};

export default function StudentAttendanceTimeline() {
  return (
    <motion.div
      className="sat-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Recent Attendance Timeline</h3>
      <div className="sat-list">
        {TIMELINE_EVENTS.map((ev, i) => (
          <motion.div
            key={i}
            className="sat-row"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <span
              className="sat-status-icon"
              style={{
                color: statusColor[ev.status],
                background: `${statusColor[ev.status]}18`,
              }}
            >
              {statusIcon[ev.status]}
            </span>
            <div className="sat-body">
              <p>
                <strong>{ev.subject}</strong>
              </p>
              <span>
                {ev.date} · {ev.time}
              </span>
            </div>
            <div className="sat-right">
              <span className={`sat-badge ${ev.status.toLowerCase()}`}>
                {ev.icon} {ev.status}
              </span>
              {ev.verified && (
                <span className="sat-verified">
                  <FiMapPin /> Verified
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
