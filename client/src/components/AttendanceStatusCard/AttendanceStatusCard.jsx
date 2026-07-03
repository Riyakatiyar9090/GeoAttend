import { motion } from "framer-motion";
import { FiCheck, FiShield, FiAward } from "react-icons/fi";
import "./AttendanceStatusCard.css";

export default function AttendanceStatusCard({
  status,
  date,
  attendanceId,
  pctImpact,
}) {
  const isPresent = status === "Present";

  return (
    <motion.div
      className={`asc-card ${isPresent ? "asc-present" : "asc-absent"}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="asc-left">
        <motion.div
          className="asc-check-circle"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 240,
            damping: 18,
          }}
        >
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="asc-pulse-ring"
              animate={{ scale: [1, 1.5 + i * 0.25], opacity: [0.35, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
          <motion.svg viewBox="0 0 52 52" className="asc-svg">
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            <motion.path
              d="M14 27l7 7 16-16"
              fill="none"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.65 }}
            />
          </motion.svg>
        </motion.div>

        <div className="asc-text">
          <span className="asc-id">#{attendanceId}</span>
          <h2>{isPresent ? "Attendance Marked Present" : "Marked Absent"}</h2>
          <p>{date}</p>
        </div>
      </div>

      <div className="asc-right">
        <div className="asc-chip">
          <FiShield /> Verified
        </div>
        <div className="asc-chip">
          <FiCheck /> Session Complete
        </div>
        {pctImpact && (
          <div className="asc-chip">
            <FiAward /> +{pctImpact}% Impact
          </div>
        )}
      </div>
    </motion.div>
  );
}
