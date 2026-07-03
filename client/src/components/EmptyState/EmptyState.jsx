import { motion } from "framer-motion";
import "./EmptyState.css";

export default function EmptyState({ title, subtitle, onRefresh }) {
  return (
    <motion.div
      className="empty-state-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="es-illustration">📋</div>
      <h3>{title || "No Attendance Records Found"}</h3>
      <p>
        {subtitle ||
          "Your attendance records will appear here after your first session."}
      </p>
      {onRefresh && (
        <button className="es-refresh-btn" onClick={onRefresh}>
          Refresh
        </button>
      )}
    </motion.div>
  );
}
