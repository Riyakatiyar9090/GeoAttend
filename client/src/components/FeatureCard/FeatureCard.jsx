import { motion } from "framer-motion";
import "./FeatureCard.css";

export default function FeatureCard({ icon, title, description, index }) {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <motion.div
        className="feature-icon"
        whileHover={{ rotate: 8, scale: 1.1 }}
      >
        {icon}
      </motion.div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}
