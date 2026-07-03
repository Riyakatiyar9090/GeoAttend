import { motion } from "framer-motion";
import "./AttendanceGoal.css";

export default function AttendanceGoal({
  current = 92,
  target = 90,
  totalClasses = 132,
}) {
  const within = current >= target;
  const needed = within
    ? 0
    : Math.ceil(
        (target * totalClasses - (current * totalClasses) / 100) /
          (100 - target),
      );
  const circumference = 2 * Math.PI * 48;

  return (
    <motion.div
      className="ag-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Attendance Goal</h3>

      <div className="ag-circle-wrapper">
        <svg width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r="48"
            stroke="rgba(15,23,42,0.07)"
            strokeWidth="9"
            fill="none"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="48"
            stroke={within ? "#10B981" : "#EF4444"}
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - (current / 100) * circumference,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            transform="rotate(-90 60 60)"
          />
          {/* Target marker */}
          <circle
            cx={60 + 48 * Math.cos((2 * Math.PI * target) / 100 - Math.PI / 2)}
            cy={60 + 48 * Math.sin((2 * Math.PI * target) / 100 - Math.PI / 2)}
            r="5"
            fill="#F59E0B"
          />
        </svg>
        <div className="ag-center">
          <strong className={within ? "ag-good" : "ag-bad"}>{current}%</strong>
          <span>current</span>
        </div>
      </div>

      <div className="ag-legend">
        <div>
          <span className="ag-dot ag-current-dot" />
          Current: <strong>{current}%</strong>
        </div>
        <div>
          <span className="ag-dot ag-target-dot" />
          Target: <strong>{target}%</strong>
        </div>
      </div>

      <div
        className={`ag-result ${within ? "ag-result-pass" : "ag-result-fail"}`}
      >
        {within ? (
          <>
            <span>🎉</span> Target achieved! You're above {target}%
          </>
        ) : (
          <>
            <span>⚠️</span> Attend <strong>{needed}</strong> more classes to
            reach {target}%
          </>
        )}
      </div>
    </motion.div>
  );
}
