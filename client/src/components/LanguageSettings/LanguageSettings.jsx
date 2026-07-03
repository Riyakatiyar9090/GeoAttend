import { useState } from "react";
import { motion } from "framer-motion";
import {
  SectionCard,
  SettingRow,
} from "../../pages/TeacherSettings/settingsHelpers";

export default function LanguageSettings() {
  const [settings, setSettings] = useState({
    language: "English",
    timezone: "Asia/Kolkata (IST, UTC+5:30)",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12-hour (AM/PM)",
  });

  const set = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <SectionCard
        title="Language & Region"
        subtitle="Localization preferences for your dashboard."
      >
        <SettingRow
          label="Language"
          desc="The language used across the application."
        >
          <select
            value={settings.language}
            onChange={(e) => set("language", e.target.value)}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Tamil</option>
            <option>Telugu</option>
            <option>Kannada</option>
          </select>
        </SettingRow>

        <SettingRow
          label="Timezone"
          desc="Used for session times and report timestamps."
        >
          <select
            value={settings.timezone}
            onChange={(e) => set("timezone", e.target.value)}
          >
            <option>Asia/Kolkata (IST, UTC+5:30)</option>
            <option>UTC (UTC+0)</option>
            <option>America/New_York (EST, UTC-5)</option>
          </select>
        </SettingRow>

        <SettingRow
          label="Date Format"
          desc="How dates are displayed across the app."
        >
          <select
            value={settings.dateFormat}
            onChange={(e) => set("dateFormat", e.target.value)}
          >
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </SettingRow>

        <SettingRow
          label="Time Format"
          desc="12-hour or 24-hour clock display."
        >
          <select
            value={settings.timeFormat}
            onChange={(e) => set("timeFormat", e.target.value)}
          >
            <option>12-hour (AM/PM)</option>
            <option>24-hour</option>
          </select>
        </SettingRow>
      </SectionCard>
    </motion.div>
  );
}
