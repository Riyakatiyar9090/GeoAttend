import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckSquare,
  FiSettings,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import NotificationStats from "../../components/NotificationStats/NotificationStats";
import NotificationFilters from "../../components/NotificationFilters/NotificationFilters";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import NotificationCharts from "../../components/NotificationCharts/NotificationCharts";
import StudentNotificationSidebar from "../../components/StudentNotificationSidebar/StudentNotificationSidebar";
import EmptyState from "../../components/EmptyState/EmptyState";
import Pagination from "../../components/Pagination/Pagination";
import {
  STUDENT_NOTIFICATIONS,
  STUDENT_CATEGORY_FILTERS,
} from "./studentNotificationData";
import "./StudentNotifications.css";

// Swap in the student category list for the filter component
// by temporarily patching the import — we pass it as a prop
// (NotificationFilters accepts categories as an optional prop)

const PAGE_SIZE = 8;

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState(STUDENT_NOTIFICATIONS);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let data = [...notifications];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (n) =>
          n.title.toLowerCase().includes(q) || n.desc.toLowerCase().includes(q),
      );
    }

    if (activeFilter === "Unread") data = data.filter((n) => !n.read);
    else if (activeFilter === "Read") data = data.filter((n) => n.read);
    else if (activeFilter !== "All")
      data = data.filter((n) => n.category === activeFilter);

    if (sortOrder === "oldest") data.reverse();

    return data;
  }, [notifications, search, activeFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageNotifications = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const deleteNotif = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  const handleClear = () => {
    setSearch("");
    setActiveFilter("All");
    setSortOrder("newest");
    setPage(1);
  };

  return (
    <div className="student-notifications-page">
      {/* Header */}
      <motion.div
        className="sn-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>
            Notifications
            {unreadCount > 0 && (
              <span className="sn-unread-badge">{unreadCount}</span>
            )}
          </h1>
          <p>Stay updated with attendance, classes and announcements.</p>
        </div>
        <div className="sn-header-actions">
          <motion.button
            className="sn-mark-all-btn"
            onClick={markAllRead}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiCheckSquare /> Mark All as Read
          </motion.button>
          <button
            className="sn-settings-btn"
            onClick={() => alert("Notification settings — backend pending")}
          >
            <FiSettings /> Settings
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <NotificationStats notifications={notifications} />

      {/* Filters — pass student categories via the categories prop */}
      <StudentNotificationFilterBar
        search={search}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        activeFilter={activeFilter}
        onFilter={(f) => {
          setActiveFilter(f);
          setPage(1);
        }}
        sortOrder={sortOrder}
        onSort={setSortOrder}
        onClear={handleClear}
      />

      {/* Summary */}
      <div className="sn-summary-bar">
        <span>
          Showing <strong>{filtered.length}</strong> of{" "}
          <strong>{notifications.length}</strong> notifications
          {unreadCount > 0 && (
            <span className="sn-unread-note"> · {unreadCount} unread</span>
          )}
        </span>
      </div>

      {/* Main layout */}
      <div className="sn-main-layout">
        <div className="sn-list-col">
          {filtered.length === 0 ? (
            <EmptyState
              title="No Notifications Found"
              subtitle="Try adjusting your filters or reset to see all notifications."
              onRefresh={handleClear}
            />
          ) : (
            <AnimatePresence mode="popLayout">
              {pageNotifications.map((n, i) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  index={i}
                  onMarkRead={markRead}
                  onDelete={deleteNotif}
                />
              ))}
            </AnimatePresence>
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

        <div className="sn-sidebar-col">
          <StudentNotificationSidebar onMarkAllRead={markAllRead} />
        </div>
      </div>

      {/* Charts */}
      <div className="sn-section-title">
        <h2>Notification Statistics</h2>
      </div>
      <NotificationCharts notifications={notifications} />
    </div>
  );
}

/* ── Inline filter bar for student categories ── */
function StudentNotificationFilterBar({
  search,
  onSearch,
  activeFilter,
  onFilter,
  sortOrder,
  onSort,
  onClear,
}) {
  return (
    <div className="sn-filter-card">
      <div className="sn-filter-search">
        <FiSearch />
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="sn-filter-pills-row">
        <div className="sn-pills">
          {STUDENT_CATEGORY_FILTERS.map((f) => (
            <button
              key={f}
              className={`sn-pill ${activeFilter === f ? "sn-pill-active" : ""}`}
              onClick={() => onFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="sn-sort-reset">
          <select
            value={sortOrder}
            onChange={(e) => onSort(e.target.value)}
            className="sn-sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
          <button className="sn-clear-btn" onClick={onClear}>
            <FiRefreshCw /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}
