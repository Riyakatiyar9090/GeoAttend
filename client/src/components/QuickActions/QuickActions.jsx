import { motion } from "framer-motion";
import { FiFileText, FiDownload, FiMail, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./QuickActions.css";

const ACTIONS = [
  {
    icon: <FiFileText />,
    label: "Generate Report",
    gradient: "var(--gradient-primary)",
    action: "generate",
  },
  {
    icon: <FiDownload />,
    label: "Export Excel",
    gradient: "linear-gradient(135deg,#10B981,#06B6D4)",
    action: "excel",
  },
  {
    icon: <FiDownload />,
    label: "Export PDF",
    gradient: "linear-gradient(135deg,#F59E0B,#EF4444)",
    action: "pdf",
  },
  {
    icon: <FiMail />,
    label: "Notify Students",
    gradient: "linear-gradient(135deg,#4F46E5,#2563EB)",
    action: "notify",
  },
  {
    icon: <FiEye />,
    label: "View Report",
    gradient: "linear-gradient(135deg,#0F172A,#2563EB)",
    action: "report",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (action === "report") navigate("/teacher/attendance");
    else alert(`${action} — backend integration pending.`);
  };

  return (
    <motion.div
      className="quick-actions-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Quick Actions</h3>
      <div className="qa-list">
        {ACTIONS.map((a, i) => (
          <motion.button
            key={a.label}
            className="qa-btn"
            onClick={() => handleAction(a.action)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="qa-btn-icon" style={{ background: a.gradient }}>
              {a.icon}
            </span>
            {a.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
