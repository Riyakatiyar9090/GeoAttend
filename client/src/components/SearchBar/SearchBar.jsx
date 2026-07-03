import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import "./SearchBar.css";

export default function SearchBar() {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`search-bar ${focused ? "search-focused" : ""}`}>
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search anything..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
