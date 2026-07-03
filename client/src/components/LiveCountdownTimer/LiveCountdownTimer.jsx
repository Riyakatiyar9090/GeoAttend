import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";
import "./LiveCountdownTimer.css";

export default function LiveCountdownTimer({ endsInSeconds: initial }) {
  const [secondsLeft, setSecondsLeft] = useState(initial);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  if (secondsLeft <= 0) {
    return <span className="countdown-timer expired">Session ended</span>;
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const urgent = secondsLeft <= 300; // last 5 minutes

  return (
    <motion.span
      className={`countdown-timer ${urgent ? "countdown-urgent" : ""}`}
      animate={urgent ? { scale: [1, 1.04, 1] } : {}}
      transition={{ duration: 1, repeat: urgent ? Infinity : 0 }}
    >
      <FiClock /> {minutes}m {seconds.toString().padStart(2, "0")}s remaining
    </motion.span>
  );
}
