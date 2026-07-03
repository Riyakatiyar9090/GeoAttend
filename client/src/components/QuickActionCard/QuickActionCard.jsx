import { motion } from "framer-motion";
import "./QuickActionCard.css";

export default function QuickActionCard({
  icon,
  title,
  description,
  gradient,
  onClick,
  index,
}) {
  return (
    <motion.div
      className="quick-action-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
    >
      <div className="qa-icon" style={{ background: gradient }}>
        {icon}
      </div>
      <h4>{title}</h4>
      <p>{description}</p>
    </motion.div>
  );
}
