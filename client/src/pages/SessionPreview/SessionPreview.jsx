import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiSave, FiPlay, FiEdit2 } from "react-icons/fi";
import SessionSummaryCard from "../../components/SessionSummaryCard/SessionSummaryCard";
import LocationCard from "../../components/LocationCard/LocationCard";
import PreviewCard from "../../components/PreviewCard/PreviewCard";
import ChecklistCard from "../../components/ChecklistCard/ChecklistCard";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import SuccessAnimation from "../../components/SuccessAnimation/SuccessAnimation";
import "./SessionPreview.css";

// Mock fallback data — used when this page is opened directly without route state
const mockSession = {
  subject: "Database Management Systems",
  faculty: "Dr. Neha Kapoor",
  className: "CSE-A",
  section: "A",
  semester: "5th",
  room: "Room 204",
  sessionType: "Theory",
  date: "2026-06-30",
  startTime: "10:00",
  endTime: "11:00",
  radius: 30,
  allowLateEntry: true,
  lateDuration: "10 min",
  notes: "Bring your own laptops for the live SQL demo.",
  location: { latitude: 28.4595, longitude: 77.0266 },
  buildingName: "Block C — Computer Science Dept.",
  estimatedStudents: 60,
};

export default function SessionPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = { ...mockSession, ...(location.state?.createdSession || {}) };

  const [showConfirm, setShowConfirm] = useState(false);
  const [starting, setStarting] = useState(false);
  const [started, setStarted] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    // TODO: replace with real API call, e.g.
    // await axios.post('/api/teacher/sessions/draft', session);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSavingDraft(false);
    navigate("/teacher");
  };

  const handleConfirmStart = async () => {
    setStarting(true);
    // TODO: replace with real API call, e.g.
    // await axios.post('/api/teacher/sessions/start', session);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setStarting(false);
    setShowConfirm(false);
    setStarted(true);

    setTimeout(() => {
      navigate("/teacher/sessions/live", { state: { liveSession: session } });
    }, 1800);
  };

  if (started) {
    return (
      <div className="session-preview-page started-state">
        <SuccessAnimation message="Session Started Successfully" />
      </div>
    );
  }

  return (
    <div className="session-preview-page">
      <motion.div
        className="session-preview-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Session Preview</h1>
          <p>Review all details before starting the attendance session.</p>
        </div>
        <button
          className="back-to-edit-btn"
          onClick={() => navigate("/teacher/sessions")}
        >
          <FiArrowLeft /> Back to Edit
        </button>
      </motion.div>

      <div className="session-preview-grid">
        <div className="preview-col-left">
          <SessionSummaryCard session={session} />
          <LocationCard
            location={session.location}
            radius={session.radius}
            buildingName={session.buildingName}
          />
          <ChecklistCard session={session} />
        </div>

        <div className="preview-col-right">
          <PreviewCard session={session} />
        </div>
      </div>

      <motion.div
        className="session-preview-actions"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <button
          className="action-edit-btn"
          onClick={() => navigate("/teacher/sessions")}
        >
          <FiEdit2 /> Edit Session
        </button>
        <button
          className="action-draft-btn"
          onClick={handleSaveDraft}
          disabled={savingDraft}
        >
          <FiSave /> {savingDraft ? "Saving..." : "Save as Draft"}
        </button>
        <motion.button
          className="action-start-btn"
          onClick={() => setShowConfirm(true)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <FiPlay /> Start Attendance Session
        </motion.button>
      </motion.div>

      <ConfirmationModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmStart}
        loading={starting}
      />
    </div>
  );
}
