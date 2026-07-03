import { motion } from "framer-motion";
import "./AchievementCard.css";

export default function AchievementCard({ emoji, title, desc, color }) {
  return (
    <motion.div
      className="achievement-card"
      style={{ "--ach-color": color }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.7 }}
      whileHover={{ y: -4 }}
    >
      <motion.span
        className="ach-emoji"
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        {emoji}
      </motion.span>
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </motion.div>
  );
}
