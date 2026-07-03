import { motion } from "framer-motion";
import "./AnimatedBackground.css";

export default function AnimatedBackground() {
  return (
    <div className="animated-bg">
      <motion.div
        className="blob blob-1"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="blob blob-2"
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grid-pattern" />
      <div className="glow" />
    </div>
  );
}
