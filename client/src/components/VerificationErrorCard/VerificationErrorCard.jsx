import { motion } from "framer-motion";
import { FiX, FiRefreshCw, FiMap } from "react-icons/fi";
import "./VerificationErrorCard.css";

const errorConfig = {
  outside_radius: {
    title: "Outside Allowed Radius",
    desc: "Your current location is beyond the allowed attendance boundary. Please move closer to the classroom.",
    tone: "danger",
  },
  permission_denied: {
    title: "Location Permission Denied",
    desc: "GeoAttend needs location access to verify your presence. Please enable it in your browser settings.",
    tone: "warning",
  },
  gps_disabled: {
    title: "GPS Disabled",
    desc: "Your device GPS appears to be off. Please enable location services and try again.",
    tone: "warning",
  },
  poor_accuracy: {
    title: "Poor GPS Accuracy",
    desc: "Your GPS signal is weak. Try moving to an open area for a better reading.",
    tone: "warning",
  },
  timeout: {
    title: "Location Timeout",
    desc: "Could not retrieve your location in time. Please try again.",
    tone: "danger",
  },
};

export default function VerificationErrorCard({
  errorType,
  distance,
  radius,
  onRetry,
  onViewMap,
}) {
  const { title, desc, tone } =
    errorConfig[errorType] || errorConfig.outside_radius;

  return (
    <motion.div
      className={`verification-error-card ve-${tone}`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: [0, -10, 10, -6, 6, 0] }}
      transition={{ duration: 0.5 }}
    >
      <div className="ve-icon-wrapper">
        <FiX />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>

      {errorType === "outside_radius" && distance !== null && (
        <div className="ve-distance-info">
          <div>
            <span>Your Distance</span>
            <strong>{distance.toFixed(1)}m</strong>
          </div>
          <div>
            <span>Allowed Radius</span>
            <strong>{radius}m</strong>
          </div>
          <div>
            <span>Excess</span>
            <strong className="ve-excess">
              +{(distance - radius).toFixed(1)}m
            </strong>
          </div>
        </div>
      )}

      <div className="ve-actions">
        <motion.button
          className="ve-retry-btn"
          onClick={onRetry}
          whileHover={{ y: -2 }}
        >
          <FiRefreshCw /> Try Again
        </motion.button>
        {onViewMap && (
          <button className="ve-map-btn" onClick={onViewMap}>
            <FiMap /> View Map
          </button>
        )}
      </div>
    </motion.div>
  );
}
