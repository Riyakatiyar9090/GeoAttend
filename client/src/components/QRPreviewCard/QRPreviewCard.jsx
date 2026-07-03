import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { FiClock } from "react-icons/fi";
import "./QRPreviewCard.css";

export default function QRPreviewCard({
  qrCodeId,
  sessionId,
  generatedAt,
  expiresAt,
}) {
  return (
    <motion.div
      className="qr-preview-record-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3>QR Code Used</h3>
      <div className="qrp-inner">
        <div className="qrp-canvas-wrapper">
          <QRCodeCanvas
            value={`${sessionId}-${qrCodeId}`}
            size={120}
            level="H"
            fgColor="#0F172A"
            bgColor="#FFFFFF"
          />
        </div>
        <div className="qrp-meta">
          <div>
            <span>QR ID</span>
            <code>{qrCodeId}</code>
          </div>
          <div>
            <span>
              <FiClock /> Generated
            </span>
            <strong>{generatedAt}</strong>
          </div>
          <div>
            <span>
              <FiClock /> Expired
            </span>
            <strong>{expiresAt}</strong>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
