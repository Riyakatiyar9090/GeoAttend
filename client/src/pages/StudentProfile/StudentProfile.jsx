import { motion } from "framer-motion";
import { FiSave, FiEdit2 } from "react-icons/fi";
import StudentProfileCard from "../../components/StudentProfileCard/StudentProfileCard";
import PersonalInfoForm from "../../components/PersonalInfoForm/PersonalInfoForm";
import AcademicInfo from "../../components/AcademicInfo/AcademicInfo";
import AttendanceSummaryCard from "../../components/AttendanceSummaryCard/AttendanceSummaryCard";
import EmergencyContact from "../../components/EmergencyContact/EmergencyContact";
import AccountInfo from "../../components/AccountInfo/AccountInfo";
import SecuritySettings from "../../components/SecuritySettings/SecuritySettings";
import ProfileProgress from "../../components/ProfileProgress/ProfileProgress";
import StudentProfileSidebar from "../../components/StudentProfileSidebar/StudentProfileSidebar";
import StudentActivityTimeline from "../../components/StudentActivityTimeline/StudentActivityTimeline";
import { STUDENT } from "./studentProfileData";
import "./StudentProfile.css";

export default function StudentProfile() {
  return (
    <div className="student-profile-page">
      <motion.div
        className="sp-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Student Profile</h1>
          <p>Manage your personal information and academic details.</p>
        </div>
        <div className="sp-header-actions">
          <button
            className="sp-edit-btn"
            onClick={() => alert("Edit — backend pending")}
          >
            <FiEdit2 /> Edit Profile
          </button>
          <motion.button
            className="sp-save-btn"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => alert("Saved — backend pending")}
          >
            <FiSave /> Save Changes
          </motion.button>
        </div>
      </motion.div>

      <StudentProfileCard student={STUDENT} />

      <div className="sp-main-grid">
        <div className="sp-left-col">
          <PersonalInfoForm teacher={STUDENT} />
          <AcademicInfo student={STUDENT} />
          <AttendanceSummaryCard student={STUDENT} />
          <EmergencyContact student={STUDENT} />
          <AccountInfo student={STUDENT} />
          <SecuritySettings />
          <StudentActivityTimeline />
        </div>

        <div className="sp-right-col">
          <ProfileProgress />
          <StudentProfileSidebar />
        </div>
      </div>
    </div>
  );
}
