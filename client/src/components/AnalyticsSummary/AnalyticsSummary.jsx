import { motion } from "framer-motion";
import {
  FiPercent,
  FiCheckSquare,
  FiXSquare,
  FiZap,
  FiTrendingUp,
  FiAlertTriangle,
} from "react-icons/fi";
import useCountUp from "../../hooks/useCountUp";
import "./AnalyticsSummary.css";

const CARDS = [
  {
    icon: <FiPercent />,
    label: "Overall Attendance",
    value: 92,
    suffix: "%",
    gradient: "linear-gradient(135deg,#2563EB,#4F46E5)",
    spark: [78, 82, 85, 88, 91, 92],
  },
  {
    icon: <FiCheckSquare />,
    label: "Classes Attended",
    value: 110,
    suffix: "",
    gradient: "linear-gradient(135deg,#10B981,#06B6D4)",
    spark: [88, 94, 102, 108, 110, 110],
  },
  {
    icon: <FiXSquare />,
    label: "Classes Missed",
    value: 14,
    suffix: "",
    gradient: "linear-gradient(135deg,#F59E0B,#EF4444)",
    spark: [14, 12, 10, 9, 8, 14],
  },
  {
    icon: <FiZap />,
    label: "Current Streak",
    value: 10,
    suffix: " days",
    gradient: "linear-gradient(135deg,#4F46E5,#2563EB)",
    spark: [4, 6, 8, 10, 10, 10],
  },
  {
    icon: <FiTrendingUp />,
    label: "Longest Streak",
    value: 14,
    suffix: " days",
    gradient: "linear-gradient(135deg,#06B6D4,#10B981)",
    spark: [10, 10, 12, 12, 14, 14],
  },
  {
    icon: <FiAlertTriangle />,
    label: "Below 75%",
    value: 1,
    suffix: " subject",
    gradient: "linear-gradient(135deg,#EF4444,#F59E0B)",
    spark: [3, 2, 2, 1, 1, 1],
  },
];

function Spark({ data }) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 56;
      const y = 18 - ((v - min) / (max - min || 1)) * 14;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width="56" height="22">
      <polyline
        points={pts}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SummaryCard({ icon, label, value, suffix, gradient, spark, index }) {
  const { count, ref } = useCountUp(value, 1000);
  return (
    <motion.div
      className="as-card"
      ref={ref}
      style={{ "--as-grad": gradient }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="as-card-top">
        <span className="as-icon">{icon}</span>
        <Spark data={spark} />
      </div>
      <h3>
        {count}
        {suffix}
      </h3>
      <p>{label}</p>
    </motion.div>
  );
}

export default function AnalyticsSummary() {
  return (
    <div className="as-grid">
      {CARDS.map((c, i) => (
        <SummaryCard key={c.label} {...c} index={i} />
      ))}
    </div>
  );
}
