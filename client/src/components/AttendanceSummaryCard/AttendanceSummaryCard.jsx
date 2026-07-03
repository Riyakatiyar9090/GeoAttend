import { motion } from "framer-motion";
import {
  FiUser,
  FiHash,
  FiBookOpen,
  FiUserCheck,
  FiMapPin,
  FiTag,
} from "react-icons/fi";
import "./AttendanceSummaryCard.css";

export default function AttendanceSummaryCard({ student, session, markedAt }) {
  const rows = [
    { icon: <FiUser />, label: "Student Name", value: student.name },
    { icon: <FiHash />, label: "Roll Number", value: student.rollNumber },
    { icon: <FiBookOpen />, label: "Subject", value: session.subject },
    { icon: <FiUserCheck />, label: "Faculty", value: session.teacher },
    { icon: <FiTag />, label: "Department", value: session.department },
    { icon: <FiMapPin />, label: "Room", value: session.room },
    { icon: <FiHash />, label: "Session ID", value: session.sessionId },
  ];

  return (
    <motion.div
      className="attendance-summary-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="asc-header">
        <h3>Attendance Summary</h3>
        <span className="asc-present-badge">✅ Present</span>
      </div>

      <div className="asc-rows">
        {rows.map((r) => (
          <div key={r.label} className="asc-row">
            <span className="asc-icon">{r.icon}</span>
            <span className="asc-label">{r.label}</span>
            <span className="asc-value">{r.value}</span>
          </div>
        ))}
        <div className="asc-row">
          <span className="asc-icon">
            <FiTag />
          </span>
          <span className="asc-label">Marked At</span>
          <span className="asc-value">{markedAt}</span>
        </div>
      </div>

      <div className="asc-verification-row">
        <span className="asc-verify-chip">
          <span>🔳</span> QR Verified
        </span>
        <span className="asc-verify-chip">
          <span>📍</span> Location Verified
        </span>
        <span className="asc-verify-chip">
          <span>🌐</span> Connected
        </span>
      </div>
    </motion.div>
  );
}
