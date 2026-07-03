import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "../../pages/TeacherProfile/teacherProfileData";
import "./ProfileAchievements.css";

export default function ProfileAchievements() {
  return (
    <motion.div
      className="ach-section"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Achievements & Certificates</h2>
      <div className="ach-grid">
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div
            key={a.title}
            className="ach-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -5 }}
          >
            <span className="ach-emoji">{a.emoji}</span>
            <h4>{a.title}</h4>
            <p>{a.desc}</p>
            <span className="ach-year">{a.year}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
