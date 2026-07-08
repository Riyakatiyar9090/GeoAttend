import { useState } from "react";
import { motion } from "framer-motion";
import {
  SectionCard,
  ToggleRow,
} from "../../pages/TeacherSettings/settingsHelpers";

export default function StudentNotificationSettings() {
  const [settings, setSettings] = useState({
    attendanceAlerts: true,
    classReminders: true,
    emailNotifications: true,
    pushNotifications: false,
    lowAttendanceWarning: true,
    examNotifications: true,
    announcements: true,
  });

  const set = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

  const rows = [
    {
      key: "attendanceAlerts",
      label: "Attendance Alerts",
      desc: "Get notified when your attendance is marked or missed.",
    },
    {
      key: "classReminders",
      label: "Class Reminders",
      desc: "Receive reminders before each scheduled class.",
    },
    {
      key: "emailNotifications",
      label: "Email Notifications",
      desc: "Receive all alerts to your registered email.",
    },
    {
      key: "pushNotifications",
      label: "Push Notifications",
      desc: "Enable mobile push notifications for real-time updates.",
    },
    {
      key: "lowAttendanceWarning",
      label: "Low Attendance Warning",
      desc: "Alert when your attendance drops below your set goal.",
    },
    {
      key: "examNotifications",
      label: "Exam Notifications",
      desc: "Receive reminders for upcoming exams and tests.",
    },
    {
      key: "announcements",
      label: "Announcements",
      desc: "Get faculty and college announcements as notifications.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      <SectionCard
        title="Notification Preferences"
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
