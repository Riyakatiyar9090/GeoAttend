import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import "./ProfileDropdown.css";

export default function ProfileDropdown({
  name = "Aditi Sharma",
  role = "student",
  basePath,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // TODO: clear auth token / session here
    navigate("/login");
  };

  return (
    <div className="profile-wrapper" ref={ref}>
      <button className="profile-trigger" onClick={() => setOpen(!open)}>
        <span className="profile-avatar">{name.charAt(0)}</span>
        <span className="profile-meta">
          <span className="profile-name">{name}</span>
          <span className="profile-role">
            {role === "teacher" ? "Teacher" : "Student"}
          </span>
        </span>
        <FiChevronDown className={`chevron ${open ? "rotate" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="profile-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            <button onClick={() => navigate(`${basePath}/profile`)}>
              <FiUser /> My Profile
            </button>
            <button onClick={() => navigate(`${basePath}/settings`)}>
              <FiSettings /> Settings
            </button>
            <div className="dropdown-divider" />
            <button className="logout-option" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
