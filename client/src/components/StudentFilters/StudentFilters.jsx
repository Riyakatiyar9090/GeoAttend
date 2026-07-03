import { FiSearch, FiRefreshCw } from "react-icons/fi";
import {
  DEPARTMENTS,
  SEMESTERS,
  SECTIONS,
} from "../../pages/ManageStudents/studentData";
import "./StudentFilters.css";

const DEFAULT = {
  search: "",
  dept: "All",
  semester: "All",
  section: "All",
  status: "All",
  sort: "name-asc",
};

export default function StudentFilters({ filters, onChange, onReset }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });

  return (
    <div className="sf-card">
      <div className="sf-search-row">
        <div className="sf-search-field">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name, roll number, email or reg. no..."
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
          />
        </div>
      </div>
      <div className="sf-filter-row">
        {[
          { key: "dept", label: "Department", opts: DEPARTMENTS },
          { key: "semester", label: "Semester", opts: SEMESTERS },
          { key: "section", label: "Section", opts: SECTIONS },
          {
            key: "status",
            label: "Status",
            opts: ["All", "Active", "Inactive", "Blocked"],
          },
          {
            key: "sort",
            label: "Sort By",
            opts: [
              "name-asc",
              "name-desc",
              "attendance-high",
              "attendance-low",
            ],
          },
        ].map(({ key, label, opts }) => (
          <select
            key={key}
            value={filters[key]}
            onChange={(e) => set(key, e.target.value)}
            className="sf-select"
          >
            {opts.map((o) => (
              <option key={o} value={o}>
                {label === "Sort By"
                  ? {
                      "name-asc": "Name A-Z",
                      "name-desc": "Name Z-A",
                      "attendance-high": "Attendance ↑",
                      "attendance-low": "Attendance ↓",
                    }[o]
                  : o}
              </option>
            ))}
          </select>
        ))}
        <button className="sf-reset-btn" onClick={onReset}>
          <FiRefreshCw /> Reset
        </button>
      </div>
    </div>
  );
}
