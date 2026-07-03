import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiPrinter, FiFileText } from "react-icons/fi";
import AttendanceStats from "../../components/AttendanceStats/AttendanceStats";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import HistoryTable from "../../components/HistoryTable/HistoryTable";
import ProgressChart from "../../components/ProgressChart/ProgressChart";
import CalendarWidget from "../../components/CalendarWidget/CalendarWidget";
import Pagination from "../../components/Pagination/Pagination";
import EmptyState from "../../components/EmptyState/EmptyState";
import SkeletonCard from "../../components/SkeletonCard/SkeletonCard";
import { MOCK_RECORDS } from "./mockData";
import "./AttendanceHistory.css";

const PAGE_SIZE = 15;

const DEFAULT_FILTERS = {
  semester: "All",
  subject: "All",
  status: "All",
  sort: "newest",
};

export default function AttendanceHistory() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [loading] = useState(false); // toggle to true to preview skeleton

  const today = new Date();

  const presentDays = useMemo(
    () =>
      MOCK_RECORDS.filter((r) => r.status === "Present").map((r) =>
        r.rawDate.getDate(),
      ),
    [],
  );

  const filtered = useMemo(() => {
    let data = [...MOCK_RECORDS];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.subject.toLowerCase().includes(q) ||
          r.faculty.toLowerCase().includes(q) ||
          r.room.toLowerCase().includes(q) ||
          r.date.toLowerCase().includes(q),
      );
    }

    if (filters.subject !== "All")
      data = data.filter((r) => r.subject === filters.subject);
    if (filters.status !== "All")
      data = data.filter((r) => r.status === filters.status);

    data.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "date") return dir * (a.rawDate - b.rawDate);
      if (sortKey === "status") return dir * a.status.localeCompare(b.status);
      if (sortKey === "subject")
        return dir * a.subject.localeCompare(b.subject);
      return 0;
    });

    if (filters.sort === "oldest") data.reverse();

    return data;
  }, [search, filters, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRecords = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const handleFilterChange = (next) => {
    setFilters(next);
    setPage(1);
  };
  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    setPage(1);
  };

  const handleExport = (type) => {
    // TODO: wire to real PDF/CSV generation
    alert(`Exporting as ${type} — backend integration pending.`);
  };

  const overall =
    MOCK_RECORDS.length > 0
      ? Math.round(
          (MOCK_RECORDS.filter((r) => r.status === "Present").length /
            MOCK_RECORDS.length) *
            100,
        )
      : 0;

  return (
    <div className="attendance-history-page">
      {/* Header */}
      <motion.div
        className="ah-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Attendance History</h1>
          <p>
            View all your attendance records and monitor your academic progress.
          </p>
        </div>
        <div className="ah-header-meta">
          <span>
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="ah-overall-badge">{overall}% Overall</span>
        </div>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div className="ah-skeleton-grid">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <AttendanceStats records={MOCK_RECORDS} />
      )}

      {/* Charts + Calendar row */}
      <div className="ah-chart-row">
        <ProgressChart records={MOCK_RECORDS} />
        <CalendarWidget
          year={today.getFullYear()}
          month={today.getMonth()}
          today={today.getDate()}
          sessionDays={presentDays}
        />
      </div>

      {/* Search + Filters */}
      <div className="ah-search-filter-row">
        <div className="ah-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by subject, teacher, room or date..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          onExport={() => handleExport("CSV")}
        />
      </div>

      {/* Quick summary bar */}
      <div className="ah-summary-bar">
        <span>
          Showing <strong>{filtered.length}</strong> records
        </span>
        <div className="ah-summary-chips">
          {["Present", "Absent", "Late"].map((s) => (
            <span key={s} className={`ah-chip ah-chip-${s.toLowerCase()}`}>
              {s}: {filtered.filter((r) => r.status === s).length}
            </span>
          ))}
        </div>
        <div className="ah-export-btns">
          <button onClick={() => handleExport("PDF")}>
            <FiFileText /> PDF
          </button>
          <button onClick={() => handleExport("CSV")}>
            <FiFileText /> CSV
          </button>
          <button onClick={() => window.print()}>
            <FiPrinter /> Print
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonCard />
      ) : filtered.length === 0 ? (
        <EmptyState onRefresh={handleReset} />
      ) : (
        <HistoryTable
          records={pageRecords}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
        />
      )}

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPage={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
