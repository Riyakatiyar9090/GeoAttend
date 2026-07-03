import { motion } from "framer-motion";
import { FiBell, FiMail, FiAlertTriangle, FiUserCheck } from "react-icons/fi";
import useCountUp from "../../hooks/useCountUp";
import "./NotificationStats.css";

function StatCard({ icon, label, value, gradient, index }) {
  const { count, ref } = useCountUp(value, 900);
  return (
    <motion.div
      className="ns-card"
      ref={ref}
      style={{ "--ns-grad": gradient }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="ns-icon">{icon}</div>
      <div>
        <h3>{count}</h3>
        <p>{label}</p>
      </div>
    </motion.div>
  );
}

export default function NotificationStats({ notifications }) {
  const total = notifications.length;
  const unread = notifications.filter((n) => !n.read).length;
  const attendance = notifications.filter(
    (n) => n.category === "Attendance",
  ).length;
  const students = notifications.filter(
    (n) => n.category === "Students",
  ).length;

  const cards = [
    {
      icon: <FiBell />,
      label: "Total Notifications",
      value: total,
      gradient: "linear-gradient(135deg,#2563EB,#4F46E5)",
    },
    {
      icon: <FiMail />,
      label: "Unread",
      value: unread,
      gradient: "linear-gradient(135deg,#EF4444,#F59E0B)",
    },
    {
      icon: <FiAlertTriangle />,
      label: "Attendance Alerts",
      value: attendance,
      gradient: "linear-gradient(135deg,#F59E0B,#10B981)",
    },
    {
      icon: <FiUserCheck />,
      label: "Student Requests",
      value: students,
      gradient: "linear-gradient(135deg,#10B981,#06B6D4)",
    },
  ];

  return (
    <div className="ns-grid">
      {cards.map((c, i) => (
        <StatCard key={c.label} {...c} index={i} />
      ))}
    </div>
  );
}
