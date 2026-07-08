import { motion } from "framer-motion";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiShield,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import "./AccountInfo.css";

export default function AccountInfo({ student }) {
  const rows = [
    { icon: <FiUser />, label: "Username", value: student.username },
    {
      icon: <FiCalendar />,
      label: "Registration Date",
      value: student.registrationDate,
    },
    { icon: <FiClock />, label: "Last Login", value: student.lastLogin },
    {
      icon: <FiShield />,
      label: "Account Status",
      value: student.accountStatus,
      good: true,
    },
    {
      icon: <FiMail />,
      label: "Email Verified",
      value: student.emailVerified ? "✅ Verified" : "❌ Not Verified",
      good: student.emailVerified,
    },
    {
      icon: <FiPhone />,
      label: "Phone Verified",
      value: student.phoneVerified ? "✅ Verified" : "❌ Not Verified",
      good: student.phoneVerified,
    },
  ];

  return (
    <motion.div
      className="aci-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3>Account Information</h3>
      <div className="aci-rows">
        {rows.map((r) => (
          <div key={r.label} className="aci-row">
            <span className="aci-icon">{r.icon}</span>
            <span className="aci-label">{r.label}</span>
            <span className={`aci-value ${r.good ? "aci-good" : ""}`}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
