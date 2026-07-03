import { useState } from "react";
import { motion } from "framer-motion";
import { FiDownload } from "react-icons/fi";
import {
  SectionCard,
  ToggleRow,
  SettingRow,
} from "../../pages/TeacherSettings/settingsHelpers";
import "./PrivacySettings.css";

export default function PrivacySettings() {
  const [settings, setSettings] = useState({
    profileVisibility: "All Students",
    allowContact: true,
    dataSharing: false,
  });

  const set = (k, v) => setSettings((p) => ({ ...p, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <SectionCard
        title="Privacy"
        subtitle="Control how your information is shared and used."
      >
        <SettingRow
          label="Profile Visibility"
          desc="Who can view your teacher profile."
        >
          <select
            value={settings.profileVisibility}
            onChange={(e) => set("profileVisibility", e.target.value)}
          >
            <option>All Students</option>
            <option>My Students Only</option>
            <option>Faculty Only</option>
            <option>Private</option>
          </select>
        </SettingRow>

        <ToggleRow
          label="Allow Student Contact"
          desc="Students can send you direct messages."
          checked={settings.allowContact}
          onChange={(v) => set("allowContact", v)}
        />
        <ToggleRow
          label="Data Sharing"
          desc="Allow anonymized data to improve GeoAttend."
          checked={settings.dataSharing}
          onChange={(v) => set("dataSharing", v)}
        />

        <div className="ps-download-row">
          <div>
            <strong>Download My Data</strong>
            <p>Export all your GeoAttend data as a ZIP file.</p>
          </div>
          <button
            className="ps-download-btn"
            onClick={() => alert("Download data — backend pending")}
          >
            <FiDownload /> Export Data
          </button>
        </div>
      </SectionCard>
    </motion.div>
  );
}
