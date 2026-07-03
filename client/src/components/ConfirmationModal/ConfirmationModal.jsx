import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import Loader from "../Loader/Loader";
import "./ConfirmationModal.css";

export default function ConfirmationModal({
  open,
  onCancel,
  onConfirm,
  loading,
  title = "Start Attendance Session?",
  message = "Students will now be able to scan the QR code and mark attendance.",
  confirmLabel = "Start Now",
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="confirm-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="confirm-modal-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon">
              <FiAlertCircle />
            </div>
            <h3>{title}</h3>
            <p>{message}</p>

            <div className="confirm-actions">
              <button
                className="confirm-cancel-btn"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <motion.button
                className="confirm-start-btn"
                onClick={onConfirm}
                disabled={loading}
                whileHover={{ y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
              >
                {loading ? (
                  <>
                    <Loader /> Processing...
                  </>
                ) : (
                  confirmLabel
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
