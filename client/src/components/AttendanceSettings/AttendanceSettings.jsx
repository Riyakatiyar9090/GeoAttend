import { useState } from "react";
import { motion } from "framer-motion";
import {
  SectionCard,
  SettingRow,
  ToggleRow,
} from "../../pages/TeacherSettings/settingsHelpers";
import "./AttendanceSettings.css";

const RADIUS_OPTIONS = [10, 20, 30, 50, 100];
const QR_EXPIRY_OPTIONS = [30, 60, 90, 120];
const DURATION_OPTIONS = [30, 45, 60, 90, 120];

export default function AttendanceSettings() {
  const [settings, setSettings] = useState({
    defaultDuration: 60,
    defaultRadius: 30,
    qrExpiry: 60,
    autoEndSession: true,
    requireLocation: true,
    requireQR: true,
  });

  const set = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <SectionCard
        title="Attendance Preferences"
        subtitle="Default settings applied when creating new attendance sessions."
      >
        <SettingRow
          label="Default Session Duration"
          desc="How long attendance stays open by default."
        >
          <select
            value={settings.defaultDuration}
            onChange={(e) => set("defaultDuration", Number(e.target.value))}
          >
            {DURATION_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d} minutes
              </option>
            ))}
          </select>
        </SettingRow>

        <SettingRow
          label="Default Attendance Radius"
          desc="Geolocation radius for student verification."
        >
          <select
            value={settings.defaultRadius}
            onChange={(e) => set("defaultRadius", Number(e.target.value))}
          >
            {RADIUS_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r} metres
              </option>
            ))}
          </select>
        </SettingRow>

        <SettingRow
          label="QR Code Expiry"
          desc="How often the QR code auto-refreshes."
        >
          <select
            value={settings.qrExpiry}
            onChange={(e) => set("qrExpiry", Number(e.target.value))}
          >
            {QR_EXPIRY_OPTIONS.map((q) => (
              <option key={q} value={q}>
                {q} seconds
              </option>
            ))}
          </select>
        </SettingRow>

        <ToggleRow
          label="Auto-End Session"
          desc="Automatically close the session when duration expires."
          checked={settings.autoEndSession}
          onChange={(v) => set("autoEndSession", v)}
        />
        <ToggleRow
          label="Require Location Verification"
          desc="Students must be within the radius to mark attendance."
          checked={settings.requireLocation}
          onChange={(v) => set("requireLocation", v)}
        />
        <ToggleRow
          label="Require QR Verification"
          desc="Students must scan a valid QR to mark attendance."
          checked={settings.requireQR}
          onChange={(v) => set("requireQR", v)}
        />
      </SectionCard>
    </motion.div>
  );
}
