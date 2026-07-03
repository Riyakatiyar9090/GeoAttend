// import { useState, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiSearch, FiFilter } from "react-icons/fi";
// import "./StudentTable.css";

// const statusStyles = {
//   Present: "st-badge-present",
//   Late: "st-badge-late",
//   "Outside Radius": "st-badge-outside",
//   "Duplicate Attempt": "st-badge-duplicate",
//   Rejected: "st-badge-rejected",
// };

// const filters = [
//   "All",
//   "Present",
//   "Late",
//   "Outside Radius",
//   "Duplicate Attempt",
//   "Rejected",
// ];

// export default function StudentTable({ students }) {
//   const [search, setSearch] = useState("");
//   const [activeFilter, setActiveFilter] = useState("All");

//   const filtered = useMemo(() => {
//     return students
//       .filter((s) => activeFilter === "All" || s.status === activeFilter)
//       .filter(
//         (s) =>
//           s.name.toLowerCase().includes(search.toLowerCase()) ||
//           s.rollNumber.toLowerCase().includes(search.toLowerCase()),
//       );
//   }, [students, search, activeFilter]);

//   if (students.length === 0) {
//     return (
//       <div className="student-table-card empty-feed">
//         <motion.div
//           className="pulse-illustration"
//           animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
//           transition={{ duration: 2, repeat: Infinity }}
//         >
//           👥
//         </motion.div>
//         <h4>Waiting for students...</h4>
//         <p>
//           Live check-ins will appear here as soon as students scan the QR code.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="student-table-card">
//       <div className="st-header">
//         <h3>Live Attendance Feed</h3>
//         <div className="st-search-wrapper">
//           <FiSearch />
//           <input
//             type="text"
//             placeholder="Search by name or roll number..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="st-filters">
//         <FiFilter />
//         {filters.map((f) => (
//           <button
//             key={f}
//             className={activeFilter === f ? "filter-active" : ""}
//             onClick={() => setActiveFilter(f)}
//           >
//             {f}
//           </button>
//         ))}
//       </div>

//       <div className="st-scroll">
//         <table className="student-table">
//           <thead>
//             <tr>
//               <th></th>
//               <th>Student</th>
//               <th>Roll No.</th>
//               <th>Time</th>
//               <th>Location</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             <AnimatePresence initial={false}>
//               {filtered.map((s) => (
//                 <motion.tr
//                   key={s.id}
//                   initial={{ opacity: 0, y: -12 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.35 }}
//                 >
//                   <td>
//                     <span className="st-avatar">{s.name.charAt(0)}</span>
//                   </td>
//                   <td className="st-name">{s.name}</td>
//                   <td>{s.rollNumber}</td>
//                   <td>{s.time}</td>
//                   <td
//                     className={
//                       s.locationOk ? "st-location-ok" : "st-location-bad"
//                     }
//                   >
//                     {s.locationOk ? "Verified" : "Flagged"}
//                   </td>
//                   <td>
//                     <span className={`st-badge ${statusStyles[s.status]}`}>
//                       {s.status}
//                     </span>
//                   </td>
//                 </motion.tr>
//               ))}
//             </AnimatePresence>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiBarChart2,
} from "react-icons/fi";
import AttendanceProgress from "../AttendanceProgress/AttendanceProgress";
import "./StudentTable.css";

const statusConfig = {
  Active: "st-active",
  Inactive: "st-inactive",
  Blocked: "st-blocked",
};

export default function StudentTable({
  students,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onView,
  onDelete,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const allSelected =
    students.length > 0 && students.every((s) => selectedIds.has(s.id));

  return (
    <div className="student-table-card">
      {selectedIds.size > 0 && (
        <motion.div
          className="bulk-actions-bar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>{selectedIds.size} selected</span>
          <button onClick={() => alert("Bulk delete — backend pending")}>
            Delete Selected
          </button>
          <button onClick={() => alert("Export — backend pending")}>
            Export Selected
          </button>
          <button onClick={() => alert("Notify — backend pending")}>
            Send Notification
          </button>
        </motion.div>
      )}

      <div className="st-scroll">
        <table className="student-table">
          <thead>
            <tr>
              <th className="th-check">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onSelectAll(students)}
                />
              </th>
              <th>Student</th>
              <th>Roll No</th>
              <th>Email</th>
              <th>Department</th>
              <th>Sem / Sec</th>
              <th>Attendance</th>
              <th>Status</th>
              <th>Last Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {students.map((s, i) => (
                <motion.tr
                  key={s.id}
                  className={`${i % 2 === 0 ? "st-even" : ""} ${selectedIds.has(s.id) ? "st-selected" : ""}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.01, 0.2) }}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(s.id)}
                      onChange={() => onToggleSelect(s.id)}
                    />
                  </td>
                  <td>
                    <div className="st-student-cell">
                      <span className="st-avatar">{s.name.charAt(0)}</span>
                      <div>
                        <strong>{s.name}</strong>
                        <span>{s.regNo}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code className="st-code">{s.roll}</code>
                  </td>
                  <td className="st-email">{s.email}</td>
                  <td>{s.department}</td>
                  <td>
                    {s.semester} · {s.section}
                  </td>
                  <td className="st-att-cell">
                    <AttendanceProgress pct={s.attendance} />
                  </td>
                  <td>
                    <span
                      className={`st-status-badge ${statusConfig[s.status]}`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="st-date">{s.lastAttendance}</td>
                  <td>
                    <div className="st-actions">
                      <button
                        className="st-act-btn"
                        title="View Profile"
                        onClick={() => onView(s)}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="st-act-btn"
                        title="Attendance"
                        onClick={() =>
                          alert("Attendance history — backend pending")
                        }
                      >
                        <FiBarChart2 />
                      </button>
                      <button
                        className="st-act-btn"
                        title="Edit"
                        onClick={() => alert("Edit — backend pending")}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="st-act-btn st-act-danger"
                        title="Delete"
                        onClick={() => onDelete(s)}
                      >
                        <FiTrash2 />
                      </button>
                      <div className="st-menu-wrapper">
                        <button
                          className="st-act-btn"
                          onClick={() =>
                            setOpenMenu(openMenu === s.id ? null : s.id)
                          }
                        >
                          <FiMoreVertical />
                        </button>
                        <AnimatePresence>
                          {openMenu === s.id && (
                            <motion.div
                              className="st-dropdown"
                              initial={{ opacity: 0, scale: 0.93, y: -6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.14 }}
                            >
                              <button
                                onClick={() => {
                                  onView(s);
                                  setOpenMenu(null);
                                }}
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => {
                                  alert("Attendance");
                                  setOpenMenu(null);
                                }}
                              >
                                View Attendance
                              </button>
                              <button
                                onClick={() => {
                                  alert("Edit");
                                  setOpenMenu(null);
                                }}
                              >
                                Edit Student
                              </button>
                              <div className="st-divider" />
                              <button
                                className="st-menu-danger"
                                onClick={() => {
                                  onDelete(s);
                                  setOpenMenu(null);
                                }}
                              >
                                Delete Student
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
