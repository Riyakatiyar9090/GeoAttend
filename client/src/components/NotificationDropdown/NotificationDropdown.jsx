import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell } from "react-icons/fi";
import "./NotificationDropdown.css";

const notifications = [
  {
    id: 1,
    title: "Session started",
    text: "CS301 attendance session is now live.",
    time: "2m ago",
  },
  {
    id: 2,
    title: "Attendance recorded",
    text: "Your attendance for DBMS was verified.",
    time: "1h ago",
  },
  {
    id: 3,
    title: "New announcement",
    text: "Mid-sem schedule has been updated.",
    time: "3h ago",
  },
];

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notification-wrapper" ref={ref}>
      <motion.button
        className="icon-btn"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiBell />
        {notifications.length > 0 && (
          <span className="notif-badge">{notifications.length}</span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="notification-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            <div className="dropdown-header">
              <h4>Notifications</h4>
              <span>{notifications.length} new</span>
            </div>
            <div className="notification-list">
              {notifications.map((n) => (
                <div key={n.id} className="notification-item">
                  <span className="notif-dot" />
                  <div>
                    <p className="notif-title">{n.title}</p>
                    <p className="notif-text">{n.text}</p>
                    <span className="notif-time">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn">View All Notifications</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
