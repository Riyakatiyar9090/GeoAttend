import { useState } from "react";
import { motion } from "framer-motion";
import { FiPause, FiPlay, FiXCircle, FiClock } from "react-icons/fi";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import "./SessionControls.css";

export default function SessionControls({
  paused,
  onPause,
  onResume,
  onClose,
  onExtend,
}) {
  const [modal, setModal] = useState(null); // 'pause' | 'resume' | 'close' | 'extend' | null
  const [loading, setLoading] = useState(false);

  const modalConfig = {
    pause: {
      title: "Pause Attendance?",
      message: "Students will not be able to mark attendance while paused.",
    },
    resume: {
      title: "Resume Attendance?",
      message: "Students will be able to mark attendance again.",
    },
    close: {
      title: "Close Session?",
      message:
        "This will end the session permanently. Students can no longer join.",
    },
    extend: {
      title: "Extend Session?",
      message: "This adds 15 extra minutes to the current session.",
    },
  };

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    if (modal === "pause") onPause();
    if (modal === "resume") onResume();
    if (modal === "close") onClose();
    if (modal === "extend") onExtend();

    setModal(null);
  };

  return (
    <div className="session-controls-card">
      <h3>Session Controls</h3>
      <div className="controls-grid">
        {!paused ? (
          <motion.button
            className="control-btn control-pause"
            onClick={() => setModal("pause")}
            whileHover={{ y: -2 }}
          >
            <FiPause /> Pause
          </motion.button>
        ) : (
          <motion.button
            className="control-btn control-resume"
            onClick={() => setModal("resume")}
            whileHover={{ y: -2 }}
          >
            <FiPlay /> Resume
          </motion.button>
        )}

        <motion.button
          className="control-btn control-extend"
          onClick={() => setModal("extend")}
          whileHover={{ y: -2 }}
        >
          <FiClock /> Extend
        </motion.button>

        <motion.button
          className="control-btn control-close"
          onClick={() => setModal("close")}
          whileHover={{ y: -2 }}
        >
          <FiXCircle /> Close Session
        </motion.button>
      </div>

      <ConfirmationModal
        open={!!modal}
        onCancel={() => setModal(null)}
        onConfirm={handleConfirm}
        loading={loading}
        title={modal ? modalConfig[modal].title : ""}
        message={modal ? modalConfig[modal].message : ""}
      />
    </div>
  );
}
