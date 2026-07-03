import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import {
  FiDownload,
  FiRefreshCw,
  FiMaximize2,
  FiLink,
  FiCheck,
} from "react-icons/fi";
import "./QRCodeCard.css";

const QR_REFRESH_SECONDS = 60;

export default function QRCodeCard({ sessionLink, onRefresh }) {
  const [secondsLeft, setSecondsLeft] = useState(QR_REFRESH_SECONDS);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrValue, setQrValue] = useState(`${sessionLink}&t=${Date.now()}`);

  useEffect(() => {
    if (secondsLeft <= 0) {
      const newValue = `${sessionLink}&t=${Date.now()}`;
      setQrValue(newValue);
      setSecondsLeft(QR_REFRESH_SECONDS);
      onRefresh?.();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, sessionLink, onRefresh]);

  const handleManualRefresh = useCallback(() => {
    setQrValue(`${sessionLink}&t=${Date.now()}`);
    setSecondsLeft(QR_REFRESH_SECONDS);
    onRefresh?.();
  }, [sessionLink, onRefresh]);

  const handleDownload = () => {
    const canvas = document.getElementById("geoattend-qr-canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "geoattend-session-qr.png";
    link.click();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(sessionLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <motion.div
      className="qr-code-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="qr-card-header">
        <h3>Session QR Code</h3>
        <span className="qr-expiry">Refreshes in {secondsLeft}s</span>
      </div>

      <motion.div
        className="qr-canvas-wrapper"
        key={qrValue}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        onClick={() => setFullscreen(true)}
      >
        <QRCodeCanvas
          id="geoattend-qr-canvas"
          value={qrValue}
          size={200}
          level="H"
          fgColor="#0F172A"
          bgColor="#FFFFFF"
        />
      </motion.div>

      <div className="qr-progress-track">
        <motion.div
          className="qr-progress-fill"
          animate={{ width: `${(secondsLeft / QR_REFRESH_SECONDS) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </div>

      <div className="qr-actions">
        <button onClick={handleDownload}>
          <FiDownload /> Download
        </button>
        <button onClick={handleManualRefresh}>
          <FiRefreshCw /> Refresh
        </button>
        <button onClick={() => setFullscreen(true)}>
          <FiMaximize2 /> Fullscreen
        </button>
        <button onClick={handleCopyLink}>
          {copied ? <FiCheck /> : <FiLink />} {copied ? "Copied" : "Copy Link"}
        </button>
      </div>

      {fullscreen && (
        <motion.div
          className="qr-fullscreen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setFullscreen(false)}
        >
          <motion.div
            className="qr-fullscreen-canvas"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <QRCodeCanvas
              value={qrValue}
              size={360}
              level="H"
              fgColor="#0F172A"
              bgColor="#FFFFFF"
            />
            <p>Tap anywhere to close</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
