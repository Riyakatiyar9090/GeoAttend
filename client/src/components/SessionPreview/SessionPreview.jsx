import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiUsers,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiTag,
} from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";
import MapPreview from "../MapPreview/MapPreview";
import "./SessionPreview.css";

export default function SessionPreview({ data }) {
  const {
    subject,
    className,
    date,
    startTime,
    endTime,
    radius,
    location,
    sessionType,
  } = data;

  return (
    <motion.div
      className="session-preview-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="preview-header">
        <h3>Live Preview</h3>
        <span className="preview-status">Draft</span>
      </div>

      <div className="preview-rows">
        <div className="preview-row">
          <FiBookOpen />
          <div>
            <span>Subject</span>
            <strong>{subject || "—"}</strong>
          </div>
        </div>
        <div className="preview-row">
          <FiUsers />
          <div>
            <span>Class</span>
            <strong>{className || "—"}</strong>
          </div>
        </div>
        <div className="preview-row">
          <FiCalendar />
          <div>
            <span>Date</span>
            <strong>{date || "—"}</strong>
          </div>
        </div>
        <div className="preview-row">
          <FiClock />
          <div>
            <span>Time</span>
            <strong>
              {startTime && endTime ? `${startTime} - ${endTime}` : "—"}
            </strong>
          </div>
        </div>
        <div className="preview-row">
          <FiMapPin />
          <div>
            <span>Radius</span>
            <strong>{radius}m</strong>
          </div>
        </div>
        <div className="preview-row">
          <FiTag />
          <div>
            <span>Type</span>
            <strong>{sessionType}</strong>
          </div>
        </div>
      </div>

      <div className="qr-placeholder-card">
        <BsQrCode size={40} />
        <p>QR Code will be generated after creating the session.</p>
      </div>

      <MapPreview
        latitude={location.latitude}
        longitude={location.longitude}
        radius={radius}
      />
    </motion.div>
  );
}
