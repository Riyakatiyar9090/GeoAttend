import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../../components/Sidebar/Sidebar";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import "./DashboardLayout.css";

/**
 * Shared layout for Student and Teacher dashboards.
 * basePath: e.g. '/student' or '/teacher' — used to build menu links and breadcrumbs.
 * baseLabel: e.g. 'Student' or 'Teacher' — shown as the first breadcrumb segment.
 * role / userName: passed down to the profile dropdown.
 */
export default function DashboardLayout({
  basePath,
  baseLabel,
  role,
  userName,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        basePath={basePath}
      />

      <div className="dashboard-main">
        <TopNavbar
          basePath={basePath}
          baseLabel={baseLabel}
          role={role}
          userName={userName}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />

        <motion.main
          className="dashboard-content"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
