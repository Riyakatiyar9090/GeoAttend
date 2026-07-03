import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import "./LocationMap.css";

// Custom icons
const teacherIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const studentIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function AutoCenter({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [positions, map]);
  return null;
}

export default function LocationMap({
  teacher,
  student,
  radius,
  withinRadius,
}) {
  const hasStudent = student.latitude && student.longitude;
  const positions = hasStudent
    ? [
        [teacher.latitude, teacher.longitude],
        [student.latitude, student.longitude],
      ]
    : [[teacher.latitude, teacher.longitude]];

  return (
    <motion.div
      className="location-map-wrapper"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MapContainer
        center={[teacher.latitude, teacher.longitude]}
        zoom={17}
        scrollWheelZoom={false}
        className="location-map-container"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Attendance radius circle around teacher */}
        <Circle
          center={[teacher.latitude, teacher.longitude]}
          radius={radius}
          pathOptions={{
            color: withinRadius ? "#10B981" : "#EF4444",
            fillColor: withinRadius ? "#10B981" : "#EF4444",
            fillOpacity: 0.1,
            weight: 2,
          }}
        />

        {/* Teacher marker */}
        <Marker
          position={[teacher.latitude, teacher.longitude]}
          icon={teacherIcon}
        >
          <Popup>📍 Classroom Location</Popup>
        </Marker>

        {/* Student marker */}
        {hasStudent && (
          <Marker
            position={[student.latitude, student.longitude]}
            icon={studentIcon}
          >
            <Popup>🧑‍🎓 Your Location</Popup>
          </Marker>
        )}

        {/* Distance line */}
        {hasStudent && (
          <Polyline
            positions={[
              [teacher.latitude, teacher.longitude],
              [student.latitude, student.longitude],
            ]}
            pathOptions={{
              color: withinRadius ? "#10B981" : "#EF4444",
              dashArray: "6 6",
              weight: 2,
            }}
          />
        )}

        <AutoCenter positions={positions} />
      </MapContainer>

      <div className="map-legend">
        <span className="legend-item">
          <span className="legend-dot blue" />
          Classroom
        </span>
        {hasStudent && (
          <span className="legend-item">
            <span className="legend-dot green" />
            Your Location
          </span>
        )}
        <span className="legend-item">
          <span
            className={`legend-dot ${withinRadius ? "success" : "danger"}`}
          />
          {radius}m Radius
        </span>
      </div>
    </motion.div>
  );
}
