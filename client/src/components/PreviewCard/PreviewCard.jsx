import { motion } from "framer-motion";
import {
  FiUser,
  FiBookOpen,
  FiMapPin,
  FiClock,
  FiUsers,
  FiTarget,
} from "react-icons/fi";
import QRPlaceholder from "../QRPlaceholder/QRPlaceholder";
import "./PreviewCard.css";

export default function PreviewCard({ session }) {
  return (
    <motion.div
      className="preview-card-large"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="preview-card-top">
        <span className="preview-status-badge">Draft</span>
        <span className="preview-timer">⏱ Not Started</span>
      </div>

      <h2>{session.subject || "Untitled Session"}</h2>

      <div className="preview-info-grid">
        <div>
          <FiUser />
          <div>
            <span>Teacher</span>
            <strong>{session.faculty}</strong>
          </div>
        </div>
        <div>
          <FiBookOpen />
          <div>
            <span>Course</span>
            <strong>{session.className}</strong>
          </div>
        </div>
        <div>
          <FiMapPin />
          <div>
            <span>Room</span>
            <strong>{session.room}</strong>
          </div>
        </div>
        <div>
          <FiClock />
          <div>
            <span>Time</span>
            <strong>
              {session.startTime} - {session.endTime}
            </strong>
          </div>
        </div>
        <div>
          <FiUsers />
          <div>
            <span>Est. Students</span>
            <strong>{session.estimatedStudents}</strong>
          </div>
        </div>
        <div>
          <FiTarget />
          <div>
            <span>Radius</span>
            <strong>{session.radius}m</strong>
          </div>
        </div>
      </div>

      <QRPlaceholder />
    </motion.div>
  );
}
