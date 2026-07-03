import { motion } from "framer-motion";
import "./CalendarWidget.css";

export default function CalendarWidget({
  year,
  month,
  today,
  sessionDays = [],
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <motion.div
      className="calendar-widget"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="calendar-header">
        <h3>
          {monthName} {year}
        </h3>
      </div>

      <div className="calendar-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="calendar-dow">
            {d}
          </span>
        ))}

        {cells.map((day, i) => (
          <span
            key={i}
            className={`calendar-cell ${day === today ? "calendar-today" : ""} ${sessionDays.includes(day) ? "calendar-has-session" : ""}`}
          >
            {day || ""}
          </span>
        ))}
      </div>

      <div className="calendar-legend">
        <span>
          <i className="legend-dot today-dot" /> Today
        </span>
        <span>
          <i className="legend-dot session-dot" /> Session
        </span>
      </div>
    </motion.div>
  );
}
