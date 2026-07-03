import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiCheckSquare,
  FiCalendar,
  FiMaximize,
  FiBarChart2,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import SidebarItem from "./SidebarItem";
import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", icon: <FiGrid />, to: "" },
  { label: "Attendance", icon: <FiCheckSquare />, to: "attendance" },
  { label: "Sessions", icon: <FiCalendar />, to: "sessions" },
  { label: "QR Scanner", icon: <FiMaximize />, to: "qr-scanner" },
  { label: "Analytics", icon: <FiBarChart2 />, to: "analytics" },
  { label: "Notifications", icon: <FiBell />, to: "notifications" },
  { label: "Profile", icon: <FiUser />, to: "profile" },
  { label: "Settings", icon: <FiSettings />, to: "settings" },
];

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  basePath,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: clear auth token / session here, then redirect
    navigate("/login");
  };

  const sidebarContent = (
    <>
      <div className="sidebar-header">
        <motion.div
          className="sidebar-logo"
          whileHover={{ rotate: -6, scale: 1.05 }}
        >
          GA
        </motion.div>
        {!collapsed && (
          <span className="sidebar-app-name">
            Geo<span>Attend</span>
          </span>
        )}
        <button className="mobile-close-btn" onClick={onCloseMobile}>
          <FiX />
        </button>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            to={`${basePath}/${item.to}`}
            collapsed={collapsed}
            onClick={onCloseMobile}
          />
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-item logout-item" onClick={handleLogout}>
          <span className="sidebar-icon">
            <FiLogOut />
          </span>
          {!collapsed && <span className="sidebar-label">Logout</span>}
          {collapsed && <span className="sidebar-tooltip">Logout</span>}
        </div>

        <button className="collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
    </>
  );

  return (
    <>
      <motion.aside
        className="sidebar sidebar-desktop"
        animate={{ width: collapsed ? 90 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {sidebarContent}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
            />
            <motion.aside
              className="sidebar sidebar-mobile"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
