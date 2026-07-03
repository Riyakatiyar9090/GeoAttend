import { AnimatePresence, motion } from "framer-motion";
import { FiBell, FiX } from "react-icons/fi";
import "./NotificationBanner.css";

export default function NotificationBanner({ show, message, onDismiss }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="notification-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
        >
          <span className="nb-icon">
            <FiBell />
          </span>
          <p>{message}</p>
          <button onClick={onDismiss}>
            <FiX />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
