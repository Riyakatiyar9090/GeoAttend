import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import LocationMap from "../../components/LocationMap/LocationMap";
import ProgressStepper from "../../components/ProgressStepper/ProgressStepper";
import VerificationCard from "../../components/VerificationCard/VerificationCard";
import DistanceCard from "../../components/DistanceCard/DistanceCard";
import VerificationSuccessCard from "../../components/VerificationSuccessCard/VerificationSuccessCard";
import VerificationErrorCard from "../../components/VerificationErrorCard/VerificationErrorCard";
import "./LocationVerification.css";

// Haversine formula — returns distance in metres between two lat/lng pairs
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const MOCK_SESSION = {
  sessionId: "GA-101",
  subject: "Database Management Systems",
  teacher: "Dr. Neha Kapoor",
  department: "Computer Science",
  room: "Room 204",
  startTime: "10:00 AM",
  endTime: "11:00 AM",
  radius: 50,
  location: { latitude: 28.6139, longitude: 77.209 },
};

// Mock student coords — tweak longitude offset to toggle pass/fail
// Within radius: offset 0.0003  |  Outside radius: offset 0.001
const MOCK_STUDENT_OFFSET = 0.0003;

export default function LocationVerification() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const session = routeLocation.state?.session || MOCK_SESSION;

  const teacherLocation = session.location;
  const allowedRadius = session.radius;

  const [step, setStep] = useState(0); // 0-3 stepper steps
  const [verStatus, setVerStatus] = useState("idle"); // idle|fetching|success|failed|error
  const [errorType, setErrorType] = useState(null);
  const [studentCoords, setStudentCoords] = useState({
    latitude: null,
    longitude: null,
  });
  const [distance, setDistance] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [now, setNow] = useState(new Date());
  const runOnce = useRef(false);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const runVerification = useCallback(async () => {
    // Step 0 is already shown (QR verified), move to step 1
    setStep(1);
    setVerStatus("fetching");

    // Simulate geolocation fetch delay
    await new Promise((res) => setTimeout(res, 1200));

    // ---- Mock coordinates ----
    // Replace this block with real navigator.geolocation once backend is wired:
    // navigator.geolocation.getCurrentPosition(success, error, options)
    const mockStudent = {
      latitude: teacherLocation.latitude + MOCK_STUDENT_OFFSET,
      longitude: teacherLocation.longitude + MOCK_STUDENT_OFFSET,
    };
    const mockAccuracy = 8.5;

    setStudentCoords(mockStudent);
    setAccuracy(mockAccuracy);
    setStep(2);

    // Simulate comparison delay
    await new Promise((res) => setTimeout(res, 900));

    const dist = haversineDistance(
      teacherLocation.latitude,
      teacherLocation.longitude,
      mockStudent.latitude,
      mockStudent.longitude,
    );
    setDistance(dist);
    setStep(3);

    // Simulate final verification delay
    await new Promise((res) => setTimeout(res, 700));

    if (dist <= allowedRadius) {
      setVerStatus("success");
    } else {
      setVerStatus("failed");
      setErrorType("outside_radius");
    }
  }, [teacherLocation, allowedRadius]);

  useEffect(() => {
    if (runOnce.current) return;
    runOnce.current = true;
    runVerification();
  }, [runVerification]);

  const handleRetry = () => {
    setStep(0);
    setVerStatus("idle");
    setErrorType(null);
    setStudentCoords({ latitude: null, longitude: null });
    setDistance(null);
    setAccuracy(null);
    runOnce.current = false;
    setTimeout(() => {
      runOnce.current = false;
      runVerification();
    }, 100);
  };

  const handleMarkAttendance = () => {
    navigate("/student/attendance-success", {
      state: { session, distance, studentCoords },
    });
  };

  return (
    <div className="location-verification-page">
      {/* Header */}
      <motion.div
        className="lv-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="lv-header-left">
          <button
            className="lv-back-btn"
            onClick={() => navigate("/student/qr-scanner")}
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1>Location Verification</h1>
            <p>Verifying your location to securely mark your attendance.</p>
          </div>
        </div>
        <div className="lv-header-time">
          <span>
            {now.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>
            {now.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </motion.div>

      {/* Body */}
      <div className="lv-body-grid">
        {/* Left column */}
        <div className="lv-col-left">
          <VerificationCard
            distance={distance}
            radius={allowedRadius}
            accuracy={accuracy}
            studentCoords={studentCoords}
            status={
              verStatus === "idle" || verStatus === "fetching"
                ? "fetching"
                : verStatus
            }
          />

          <LocationMap
            teacher={teacherLocation}
            student={studentCoords}
            radius={allowedRadius}
            withinRadius={verStatus === "success"}
          />

          <DistanceCard
            session={session}
            distance={distance}
            radius={allowedRadius}
          />
        </div>

        {/* Right column */}
        <div className="lv-col-right">
          {/* Progress stepper */}
          <motion.div
            className="lv-stepper-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3>Verification Progress</h3>
            <ProgressStepper currentStep={step} />
          </motion.div>

          {/* Result */}
          {verStatus === "success" && (
            <VerificationSuccessCard
              distance={distance}
              onMarkAttendance={handleMarkAttendance}
            />
          )}

          {verStatus === "failed" && (
            <VerificationErrorCard
              errorType={errorType}
              distance={distance}
              radius={allowedRadius}
              onRetry={handleRetry}
              onViewMap={() =>
                document
                  .querySelector(".location-map-wrapper")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            />
          )}

          {(verStatus === "idle" || verStatus === "fetching") && (
            <motion.div
              className="lv-waiting-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="lv-pulse-ring"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <p>Verifying your location...</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
