import { motion } from "framer-motion";
import {
  FiMapPin,
  FiTarget,
  FiNavigation,
  FiCheckCircle,
} from "react-icons/fi";
import MapPreview from "../MapPreview/MapPreview";
import "./LocationInfoCard.css";

export default function LocationInfoCard({
  teacherCoords,
  studentCoords,
  distance,
  radius,
}) {
  const within = distance <= radius;

  return (
    <motion.div
      className="location-info-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="lic-header">
        <h3>Location Verification</h3>
        <span className={`lic-result ${within ? "lic-pass" : "lic-fail"}`}>
          <FiCheckCircle /> {within ? "Within Radius" : "Outside Radius"}
        </span>
      </div>

      <div className="lic-coords-grid">
        <div>
          <span className="lic-coords-label">
            <FiMapPin /> Classroom
          </span>
          <code>
            {teacherCoords.latitude.toFixed(5)},{" "}
            {teacherCoords.longitude.toFixed(5)}
          </code>
        </div>
        <div>
          <span className="lic-coords-label">
            <FiNavigation /> Your Location
          </span>
          <code>
            {studentCoords.latitude.toFixed(5)},{" "}
            {studentCoords.longitude.toFixed(5)}
          </code>
        </div>
        <div>
          <span className="lic-coords-label">
            <FiTarget /> Distance
          </span>
          <code className={within ? "coord-good" : "coord-bad"}>
            {distance.toFixed(1)}m
          </code>
        </div>
        <div>
          <span className="lic-coords-label">
            <FiTarget /> Allowed Radius
          </span>
          <code>{radius}m</code>
        </div>
      </div>

      <MapPreview
        latitude={teacherCoords.latitude}
        longitude={teacherCoords.longitude}
        radius={radius}
      />
    </motion.div>
  );
}
