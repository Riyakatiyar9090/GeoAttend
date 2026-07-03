import { motion } from "framer-motion";
import useCountUp from "../../hooks/useCountUp";
import "./ProgressCircle.css";

export default function ProgressCircle({
  percentage,
  size = 90,
  strokeWidth = 8,
  color = "var(--success)",
  label,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const { count, ref } = useCountUp(percentage, 1200);

  return (
    <div
      className="progress-circle-wrapper"
      ref={ref}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="progress-circle-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(15,23,42,0.06)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (count / 100) * circumference,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="progress-circle-text">
        <span className="progress-value">{count}%</span>
        {label && <span className="progress-label">{label}</span>}
      </div>
    </div>
  );
}
