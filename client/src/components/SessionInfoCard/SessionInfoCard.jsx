import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiTarget,
} from "react-icons/fi";
import "./SessionInfoCard.css";

export default function SessionInfoCard({ session, distance }) {
  const rows = [
    { icon: <FiBookOpen />, label: "Subject", value: session.subject },
    { icon: <FiUser />, label: "Teacher", value: session.teacher },
    { icon: <FiMapPin />, label: "Department", value: session.department },
    { icon: <FiMapPin />, label: "Room", value: session.room },
    { icon: <FiCalendar />, label: "Date", value: session.date },
    {
      icon: <FiClock />,
      label: "Time",
      value: `${session.startTime} – ${session.endTime}`,
    },
    {
      icon: <FiTarget />,
      label: "Allowed Radius",
      value: `${session.radius}m`,
    },
    {
      icon: <FiTarget />,
      label: "Your Distance",
      value: distance !== null ? `${distance.toFixed(1)}m` : "N/A",
      good: true,
    },
  ];

  return (
    <motion.div
      className="session-info-card-success"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
    >
      <h3>Session Information</h3>
      <div className="sic-rows">
        {rows.map((r) => (
          <div key={r.label} className="sic-row">
            <span className="sic-icon">{r.icon}</span>
            <span className="sic-label">{r.label}</span>
            <span className={`sic-value ${r.good ? "sic-good" : ""}`}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
