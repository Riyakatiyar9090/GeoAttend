import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiDownload } from "react-icons/fi";
import AttendanceReportStats from "../../components/AttendanceReportStats/AttendanceReportStats";
import AttendanceFilterBar from "../../components/AttendanceFilterBar/AttendanceFilterBar";
import AttendanceReportTable from "../../components/AttendanceReportTable/AttendanceReportTable";
import AttendanceInsights from "../../components/AttendanceInsights/AttendanceInsights";
import AttendanceReportTimeline from "../../components/AttendanceReportTimeline/AttendanceReportTimeline";
import Pagination from "../../components/Pagination/Pagination";
import EmptyState from "../../components/EmptyState/EmptyState";
import SkeletonCard from "../../components/SkeletonCard/SkeletonCard";
import { REPORT_RECORDS, TIMELINE_EVENTS } from "./mockReportData";
import "./AttendanceReport.css";

const PAGE_SIZE = 12;
const DEFAULT_FILTERS = {
  student: "",
  roll: "",
  subject: "",
  status: "All",
  date: "",
};

export default function AttendanceReport() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [loading] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const filtered = useMemo(() => {
    let data = [...REPORT_RECORDS];

    if (filters.student.trim()) {
      const q = filters.student.toLowerCase();
      data = data.filter((r) => r.student.toLowerCase().includes(q));
    }
    if (filters.roll.trim()) {
      data = data.filter((r) =>
        r.roll.toLowerCase().includes(filters.roll.toLowerCase()),
      );
    }
    if (filters.subject.trim()) {
      data = data.filter((r) =>
        r.subject.toLowerCase().includes(filters.subject.toLowerCase()),
      );
    }
    if (filters.status !== "All") {
      data = data.filter((r) => r.status === filters.status);
    }
    if (filters.date) {
      const chosen = new Date(filters.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      data = data.filter((r) => r.date === chosen);
    }

    data.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "date") return dir * (a.rawDate - b.rawDate);
      if (sortKey === "student")
        return dir * a.student.localeCompare(b.student);
      if (sortKey === "subject")
        return dir * a.subject.localeCompare(b.subject);
      if (sortKey === "status") return dir * a.status.localeCompare(b.status);
      return 0;
    });

    return data;
  }, [filters, sortKey, sortDir]);

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
    setPage(1);
  };

  return (
    <div className="attendance-report-page">
      {/* Header */}
      <motion.div
        className="ar-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Attendance Report</h1>
          <p>
            View, search and analyze attendance records across all sessions.
          </p>
        </div>
        <div className="ar-header-right">
          <span className="ar-date">{today}</span>
          <div className="ar-export-btns">
            <button onClick={() => alert("PDF export — backend pending")}>
              <FiFileText /> Export PDF
            </button>
            <button onClick={() => alert("CSV export — backend pending")}>
              <FiDownload /> Export CSV
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div className="ar-skeleton-row">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <AttendanceReportStats records={REPORT_RECORDS} />
      )}

      {/* Filters */}
      <AttendanceFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Summary bar */}
      <div className="ar-summary-bar">
        <span>
          Showing <strong>{filtered.length}</strong> of{" "}
          <strong>{REPORT_RECORDS.length}</strong> records
        </span>
        <div className="ar-chip-row">
          {["Present", "Absent", "Late"].map((s) => (
            <span key={s} className={`ar-chip ar-chip-${s.toLowerCase()}`}>
              {s}: {filtered.filter((r) => r.status === s).length}
            </span>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="ar-main-layout">
        {/* Table column */}
        <div className="ar-table-col">
          {loading ? (
            <SkeletonCard />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No Attendance Records Found"
              subtitle="Try adjusting your search filters or reset to see all records."
              onRefresh={handleReset}
            />
          ) : (
            <AttendanceReportTable
              records={pageRecords}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
          )}

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

        {/* Insights column */}
        <div className="ar-insights-col">
          <AttendanceInsights
            records={filtered.length > 0 ? filtered : REPORT_RECORDS}
          />
        </div>
      </div>

      {/* Timeline */}
      <AttendanceReportTimeline events={TIMELINE_EVENTS} />
    </div>
  );
}
