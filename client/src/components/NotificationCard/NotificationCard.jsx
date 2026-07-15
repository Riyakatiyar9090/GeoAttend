import { motion } from "framer-motion";
import { FiCheck, FiTrash2, FiChevronRight } from "react-icons/fi";
import "./NotificationCard.css";

const categoryColors = {
  Attendance: { bg: "rgba(37,99,235,0.08)", color: "var(--primary)" },
  Sessions: { bg: "rgba(16,185,129,0.08)", color: "var(--success)" },
  Students: { bg: "rgba(6,182,212,0.08)", color: "var(--accent)" },
  Announcements: { bg: "rgba(245,158,11,0.08)", color: "var(--warning)" },
  System: { bg: "rgba(79,70,229,0.08)", color: "var(--secondary)" },
};

export default function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
  index,
}) {
  // ADD THESE 4 LINES
  if (!notification) {
    return null;
  }

  const cc = categoryColors[notification.category] || categoryColors.System;

  return (
    <motion.div
      className={`notification-card ${!notification.read ? "nc-unread" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -2 }}
      layout
    >
      {!notification.read && <span className="nc-unread-dot" />}

      <div className="nc-icon-col">
        <span className="nc-emoji">{notification.icon}</span>
      </div>

      <div className="nc-body">
        <div className="nc-title-row">
          <h4>{notification.title}</h4>
          <span
            className="nc-badge"
            style={{ background: cc.bg, color: cc.color }}
          >
            {notification.category}
          </span>
        </div>
        <p className="nc-desc">{notification.desc}</p>
        <div className="nc-footer">
          <span className="nc-time">{notification.time}</span>
          <span className="nc-date">{notification.date}</span>
        </div>
      </div>

      <div className="nc-actions">
        {!notification.read && (
          <button
            className="nc-act-btn nc-read-btn"
            title="Mark as read"
            onClick={() => onMarkRead(notification.id)}
          >
            <FiCheck />
          </button>
        )}
        <button
          className="nc-act-btn nc-delete-btn"
          title="Delete"
          onClick={() => onDelete(notification.id)}
        >
          <FiTrash2 />
        </button>
        <button className="nc-act-btn nc-view-btn" title="View Details">
          <FiChevronRight />
        </button>
      </div>
    </motion.div>
  );
}
