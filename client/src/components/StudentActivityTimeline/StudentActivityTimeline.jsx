import { motion } from "framer-motion";
import { ACTIVITY_TIMELINE } from "../../pages/StudentProfile/studentProfileData";
import "./StudentActivityTimeline.css";

export default function StudentActivityTimeline() {
  return (
    <motion.div
      className="sat-tl-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Activity Timeline</h3>
      <div className="sat-tl-list">
        {ACTIVITY_TIMELINE.map((a, i) => (
          <motion.div
            key={i}
            className="sat-tl-row"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <span className="sat-tl-emoji">{a.icon}</span>
            <div className="sat-tl-content">
              <p>{a.text}</p>
              <span>
                {a.date} · {a.time}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
