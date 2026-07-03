import { motion } from "framer-motion";
import { STUDENTS } from "../../pages/ManageStudents/studentData";
import "./StudentSidebar.css";

export default function StudentSidebar() {
  const recent = [...STUDENTS]
    .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    .slice(0, 5);
  const top = [...STUDENTS]
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 5);

  return (
    <div className="student-sidebar">
      <motion.div
        className="sb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Recently Added</h3>
        <div className="sb-student-list">
          {recent.map((s) => (
            <div key={s.id} className="sb-student-row">
              <span className="sb-avatar">{s.name.charAt(0)}</span>
              <div>
                <strong>{s.name}</strong>
                <span>
                  {s.roll} · {s.department.split(" ")[0]}
                </span>
              </div>
              <span className="sb-date">{s.joinDate.split(",")[0]}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="sb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>🏆 Top Performers</h3>
        <div className="sb-student-list">
          {top.map((s, i) => (
            <div key={s.id} className="sb-student-row">
              <span className="sb-rank">#{i + 1}</span>
              <span className="sb-avatar">{s.name.charAt(0)}</span>
              <div>
                <strong>{s.name}</strong>
                <span>{s.attendance}% attendance</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="sb-widget"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>Quick Filters</h3>
        <div className="sb-quick-filters">
          {["Above 90%", "75-90%", "Below 75%", "Active", "At Risk"].map(
            (f) => (
              <button key={f} className="sb-qf-btn">
                {f}
              </button>
            ),
          )}
        </div>
      </motion.div>
    </div>
  );
}
