import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "./SidebarItem.css";

export default function SidebarItem({ icon, label, to, collapsed, onClick }) {
  return (
    <NavLink to={to} className="sidebar-item-link" onClick={onClick} end>
      {({ isActive }) => (
        <motion.div
          className={`sidebar-item ${isActive ? "active" : ""}`}
          whileHover={{ x: collapsed ? 0 : 4 }}
        >
          {isActive && (
            <motion.span
              className="active-indicator"
              layoutId="active-indicator"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <span className="sidebar-icon">{icon}</span>
          {!collapsed && <span className="sidebar-label">{label}</span>}
          {collapsed && <span className="sidebar-tooltip">{label}</span>}
        </motion.div>
      )}
    </NavLink>
  );
}
