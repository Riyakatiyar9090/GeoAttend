import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiDownload,
  FiMoreVertical,
  FiCheck,
  FiX,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./AttendanceReportTable.css";

const statusConfig = {
  Present: { cls: "sb-present", label: "🟢 Present" },
  Absent: { cls: "sb-absent", label: "🔴 Absent" },
  Late: { cls: "sb-late", label: "🟡 Late" },
};

const COLS = [
  { key: "student", label: "Student" },
  { key: "roll", label: "Roll No" },
  { key: "subject", label: "Subject" },
  { key: "teacher", label: "Teacher" },
  { key: "session", label: "Session" },
  { key: "date", label: "Date" },
  { key: "checkInTime", label: "Check-in" },
  { key: "locationVerified", label: "Location" },
  { key: "status", label: "Status" },
  { key: null, label: "Actions" },
];

export default function AttendanceReportTable({
  records,
  sortKey,
  sortDir,
  onSort,
}) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <div className="art-card">
      <div className="art-scroll">
        <table className="art-table">
          <thead>
            <tr>
              {COLS.map((col) => (
                <th
                  key={col.label}
                  className={col.key ? "art-sortable" : ""}
                  onClick={() => col.key && onSort(col.key)}
                >
                  {col.label}
                  {col.key &&
                    sortKey === col.key &&
                    (sortDir === "asc" ? <FiChevronUp /> : <FiChevronDown />)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {records.map((r, i) => {
                const sc = statusConfig[r.status] || statusConfig.Present;
                return (
                  <motion.tr
                    key={r.id}
                    className={i % 2 === 0 ? "art-even" : ""}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: Math.min(i * 0.015, 0.25),
                    }}
                  >
                    <td className="art-student-cell">
                      <span className="art-avatar">{r.student.charAt(0)}</span>
                      {r.student}
                    </td>
                    <td>
                      <code className="art-roll">{r.roll}</code>
                    </td>
                    <td className="art-subject-cell">{r.subject}</td>
                    <td>{r.teacher}</td>
                    <td>
                      <code className="art-session">{r.session}</code>
                    </td>
                    <td className="art-date-cell">{r.date}</td>
                    <td>{r.checkInTime}</td>
                    <td>
                      {r.locationVerified ? (
                        <span className="art-loc-ok">
                          <FiCheck /> Verified
                        </span>
                      ) : (
                        <span className="art-loc-fail">
                          <FiX /> Failed
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`art-badge ${sc.cls}`}>{sc.label}</span>
                    </td>
                    <td>
                      <div className="art-actions-cell">
                        <button
                          className="art-action-btn"
                          title="View"
                          onClick={() =>
                            navigate("/teacher/attendance-report/details", {
                              state: { record: r },
                            })
                          }
                        >
                          <FiEye />
                        </button>
                        <button
                          className="art-action-btn"
                          title="Download"
                          onClick={() => alert("Download — backend pending")}
                        >
                          <FiDownload />
                        </button>
                        <div className="art-menu-wrapper">
                          <button
                            className="art-action-btn"
                            onClick={() =>
                              setOpenMenu(openMenu === r.id ? null : r.id)
                            }
                          >
                            <FiMoreVertical />
                          </button>
                          <AnimatePresence>
                            {openMenu === r.id && (
                              <motion.div
                                className="art-dropdown-menu"
                                initial={{ opacity: 0, scale: 0.92, y: -6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: -6 }}
                                transition={{ duration: 0.15 }}
                              >
                                <button
                                  onClick={() => {
                                    navigate(
                                      "/teacher/attendance-report/details",
                                      { state: { record: r } },
                                    );
                                    setOpenMenu(null);
                                  }}
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => {
                                    alert("Export PDF — backend pending");
                                    setOpenMenu(null);
                                  }}
                                >
                                  Export PDF
                                </button>
                                <button onClick={() => setOpenMenu(null)}>
                                  Close
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
