import { motion } from "framer-motion";
import { FiEdit2 } from "react-icons/fi";
import "./ProfileCard.css";

export default function ProfileCard({ student, onEdit }) {
  return (
    <motion.div
      className="profile-card-widget"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-card-avatar">{student.name.charAt(0)}</div>
      <h3>{student.name}</h3>
      <p className="profile-card-role">Student</p>

      <div className="profile-card-details">
        <div>
          <span>Branch</span>
          <strong>{student.branch}</strong>
        </div>
        <div>
          <span>Year</span>
          <strong>{student.year}</strong>
        </div>
        <div>
          <span>Roll No.</span>
          <strong>{student.rollNumber}</strong>
        </div>
      </div>

      <button className="edit-profile-btn" onClick={onEdit}>
        <FiEdit2 /> Edit Profile
      </button>
    </motion.div>
  );
}
