import { motion } from "framer-motion";
import "./Button.css";

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
}) {
  return (
    <motion.button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.button>
  );
}
