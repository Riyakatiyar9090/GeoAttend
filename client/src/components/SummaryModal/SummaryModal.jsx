import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiDownload, FiFileText, FiCheck } from "react-icons/fi";
import "./SummaryModal.css";

export default function SummaryModal({ open, summary }) {
  const navigate = useNavigate();
  const percentage = Math.round((summary.present / summary.total) * 100) || 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="summary-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="summary-modal-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <h3>Session Closed</h3>
            <p className="summary-modal-subtitle">
              Here's how today's session went.
            </p>

            <div className="summary-stats-grid">
              <div className="summary-stat present">
                <strong>{summary.present}</strong>
                <span>Present</span>
              </div>
              <div className="summary-stat absent">
                <strong>{summary.absent}</strong>
                <span>Absent</span>
              </div>
              <div className="summary-stat late">
                <strong>{summary.late}</strong>
                <span>Late</span>
              </div>
              <div className="summary-stat pct">
                <strong>{percentage}%</strong>
                <span>Attendance</span>
              </div>
            </div>

            <div className="summary-modal-actions">
              <button className="summary-export-btn">
                <FiDownload /> Export
              </button>
              <button
                className="summary-report-btn"
                onClick={() => navigate("/teacher/attendance")}
              >
                <FiFileText /> View Report
              </button>
              <button
                className="summary-finish-btn"
                onClick={() => navigate("/teacher")}
              >
                <FiCheck /> Finish Session
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
