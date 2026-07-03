import { motion } from "framer-motion";
import "./AttendanceProgress.css";

function getColor(pct) {
  if (pct >= 90) return "#10B981";
  if (pct >= 75) return "#2563EB";
  if (pct >= 60) return "#F59E0B";
  return "#EF4444";
}

export default function AttendanceProgress({ pct }) {
  const color = getColor(pct);
  return (
    <div className="ap-wrapper">
      <div className="ap-bar-track">
        <motion.div
          className="ap-bar-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <span className="ap-label" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}
