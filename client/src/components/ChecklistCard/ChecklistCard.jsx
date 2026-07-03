import { motion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";
import "./ChecklistCard.css";

export default function ChecklistCard({ session }) {
  const checks = [
    { label: "Subject Selected", passed: !!session.subject },
    { label: "Date Selected", passed: !!session.date },
    { label: "Time Valid", passed: !!session.startTime && !!session.endTime },
    { label: "Location Available", passed: !!session.location?.latitude },
    { label: "Radius Configured", passed: !!session.radius },
  ];

  const allPassed = checks.every((c) => c.passed);

  return (
    <motion.div
      className="checklist-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3>Pre-Flight Checklist</h3>

      <div className="checklist-items">
        {checks.map((c, i) => (
          <motion.div
            key={c.label}
            className="checklist-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.06 }}
          >
            <span
              className={`check-icon ${c.passed ? "check-pass" : "check-fail"}`}
            >
              {c.passed ? <FiCheck /> : <FiX />}
            </span>
            {c.label}
          </motion.div>
        ))}
      </div>

      <div
        className={`checklist-status ${allPassed ? "status-ready" : "status-pending"}`}
      >
        <span
          className={`check-icon ${allPassed ? "check-pass" : "check-fail"}`}
        >
          {allPassed ? <FiCheck /> : <FiX />}
        </span>
        Ready to Start
      </div>
    </motion.div>
  );
}
