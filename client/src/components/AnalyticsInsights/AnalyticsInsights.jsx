import { motion } from "framer-motion";
import { INSIGHTS } from "../../pages/TeacherAnalytics/analyticsData";
import "./AnalyticsInsights.css";

const toneStyles = {
  success: "insight-success",
  primary: "insight-primary",
  warning: "insight-warning",
  danger: "insight-danger",
};

export default function AnalyticsInsights() {
  return (
    <motion.div
      className="analytics-insights-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>AI-Style Insights</h3>
      <p className="ai-subtitle">
        Automatically generated from your attendance data.
      </p>
      <div className="ai-insights-list">
        {INSIGHTS.map((ins, i) => (
          <motion.div
            key={i}
            className={`ai-insight-row ${toneStyles[ins.tone]}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <span className="ai-emoji">{ins.emoji}</span>
            <p>{ins.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
