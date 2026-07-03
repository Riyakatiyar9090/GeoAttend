import { motion } from "framer-motion";
import AnimatedBackground from "../AnimatedBackground/AnimatedBackground";
import AuthIllustration from "../AuthIllustration/AuthIllustration";
import "./AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <AnimatedBackground />

      <div className="auth-illustration-side">
        <AuthIllustration />
      </div>

      <div className="auth-form-side">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ boxShadow: "0 16px 48px rgba(37,99,235,0.14)" }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
