import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiSave, FiRefreshCw } from "react-icons/fi";

// Fully reused from teacher-side
import AppearanceSettings from "../../components/AppearanceSettings/AppearanceSettings";
import SecuritySettings from "../../components/SecuritySettings/SecuritySettings";
import PrivacySettings from "../../components/PrivacySettings/PrivacySettings";
import LanguageSettings from "../../components/LanguageSettings/LanguageSettings";
import BackupSettings from "../../components/BackupSettings/BackupSettings";
import DangerZone from "../../components/DangerZone/DangerZone";

// Student-specific
import StudentNotificationSettings from "../../components/StudentNotificationSettings/StudentNotificationSettings";
import StudentAttendanceSettings from "../../components/StudentAttendanceSettings/StudentAttendanceSettings";
import StudentSettingsSidebar from "../../components/StudentSettingsSidebar/StudentSettingsSidebar";

import "./StudentSettings.css";

const SECTION_IDS = [
  "Appearance",
  "Notifications",
  "Attendance",
  "Security",
  "Privacy",
  "Language",
  "Backup",
  "Danger Zone",
];

export default function StudentSettings() {
  const [activeSection, setActiveSection] = useState("Appearance");
  const sectionRefs = useRef({});

  const scrollToSection = (name) => {
    setActiveSection(name);
    sectionRefs.current[name]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const setRef = (name) => (el) => {
    sectionRefs.current[name] = el;
  };

  return (
    <div className="student-settings-page">
      {/* Header */}
      <motion.div
        className="sts-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Student Settings</h1>
          <p>
            Customize your account, notifications and application preferences.
          </p>
        </div>
        <div className="sts-header-actions">
          <button
            className="sts-reset-btn"
            onClick={() => alert("Reset to defaults — backend pending")}
          >
            <FiRefreshCw /> Reset Defaults
          </button>
          <motion.button
            className="sts-save-btn"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => alert("All settings saved — backend pending")}
          >
            <FiSave /> Save Changes
          </motion.button>
        </div>
      </motion.div>

      {/* Body */}
      <div className="sts-body">
        <div className="sts-content-col">
          <div ref={setRef("Appearance")} className="sts-anchor">
            <AppearanceSettings />
          </div>
          <div ref={setRef("Notifications")} className="sts-anchor">
            <StudentNotificationSettings />
          </div>
          <div ref={setRef("Attendance")} className="sts-anchor">
            <StudentAttendanceSettings />
          </div>
          <div ref={setRef("Security")} className="sts-anchor">
            <SecuritySettings />
          </div>
          <div ref={setRef("Privacy")} className="sts-anchor">
            <PrivacySettings />
          </div>
          <div ref={setRef("Language")} className="sts-anchor">
            <LanguageSettings />
          </div>
          <div ref={setRef("Backup")} className="sts-anchor">
            <BackupSettings />
          </div>
          <div ref={setRef("Danger Zone")} className="sts-anchor">
            <DangerZone />
          </div>
        </div>

        <div className="sts-sidebar-col">
          <StudentSettingsSidebar
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />
        </div>
      </div>
    </div>
  );
}
