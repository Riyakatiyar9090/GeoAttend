import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiClock, FiArrowRight } from "react-icons/fi";
import Confetti from "../../components/Confetti/Confetti";
import AttendanceSummaryCard from "../../components/AttendanceSummaryCard/AttendanceSummaryCard";
import VerificationTimeline from "../../components/VerificationTimeline/VerificationTimeline";
import SessionInfoCard from "../../components/SessionInfoCard/SessionInfoCard";
import AchievementCard from "../../components/AchievementCard/AchievementCard";
import useCountUp from "../../hooks/useCountUp";
import "./AttendanceSuccess.css";

const MOCK_STUDENT = {
  name: "Riya Mehta",
  rollNumber: "CS21B045",
  branch: "Computer Science",
};

const MOCK_SESSION = {
  sessionId: "GA-101",
  subject: "Database Management Systems",
  teacher: "Dr. Neha Kapoor",
  department: "Computer Science",
  room: "Room 204",
  date: new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  startTime: "10:00 AM",
  endTime: "11:00 AM",
  radius: 50,
};

const achievements = [
  {
    emoji: "🔥",
    title: "10-Day Attendance Streak!",
    desc: "You've attended class 10 days in a row.",
    color: "245,158,11",
  },
  {
    emoji: "⭐",
    title: "Perfect Attendance This Week!",
    desc: "All sessions marked present this week.",
    color: "37,99,235",
  },
];

function QuickStatCard({ label, value, suffix, index }) {
  const { count, ref } = useCountUp(value, 1000);
  return (
    <motion.div
      className="quick-stat-card"
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.08 }}
      whileHover={{ y: -4 }}
    >
      <h3>
        {count}
        {suffix}
      </h3>
      <p>{label}</p>
    </motion.div>
  );
}

export default function AttendanceSuccess() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { session: routeSession, distance: routeDistance } =
    routeLocation.state || {};

  const session = { ...MOCK_SESSION, ...routeSession };
  const distance = routeDistance ?? 18.4;
  const markedAt = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setShowConfetti(false), 3600);
    return () => clearTimeout(id);
  }, []);

  const quickStats = [
    { label: "Attendance %", value: 92, suffix: "%" },
    { label: "Sessions Attended", value: 44, suffix: "" },
    { label: "Current Streak", value: 10, suffix: " days" },
    { label: "Monthly Attendance", value: 96, suffix: "%" },
  ];

  return (
    <div className="attendance-success-page">
      {showConfetti && <Confetti />}

      {/* Success hero */}
      <motion.div
        className="success-hero"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Checkmark */}
        <motion.div
          className="success-check-circle"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 220,
            damping: 18,
          }}
        >
          <motion.svg viewBox="0 0 52 52" className="success-svg">
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            />
            <motion.path
              d="M14 27l7 7 16-16"
              fill="none"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
          </motion.svg>

          {/* Pulse rings */}
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="success-pulse-ring"
              animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>

        <motion.div
          className="success-hero-text"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <div className="success-hero-badge">
            <span>✅</span> Verified Attendance
          </div>
          <h1>Attendance Marked Successfully!</h1>
          <p>Your attendance has been securely recorded for this session.</p>
          <span className="success-timestamp">
            <FiClock /> Marked at {markedAt}
          </span>
        </motion.div>
      </motion.div>

      {/* Quick stats */}
      <div className="success-quick-stats">
        {quickStats.map((s, i) => (
          <QuickStatCard key={s.label} {...s} index={i} />
        ))}
      </div>

      {/* Achievements */}
      <motion.div
        className="success-achievements"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
      >
        {achievements.map((a) => (
          <AchievementCard key={a.title} {...a} />
        ))}
      </motion.div>

      {/* Main grid */}
      <div className="success-main-grid">
        <div className="success-col-left">
          <AttendanceSummaryCard
            student={MOCK_STUDENT}
            session={session}
            markedAt={markedAt}
          />
          <SessionInfoCard session={session} distance={distance} />
        </div>

        <div className="success-col-right">
          <VerificationTimeline />

          {/* Notification banner */}
          <motion.div
            className="success-notification-banner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <span>🎉</span>
            <div>
              <p>Your attendance has been recorded successfully.</p>
              <small>You can now safely leave the attendance page.</small>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action buttons */}
      <motion.div
        className="success-actions"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <button
          className="sa-outline-btn"
          onClick={() => navigate("/student/sessions")}
        >
          <FiArrowLeft /> Back to Sessions
        </button>
        <button
          className="sa-secondary-btn"
          onClick={() => navigate("/student/history")}
        >
          Attendance History
        </button>
        <motion.button
          className="sa-primary-btn"
          onClick={() => navigate("/student")}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          Back to Dashboard <FiArrowRight />
        </motion.button>
      </motion.div>
    </div>
  );
}
