import { useRef } from "react";
import { motion } from "framer-motion";
import { FiCamera, FiMail, FiPhone, FiShield, FiCircle } from "react-icons/fi";
import "./TeacherProfileCard.css";

export default function TeacherProfileCard({ teacher }) {
  const fileRef = useRef(null);

  return (
    <motion.div
      className="tpc-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="tpc-cover" />

      <div className="tpc-body">
        <div className="tpc-avatar-wrapper">
          <motion.div className="tpc-avatar" whileHover={{ scale: 1.05 }}>
            <span>{teacher.firstName.charAt(0)}</span>
            <button
              className="tpc-upload-btn"
              onClick={() => fileRef.current?.click()}
            >
              <FiCamera />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={() => alert("Upload — backend pending")}
            />
          </motion.div>
          <div className="tpc-online-badge">
            <FiCircle
              className={teacher.online ? "badge-online" : "badge-offline"}
            />
            {teacher.online ? "Online" : "Offline"}
          </div>
        </div>

        <div className="tpc-info">
          <div className="tpc-name-row">
            <h2>
              {teacher.firstName} {teacher.lastName}
            </h2>
            {teacher.verified && (
              <span className="tpc-verified-badge">
                <FiShield /> Verified
              </span>
            )}
          </div>
          <p className="tpc-designation">{teacher.designation}</p>
          <p className="tpc-department">{teacher.department}</p>

          <div className="tpc-contact-row">
            <span>
              <FiMail /> {teacher.email}
            </span>
            <span>
              <FiPhone /> {teacher.phone}
            </span>
          </div>

          <div className="tpc-chips">
            <span>Employee ID: {teacher.employeeId}</span>
            <span>Faculty Since {teacher.facultySince}</span>
            <span>{teacher.experience} Experience</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
