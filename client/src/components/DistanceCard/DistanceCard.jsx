import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiUser,
  FiMapPin,
  FiClock,
  FiTarget,
} from "react-icons/fi";
import "./DistanceCard.css";

export default function DistanceCard({ session, distance, radius }) {
  return (
    <motion.div
      className="distance-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3>Session Summary</h3>
      <div className="dc-rows">
        <div>
          <FiBookOpen />
          <span>Subject</span>
          <strong>{session.subject}</strong>
        </div>
        <div>
          <FiUser />
          <span>Teacher</span>
          <strong>{session.teacher}</strong>
        </div>
        <div>
          <FiMapPin />
          <span>Room</span>
          <strong>{session.room}</strong>
        </div>
        <div>
          <FiClock />
          <span>Time</span>
          <strong>
            {session.startTime} – {session.endTime}
          </strong>
        </div>
        <div>
          <FiTarget />
          <span>Allowed Radius</span>
          <strong>{radius}m</strong>
        </div>
        <div>
          <FiTarget />
          <span>Your Distance</span>
          <strong
            className={
              distance !== null && distance <= radius ? "dc-good" : "dc-bad"
            }
          >
            {distance !== null ? `${distance.toFixed(1)}m` : "Calculating..."}
          </strong>
        </div>
      </div>
    </motion.div>
  );
}
