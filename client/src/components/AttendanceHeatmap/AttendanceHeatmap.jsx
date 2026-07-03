import { useState } from "react";
import { motion } from "framer-motion";
import { HEATMAP_DATA } from "../../pages/TeacherAnalytics/analyticsData";
import "./AttendanceHeatmap.css";

const INTENSITY_COLORS = [
  "rgba(37,99,235,0.06)",
  "rgba(37,99,235,0.22)",
  "rgba(37,99,235,0.44)",
  "rgba(37,99,235,0.66)",
  "rgba(37,99,235,0.9)",
];

const INTENSITY_LABELS = [
  "No data",
  "Low (< 70%)",
  "Fair (70-80%)",
  "Good (80-90%)",
  "High (> 90%)",
];

export default function AttendanceHeatmap() {
  const [tooltip, setTooltip] = useState(null);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <motion.div
      className="heatmap-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chart-card-header">
        <div>
          <h3>Attendance Heatmap — June 2026</h3>
          <p>Daily attendance intensity across the month</p>
        </div>
      </div>

      <div className="heatmap-grid">
        {days.map((d) => {
          const intensity = HEATMAP_DATA[d] ?? 0;
          return (
            <motion.div
              key={d}
              className="heatmap-cell"
              style={{ background: INTENSITY_COLORS[intensity] }}
              whileHover={{ scale: 1.2 }}
              onMouseEnter={(e) =>
                setTooltip({ day: d, intensity, x: e.clientX, y: e.clientY })
              }
              onMouseLeave={() => setTooltip(null)}
            >
              <span className="heatmap-day-label">{d}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="heatmap-legend">
        <span>Less</span>
        {INTENSITY_COLORS.map((c, i) => (
          <div
            key={i}
            className="legend-cell"
            style={{ background: c }}
            title={INTENSITY_LABELS[i]}
          />
        ))}
        <span>More</span>
      </div>

      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{ top: tooltip.y - 60, left: tooltip.x - 60 }}
        >
          June {tooltip.day} · {INTENSITY_LABELS[tooltip.intensity]}
        </div>
      )}
    </motion.div>
  );
}
