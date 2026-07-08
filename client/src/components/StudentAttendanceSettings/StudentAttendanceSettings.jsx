import { useState } from "react";
import { motion } from "framer-motion";
import {
  SectionCard,
  ToggleRow,
  SettingRow,
} from "../../pages/TeacherSettings/settingsHelpers";

export default function StudentAttendanceSettings() {
  const [settings, setSettings] = useState({
    defaultView: "Subject-wise",
    showPercentage: true,
    autoRefresh: true,
    showStreak: true,
    weeklyGoal: "90%",
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
        subtitle="Customize how attendance data is displayed and tracked."
      >
        <SettingRow
          label="Default Attendance View"
          desc="How attendance records are grouped on your dashboard."
        >
          <select
            value={settings.defaultView}
            onChange={(e) => set("defaultView", e.target.value)}
          >
            <option>Subject-wise</option>
            <option>Date-wise</option>
            <option>Monthly</option>
          </select>
        </SettingRow>

        <SettingRow
          label="Weekly Attendance Goal"
          desc="Your personal target percentage for each week."
        >
          <select
            value={settings.weeklyGoal}
            onChange={(e) => set("weeklyGoal", e.target.value)}
          >
            <option>75%</option>
            <option>80%</option>
            <option>85%</option>
            <option>90%</option>
            <option>95%</option>
            <option>100%</option>
          </select>
        </SettingRow>

        <ToggleRow
          label="Show Attendance Percentage"
          desc="Display attendance % prominently on dashboard cards."
          checked={settings.showPercentage}
          onChange={(v) => set("showPercentage", v)}
        />

        <ToggleRow
          label="Auto Refresh Dashboard"
          desc="Automatically refresh attendance data every 2 minutes."
          checked={settings.autoRefresh}
          onChange={(v) => set("autoRefresh", v)}
        />

        <ToggleRow
          label="Show Attendance Streak"
          desc="Display your consecutive attendance streak on the dashboard."
          checked={settings.showStreak}
          onChange={(v) => set("showStreak", v)}
        />
      </SectionCard>
    </motion.div>
  );
}
