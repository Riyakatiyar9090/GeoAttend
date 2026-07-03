import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiUser,
  FiMapPin,
  FiTarget,
  FiClock,
  FiBookOpen,
  FiInfo,
} from "react-icons/fi";
import StatusBadge from "../StatusBadge/StatusBadge";
import "./DetailsDrawer.css";

export default function DetailsDrawer({ session, onClose }) {
  return (
    <AnimatePresence>
      {session && (
        <>
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="details-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
          >
            <div className="drawer-header">
              <h3>Session Details</h3>
              <button className="drawer-close-btn" onClick={onClose}>
                <FiX />
              </button>
            </div>

            <div className="drawer-body">
              <div className="drawer-title-row">
                <h2>{session.subject}</h2>
                <StatusBadge status={session.status} />
              </div>

              <div className="drawer-section">
                <div className="drawer-row">
                  <FiUser />
                  <div>
                    <span>Teacher</span>
                    <strong>{session.teacher}</strong>
                  </div>
                </div>
                <div className="drawer-row">
                  <FiMapPin />
                  <div>
                    <span>Room</span>
                    <strong>{session.room}</strong>
                  </div>
                </div>
                <div className="drawer-row">
                  <FiBookOpen />
                  <div>
                    <span>Building</span>
                    <strong>{session.building}</strong>
                  </div>
                </div>
                <div className="drawer-row">
                  <FiTarget />
                  <div>
                    <span>Attendance Radius</span>
                    <strong>{session.radius}m</strong>
                  </div>
                </div>
                <div className="drawer-row">
                  <FiClock />
                  <div>
                    <span>Allowed Time</span>
                    <strong>
                      {session.startTime} - {session.endTime}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="drawer-instructions">
                <h4>
                  <FiInfo /> Instructions
                </h4>
                <p>{session.instructions}</p>
              </div>

              <div className="drawer-rules">
                <h4>Rules</h4>
                <ul>
                  {session.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="drawer-close-bottom-btn" onClick={onClose}>
              Close
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
