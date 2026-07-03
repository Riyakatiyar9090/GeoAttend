import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiDownload, FiPrinter, FiClock } from "react-icons/fi";
import AttendanceStatusCard from "../../components/AttendanceStatusCard/AttendanceStatusCard";
import VerificationCards from "../../components/VerificationCards/VerificationCards";
import VerificationTimeline from "../../components/VerificationTimeline/VerificationTimeline";
import SessionInfoCard from "../../components/SessionInfoCard/SessionInfoCard";
import LocationInfoCard from "../../components/LocationInfoCard/LocationInfoCard";
import MetadataCard from "../../components/MetadataCard/MetadataCard";
import QRPreviewCard from "../../components/QRPreviewCard/QRPreviewCard";
import useCountUp from "../../hooks/useCountUp";
import { MOCK_DETAIL } from "./mockDetail";
import "./AttendanceDetails.css";

function QuickStatItem({ label, value, suffix, index }) {
  const { count, ref } = useCountUp(value, 1000);
  return (
    <motion.div
      className="ad-quick-stat"
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.08 }}
      whileHover={{ y: -3 }}
    >
      <h3>
        {count}
        {suffix}
      </h3>
      <p>{label}</p>
    </motion.div>
  );
}

export default function AttendanceDetails() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { id } = useParams();

  // Use route state if available, else fall back to mock
  const record = routeLocation.state?.record
    ? { ...MOCK_DETAIL, ...routeLocation.state.record }
    : MOCK_DETAIL;

  const quickStats = [
    { label: "Attendance %", value: record.attendancePct, suffix: "%" },
    { label: "Current Streak", value: record.streak, suffix: " days" },
    { label: "Present Count", value: record.presentCount, suffix: "" },
    { label: "Monthly %", value: record.monthlyPct, suffix: "%" },
  ];

  return (
    <div className="attendance-details-page">
      {/* Breadcrumb */}
      <nav className="ad-breadcrumb">
        <span onClick={() => navigate("/student")} className="bc-link">
          Dashboard
        </span>
        <span className="bc-sep">/</span>
        <span onClick={() => navigate("/student/history")} className="bc-link">
          Attendance History
        </span>
        <span className="bc-sep">/</span>
        <span className="bc-current">Attendance Details</span>
      </nav>

      {/* Header */}
      <motion.div
        className="ad-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="ad-header-left">
          <button
            className="ad-back-btn"
            onClick={() => navigate("/student/history")}
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1>Attendance Details</h1>
            <p>Complete information about your attendance record.</p>
          </div>
        </div>
        <div className="ad-header-meta">
          <span className="ad-id-badge">ID: {record.id}</span>
          <span className="ad-date-badge">
            <FiClock /> {record.date}
          </span>
        </div>
      </motion.div>

      {/* Success banner */}
      <motion.div
        className="ad-success-banner"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <span>✅</span>
        <div>
          <strong>Attendance Successfully Verified</strong>
          <p>Your QR code and geolocation were both verified successfully.</p>
        </div>
      </motion.div>

      {/* Status hero card */}
      <AttendanceStatusCard
        status={record.status}
        date={record.date}
        attendanceId={record.id}
        pctImpact={1}
      />

      {/* Quick stats */}
      <div className="ad-quick-stats-row">
        {quickStats.map((s, i) => (
          <QuickStatItem key={s.label} {...s} index={i} />
        ))}
      </div>

      {/* Verification cards */}
      <div className="ad-section">
        <h2 className="ad-section-title">Verification Status</h2>
        <VerificationCards verification={record.verification} />
      </div>

      {/* Main grid */}
      <div className="ad-main-grid">
        <div className="ad-col-left">
          <SessionInfoCard session={record} distance={record.distance} />
          <LocationInfoCard
            teacherCoords={record.teacherCoords}
            studentCoords={record.studentCoords}
            distance={record.distance}
            radius={record.radius}
          />
          <MetadataCard record={record} />
        </div>

        <div className="ad-col-right">
          <VerificationTimeline />

          {/* Attendance Summary */}
          <motion.div
            className="ad-summary-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>Attendance Summary</h3>
            <div className="ad-summary-rows">
              <div>
                <span>Status</span>
                <strong className="summary-present">{record.status}</strong>
              </div>
              <div>
                <span>Check-in Time</span>
                <strong>{record.checkInTime}</strong>
              </div>
              <div>
                <span>Verification Time</span>
                <strong>{record.verificationTime}</strong>
              </div>
              <div>
                <span>Duration</span>
                <strong>{record.duration}</strong>
              </div>
              <div>
                <span>Attendance Type</span>
                <strong>{record.attendanceType}</strong>
              </div>
              <div>
                <span>Semester</span>
                <strong>{record.semester}</strong>
              </div>
            </div>
          </motion.div>

          <QRPreviewCard
            qrCodeId={record.qrCodeId}
            sessionId={record.sessionId}
            generatedAt={record.qrGeneratedAt}
            expiresAt={record.qrExpiresAt}
          />
        </div>
      </div>

      {/* Actions */}
      <motion.div
        className="ad-actions"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          className="ad-outline-btn"
          onClick={() => navigate("/student/history")}
        >
          <FiArrowLeft /> Back to History
        </button>
        <button
          className="ad-secondary-btn"
          onClick={() => alert("Download — backend pending")}
        >
          <FiDownload /> Download Receipt
        </button>
        <motion.button
          className="ad-print-btn"
          onClick={() => window.print()}
          whileHover={{ y: -2 }}
        >
          <FiPrinter /> Print Record
        </motion.button>
      </motion.div>
    </div>
  );
}
