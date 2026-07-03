import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiFilter } from "react-icons/fi";
import "./FilterDropdown.css";

const options = [
  "All Sessions",
  "Active",
  "Ending Soon",
  "Upcoming",
  "Completed",
];

export default function FilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="filter-dropdown" ref={ref}>
      <button className="filter-trigger" onClick={() => setOpen(!open)}>
        <FiFilter /> {value}
        <FiChevronDown className={`filter-chevron ${open ? "rotate" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="filter-menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
          >
            {options.map((opt) => {
              const disabled = opt === "Completed";
              return (
                <button
                  key={opt}
                  className={`${value === opt ? "filter-option-active" : ""} ${disabled ? "filter-option-disabled" : ""}`}
                  disabled={disabled}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  {opt} {disabled && <span className="soon-tag">Soon</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
