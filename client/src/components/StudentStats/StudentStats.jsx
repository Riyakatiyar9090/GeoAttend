import { motion } from "framer-motion";
import {
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiPercent,
  FiAlertTriangle,
  FiUserPlus,
} from "react-icons/fi";
import useCountUp from "../../hooks/useCountUp";
import "./StudentStats.css";

function StatCard({ icon, label, value, suffix, gradient, index }) {
  const { count, ref } = useCountUp(value, 1000);
  return (
    <motion.div
      className="ss-card"
      ref={ref}
      style={{ "--grad": gradient }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="ss-icon">{icon}</div>
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

export default function StudentStats({ students }) {
  const total = students.length;
  const active = students.filter((s) => s.status === "Active").length;
  const inactive = students.filter((s) => s.status !== "Active").length;
  const avg = Math.round(
    students.reduce((a, s) => a + s.attendance, 0) / total,
  );
  const atRisk = students.filter((s) => s.attendance < 75).length;
  const newReg = students.filter(
    (s) => new Date(s.joinDate) > new Date(2026, 4, 1),
  ).length;

  const cards = [
    {
      icon: <FiUsers />,
      label: "Total Students",
      value: total,
      suffix: "",
      gradient: "linear-gradient(135deg,#2563EB,#4F46E5)",
    },
    {
      icon: <FiCheckCircle />,
      label: "Active Students",
      value: active,
      suffix: "",
      gradient: "linear-gradient(135deg,#10B981,#06B6D4)",
    },
    {
      icon: <FiXCircle />,
      label: "Inactive/Blocked",
      value: inactive,
      suffix: "",
      gradient: "linear-gradient(135deg,#F59E0B,#EF4444)",
    },
    {
      icon: <FiPercent />,
      label: "Average Attendance",
      value: avg,
      suffix: "%",
      gradient: "linear-gradient(135deg,#4F46E5,#06B6D4)",
    },
    {
      icon: <FiAlertTriangle />,
      label: "Below 75%",
      value: atRisk,
      suffix: "",
      gradient: "linear-gradient(135deg,#EF4444,#F59E0B)",
    },
    {
      icon: <FiUserPlus />,
      label: "New Registrations",
      value: newReg,
      suffix: "",
      gradient: "linear-gradient(135deg,#0F172A,#2563EB)",
    },
  ];

  return (
    <div className="ss-grid">
      {cards.map((c, i) => (
        <StatCard key={c.label} {...c} index={i} />
      ))}
    </div>
  );
}
