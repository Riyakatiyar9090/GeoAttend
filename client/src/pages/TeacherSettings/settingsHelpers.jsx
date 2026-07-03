// Reusable primitives shared across all settings sections

import "./settingsHelpers.css";

export function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="sh-toggle-row">
      <div className="sh-toggle-text">
        <strong>{label}</strong>
        {desc && <p>{desc}</p>}
      </div>
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="switch-slider" />
      </label>
    </div>
  );
}

export function SettingRow({ label, desc, children }) {
  return (
    <div className="sh-setting-row">
      <div className="sh-setting-label">
        <strong>{label}</strong>
        {desc && <p>{desc}</p>}
      </div>
      <div className="sh-setting-control">{children}</div>
    </div>
  );
}

export function SectionCard({ title, subtitle, children }) {
  return (
    <div className="sh-section-card">
      <div className="sh-section-header">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
