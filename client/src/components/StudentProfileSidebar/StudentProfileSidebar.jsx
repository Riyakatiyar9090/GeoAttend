import { motion } from "framer-motion";
import useCountUp from "../../hooks/useCountUp";
import { ACHIEVEMENTS } from "../../pages/StudentProfile/studentProfileData";
import "./StudentProfileSidebar.css";

const QUICK_STATS = [
  { label: "Sessions Attended", value: 110, color: "var(--success)" },
  { label: "Sessions Missed", value: 14, color: "var(--danger)" },
  { label: "Current Streak", value: 10, color: "var(--primary)" },
  { label: "Rank in Class", value: 3, color: "var(--accent)" },
];

const UPCOMING = [
  { subject: "Software Engineering", time: "12:00 PM", room: "Room 301" },
  { subject: "Web Dev Lab", time: "2:00 PM", room: "Lab 3" },
];

function StatRow({ label, value, color, index }) {
  const { count, ref } = useCountUp(value, 1000);
  return (
    <motion.div
      className="spsb-stat-row"
      ref={ref}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <span>{label}</span>
      <strong style={{ color }}>{count}</strong>
    </motion.div>
  );
}

export default function StudentProfileSidebar() {
  return (
    <div className="spsb-sidebar">
      <motion.div
        className="spsb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Quick Stats</h3>
        <div className="spsb-stats-list">
          {QUICK_STATS.map((s, i) => (
            <StatRow key={s.label} {...s} index={i} />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="spsb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>Upcoming Classes</h3>
        <div className="spsb-upcoming-list">
          {UPCOMING.map((u, i) => (
            <div key={i} className="spsb-upcoming-row">
              <span className="spsb-upcoming-dot" />
              <div>
                <strong>{u.subject}</strong>
                <span>
                  {u.time} · {u.room}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="spsb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>Achievements</h3>
        <div className="spsb-achievements-list">
          {ACHIEVEMENTS.map((a, i) => (
            <div
              key={i}
              className={`spsb-achievement-row ${a.earned ? "ach-earned" : "ach-locked"}`}
            >
              <span>{a.earned ? a.emoji : "🔒"}</span>
              <div>
                <strong>{a.title}</strong>
                <span>{a.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
