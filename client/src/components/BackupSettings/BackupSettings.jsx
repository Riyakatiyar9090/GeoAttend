import { motion } from "framer-motion";
import { FiDownload, FiUpload, FiRefreshCw } from "react-icons/fi";
import { SectionCard } from "../../pages/TeacherSettings/settingsHelpers";
import "./BackupSettings.css";

export default function BackupSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <SectionCard
        title="Backup & Restore"
        subtitle="Export, import or reset your GeoAttend settings."
      >
        <div className="bs-action-grid">
          <div className="bs-action-card">
            <div className="bs-action-icon bs-icon-export">
              <FiDownload />
            </div>
            <h4>Export Settings</h4>
            <p>
              Download a backup of all your current settings as a JSON file.
            </p>
            <button
              className="bs-btn"
              onClick={() => alert("Export settings — backend pending")}
            >
              Export
            </button>
          </div>

          <div className="bs-action-card">
            <div className="bs-action-icon bs-icon-import">
              <FiUpload />
            </div>
            <h4>Import Settings</h4>
            <p>Restore settings from a previously exported backup file.</p>
            <button
              className="bs-btn"
              onClick={() => alert("Import settings — backend pending")}
            >
              Import
            </button>
          </div>

          <div className="bs-action-card bs-action-danger">
            <div className="bs-action-icon bs-icon-reset">
              <FiRefreshCw />
            </div>
            <h4>Reset All Settings</h4>
            <p>
              Revert every setting to its factory default. This cannot be
              undone.
            </p>
            <button
              className="bs-btn bs-btn-danger"
              onClick={() => alert("Reset settings — backend pending")}
            >
              Reset
            </button>
          </div>
        </div>
      </SectionCard>
    </motion.div>
  );
}
