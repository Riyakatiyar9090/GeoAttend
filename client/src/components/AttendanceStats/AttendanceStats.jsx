import { motion } from "framer-motion";
import { FiCheckSquare, FiPercent, FiXSquare, FiZap } from "react-icons/fi";
import useCountUp from "../../hooks/useCountUp";
import "./AttendanceStats.css";

function StatCard({ icon, label, value, suffix, accent, index }) {
  const { count, ref } = useCountUp(value, 1100);
  return (
    <motion.div
      className="ah-stat-card"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -5 }}
    >
      <div className="ah-stat-icon" style={{ background: accent }}>
        {icon}
      </div>
      <div>
        <h3>
          {count}
          {suffix}
        </h3>
        <p>{label}</p>
      </div>
    </motion.div>
  );
}

export default function AttendanceStats({ records }) {
  const total = records.length;
  const present = records.filter((r) => r.status === "Present").length;
  const absent = records.filter((r) => r.status === "Absent").length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;

  // Calculate streak (consecutive present days from most recent)
  const sorted = [...records].sort((a, b) => b.rawDate - a.rawDate);
  let streak = 0;
  for (const r of sorted) {
    if (r.status === "Present") streak++;
    else break;
  }

  const cards = [
    {
      icon: <FiCheckSquare />,
      label: "Present Classes",
      value: present,
      suffix: "",
      accent: "linear-gradient(135deg,#10B981,#06B6D4)",
    },
    {
      icon: <FiPercent />,
      label: "Attendance %",
      value: pct,
      suffix: "%",
      accent: "var(--gradient-primary)",
    },
    {
      icon: <FiXSquare />,
      label: "Classes Missed",
      value: absent,
      suffix: "",
      accent: "linear-gradient(135deg,#F59E0B,#EF4444)",
    },
    {
      icon: <FiZap />,
      label: "Current Streak",
      value: streak,
      suffix: " days",
      accent: "linear-gradient(135deg,#4F46E5,#2563EB)",
    },
  ];

  return (
    <div className="ah-stats-grid">
      {cards.map((c, i) => (
        <StatCard key={c.label} {...c} index={i} />
      ))}
    </div>
  );
}
