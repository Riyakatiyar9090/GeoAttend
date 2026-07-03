import { motion } from "framer-motion";
import { FiHash, FiMonitor, FiWifi, FiShield } from "react-icons/fi";
import "./MetadataCard.css";

export default function MetadataCard({ record }) {
  const rows = [
    { icon: <FiHash />, label: "Attendance ID", value: record.id, mono: true },
    {
      icon: <FiHash />,
      label: "Session ID",
      value: record.sessionId,
      mono: true,
    },
    {
      icon: <FiHash />,
      label: "Student ID",
      value: record.studentId,
      mono: true,
    },
    {
      icon: <FiHash />,
      label: "QR Code ID",
      value: record.qrCodeId,
      mono: true,
    },
    {
      icon: <FiShield />,
      label: "Verification Method",
      value: record.attendanceType,
    },
    { icon: <FiMonitor />, label: "Browser", value: record.browser },
    { icon: <FiMonitor />, label: "Device", value: record.device },
    { icon: <FiShield />, label: "IP Address", value: record.ip },
    { icon: <FiWifi />, label: "Network", value: record.network },
  ];

  return (
    <motion.div
      className="metadata-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <h3>Attendance Metadata</h3>
      <div className="mc-rows">
        {rows.map((r) => (
          <div key={r.label} className="mc-row">
            <span className="mc-icon">{r.icon}</span>
            <span className="mc-label">{r.label}</span>
            <span className={`mc-value ${r.mono ? "mc-mono" : ""}`}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
