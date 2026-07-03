import { useState } from "react";
import { motion } from "framer-motion";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import {
  SectionCard,
  SettingRow,
  ToggleRow,
} from "../../pages/TeacherSettings/settingsHelpers";
import "./AppearanceSettings.css";

const THEMES = [
  { key: "light", label: "Light", icon: <FiSun /> },
  { key: "dark", label: "Dark", icon: <FiMoon /> },
  { key: "system", label: "System", icon: <FiMonitor /> },
];

const FONT_SIZES = ["Small", "Medium (Default)", "Large"];
const PRIMARY_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#D97706",
  "#0891B2",
];

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("Medium (Default)");
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [compactMode, setCompactMode] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <SectionCard
        title="Appearance"
        subtitle="Customize the look and feel of your dashboard."
      >
        <div className="as-theme-row">
          <strong className="as-row-label">Theme</strong>
          <div className="as-theme-options">
            {THEMES.map((t) => (
              <button
                key={t.key}
                className={`as-theme-btn ${theme === t.key ? "as-theme-active" : ""}`}
                onClick={() => setTheme(t.key)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="as-color-row">
          <strong className="as-row-label">Primary Color</strong>
          <div className="as-color-swatches">
            {PRIMARY_COLORS.map((c) => (
              <button
                key={c}
                className={`as-swatch ${primaryColor === c ? "swatch-active" : ""}`}
                style={{ background: c }}
                onClick={() => setPrimaryColor(c)}
              />
            ))}
          </div>
        </div>

        <SettingRow
          label="Font Size"
          desc="Adjust the base font size of the UI."
        >
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            {FONT_SIZES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </SettingRow>

        <ToggleRow
          label="Compact Mode"
          desc="Reduce spacing to show more content on screen."
          checked={compactMode}
          onChange={setCompactMode}
        />
      </SectionCard>
    </motion.div>
  );
}
