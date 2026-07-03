import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import "./RoleCard.css";

export default function RoleCard({
  icon,
  role,
  points,
  buttonLabel,
  variant,
  onClick,
  index,
}) {
  return (
    <motion.div
      className={`role-card role-${variant}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <div className="role-card-glow" />

      <motion.div className="role-icon" whileHover={{ rotate: 8, scale: 1.1 }}>
        {icon}
      </motion.div>

      <h3>{role}</h3>

      <ul className="role-points">
        {points.map((point) => (
          <li key={point}>
            <span className="point-dot" />
            {point}
          </li>
        ))}
      </ul>

      <motion.button
        className={`role-btn role-btn-${variant}`}
        onClick={onClick}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
      >
        {buttonLabel}
        <FiArrowRight className="btn-arrow" />
      </motion.button>
    </motion.div>
  );
}
