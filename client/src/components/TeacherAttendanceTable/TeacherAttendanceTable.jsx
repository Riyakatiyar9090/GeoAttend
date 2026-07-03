import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";
import "./TeacherAttendanceTable.css";

export default function TeacherAttendanceTable({ records, onView }) {
  return (
    <motion.div
      className="teacher-table-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="table-header">
        <h3>Recent Attendance</h3>
      </div>

      <div className="table-scroll">
        <table className="teacher-attendance-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Class</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance %</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <td className="subject-cell">{r.subject}</td>
                <td>{r.className}</td>
                <td>{r.present}</td>
                <td>{r.absent}</td>
                <td>
                  <span
                    className={`pct-badge ${r.percentage >= 90 ? "pct-good" : r.percentage >= 75 ? "pct-mid" : "pct-low"}`}
                  >
                    {r.percentage}%
                  </span>
                </td>
                <td>
                  <button className="view-btn" onClick={() => onView?.(r)}>
                    <FiEye /> View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
