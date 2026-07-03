import { motion } from "framer-motion";
import {
  FiUser,
  FiMapPin,
  FiUsers,
  FiTarget,
  FiClock,
  FiEye,
} from "react-icons/fi";
import StatusBadge from "../StatusBadge/StatusBadge";
import LiveCountdownTimer from "../LiveCountdownTimer/LiveCountdownTimer";
import "./StudentSessionCard.css";

export default function StudentSessionCard({
  session,
  onJoin,
  onViewDetails,
  index,
}) {
  const canJoin = session.status === "Live" || session.status === "Ending Soon";

  return (
    <motion.div
      className={`student-session-card status-border-${session.status.toLowerCase().replace(" ", "-")}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.01 }}
    >
      <div className="ssc-top">
        <StatusBadge status={session.status} />
        <span className="ssc-students-joined">
          <FiUsers /> {session.studentsJoined} joined
        </span>
      </div>

      <h3>{session.subject}</h3>
      <p className="ssc-department">{session.department}</p>

      <div className="ssc-meta">
        <span>
          <FiUser /> {session.teacher}
        </span>
        <span>
          <FiMapPin /> {session.room}
        </span>
        <span>
          <FiTarget /> {session.radius}m radius
        </span>
        <span>
          <FiClock /> {session.startTime} - {session.endTime}
        </span>
      </div>

      <div className="ssc-countdown-row">
        <LiveCountdownTimer endsInSeconds={session.remainingSeconds} />
      </div>

      <div className="ssc-actions">
        <button
          className="ssc-join-btn"
          onClick={() => onJoin(session)}
          disabled={!canJoin}
        >
          {canJoin ? "Join Attendance" : "Not Started"}
        </button>
        <button
          className="ssc-details-btn"
          onClick={() => onViewDetails(session)}
        >
          <FiEye /> Details
        </button>
      </div>
    </motion.div>
  );
}
