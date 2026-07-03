import { motion } from "framer-motion";
import {
  FiUserCheck,
  FiClock,
  FiCheckCircle,
  FiDownload,
  FiXCircle,
} from "react-icons/fi";
import "./AttendanceReportTimeline.css";

const iconMap = {
  present: <FiUserCheck />,
  late: <FiClock />,
  session: <FiCheckCircle />,
  export: <FiDownload />,
  absent: <FiXCircle />,
};
const colorMap = {
  present: "var(--success)",
  late: "var(--warning)",
  session: "var(--primary)",
  export: "var(--accent)",
  absent: "var(--danger)",
};

export default function AttendanceReportTimeline({ events }) {
  return (
    <motion.div
      className="art-timeline-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Recent Attendance Activity</h3>
      <div className="art-tl-list">
        {events.map((ev, i) => (
          <motion.div
            key={i}
            className="art-tl-row"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <span
              className="art-tl-icon"
              style={{
                color: colorMap[ev.type],
                background: `${colorMap[ev.type]}18`,
              }}
            >
              {iconMap[ev.type]}
            </span>
            <div className="art-tl-body">
              <p>{ev.text}</p>
              <span>{ev.sub}</span>
            </div>
            <span className="art-tl-time">{ev.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
