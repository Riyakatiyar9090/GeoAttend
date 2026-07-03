import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckSquare, FiSettings } from "react-icons/fi";
import NotificationStats from "../../components/NotificationStats/NotificationStats";
import NotificationFilters from "../../components/NotificationFilters/NotificationFilters";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import NotificationSidebar from "../../components/NotificationSidebar/NotificationSidebar";
import NotificationCharts from "../../components/NotificationCharts/NotificationCharts";
import EmptyState from "../../components/EmptyState/EmptyState";
import Pagination from "../../components/Pagination/Pagination";
import { NOTIFICATIONS } from "./notificationData";
import "./TeacherNotifications.css";

const PAGE_SIZE = 8;

export default function TeacherNotifications() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
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

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClear = () => {
    setSearch("");
    setActiveFilter("All");
    setSortOrder("newest");
    setPage(1);
  };

  const handleFilterChange = (f) => {
    setActiveFilter(f);
    setPage(1);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="teacher-notifications-page">
      {/* Header */}
      <motion.div
        className="tn-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>
            Notifications
            {unreadCount > 0 && (
              <span className="tn-unread-badge">{unreadCount}</span>
            )}
          </h1>
          <p>Stay updated with attendance activities and important alerts.</p>
        </div>
        <div className="tn-header-actions">
          <motion.button
            className="tn-mark-all-btn"
            onClick={markAllRead}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiCheckSquare /> Mark All as Read
          </motion.button>
          <button
            className="tn-settings-btn"
            onClick={() => alert("Notification settings — backend pending")}
          >
            <FiSettings /> Settings
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <NotificationStats notifications={notifications} />

      {/* Filters */}
      <NotificationFilters
        search={search}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        activeFilter={activeFilter}
        onFilter={handleFilterChange}
        sortOrder={sortOrder}
        onSort={setSortOrder}
        onClear={handleClear}
      />

      {/* Summary */}
      <div className="tn-summary-bar">
        <span>
          Showing <strong>{filtered.length}</strong> of{" "}
          <strong>{notifications.length}</strong> notifications
          {unreadCount > 0 && (
            <span className="tn-unread-note"> · {unreadCount} unread</span>
          )}
        </span>
      </div>

      {/* Main layout */}
      <div className="tn-main-layout">
        <div className="tn-list-col">
          {filtered.length === 0 ? (
            <EmptyState
              title="No Notifications Found"
              subtitle="No notifications match your current filters."
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
                  onDelete={deleteNotification}
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

        <div className="tn-sidebar-col">
          <NotificationSidebar onMarkAllRead={markAllRead} />
        </div>
      </div>

      {/* Charts */}
      <div className="tn-section-title">
        <h2>Notification Statistics</h2>
      </div>
      <NotificationCharts notifications={notifications} />
    </div>
  );
}
