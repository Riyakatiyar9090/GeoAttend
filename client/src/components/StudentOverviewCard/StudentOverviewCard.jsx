import { motion } from "framer-motion";
import "./StudentOverviewCard.css";

export default function StudentOverviewCard({ stats }) {
  return (
    <motion.div
      className="student-overview-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3>Student Overview</h3>
      <div className="overview-grid">
        {stats.map((s, i) => (
          <div key={i} className="overview-mini-card">
            <span className="overview-label">{s.label}</span>
            <strong className={`overview-value overview-${s.tone}`}>
              {s.value}
            </strong>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
