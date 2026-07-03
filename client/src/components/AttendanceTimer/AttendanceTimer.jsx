import { motion } from "framer-motion";
import "./AttendanceTimer.css";

export default function AttendanceTimer({ elapsedSeconds, totalSeconds }) {
  const format = (s) => {
    const h = Math.floor(s / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const remaining = Math.max(totalSeconds - elapsedSeconds, 0);
  const progress = Math.min((elapsedSeconds / totalSeconds) * 100, 100);
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="attendance-timer-card">
      <div className="timer-circle-wrapper">
        <svg width="130" height="130">
          <circle
            cx="65"
            cy="65"
            r="54"
            stroke="rgba(15,23,42,0.06)"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="65"
            cy="65"
            r="54"
            stroke="#2563EB"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset:
                circumference - (progress / 100) * circumference,
            }}
            transition={{ duration: 1, ease: "linear" }}
            transform="rotate(-90 65 65)"
          />
        </svg>
        <div className="timer-circle-text">
          <span>{format(elapsedSeconds)}</span>
          <small>elapsed</small>
        </div>
      </div>

      <div className="timer-meta">
        <div>
          <span>Session Started</span>
          <strong>{format(elapsedSeconds)} ago</strong>
        </div>
        <div>
          <span>Time Remaining</span>
          <strong>{format(remaining)}</strong>
        </div>
      </div>
    </div>
  );
}
