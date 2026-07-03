import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import "./VerificationSuccessCard.css";

export default function VerificationSuccessCard({
  distance,
  onMarkAttendance,
}) {
  return (
    <motion.div
      className="verification-success-card"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
    >
      <motion.div
        className="vs-check-circle"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 240, damping: 20 }}
      >
        <motion.svg viewBox="0 0 52 52" className="vs-check-svg">
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
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          />
        </motion.svg>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        Location Verified Successfully
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        You are <strong>{distance.toFixed(1)}m</strong> from the classroom —
        within the allowed radius.
      </motion.p>

      <motion.button
        className="vs-mark-btn"
        onClick={onMarkAttendance}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
      >
        Mark Attendance <FiArrowRight />
      </motion.button>
    </motion.div>
  );
}
