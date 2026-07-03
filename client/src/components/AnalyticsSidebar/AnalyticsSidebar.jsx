import { motion } from "framer-motion";
import { FiClock, FiBell, FiTarget } from "react-icons/fi";
import { UPCOMING_SESSIONS } from "../../pages/TeacherAnalytics/analyticsData";
import QuickActions from "../QuickActions/QuickActions";
import "./AnalyticsSidebar.css";

export default function AnalyticsSidebar() {
  return (
    <div className="analytics-sidebar">
      {/* Upcoming Sessions */}
      <motion.div
        className="sidebar-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>
          <FiClock /> Upcoming Sessions
        </h3>
        <div className="upcoming-list">
          {UPCOMING_SESSIONS.map((s, i) => (
            <div key={i} className="upcoming-item">
              <span className="up-dot" />
              <div>
                <strong>{s.subject}</strong>
                <span>
                  {s.className} · {s.room}
                </span>
                <span className="up-time">{s.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Attendance Goal */}
      <motion.div
        className="sidebar-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>
          <FiTarget /> Attendance Goal
        </h3>
        <p className="goal-subtitle">Target: 90% department-wide</p>
        <div className="goal-bar-track">
          <motion.div
            className="goal-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: "91%" }}
            transition={{ duration: 1, delay: 0.4 }}
          />
        </div>
        <div className="goal-labels">
          <span>91% achieved</span>
          <span>Target: 90%</span>
        </div>
        <p className="goal-note">🎉 Goal exceeded this month!</p>
      </motion.div>

      {/* Notifications */}
      <motion.div
        className="sidebar-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3>
          <FiBell /> Recent Notifications
        </h3>
        <div className="notif-list">
          {[
            { text: "CSE-A attendance session completed", time: "5m ago" },
            { text: "4 students below 75% threshold", time: "1h ago" },
            { text: "Weekly report auto-generated", time: "3h ago" },
          ].map((n, i) => (
            <div key={i} className="notif-item">
              <span className="notif-dot" />
              <div>
                <p>{n.text}</p>
                <span>{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <QuickActions />
    </div>
  );
}
