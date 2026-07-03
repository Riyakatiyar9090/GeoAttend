import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./HistoryTable.css";

const statusStyles = {
  Present: "ht-badge-present",
  Absent: "ht-badge-absent",
  Late: "ht-badge-late",
  Excused: "ht-badge-excused",
};

const verificationLabel = {
  Both: { label: "✅ Both Verified", cls: "vbadge-both" },
  "QR Only": { label: "🔳 QR Only", cls: "vbadge-qr" },
  "Location Only": { label: "📍 Location Only", cls: "vbadge-loc" },
  None: { label: "—", cls: "vbadge-none" },
};

export default function HistoryTable({ records, sortKey, sortDir, onSort }) {
  const navigate = useNavigate();

  const SortIcon = ({ col }) =>
    sortKey === col ? (
      sortDir === "asc" ? (
        <FiChevronUp />
      ) : (
        <FiChevronDown />
      )
    ) : null;

  return (
    <div className="history-table-card">
      <div className="ht-scroll">
        <table className="history-table">
          <thead>
            <tr>
              {[
                { key: "date", label: "Date" },
                { key: "subject", label: "Subject" },
                { key: "faculty", label: "Faculty" },
                { key: "department", label: "Department" },
                { key: "room", label: "Room" },
                { key: "checkInTime", label: "Check-in" },
                { key: "status", label: "Status" },
                { key: "verification", label: "Verification" },
                { key: null, label: "Action" },
              ].map((col) => (
                <th
                  key={col.label}
                  className={col.key ? "sortable" : ""}
                  onClick={() => col.key && onSort(col.key)}
                >
                  {col.label} <SortIcon col={col.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {records.map((r, i) => {
                const vb =
                  verificationLabel[r.verification] || verificationLabel.None;
                return (
                  <motion.tr
                    key={r.id}
                    className={i % 2 === 0 ? "ht-row-even" : ""}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(i * 0.02, 0.3),
                    }}
                  >
                    <td className="ht-date">{r.date}</td>
                    <td className="ht-subject">{r.subject}</td>
                    <td>{r.faculty}</td>
                    <td>{r.department}</td>
                    <td>{r.room}</td>
                    <td>{r.checkInTime}</td>
                    <td>
                      <span className={`ht-badge ${statusStyles[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <span className={`ht-v-badge ${vb.cls}`}>{vb.label}</span>
                    </td>
                    <td>
                      <button
                        className="ht-view-btn"
                        onClick={() =>
                          navigate(`/student/history/details/${r.id}`, {
                            state: { record: r },
                          })
                        }
                      >
                        <FiEye /> View
                      </button>
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
