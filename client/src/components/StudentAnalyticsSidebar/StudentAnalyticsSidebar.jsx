import { motion } from "framer-motion";
import { FiCalendar, FiBell, FiTarget } from "react-icons/fi";
import "./StudentAnalyticsSidebar.css";

const todayClasses = [
  { subject: "DBMS", time: "10:00 AM", room: "Room 204", done: true },
  {
    subject: "Operating Systems",
    time: "11:00 AM",
    room: "Room 112",
    done: false,
  },
  { subject: "Web Dev Lab", time: "2:00 PM", room: "Lab 3", done: false },
];

const notifications = [
  { text: "Computer Networks attendance is at 70%", tone: "danger" },
  { text: "DBMS session starts in 30 minutes", tone: "primary" },
  { text: "You achieved a 10-day streak! 🔥", tone: "success" },
];

export default function StudentAnalyticsSidebar() {
  return (
    <div className="sas-sidebar">
      <motion.div
        className="sas-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>
          <FiCalendar /> Today's Classes
        </h3>
        <div className="sas-class-list">
          {todayClasses.map((c, i) => (
            <div
              key={i}
              className={`sas-class-row ${c.done ? "sas-done" : ""}`}
            >
              <span
                className={`sas-class-dot ${c.done ? "dot-done" : "dot-pending"}`}
              />
              <div>
                <strong>{c.subject}</strong>
                <span>
                  {c.time} · {c.room}
                </span>
              </div>
              {c.done && <span className="sas-done-badge">✓</span>}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="sas-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>
          <FiTarget /> Weekly Goal
        </h3>
        <p className="sas-goal-sub">Target: 90% this week</p>
        <div className="sas-goal-track">
          <motion.div
            className="sas-goal-fill"
            initial={{ width: 0 }}
            animate={{ width: "94%" }}
            transition={{ duration: 1, delay: 0.4 }}
          />
        </div>
        <div className="sas-goal-labels">
          <span>4/5 classes attended</span>
          <span className="sas-goal-pct">94%</span>
        </div>
        <p className="sas-goal-note">🎉 Goal exceeded!</p>
      </motion.div>

      <motion.div
        className="sas-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>
          <FiBell /> Recent Alerts
        </h3>
        <div className="sas-alerts">
          {notifications.map((n, i) => (
            <div key={i} className={`sas-alert sas-${n.tone}`}>
              {n.text}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="sas-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3>Quick Stats</h3>
        <div className="sas-quick-stats">
          {[
            { label: "This Week", value: "94%" },
            { label: "This Month", value: "92%" },
            { label: "Best Subject", value: "DSA" },
            { label: "Worst Subject", value: "Networks" },
          ].map((s) => (
            <div key={s.label} className="sas-quick-row">
              <span>{s.label}</span>
              <strong>{s.value}</strong>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
