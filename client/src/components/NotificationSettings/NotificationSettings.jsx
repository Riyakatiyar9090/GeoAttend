import { useState } from "react";
import { motion } from "framer-motion";
import {
  SectionCard,
  ToggleRow,
} from "../../pages/TeacherSettings/settingsHelpers";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    attendanceAlerts: true,
    sessionReminders: true,
    emailNotifications: true,
    pushNotifications: false,
    browserNotifications: false,
    weeklySummary: true,
    monthlyReport: true,
  });

  const set = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

  const rows = [
    {
      key: "attendanceAlerts",
      label: "Attendance Alerts",
      desc: "Get notified when students mark or miss attendance.",
    },
    {
      key: "sessionReminders",
      label: "Session Reminders",
      desc: "Receive reminders before scheduled sessions start.",
    },
    {
      key: "emailNotifications",
      label: "Email Notifications",
      desc: "Receive all alerts via email.",
    },
    {
      key: "pushNotifications",
      label: "Push Notifications",
      desc: "Get mobile push notifications.",
    },
    {
      key: "browserNotifications",
      label: "Browser Notifications",
      desc: "Allow this app to send browser alerts.",
    },
    {
      key: "weeklySummary",
      label: "Weekly Summary",
      desc: "Receive a weekly digest every Monday morning.",
    },
    {
      key: "monthlyReport",
      label: "Monthly Report",
      desc: "Auto-generated attendance report on the 1st of each month.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      <SectionCard
        title="Notifications"
        subtitle="Control which alerts and updates you receive."
      >
        {rows.map((r) => (
          <ToggleRow
            key={r.key}
            label={r.label}
            desc={r.desc}
            checked={settings[r.key]}
            onChange={(v) => set(r.key, v)}
          />
        ))}
      </SectionCard>
    </motion.div>
  );
}
