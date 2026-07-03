import { motion } from "framer-motion";
import { FiMapPin, FiNavigation } from "react-icons/fi";
import MapPreview from "../MapPreview/MapPreview";
import "./LocationCard.css";

export default function LocationCard({ location, radius, buildingName }) {
  return (
    <motion.div
      className="location-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="location-card-header">
        <h3>
          <FiMapPin /> Session Location
        </h3>
      </div>

      <div className="location-meta">
        <div>
          <span>Latitude</span>
          <strong>{location.latitude?.toFixed(5) || "—"}</strong>
        </div>
        <div>
          <span>Longitude</span>
          <strong>{location.longitude?.toFixed(5) || "—"}</strong>
        </div>
        <div>
          <span>
            <FiNavigation /> Building
          </span>
          <strong>{buildingName}</strong>
        </div>
      </div>

      <MapPreview
        latitude={location.latitude}
        longitude={location.longitude}
        radius={radius}
      />
    </motion.div>
  );
}
