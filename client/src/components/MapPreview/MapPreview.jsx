import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "./MapPreview.css";

// Default marker icon fix for bundlers
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function MapPreview({ latitude, longitude, radius }) {
  const hasLocation = latitude && longitude;

  if (!hasLocation) {
    return (
      <div className="map-preview-placeholder">
        <span>📍</span>
        <p>Location preview will appear here once detected.</p>
      </div>
    );
  }

  return (
    <div className="map-preview-wrapper">
      <MapContainer
        center={[latitude, longitude]}
        zoom={17}
        scrollWheelZoom={false}
        className="map-preview-container"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={markerIcon} />
        <Circle
          center={[latitude, longitude]}
          radius={radius}
          pathOptions={{
            color: "#2563EB",
            fillColor: "#2563EB",
            fillOpacity: 0.12,
          }}
        />
        <RecenterMap lat={latitude} lng={longitude} />
      </MapContainer>
    </div>
  );
}
