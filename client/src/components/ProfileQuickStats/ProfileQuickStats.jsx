import { motion } from "framer-motion";
import useCountUp from "../../hooks/useCountUp";
import "./ProfileQuickStats.css";

const STATS = [
  { label: "Sessions Created", value: 48, color: "var(--primary)" },
  { label: "Classes Conducted", value: 156, color: "var(--success)" },
  { label: "Attendance Recorded", value: 7840, color: "var(--accent)" },
  { label: "Students Managed", value: 240, color: "var(--secondary)" },
];

function StatRow({ label, value, color, index }) {
  const { count, ref } = useCountUp(value, 1000);
  return (
    <motion.div
      className="pqs-row"
      ref={ref}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <span className="pqs-label">{label}</span>
      <strong style={{ color }}>{count.toLocaleString()}</strong>
    </motion.div>
  );
}

export default function ProfileQuickStats() {
  return (
    <motion.div
      className="pqs-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3>Quick Statistics</h3>
      <div className="pqs-list">
        {STATS.map((s, i) => (
          <StatRow key={s.label} {...s} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
