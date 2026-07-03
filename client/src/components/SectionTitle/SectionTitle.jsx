import { motion } from "framer-motion";
import "./SectionTitle.css";

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  light = false,
}) {
  return (
    <motion.div
      className={`section-title ${light ? "light" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </motion.div>
  );
}
