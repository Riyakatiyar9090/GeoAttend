import { motion } from "framer-motion";
import { FiCheckSquare, FiXSquare, FiZap, FiTrendingUp } from "react-icons/fi";
import ProgressCircle from "../ProgressCircle/ProgressCircle";
import useCountUp from "../../hooks/useCountUp";
import "./AttendanceSummaryCard.css";

function StatItem({ icon, label, value, suffix, color, index }) {
  const { count, ref } = useCountUp(value, 1000);
  return (
    <motion.div
      className="asc-stat"
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -3 }}
    >
      <span
        className="asc-stat-icon"
        style={{ color, background: `${color}18` }}
      >
        {icon}
      </span>
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

export default function AttendanceSummaryCard({ student }) {
  return (
    <motion.div
      className="asc-wrapper"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <h3>Attendance Summary</h3>
      <div className="asc-inner">
        <div className="asc-circle-col">
          <ProgressCircle
            percentage={student.attendance}
            size={110}
            strokeWidth={9}
            color="var(--success)"
            label="Overall"
          />
        </div>
        <div className="asc-stats-grid">
          <StatItem
            icon={<FiCheckSquare />}
            label="Classes Attended"
            value={student.attended}
            suffix=""
            color="var(--success)"
            index={0}
          />
          <StatItem
            icon={<FiXSquare />}
            label="Classes Missed"
            value={student.missed}
            suffix=""
            color="var(--danger)"
            index={1}
          />
          <StatItem
            icon={<FiZap />}
            label="Current Streak"
            value={student.streak}
            suffix=" days"
            color="var(--primary)"
            index={2}
          />
          <StatItem
            icon={<FiTrendingUp />}
            label="Longest Streak"
            value={student.longestStreak}
            suffix=" days"
            color="var(--accent)"
            index={3}
          />
        </div>
      </div>
    </motion.div>
  );
}
