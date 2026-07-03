import { motion } from "framer-motion";
import "./SubjectPerformanceTable.css";

const statusConfig = {
  Excellent: { cls: "sp-excellent", label: "🟢 Excellent" },
  Good: { cls: "sp-good", label: "🔵 Good" },
  Warning: { cls: "sp-warning", label: "🟡 Warning" },
  Critical: { cls: "sp-critical", label: "🔴 Critical" },
};

export default function SubjectPerformanceTable({ subjects }) {
  return (
    <motion.div
      className="spt-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="spt-header">
        <h3>Subject Performance</h3>
      </div>
      <div className="spt-scroll">
        <table className="spt-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Faculty</th>
              <th>Attendance %</th>
              <th>Attended</th>
              <th>Missed</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, i) => {
              const sc = statusConfig[s.status];
              return (
                <motion.tr
                  key={s.name}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={i % 2 === 0 ? "spt-even" : ""}
                >
                  <td className="spt-subject">{s.name}</td>
                  <td className="spt-faculty">{s.faculty}</td>
                  <td>
                    <div className="spt-pct-cell">
                      <div className="spt-bar-track">
                        <motion.div
                          className="spt-bar-fill"
                          style={{
                            background:
                              s.pct >= 90
                                ? "#10B981"
                                : s.pct >= 75
                                  ? "#2563EB"
                                  : s.pct >= 60
                                    ? "#F59E0B"
                                    : "#EF4444",
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.06 }}
                        />
                      </div>
                      <span className="spt-pct-label">{s.pct}%</span>
                    </div>
                  </td>
                  <td>
                    {s.attended}/{s.total}
                  </td>
                  <td className={s.missed > 0 ? "spt-missed" : ""}>
                    {s.missed}
                  </td>
                  <td>
                    <span className={`spt-badge ${sc.cls}`}>{sc.label}</span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
