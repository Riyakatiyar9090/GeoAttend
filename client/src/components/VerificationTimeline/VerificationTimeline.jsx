import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import "./VerificationTimeline.css";

const STEPS = [
  { label: "QR Code Scanned", sub: "Valid session QR detected" },
  { label: "Location Verified", sub: "Within allowed radius" },
  { label: "Attendance Recorded", sub: "Saved to server" },
  { label: "Confirmation Sent", sub: "Session logs updated" },
];

export default function VerificationTimeline() {
  return (
    <motion.div
      className="verification-timeline-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3>Verification Timeline</h3>
      <div className="vtl-list">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.label}
            className="vtl-step"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
          >
            <motion.div
              className="vtl-check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.6 + i * 0.12,
                type: "spring",
                stiffness: 260,
                damping: 18,
              }}
            >
              <FiCheck />
            </motion.div>
            <div className="vtl-content">
              <span className="vtl-label">{step.label}</span>
              <span className="vtl-sub">{step.sub}</span>
            </div>
            {i < STEPS.length - 1 && (
              <motion.div
                className="vtl-connector"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.65 + i * 0.12, duration: 0.3 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
