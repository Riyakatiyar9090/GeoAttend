import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useScrollPosition from "../../hooks/useScrollPosition";
import Button from "../Button/Button";
import "./Navbar.css";

const links = ["Home", "Features", "How it Works", "About", "Contact"];

export default function Navbar() {
  const scrolled = useScrollPosition(40);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <motion.nav
      className={`navbar ${scrolled ? "navbar-solid" : ""}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container navbar-inner">
        <a href="#home" className="logo">
          Geo<span>Attend</span>
        </a>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase().replace(/\s/g, "-")}`}>{link}</a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>

          <Button variant="primary" onClick={() => navigate("/select-role")}>
            Get Started
          </Button>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </motion.nav>
  );
}
