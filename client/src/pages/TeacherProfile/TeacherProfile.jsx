import { motion } from "framer-motion";
import { FiSave, FiTrash2 } from "react-icons/fi";
import TeacherProfileCard from "../../components/TeacherProfileCard/TeacherProfileCard";
import PersonalInfoForm from "../../components/PersonalInfoForm/PersonalInfoForm";
import ProfessionalInfo from "../../components/ProfessionalInfo/ProfessionalInfo";
import SecuritySettings from "../../components/SecuritySettings/SecuritySettings";
import PreferencesCard from "../../components/PreferencesCard/PreferencesCard";
import ProfileProgress from "../../components/ProfileProgress/ProfileProgress";
import ProfileActivity from "../../components/ProfileActivity/ProfileActivity";
import ProfileQuickStats from "../../components/ProfileQuickStats/ProfileQuickStats";
import ProfileAchievements from "../../components/ProfileAchievements/ProfileAchievements";
import { TEACHER } from "./teacherProfileData";
import "./TeacherProfile.css";

export default function TeacherProfile() {
  return (
    <div className="teacher-profile-page">
      {/* Header */}
      <motion.div
        className="tp-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>My Profile</h1>
          <p>Manage your account information and teaching profile.</p>
        </div>
        <div className="tp-header-actions">
          <button
            className="tp-delete-btn"
            onClick={() => alert("Delete account — backend pending")}
          >
            <FiTrash2 /> Delete Account
          </button>
          <motion.button
            className="tp-save-btn"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => alert("All changes saved — backend pending")}
          >
            <FiSave /> Save Changes
          </motion.button>
        </div>
      </motion.div>

      {/* Profile card full-width */}
      <TeacherProfileCard teacher={TEACHER} />

      {/* Main grid */}
      <div className="tp-main-grid">
        <div className="tp-left-col">
          <PersonalInfoForm teacher={TEACHER} />
          <ProfessionalInfo teacher={TEACHER} />
          <SecuritySettings />
          <PreferencesCard />
        </div>

        <div className="tp-right-col">
          <ProfileProgress />
          <ProfileQuickStats />
          <ProfileActivity />
        </div>
      </div>

      {/* Achievements */}
      <ProfileAchievements />
    </div>
  );
}
