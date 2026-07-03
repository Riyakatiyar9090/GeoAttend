import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiSave, FiRefreshCw } from "react-icons/fi";
import AppearanceSettings from "../../components/AppearanceSettings/AppearanceSettings";
import NotificationSettings from "../../components/NotificationSettings/NotificationSettings";
import AttendanceSettings from "../../components/AttendanceSettings/AttendanceSettings";
import SecuritySettings from "../../components/SecuritySettings/SecuritySettings";
import PrivacySettings from "../../components/PrivacySettings/PrivacySettings";
import LanguageSettings from "../../components/LanguageSettings/LanguageSettings";
import IntegrationSettings from "../../components/IntegrationSettings/IntegrationSettings";
import BackupSettings from "../../components/BackupSettings/BackupSettings";
import DangerZone from "../../components/DangerZone/DangerZone";
import SettingsSidebar from "../../components/SettingsSidebar/SettingsSidebar";
import "./TeacherSettings.css";

const SECTION_IDS = [
  "Appearance",
  "Notifications",
  "Attendance",
  "Security",
  "Privacy",
  "Language",
  "Integrations",
  "Backup",
  "Danger Zone",
];

export default function TeacherSettings() {
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
    <div className="teacher-settings-page">
      {/* Header */}
      <motion.div
        className="ts-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Settings</h1>
          <p>Manage your application preferences and account security.</p>
        </div>
        <div className="ts-header-actions">
          <button
            className="ts-reset-btn"
            onClick={() => alert("Reset to defaults — backend pending")}
          >
            <FiRefreshCw /> Reset Defaults
          </button>
          <motion.button
            className="ts-save-btn"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => alert("All settings saved — backend pending")}
          >
            <FiSave /> Save Changes
          </motion.button>
        </div>
      </motion.div>

      {/* Body */}
      <div className="ts-body">
        <div className="ts-content-col">
          {SECTION_IDS.map((name) => (
            <div key={name} ref={setRef(name)} className="ts-section-anchor">
              {name === "Appearance" && <AppearanceSettings />}
              {name === "Notifications" && <NotificationSettings />}
              {name === "Attendance" && <AttendanceSettings />}
              {name === "Security" && <SecuritySettings />}
              {name === "Privacy" && <PrivacySettings />}
              {name === "Language" && <LanguageSettings />}
              {name === "Integrations" && <IntegrationSettings />}
              {name === "Backup" && <BackupSettings />}
              {name === "Danger Zone" && <DangerZone />}
            </div>
          ))}
        </div>

        <div className="ts-sidebar-col">
          <SettingsSidebar
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />
        </div>
      </div>
    </div>
  );
}
