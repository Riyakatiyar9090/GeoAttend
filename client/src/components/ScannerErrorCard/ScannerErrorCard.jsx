import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import "./ScannerErrorCard.css";

const errorMessages = {
  invalid_qr: {
    title: "Invalid QR Code",
    desc: "This QR code does not belong to a GeoAttend session. Please scan the correct QR code.",
  },
  expired_qr: {
    title: "QR Code Expired",
    desc: "This QR code has expired. Please ask your teacher to refresh the session QR.",
  },
  already_marked: {
    title: "Already Marked",
    desc: "Your attendance for this session has already been recorded.",
  },
  wrong_session: {
    title: "Wrong Session",
    desc: "This QR belongs to a different session or class.",
  },
  session_closed: {
    title: "Session Closed",
    desc: "The teacher has already closed this attendance session.",
  },
  generic: {
    title: "Something Went Wrong",
    desc: "An unexpected error occurred. Please try scanning again.",
  },
};

export default function ScannerErrorCard({ errorType, onRetry }) {
  const { title, desc } = errorMessages[errorType] || errorMessages.generic;

  return (
    <motion.div
      className="scanner-error-card"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: [0, -10, 10, -6, 6, 0] }}
      transition={{ duration: 0.5 }}
    >
      <div className="error-icon-wrapper">
        <FiAlertTriangle />
      </div>
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      <button className="error-retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </motion.div>
  );
}
