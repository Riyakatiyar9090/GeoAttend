import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiUser,
  FiUsers,
  FiHash,
  FiMapPin,
  FiTag,
  FiCalendar,
  FiClock,
  FiTarget,
  FiClock as FiLate,
  FiFileText,
  FiCircle,
} from "react-icons/fi";
import "./SessionSummaryCard.css";

export default function SessionSummaryCard({ session }) {
  const rows = [
    { icon: <FiBookOpen />, label: "Subject", value: session.subject },
    { icon: <FiUser />, label: "Faculty Name", value: session.faculty },
    { icon: <FiUsers />, label: "Class", value: session.className },
    { icon: <FiHash />, label: "Section", value: session.section },
    { icon: <FiHash />, label: "Semester", value: session.semester },
    { icon: <FiMapPin />, label: "Room Number", value: session.room },
    { icon: <FiTag />, label: "Session Type", value: session.sessionType },
    { icon: <FiCalendar />, label: "Date", value: session.date },
    { icon: <FiClock />, label: "Start Time", value: session.startTime },
    { icon: <FiClock />, label: "End Time", value: session.endTime },
    {
      icon: <FiTarget />,
      label: "Attendance Radius",
      value: `${session.radius}m`,
    },
    {
      icon: <FiLate />,
      label: "Late Entry",
      value: session.allowLateEntry
        ? `Allowed (${session.lateDuration})`
        : "Not Allowed",
    },
  ];

  return (
    <motion.div
      className="summary-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="summary-card-header">
        <h3>Session Summary</h3>
        <span className="status-pill">
          <FiCircle /> Draft
        </span>
      </div>

      <div className="summary-rows">
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            className="summary-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <span className="summary-icon">{r.icon}</span>
            <span className="summary-label">{r.label}</span>
            <span className="summary-value">{r.value || "—"}</span>
          </motion.div>
        ))}
      </div>

      {session.notes && (
        <div className="summary-notes">
          <FiFileText />
          <p>{session.notes}</p>
        </div>
      )}
    </motion.div>
  );
}
