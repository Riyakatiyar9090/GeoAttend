import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiUser,
  FiMapPin,
  FiClock,
  FiTarget,
} from "react-icons/fi";
import Loader from "../Loader/Loader";
import "./SessionPreviewCard.css";

export default function SessionPreviewCard({ session, onVerify, verifying }) {
  return (
    <motion.div
      className="scanner-session-preview"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 250, damping: 24 }}
    >
      <div className="ssp-detected-badge">✅ QR Code Detected</div>

      <h3>{session.subject}</h3>
      <p className="ssp-dept">{session.department}</p>

      <div className="ssp-rows">
        <div>
          <FiUser /> <span>Teacher</span>
          <strong>{session.teacher}</strong>
        </div>
        <div>
          <FiMapPin /> <span>Room</span>
          <strong>{session.room}</strong>
        </div>
        <div>
          <FiClock /> <span>Time</span>
          <strong>
            {session.startTime} - {session.endTime}
          </strong>
        </div>
        <div>
          <FiTarget /> <span>Radius</span>
          <strong>{session.radius}m</strong>
        </div>
        <div>
          <FiBookOpen /> <span>Session ID</span>
          <strong>{session.sessionId}</strong>
        </div>
      </div>

      <motion.button
        className="ssp-verify-btn"
        onClick={onVerify}
        disabled={verifying}
        whileHover={{ y: verifying ? 0 : -3 }}
        whileTap={{ scale: verifying ? 1 : 0.97 }}
      >
        {verifying ? (
          <>
            <Loader /> Verifying Location...
          </>
        ) : (
          "📍 Verify Location"
        )}
      </motion.button>
    </motion.div>
  );
}
