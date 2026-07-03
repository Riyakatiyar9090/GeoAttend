import { motion } from "framer-motion";
import "./StudentAchievements.css";

const BADGES = [
  {
    emoji: "💯",
    title: "100% Attendance",
    desc: "Perfect attendance in Data Structures",
    earned: true,
  },
  {
    emoji: "🔥",
    title: "10-Day Streak",
    desc: "Attended 10 consecutive classes",
    earned: true,
  },
  {
    emoji: "🏆",
    title: "Top Performer",
    desc: "Ranked #2 in attendance for June",
    earned: true,
  },
  {
    emoji: "⭐",
    title: "Perfect Week",
    desc: "All sessions attended this week",
    earned: true,
  },
  {
    emoji: "🎓",
    title: "Semester Excellence",
    desc: "Above 90% for entire semester",
    earned: false,
  },
];

export default function StudentAchievements() {
  return (
    <motion.div
      className="sa-section"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Achievements</h3>
      <div className="sa-badges-grid">
        {BADGES.map((b, i) => (
          <motion.div
            key={b.title}
            className={`sa-badge ${b.earned ? "sa-earned" : "sa-locked"}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: i * 0.08,
              type: "spring",
              stiffness: 220,
              damping: 18,
            }}
            whileHover={{ y: -4 }}
          >
            <span className="sa-badge-emoji">{b.earned ? b.emoji : "🔒"}</span>
            <h4>{b.title}</h4>
            <p>{b.desc}</p>
            {b.earned && <span className="sa-earned-chip">Earned ✓</span>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
