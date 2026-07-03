import { motion } from "framer-motion";
import "./SuccessAnimation.css";

export default function SuccessAnimation({
  message = "Verified Successfully",
}) {
  return (
    <motion.div
      className="success-animation"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="success-circle"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <motion.svg viewBox="0 0 52 52" className="success-check">
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M14 27l7 7 16-16"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          />
        </motion.svg>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
}
