import { motion } from "framer-motion";
import { FiMapPin, FiCheckCircle } from "react-icons/fi";
import "./AttendanceTable.css";

const statusStyles = {
  Present: "badge-present",
  Absent: "badge-absent",
  Late: "badge-late",
};

export default function AttendanceTable({ records }) {
  return (
    <motion.div
      className="attendance-table-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="table-header">
        <h3>Recent Attendance</h3>
      </div>

      <div className="table-scroll">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Date</th>
              <th>Status</th>
              <th>Location</th>
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
                <td>{r.faculty}</td>
                <td>{r.date}</td>
                <td>
                  <span className={`status-badge ${statusStyles[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.verified ? (
                    <span className="verified-cell">
                      <FiCheckCircle /> Verified
                    </span>
                  ) : (
                    <span className="unverified-cell">
                      <FiMapPin /> —
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
