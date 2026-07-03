import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import Loader from "../Loader/Loader";
import "./DeleteStudentModal.css";

export default function DeleteStudentModal({
  student,
  onClose,
  onConfirm,
  loading,
}) {
  return (
    <AnimatePresence>
      {student && (
        <motion.div
          className="dsm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="dsm-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dsm-icon">
              <FiAlertTriangle />
            </div>
            <h3>Delete Student?</h3>
            <p>
              You are about to permanently delete{" "}
              <strong>{student.name}</strong> ({student.roll}). This action
              cannot be undone.
            </p>
            <div className="dsm-actions">
              <button
                className="dsm-cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <motion.button
                className="dsm-delete-btn"
                onClick={() => onConfirm(student.id)}
                disabled={loading}
                whileHover={{ y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
              >
                {loading ? (
                  <>
                    <Loader /> Deleting...
                  </>
                ) : (
                  "Delete Student"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
