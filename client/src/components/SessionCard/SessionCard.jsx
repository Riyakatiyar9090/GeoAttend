import { motion } from "framer-motion";
import { FiBookOpen, FiClock, FiUsers, FiEdit2, FiPlay } from "react-icons/fi";
import "./SessionCard.css";

const statusStyles = {
  Live: "session-status-live",
  Scheduled: "session-status-scheduled",
  Ended: "session-status-ended",
};

export default function SessionCard({ session, onStart, onEdit, index }) {
  return (
    <motion.div
      className="session-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
    >
      <div className="session-card-top">
        <div className="session-card-icon">
          <FiBookOpen />
        </div>
        <span className={`session-status ${statusStyles[session.status]}`}>
          {session.status === "Live" && <span className="status-dot" />}
          {session.status}
        </span>
      </div>

      <h4>{session.subject}</h4>
      <p className="session-class">{session.className}</p>

      <div className="session-card-meta">
        <span>
          <FiClock /> {session.time}
        </span>
        <span>
          <FiUsers /> {session.studentsPresent}/{session.totalStudents}
        </span>
      </div>

      <div className="session-card-actions">
        {session.status !== "Ended" ? (
          <button
            className="session-start-btn"
            onClick={() => onStart(session)}
          >
            <FiPlay /> {session.status === "Live" ? "Manage" : "Start Session"}
          </button>
        ) : (
          <button className="session-start-btn session-disabled" disabled>
            Session Ended
          </button>
        )}
        <button className="session-edit-btn" onClick={() => onEdit(session)}>
          <FiEdit2 />
        </button>
      </div>
    </motion.div>
  );
}
