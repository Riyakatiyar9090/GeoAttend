import { useState } from "react";
import { motion } from "framer-motion";
import { FiLink, FiCheck, FiX } from "react-icons/fi";
import {
  SectionCard,
  SettingRow,
} from "../../pages/TeacherSettings/settingsHelpers";
import "./IntegrationSettings.css";

const INTEGRATIONS = [
  {
    key: "google",
    name: "Google Calendar",
    desc: "Sync attendance sessions to your Google Calendar.",
    connected: false,
  },
  {
    key: "outlook",
    name: "Microsoft Outlook",
    desc: "Connect your Outlook calendar for session reminders.",
    connected: true,
  },
  {
    key: "email",
    name: "Email Service",
    desc: "Configure SMTP for custom email notifications.",
    connected: false,
  },
];

export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);
  const [exportFormat, setExportFormat] = useState("Excel (.xlsx)");

  const toggleConnect = (key) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.key === key ? { ...i, connected: !i.connected } : i)),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
    >
      <SectionCard
        title="Integrations"
        subtitle="Connect third-party tools to enhance your workflow."
      >
        <div className="int-list">
          {integrations.map((int) => (
            <div key={int.key} className="int-row">
              <div className="int-icon-col">
                <FiLink />
              </div>
              <div className="int-body">
                <strong>{int.name}</strong>
                <p>{int.desc}</p>
              </div>
              <div className="int-right">
                {int.connected ? (
                  <span className="int-connected">
                    <FiCheck /> Connected
                  </span>
                ) : null}
                <button
                  className={`int-btn ${int.connected ? "int-btn-disconnect" : "int-btn-connect"}`}
                  onClick={() => toggleConnect(int.key)}
                >
                  {int.connected ? (
                    <>
                      <FiX /> Disconnect
                    </>
                  ) : (
                    <>
                      <FiLink /> Connect
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <SettingRow
          label="Default Export Format"
          desc="Format used for attendance data exports."
        >
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option>Excel (.xlsx)</option>
            <option>CSV (.csv)</option>
            <option>PDF (.pdf)</option>
          </select>
        </SettingRow>
      </SectionCard>
    </motion.div>
  );
}
