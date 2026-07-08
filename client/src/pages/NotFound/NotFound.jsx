import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiHome, FiGrid } from "react-icons/fi";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="nf-page">
      {/* Animated background blobs */}
      <div className="nf-bg">
        <motion.div
          className="nf-blob nf-blob-1"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="nf-blob nf-blob-2"
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="nf-blob nf-blob-3"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="nf-grid-pattern" />
      </div>

      {/* Glass card */}
      <motion.div
        className="nf-card"
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 220,
          damping: 22,
        }}
      >
        {/* Floating 404 number */}
        <motion.div
          className="nf-number-wrapper"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="nf-four-left">4</span>
          <motion.div
            className="nf-zero"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="nf-zero-inner">
              <motion.div
                className="nf-zero-dot"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
          <span className="nf-four-right">4</span>
        </motion.div>

        {/* Animated divider */}
        <motion.div
          className="nf-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Text */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Page Not Found
        </motion.h1>

        <motion.p
          className="nf-subtitle"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          The page you're looking for doesn't exist or has been moved.
          <br />
          Let's get you back on track.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="nf-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <motion.button
            className="nf-btn nf-btn-primary"
            onClick={() => navigate("/")}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiHome /> Go to Home
          </motion.button>

          <motion.button
            className="nf-btn nf-btn-secondary"
            onClick={() => navigate("/student")}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiGrid /> Go to Dashboard
          </motion.button>

          <motion.button
            className="nf-btn nf-btn-outline"
            onClick={() => navigate(-1)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiArrowLeft /> Go Back
          </motion.button>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          className="nf-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Lost? Try navigating from the{" "}
          <span onClick={() => navigate("/")}>landing page</span>.
        </motion.p>
      </motion.div>
    </div>
  );
}
