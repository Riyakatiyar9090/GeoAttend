import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertTriangle,
  FiLogOut,
  FiTrash2,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import Loader from "../Loader/Loader";
import "./DangerZone.css";

function ConfirmModal({
  title,
  message,
  onConfirm,
  onClose,
  loading,
  confirmLabel = "Confirm",
  dangerColor = true,
}) {
  return (
    <AnimatePresence>
      <motion.div
        className="dz-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="dz-modal-card"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="dz-modal-close" onClick={onClose}>
            <FiX />
          </button>
          <div className="dz-modal-icon">
            <FiAlertTriangle />
          </div>
          <h3>{title}</h3>
          <p>{message}</p>
          <div className="dz-modal-actions">
            <button
              className="dz-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className={`dz-confirm-btn ${dangerColor ? "dz-danger" : "dz-warning"}`}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader /> Processing...
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function DangerZone() {
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 900));
    setLoading(false);
    setModal(null);
    alert(`${modal} — backend pending`);
  };

  const ACTIONS = [
    {
      key: "logout",
      icon: <FiLogOut />,
      title: "Logout From All Devices",
      desc: "End all active sessions across every device. You will need to sign in again.",
      btnLabel: "Logout All",
      btnClass: "dz-btn-warning",
      modalTitle: "Logout From All Devices?",
      modalMessage:
        "All active sessions will be terminated immediately. You will be logged out everywhere.",
      confirmLabel: "Logout All",
    },
    {
      key: "reset",
      icon: <FiRefreshCw />,
      title: "Reset All Preferences",
      desc: "Revert every setting and preference to its factory default. Your data will not be affected.",
      btnLabel: "Reset Preferences",
      btnClass: "dz-btn-warning",
      modalTitle: "Reset All Preferences?",
      modalMessage:
        "All custom settings will be reset to their defaults. This cannot be undone.",
      confirmLabel: "Reset All",
    },
    {
      key: "delete",
      icon: <FiTrash2 />,
      title: "Delete Account",
      desc: "Permanently delete your GeoAttend account and all associated data. This action is irreversible.",
      btnLabel: "Delete Account",
      btnClass: "dz-btn-danger",
      modalTitle: "Delete Your Account?",
      modalMessage:
        "All your sessions, attendance records, and profile data will be permanently erased. This cannot be undone.",
      confirmLabel: "Delete Account",
    },
  ];

  const activeAction = ACTIONS.find((a) => a.key === modal);

  return (
    <>
      <motion.div
        className="danger-zone-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="dz-header">
          <FiAlertTriangle className="dz-header-icon" />
          <div>
            <h3>Danger Zone</h3>
            <p>These actions are irreversible. Please proceed with caution.</p>
          </div>
        </div>

        <div className="dz-actions-list">
          {ACTIONS.map((a) => (
            <div key={a.key} className="dz-action-row">
              <div className="dz-action-info">
                <strong>{a.title}</strong>
                <p>{a.desc}</p>
              </div>
              <button
                className={`dz-btn ${a.btnClass}`}
                onClick={() => setModal(a.key)}
              >
                {a.icon} {a.btnLabel}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {modal && activeAction && (
        <ConfirmModal
          title={activeAction.modalTitle}
          message={activeAction.modalMessage}
          confirmLabel={activeAction.confirmLabel}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
          loading={loading}
          dangerColor={activeAction.key === "delete"}
        />
      )}
    </>
  );
}
