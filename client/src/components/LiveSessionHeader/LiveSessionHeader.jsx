import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "./LiveSessionHeader.css";

export default function LiveSessionHeader({ subject, duration }) {
  const navigate = useNavigate();

  return (
    <motion.div
      className="live-session-header"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="lsh-left">
        <button className="lsh-back-btn" onClick={() => navigate("/teacher")}>
          <FiArrowLeft />
        </button>
        <div>
          <div className="lsh-title-row">
            <h1>Live Attendance Session</h1>
            <motion.span
              className="live-badge-large"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              🟢 LIVE
            </motion.span>
          </div>
          <p>Students are currently marking attendance for {subject}.</p>
        </div>
      </div>

      <div className="lsh-right">
        <span className="lsh-duration-label">Session Duration</span>
        <span className="lsh-duration-value">{duration}</span>
      </div>
    </motion.div>
  );
}
