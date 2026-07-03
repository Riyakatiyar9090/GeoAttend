import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { SUBJECTS_LIST } from "../../pages/AttendanceReport/mockReportData";
import "./AttendanceFilterBar.css";

export default function AttendanceFilterBar({ filters, onChange, onReset }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="afb-card">
      <div className="afb-search-group">
        <div className="afb-search-field">
          <FiSearch />
          <input
            type="text"
            placeholder="Search student name..."
            value={filters.student}
            onChange={(e) => set("student", e.target.value)}
          />
        </div>
        <div className="afb-search-field">
          <FiSearch />
          <input
            type="text"
            placeholder="Search roll number..."
            value={filters.roll}
            onChange={(e) => set("roll", e.target.value)}
          />
        </div>
        <div className="afb-search-field">
          <FiSearch />
          <input
            type="text"
            placeholder="Search subject..."
            value={filters.subject}
            onChange={(e) => set("subject", e.target.value)}
          />
        </div>
      </div>

      <div className="afb-filter-group">
        <select
          value={filters.status}
          onChange={(e) => set("status", e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option>Present</option>
          <option>Absent</option>
          <option>Late</option>
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => set("date", e.target.value)}
          className="afb-date-input"
        />

        <button className="afb-reset-btn" onClick={onReset}>
          <FiRefreshCw /> Reset
        </button>
      </div>
    </div>
  );
}
