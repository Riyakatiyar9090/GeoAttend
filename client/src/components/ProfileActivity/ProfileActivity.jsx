import { motion } from "framer-motion";
import { RECENT_ACTIVITY } from "../../pages/TeacherProfile/teacherProfileData";
import "./ProfileActivity.css";

export default function ProfileActivity() {
  return (
    <motion.div
      className="pa-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Recent Activity</h3>
      <div className="pa-timeline">
        {RECENT_ACTIVITY.map((a, i) => (
          <motion.div
            key={i}
            className="pa-row"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
          >
            <span className="pa-emoji">{a.icon}</span>
            <div className="pa-content">
              <p>{a.text}</p>
              <span>{a.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
