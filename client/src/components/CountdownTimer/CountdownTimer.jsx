import { useState, useEffect, useCallback } from "react";
import "./CountdownTimer.css";

export default function CountdownTimer({
  duration = 119,
  onExpire,
  restartKey,
}) {
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    setSecondsLeft(duration);
  }, [duration, restartKey]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire?.();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, onExpire]);

  const format = useCallback((s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }, []);

  return <span className="countdown-timer">{format(secondsLeft)}</span>;
}
