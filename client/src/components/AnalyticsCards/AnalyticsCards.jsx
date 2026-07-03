import { motion } from "framer-motion";
import {
  FiPercent,
  FiSun,
  FiCalendar,
  FiTrendingUp,
  FiActivity,
  FiAlertTriangle,
} from "react-icons/fi";
import useCountUp from "../../hooks/useCountUp";
import "./AnalyticsCards.css";

const CARDS = [
  {
    icon: <FiPercent />,
    label: "Overall Attendance",
    value: 91,
    suffix: "%",
    gradient: "linear-gradient(135deg,#2563EB,#4F46E5)",
    spark: [80, 85, 88, 91],
  },
  {
    icon: <FiSun />,
    label: "Today's Attendance",
    value: 94,
    suffix: "%",
    gradient: "linear-gradient(135deg,#10B981,#06B6D4)",
    spark: [88, 90, 92, 94],
  },
  {
    icon: <FiCalendar />,
    label: "Weekly Attendance",
    value: 89,
    suffix: "%",
    gradient: "linear-gradient(135deg,#F59E0B,#EF4444)",
    spark: [82, 86, 88, 89],
  },
  {
    icon: <FiTrendingUp />,
    label: "Monthly Attendance",
    value: 87,
    suffix: "%",
    gradient: "linear-gradient(135deg,#4F46E5,#06B6D4)",
    spark: [78, 82, 85, 87],
  },
  {
    icon: <FiActivity />,
    label: "Active Sessions",
    value: 3,
    suffix: "",
    gradient: "linear-gradient(135deg,#0F172A,#2563EB)",
    spark: [1, 2, 2, 3],
  },
  {
    icon: <FiAlertTriangle />,
    label: "Students At Risk",
    value: 4,
    suffix: "",
    gradient: "linear-gradient(135deg,#EF4444,#F59E0B)",
    spark: [6, 5, 5, 4],
  },
];

function Sparkline({ data }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 60;
      const y = 20 - ((v - min) / (max - min || 1)) * 16;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="60" height="24" className="sparkline-svg">
      <polyline
        points={pts}
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnalyticsCard({ icon, label, value, suffix, gradient, spark, index }) {
  const { count, ref } = useCountUp(value, 1000);
  return (
    <motion.div
      className="analytics-card-item"
      ref={ref}
      style={{ "--card-gradient": gradient }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="aci-top">
        <span className="aci-icon">{icon}</span>
        <Sparkline data={spark} />
      </div>
      <h3>
        {count}
        {suffix}
      </h3>
      <p>{label}</p>
    </motion.div>
  );
}

export default function AnalyticsCards() {
  return (
    <div className="analytics-cards-grid">
      {CARDS.map((c, i) => (
        <AnalyticsCard key={c.label} {...c} index={i} />
      ))}
    </div>
  );
}
