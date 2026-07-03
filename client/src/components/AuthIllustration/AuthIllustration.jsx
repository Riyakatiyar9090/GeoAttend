import { motion } from "framer-motion";
import { FiMapPin } from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";
import "./AuthIllustration.css";

const features = [
  { icon: <BsQrCode />, label: "Instant QR Sessions" },
  { icon: <FiMapPin />, label: "Geo-Verified Check-ins" },
];

export default function AuthIllustration() {
  return (
    <div className="auth-illustration">
      <div className="illustration-blobs">
        <div className="ib-blob ib-blob-1" />
        <div className="ib-blob ib-blob-2" />
      </div>

      <motion.div
        className="brand-block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>
          Geo<span>Attend</span>
        </h2>
        <p>Attendance, verified by location — not trust.</p>
      </motion.div>

      <motion.div
        className="qr-visual"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="qr-box">
          <BsQrCode size={64} />
        </div>
        <motion.div
          className="pin-pulse"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FiMapPin />
        </motion.div>
      </motion.div>

      <div className="mini-feature-list">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            className="mini-feature-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
          >
            <span className="mf-icon">{f.icon}</span>
            {f.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
