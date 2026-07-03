import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBookOpen, FiUser, FiMapPin, FiClock } from "react-icons/fi";
import "./ActiveSessionCard.css";

function useCountdown(seconds) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  const m = Math.floor(left / 60)
    .toString()
    .padStart(2, "0");
  const s = (left % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ActiveSessionCard({ session, onJoin, onRefresh }) {
  const countdown = useCountdown(session ? 9 * 60 + 42 : 0);

  if (!session) {
    return (
      <motion.div
        className="active-session-card empty-session"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="empty-illustration">📭</div>
        <h4>No active attendance session</h4>
        <p>You'll see live sessions here once a teacher starts one.</p>
        <button className="refresh-btn" onClick={onRefresh}>
          Refresh
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="active-session-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <div className="session-top">
        <motion.span
          className="live-badge"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          ● LIVE
        </motion.span>
        <span className="session-countdown">
          <FiClock /> {countdown}
        </span>
      </div>

      <h3>{session.subject}</h3>

      <div className="session-meta">
        <span>
          <FiUser /> {session.faculty}
        </span>
        <span>
          <FiMapPin /> {session.room}
        </span>
        <span>
          <FiClock /> {session.time}
        </span>
      </div>

      <motion.button
        className="join-session-btn"
        onClick={onJoin}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
      >
        Join Session
      </motion.button>
    </motion.div>
  );
}
