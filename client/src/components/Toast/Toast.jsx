import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";
import "./Toast.css";

const iconMap = {
  success: <FiCheckCircle />,
  info: <FiInfo />,
  warning: <FiAlertTriangle />,
};

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`toast-item toast-${t.type}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.3 }}
          >
            {iconMap[t.type]}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
