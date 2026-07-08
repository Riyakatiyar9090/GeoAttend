import { useRef } from "react";
import { motion } from "framer-motion";
import { FiCamera, FiMail, FiPhone, FiCircle } from "react-icons/fi";
import ProgressCircle from "../ProgressCircle/ProgressCircle";
import "./StudentProfileCard.css";

export default function StudentProfileCard({ student }) {
  const fileRef = useRef(null);

  return (
    <motion.div
      className="spc-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="spc-cover" />

      <div className="spc-body">
        <div className="spc-avatar-row">
          <motion.div className="spc-avatar" whileHover={{ scale: 1.05 }}>
            <span>{student.firstName.charAt(0)}</span>
            <button
              className="spc-upload-btn"
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
          <div className="spc-badges">
            <span className="spc-online">
              <FiCircle className="dot-online" /> Active
            </span>
            <ProgressCircle
              percentage={student.attendance}
              size={72}
              strokeWidth={6}
              color="var(--success)"
              label="Attend."
            />
          </div>
        </div>

        <div className="spc-info">
          <div className="spc-name-row">
            <h2>
              {student.firstName} {student.lastName}
            </h2>
            <span className="spc-status-badge">✅ Verified</span>
          </div>
          <p className="spc-enrollment">
            Enrollment: <strong>{student.enrollmentNo}</strong>
          </p>
          <p className="spc-branch">
            {student.branch} · {student.semester} Sem · Section{" "}
            {student.section}
          </p>
          <p className="spc-college">{student.college}</p>

          <div className="spc-contact-row">
            <span>
              <FiMail /> {student.email}
            </span>
            <span>
              <FiPhone /> {student.phone}
            </span>
          </div>

          <div className="spc-chips">
            <span>Batch {student.batch}</span>
            <span>Roll: {student.rollNumber}</span>
            <span>{student.course}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
