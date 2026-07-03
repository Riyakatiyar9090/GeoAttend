import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();

  const handleWatchDemo = () => {
    const featuresSection = document.getElementById("features");

    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section id="home" className="hero">
      {/* Background Effects */}
      <div className="hero-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="grid-pattern"></div>
      </div>

      <div className="container hero-inner">
        {/* Left Content */}
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero-tag">Smart Campus Attendance</span>

          <h1>
            Smart Attendance.
            <br />
            Verified by Location.
          </h1>

          <p>
            GeoAttend lets teachers create attendance sessions in seconds and
            confirms each student's presence using QR scanning paired with live
            geolocation verification — no proxies, no paperwork.
          </p>

          <div className="hero-actions">
            <Button variant="primary" onClick={() => navigate("/select-role")}>
              Get Started
            </Button>

            <Button variant="outline" onClick={handleWatchDemo}>
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Right Dashboard Card */}
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="dashboard-card"
            animate={{ y: [0, -14, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="dash-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>

            <div className="dash-row">
              <div className="dash-stat">
                <p>Today's Attendance</p>
                <h3>94.2%</h3>
              </div>

              <div className="dash-pin">📍 Location Verified</div>
            </div>

            <div className="dash-bars">
              {[60, 80, 45, 90, 70, 95].map((height, index) => (
                <motion.div
                  key={index}
                  className="bar"
                  style={{ height: `${height}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    duration: 0.5,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
