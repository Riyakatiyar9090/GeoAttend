import { FiRefreshCw, FiDownload } from "react-icons/fi";
import { SUBJECTS } from "../../pages/AttendanceHistory/mockData";
import "./FilterPanel.css";

const semesters = ["All", "5th Semester", "4th Semester", "3rd Semester"];
const statuses = ["All", "Present", "Absent", "Late"];

export default function FilterPanel({ filters, onChange, onReset, onExport }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filter-panel">
      <select
        value={filters.semester}
        onChange={(e) => set("semester", e.target.value)}
      >
        {semesters.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <select
        value={filters.subject}
        onChange={(e) => set("subject", e.target.value)}
      >
        <option value="All">All Subjects</option>
        {SUBJECTS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => set("status", e.target.value)}
      >
        {statuses.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(e) => set("sort", e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      <button className="fp-reset-btn" onClick={onReset}>
        <FiRefreshCw /> Reset
      </button>
      <button className="fp-export-btn" onClick={onExport}>
        <FiDownload /> Export
      </button>
    </div>
  );
}
