import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiMail,
  FiHash,
  FiBook,
  FiCalendar,
  FiPhone,
} from "react-icons/fi";
import AttendanceProgress from "../AttendanceProgress/AttendanceProgress";
import "./StudentProfileModal.css";

export default function StudentProfileModal({ student, onClose }) {
  return (
    <AnimatePresence>
      {student && (
        <motion.div
          className="spm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="spm-card"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="spm-header">
              <h3>Student Profile</h3>
              <button className="spm-close-btn" onClick={onClose}>
                <FiX />
              </button>
            </div>

            <div className="spm-body">
              <div className="spm-avatar-row">
                <div className="spm-avatar">{student.name.charAt(0)}</div>
                <div>
                  <h2>{student.name}</h2>
                  <span
                    className={`spm-status-badge status-${student.status.toLowerCase()}`}
                  >
                    {student.status}
                  </span>
                </div>
              </div>

              <div className="spm-info-grid">
                <div>
                  <FiHash />
                  <span>Roll No</span>
                  <strong>{student.roll}</strong>
                </div>
                <div>
                  <FiMail />
                  <span>Email</span>
                  <strong>{student.email}</strong>
                </div>
                <div>
                  <FiPhone />
                  <span>Phone</span>
                  <strong>{student.phone}</strong>
                </div>
                <div>
                  <FiHash />
                  <span>Reg. No.</span>
                  <strong>{student.regNo}</strong>
                </div>
                <div>
                  <FiBook />
                  <span>Department</span>
                  <strong>{student.department}</strong>
                </div>
                <div>
                  <FiCalendar />
                  <span>Semester</span>
                  <strong>
                    {student.semester} · Section {student.section}
                  </strong>
                </div>
                <div>
                  <FiCalendar />
                  <span>Joined</span>
                  <strong>{student.joinDate}</strong>
                </div>
                <div>
                  <FiCalendar />
                  <span>Last Attendance</span>
                  <strong>{student.lastAttendance}</strong>
                </div>
              </div>

              <div className="spm-attendance-section">
                <p>Attendance</p>
                <AttendanceProgress pct={student.attendance} />
              </div>
            </div>

            <div className="spm-actions">
              <button className="spm-view-att-btn" onClick={onClose}>
                View Attendance
              </button>
              <button className="spm-edit-btn" onClick={onClose}>
                Edit Student
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
