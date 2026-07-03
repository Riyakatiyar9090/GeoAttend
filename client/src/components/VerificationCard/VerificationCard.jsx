import { motion } from "framer-motion";
import { FiTarget, FiNavigation, FiMapPin, FiWifi } from "react-icons/fi";
import "./VerificationCard.css";

export default function VerificationCard({
  distance,
  radius,
  accuracy,
  studentCoords,
  status,
}) {
  const within = status === "success";

  return (
    <motion.div
      className="verification-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="vc-header">
        <h3>Verification Status</h3>
        <span
          className={`vc-status-pill ${within ? "pill-success" : status === "failed" ? "pill-danger" : "pill-info"}`}
        >
          {status === "success"
            ? "🟢 Within Radius"
            : status === "failed"
              ? "🔴 Outside Radius"
              : status === "fetching"
                ? "🟡 Fetching GPS"
                : "🔵 Waiting for GPS"}
        </span>
      </div>

      <div className="vc-metrics">
        <div className="vc-metric">
          <span className="vc-metric-icon">
            <FiTarget />
          </span>
          <div>
            <span>Distance</span>
            <strong
              className={distance <= radius ? "metric-good" : "metric-bad"}
            >
              {distance !== null ? `${distance.toFixed(1)}m` : "—"}
            </strong>
          </div>
        </div>

        <div className="vc-metric">
          <span className="vc-metric-icon">
            <FiMapPin />
          </span>
          <div>
            <span>Allowed Radius</span>
            <strong>{radius}m</strong>
          </div>
        </div>

        <div className="vc-metric">
          <span className="vc-metric-icon">
            <FiWifi />
          </span>
          <div>
            <span>GPS Accuracy</span>
            <strong>
              {accuracy !== null ? `±${accuracy.toFixed(0)}m` : "—"}
            </strong>
          </div>
        </div>

        <div className="vc-metric">
          <span className="vc-metric-icon">
            <FiNavigation />
          </span>
          <div>
            <span>Your Coords</span>
            <strong>
              {studentCoords.latitude
                ? `${studentCoords.latitude.toFixed(4)}, ${studentCoords.longitude.toFixed(4)}`
                : "—"}
            </strong>
          </div>
        </div>
      </div>

      {distance !== null && (
        <div className="vc-progress-bar-track">
          <motion.div
            className={`vc-progress-bar-fill ${within ? "fill-success" : "fill-danger"}`}
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min((distance / (radius * 1.5)) * 100, 100)}%`,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <span
            className="vc-radius-marker"
            style={{ left: `${(radius / (radius * 1.5)) * 100}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}
