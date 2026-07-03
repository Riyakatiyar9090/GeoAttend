import { motion } from "framer-motion";
import "./InsightsCards.css";

const INSIGHTS = [
  {
    emoji: "🏆",
    label: "Best Subject",
    value: "Data Structures",
    sub: "100% attendance",
    tone: "success",
  },
  {
    emoji: "⚠️",
    label: "Lowest Subject",
    value: "Computer Networks",
    sub: "70% attendance",
    tone: "danger",
  },
  {
    emoji: "📅",
    label: "Best Day",
    value: "Wednesday",
    sub: "96% avg attendance",
    tone: "primary",
  },
  {
    emoji: "😴",
    label: "Most Missed",
    value: "Friday",
    sub: "Avg drops by 14%",
    tone: "warning",
  },
  {
    emoji: "📈",
    label: "Improvement",
    value: "+4% this month",
    sub: "vs last month",
    tone: "accent",
  },
];

const toneColors = {
  success: "rgba(16,185,129,0.07)",
  danger: "rgba(239,68,68,0.07)",
  primary: "rgba(37,99,235,0.07)",
  warning: "rgba(245,158,11,0.07)",
  accent: "rgba(6,182,212,0.07)",
};
const toneText = {
  success: "var(--success)",
  danger: "var(--danger)",
  primary: "var(--primary)",
  warning: "var(--warning)",
  accent: "var(--accent)",
};

export default function InsightsCards() {
  return (
    <motion.div
      className="ic-section"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Personal Insights</h3>
      <div className="ic-grid">
        {INSIGHTS.map((ins, i) => (
          <motion.div
            key={ins.label}
            className="ic-card"
            style={{
              background: toneColors[ins.tone],
              borderColor: `${toneText[ins.tone]}30`,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <span className="ic-emoji">{ins.emoji}</span>
            <p className="ic-label">{ins.label}</p>
            <strong className="ic-value" style={{ color: toneText[ins.tone] }}>
              {ins.value}
            </strong>
            <span className="ic-sub">{ins.sub}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
