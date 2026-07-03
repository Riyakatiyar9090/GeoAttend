import { motion } from "framer-motion";
import {
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiPercent,
} from "react-icons/fi";
import useCountUp from "../../hooks/useCountUp";
import "./AttendanceReportStats.css";

function StatCard({ icon, label, value, suffix, gradient, index }) {
  const { count, ref } = useCountUp(value, 1100);
  return (
    <motion.div
      className="ars-card"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
    >
      <div className="ars-icon" style={{ background: gradient }}>
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

export default function AttendanceReportStats({ records }) {
  const total = records.length;
  const present = records.filter((r) => r.status === "Present").length;
  const absent = records.filter((r) => r.status === "Absent").length;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;
  const sessions = [...new Set(records.map((r) => r.session))].length;

  const cards = [
    {
      icon: <FiCalendar />,
      label: "Total Sessions",
      value: sessions,
      suffix: "",
      gradient: "linear-gradient(135deg,#2563EB,#4F46E5)",
    },
    {
      icon: <FiCheckCircle />,
      label: "Present Students",
      value: present,
      suffix: "",
      gradient: "linear-gradient(135deg,#10B981,#06B6D4)",
    },
    {
      icon: <FiXCircle />,
      label: "Absent Students",
      value: absent,
      suffix: "",
      gradient: "linear-gradient(135deg,#F59E0B,#EF4444)",
    },
    {
      icon: <FiPercent />,
      label: "Average Attendance",
      value: pct,
      suffix: "%",
      gradient: "linear-gradient(135deg,#4F46E5,#0F172A)",
    },
  ];

  return (
    <div className="ars-grid">
      {cards.map((c, i) => (
        <StatCard key={c.label} {...c} index={i} />
      ))}
    </div>
  );
}
