import { motion } from "framer-motion";
import {
  FiPlusCircle,
  FiGrid,
  FiCheckCircle,
  FiUserPlus,
} from "react-icons/fi";
import "./Timeline.css";

const iconMap = {
  created: <FiPlusCircle />,
  qr: <FiGrid />,
  closed: <FiCheckCircle />,
  joined: <FiUserPlus />,
};

export default function Timeline({ events }) {
  return (
    <motion.div
      className="timeline-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3>Recent Activity</h3>

      <div className="timeline-list">
        {events.map((e, i) => (
          <motion.div
            key={i}
            className="timeline-row"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <span className={`timeline-icon timeline-${e.type}`}>
              {iconMap[e.type]}
            </span>
            <div>
              <p className="timeline-text">{e.text}</p>
              <span className="timeline-time">{e.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
