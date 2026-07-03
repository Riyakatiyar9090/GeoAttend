import { useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiLoader } from "react-icons/fi";
import MapPreview from "../MapPreview/MapPreview";
import "./LocationPicker.css";

export default function LocationPicker({
  location,
  onLocationChange,
  radius,
  error,
}) {
  const [loading, setLoading] = useState(false);
  const [locError, setLocError] = useState("");

  const handleDetect = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);
    setLocError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setLocError(
          "Unable to retrieve your location. Please allow location access.",
        );
        setLoading(false);
      },
    );
  };

  return (
    <div className="location-picker">
      <div className="location-picker-head">
        <span className="field-label">Session Location</span>
      </div>

      <motion.button
        type="button"
        className="detect-location-btn"
        onClick={handleDetect}
        disabled={loading}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        {loading ? <FiLoader className="spin-icon" /> : <FiMapPin />}
        {loading ? "Detecting location..." : "📍 Use Current Location"}
      </motion.button>

      {(locError || error) && (
        <p className="location-error-text">{locError || error}</p>
      )}

      {location.latitude && (
        <div className="coords-row">
          <span>
            Lat: <strong>{location.latitude.toFixed(5)}</strong>
          </span>
          <span>
            Lng: <strong>{location.longitude.toFixed(5)}</strong>
          </span>
        </div>
      )}

      <MapPreview
        latitude={location.latitude}
        longitude={location.longitude}
        radius={radius}
      />
    </div>
  );
}
