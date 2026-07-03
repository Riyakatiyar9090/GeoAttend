import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import SessionForm from "../../components/SessionForm/SessionForm";
import SessionPreview from "../../components/SessionPreview/SessionPreview";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import "./CreateSession.css";

const defaultPreviewData = {
  subject: "",
  className: "",
  date: "",
  startTime: "",
  endTime: "",
  radius: 20,
  location: {},
  sessionType: "Theory",
};

export default function CreateSession() {
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState(defaultPreviewData);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = (data) => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/teacher/sessions/preview", {
        state: { createdSession: data },
      });
    }, 2000);
  };

  return (
    <div className="create-session-page">
      <motion.div
        className="create-session-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Create Attendance Session</h1>
          <p>
            Create a secure attendance session using QR code and geolocation
            verification.
          </p>
        </div>
        <button
          className="back-to-dashboard-btn"
          onClick={() => navigate("/teacher")}
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
      </motion.div>

      <div className="create-session-grid">
        <SessionForm
          onSubmitSuccess={handleSuccess}
          onLiveChange={setPreviewData}
          onCancel={() => navigate("/teacher")}
        />
        <SessionPreview data={previewData} />
      </div>

      <SuccessModal
        open={showSuccess}
        message="Attendance Session Created Successfully"
      />
    </div>
  );
}
