import { motion } from "framer-motion";
import "./StatusBadge.css";

const config = {
  Live: { emoji: "🟢", className: "badge-live" },
  "Ending Soon": { emoji: "🟡", className: "badge-ending" },
  Upcoming: { emoji: "🔵", className: "badge-upcoming" },
  Completed: { emoji: "⚪", className: "badge-completed" },
};

export default function StatusBadge({ status }) {
  const { emoji, className } = config[status] || config.Upcoming;

  return (
    <span className={`status-badge-pill ${className}`}>
      {status === "Live" ? (
        <motion.span
          className="badge-dot"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.3, repeat: Infinity }}
        />
      ) : (
        <span className="badge-emoji">{emoji}</span>
      )}
      {status}
    </span>
  );
}
