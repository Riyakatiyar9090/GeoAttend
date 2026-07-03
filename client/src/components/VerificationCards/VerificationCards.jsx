import { motion } from "framer-motion";
import { FiGrid, FiMapPin, FiDatabase, FiMail } from "react-icons/fi";
import "./VerificationCards.css";

const CARDS = [
  {
    key: "qr",
    icon: <FiGrid />,
    label: "QR Code Verified",
    color: "var(--accent)",
  },
  {
    key: "location",
    icon: <FiMapPin />,
    label: "Location Verified",
    color: "var(--success)",
  },
  {
    key: "recorded",
    icon: <FiDatabase />,
    label: "Attendance Recorded",
    color: "var(--primary)",
  },
  {
    key: "confirmation",
    icon: <FiMail />,
    label: "Confirmation Generated",
    color: "var(--secondary)",
  },
];

export default function VerificationCards({ verification }) {
  return (
    <div className="verification-cards-grid">
      {CARDS.map((c, i) => {
        const v = verification[c.key];
        return (
          <motion.div
            key={c.key}
            className={`vc-item ${v.status ? "vc-done" : "vc-pending"}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div
              className="vc-icon"
              style={{ color: c.color, background: `${c.color}18` }}
            >
              {c.icon}
            </div>
            <div>
              <h4>{c.label}</h4>
              <span
                className={`vc-status ${v.status ? "vc-status-ok" : "vc-status-no"}`}
              >
                {v.status ? "✅ Verified" : "❌ Not Verified"}
              </span>
              <p className="vc-time">{v.time}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
