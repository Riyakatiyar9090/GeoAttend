import { motion } from "framer-motion";
import useCountUp from "../../hooks/useCountUp";
import ProgressCircle from "../ProgressCircle/ProgressCircle";
import "./StatsCard.css";

export default function StatsCard({
  type,
  icon,
  label,
  value,
  suffix = "",
  accent,
  index,
  live,
}) {
  const { count, ref } = useCountUp(
    typeof value === "number" ? value : 0,
    1200,
  );

  return (
    <motion.div
      className="stats-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
    >
      {type === "progress" ? (
        <ProgressCircle percentage={value} color="var(--success)" />
      ) : (
        <div className="stats-icon" style={{ background: accent }}>
          {icon}
        </div>
      )}

      <div className="stats-info" ref={ref}>
        {type === "live" ? (
          <h3 className="stats-value live-value">
            <motion.span
              className="live-dot"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            {value}
          </h3>
        ) : type === "progress" ? null : (
          <h3 className="stats-value">
            {count}
            {suffix}
          </h3>
        )}
        <p className="stats-label">{label}</p>
      </div>
    </motion.div>
  );
}
