import { motion, AnimatePresence } from "framer-motion";
import SuccessAnimation from "../SuccessAnimation/SuccessAnimation";
import "./SuccessModal.css";

export default function SuccessModal({ open, message }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="success-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="success-modal-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <SuccessAnimation message={message} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
