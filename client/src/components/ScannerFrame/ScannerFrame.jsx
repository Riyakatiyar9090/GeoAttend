import { motion } from "framer-motion";
import "./ScannerFrame.css";

export default function ScannerFrame({ active }) {
  return (
    <div className="scanner-frame-wrapper">
      {/* Corner highlights */}
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />

      {/* Animated scan line */}
      {active && (
        <motion.div
          className="scan-line"
          initial={{ top: "4%" }}
          animate={{ top: ["4%", "94%", "4%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Pulsing overlay glow */}
      {active && (
        <motion.div
          className="scan-glow"
          animate={{ opacity: [0.18, 0.32, 0.18] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
