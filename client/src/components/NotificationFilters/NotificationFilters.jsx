import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { CATEGORY_FILTERS } from "../../pages/TeacherNotifications/notificationData";
import "./NotificationFilters.css";

export default function NotificationFilters({
  search,
  onSearch,
  activeFilter,
  onFilter,
  sortOrder,
  onSort,
  onClear,
}) {
  return (
    <div className="nf-card">
      <div className="nf-search">
        <FiSearch />
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="nf-pills-row">
        <div className="nf-pills">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f}
              className={`nf-pill ${activeFilter === f ? "nf-pill-active" : ""}`}
              onClick={() => onFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="nf-sort-reset">
          <select
            value={sortOrder}
            onChange={(e) => onSort(e.target.value)}
            className="nf-sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <button className="nf-clear-btn" onClick={onClear}>
            <FiRefreshCw /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}
