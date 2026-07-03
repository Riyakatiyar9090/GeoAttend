import { motion } from "framer-motion";
import { FiCamera, FiCameraOff, FiAlertTriangle } from "react-icons/fi";
import "./CameraPermissionCard.css";

const states = {
  loading: {
    icon: <FiCamera />,
    title: "Starting Camera...",
    desc: "Please wait while we initialise the camera.",
    tone: "info",
  },
  denied: {
    icon: <FiCameraOff />,
    title: "Camera Access Denied",
    desc: "Please allow camera access in your browser settings and reload the page.",
    tone: "danger",
  },
  no_camera: {
    icon: <FiAlertTriangle />,
    title: "No Camera Found",
    desc: "No camera device was detected on this device.",
    tone: "warning",
  },
  paused: {
    icon: <FiCamera />,
    title: "Scanner Paused",
    desc: "Click Resume to continue scanning.",
    tone: "info",
  },
};

export default function CameraPermissionCard({ status, onRetry }) {
  const { icon, title, desc, tone } = states[status] || states.loading;

  return (
    <motion.div
      className={`camera-permission-card permission-${tone}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="permission-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{desc}</p>
      {(status === "denied" || status === "no_camera") && (
        <button className="permission-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </motion.div>
  );
}
