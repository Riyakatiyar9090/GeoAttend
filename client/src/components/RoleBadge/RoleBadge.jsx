import { motion } from "framer-motion";
import "./RoleBadge.css";

export default function RoleBadge({ role }) {
  const isTeacher = role === "teacher";
  return (
    <motion.div
      className={`role-badge ${isTeacher ? "badge-teacher" : "badge-student"}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <span className="badge-emoji">{isTeacher ? "👨‍🏫" : "🎓"}</span>
      {isTeacher ? "Teacher Portal" : "Student Portal"}
    </motion.div>
  );
}
