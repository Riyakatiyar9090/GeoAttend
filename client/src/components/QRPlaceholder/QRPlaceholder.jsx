import { motion } from "framer-motion";
import { BsQrCode } from "react-icons/bs";
import "./QRPlaceholder.css";

export default function QRPlaceholder() {
  return (
    <motion.div
      className="qr-placeholder-large"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <motion.div
        className="qr-icon-frame"
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <BsQrCode size={56} />
      </motion.div>
      <p className="qr-placeholder-text">
        QR Code will be generated after clicking <strong>Start Session</strong>
      </p>
    </motion.div>
  );
}
