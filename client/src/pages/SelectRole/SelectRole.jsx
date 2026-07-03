import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBookOpen, FiUsers } from "react-icons/fi";
import { GiGraduateCap } from "react-icons/gi";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import Navbar from "../../components/Navbar/Navbar";
import AnimatedBackground from "../../components/AnimatedBackground/AnimatedBackground";
import RoleCard from "../../components/RoleCard/RoleCard";
import "./SelectRole.css";

export default function SelectRole() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/login?role=${role}`, { state: { role } });
  };

  return (
    <div className="select-role-page">
      <AnimatedBackground />
      <Navbar />

      <div className="select-role-content">
        <motion.div
          className="select-role-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">Get Started</span>
          <h1>Choose Your Role</h1>
          <p>Select how you want to continue with GeoAttend.</p>
        </motion.div>

        <div className="role-cards-wrapper">
          <RoleCard
            icon={<GiGraduateCap />}
            role="Student"
            variant="student"
            index={0}
            points={[
              "Join attendance sessions",
              "Scan QR codes",
              "Track attendance",
              "View attendance history",
            ]}
            buttonLabel="Continue as Student"
            onClick={() => handleSelect("student")}
          />

          <RoleCard
            icon={<PiChalkboardTeacherFill />}
            role="Teacher"
            variant="teacher"
            index={1}
            points={[
              "Create attendance sessions",
              "Generate QR codes",
              "View attendance analytics",
              "Manage students",
            ]}
            buttonLabel="Continue as Teacher"
            onClick={() => handleSelect("teacher")}
          />
        </div>

        <motion.div
          className="select-role-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <a href="/" className="back-home">
            ← Back to Home
          </a>
          <p className="register-link">
            Don't have an account?{" "}
            <a onClick={() => navigate("/register")}>Register</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
