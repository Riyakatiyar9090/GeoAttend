import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import {
  FiCamera,
  FiRefreshCw,
  FiPause,
  FiPlay,
  FiArrowLeft,
  FiUpload,
  FiX,
} from "react-icons/fi";
import ScannerFrame from "../../components/ScannerFrame/ScannerFrame";
import CameraPermissionCard from "../../components/CameraPermissionCard/CameraPermissionCard";
import SessionPreviewCard from "../../components/SessionPreviewCard/SessionPreviewCard";
import ScannerErrorCard from "../../components/ScannerErrorCard/ScannerErrorCard";
import SuccessAnimation from "../../components/SuccessAnimation/SuccessAnimation";
import "./QRScanner.css";

// Mock session data returned after a "successful" QR scan
const MOCK_SESSION = {
  sessionId: "GA-101",
  subject: "Database Management Systems",
  teacher: "Dr. Neha Kapoor",
  department: "Computer Science",
  room: "Room 204",
  startTime: "10:00 AM",
  endTime: "11:00 AM",
  radius: 30,
  location: { latitude: 28.4595, longitude: 77.0266 },
};

const SCANNER_ELEMENT_ID = "qr-reader";

export default function QRScanner() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const sessionFromRoute = routeLocation.state || {};

  // Camera state: 'loading' | 'ready' | 'denied' | 'no_camera' | 'paused'
  const [cameraState, setCameraState] = useState("loading");
  const [scanned, setScanned] = useState(false);
  const [detectedSession, setDetectedSession] = useState(null);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [now, setNow] = useState(new Date());
  const [facingMode, setFacingMode] = useState("environment");

  const html5QrRef = useRef(null);
  const scannerStarted = useRef(false);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const stopScanner = useCallback(async () => {
    if (html5QrRef.current && scannerStarted.current) {
      try {
        await html5QrRef.current.stop();
        await html5QrRef.current.clear();
      } catch {
        // ignore if already stopped
      }
      scannerStarted.current = false;
    }
  }, []);

  const startScanner = useCallback(
    async (facing = "environment") => {
      await stopScanner();

      try {
        const qr = new Html5Qrcode(SCANNER_ELEMENT_ID);
        html5QrRef.current = qr;

        await qr.start(
          { facingMode: facing },
          { fps: 12, qrbox: { width: 260, height: 260 } },
          (decodedText) => {
            // On real scan success — parse decodedText here once backend is ready
            // For now we ignore decodedText and use mock data
            handleScanSuccess(decodedText);
          },
          () => {
            // scan-in-progress errors are silent
          },
        );

        scannerStarted.current = true;
        setCameraState("ready");
      } catch (err) {
        if (
          err?.message?.toLowerCase().includes("permission") ||
          err?.message?.toLowerCase().includes("notallowed")
        ) {
          setCameraState("denied");
        } else if (
          err?.message?.toLowerCase().includes("notfound") ||
          err?.message?.toLowerCase().includes("no camera")
        ) {
          setCameraState("no_camera");
        } else {
          setCameraState("denied");
        }
      }
    },
    [stopScanner],
  );

  useEffect(() => {
    startScanner(facingMode);
    return () => {
      stopScanner();
    };
  }, []);

  // ---------- Simulate a QR scan after 5 seconds (demo mode) ----------
  useEffect(() => {
    if (cameraState !== "ready") return;
    const id = setTimeout(() => {
      handleScanSuccess("GA-101-MOCK");
    }, 5000);
    return () => clearTimeout(id);
  }, [cameraState]);

  const handleScanSuccess = async (rawText) => {
    if (scanned) return;
    setScanned(true);
    await stopScanner();

    // TODO: validate rawText against /api/student/sessions/validate-qr
    // For now always resolve to mock session
    const isValid = true;

    if (!isValid) {
      setError("invalid_qr");
      return;
    }

    setDetectedSession({ ...MOCK_SESSION, ...sessionFromRoute });
  };

  const handleVerifyLocation = async () => {
    setVerifying(true);
    // TODO: call navigator.geolocation and check distance against session.radius
    await new Promise((res) => setTimeout(res, 1200));
    setVerifying(false);
    setSuccess(true);
    setTimeout(() => {
      navigate("/student/location-verify", {
        state: { session: detectedSession },
      });
    }, 1600);
  };

  const handleRetry = () => {
    setScanned(false);
    setDetectedSession(null);
    setError(null);
    setCameraState("loading");
    startScanner(facingMode);
  };

  const handlePause = async () => {
    await stopScanner();
    setCameraState("paused");
  };

  const handleResume = () => {
    setCameraState("loading");
    startScanner(facingMode);
  };

  const handleSwitchCamera = () => {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    setCameraState("loading");
    startScanner(next);
  };

  const handleUploadQR = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const qr = new Html5Qrcode("qr-upload-temp");
    qr.scanFile(file, true)
      .then((text) => {
        qr.clear();
        handleScanSuccess(text);
      })
      .catch(() => {
        qr.clear();
        setError("invalid_qr");
        setScanned(true);
      });
  };

  if (success) {
    return (
      <div className="qr-scanner-page">
        <div className="qr-success-screen">
          <SuccessAnimation message="Attendance Recorded Successfully!" />
        </div>
      </div>
    );
  }

  return (
    <div className="qr-scanner-page">
      {/* Hidden element for file upload scanning */}
      <div id="qr-upload-temp" style={{ display: "none" }} />

      {/* Header */}
      <motion.div
        className="qr-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="qr-header-left">
          <button
            className="qr-back-btn"
            onClick={() => navigate("/student/sessions")}
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1>Scan Attendance QR</h1>
            <p>Point your camera at the QR code displayed by your teacher.</p>
          </div>
        </div>
        <div className="qr-header-time">
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

      <div className="qr-body-grid">
        {/* Scanner Column */}
        <div className="qr-scanner-column">
          <motion.div
            className="qr-scanner-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="qr-scanner-viewport">
              {/* Camera element */}
              <div
                id={SCANNER_ELEMENT_ID}
                className={`qr-video-container ${scanned || cameraState === "paused" ? "hidden" : ""}`}
              />

              {/* Overlay states */}
              <AnimatePresence>
                {!scanned && cameraState !== "ready" && (
                  <motion.div
                    className="qr-overlay-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CameraPermissionCard
                      status={cameraState}
                      onRetry={handleRetry}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Scanning frame — shown only when camera is active and not yet scanned */}
              {!scanned && cameraState === "ready" && <ScannerFrame active />}

              {/* Demo hint */}
              {!scanned && cameraState === "ready" && (
                <motion.div
                  className="qr-demo-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Demo: auto-scans in 5 seconds
                </motion.div>
              )}
            </div>

            {/* Scanner controls */}
            <div className="qr-controls">
              <button
                className="qr-ctrl-btn"
                onClick={handleSwitchCamera}
                title="Switch Camera"
              >
                <FiRefreshCw /> Switch
              </button>

              {cameraState === "ready" ? (
                <button
                  className="qr-ctrl-btn qr-ctrl-pause"
                  onClick={handlePause}
                  title="Pause"
                >
                  <FiPause /> Pause
                </button>
              ) : cameraState === "paused" ? (
                <button
                  className="qr-ctrl-btn qr-ctrl-resume"
                  onClick={handleResume}
                  title="Resume"
                >
                  <FiPlay /> Resume
                </button>
              ) : null}

              <label
                className="qr-ctrl-btn qr-ctrl-upload"
                title="Upload QR Image"
              >
                <FiUpload /> Upload
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleUploadQR}
                />
              </label>

              <button
                className="qr-ctrl-btn qr-ctrl-cancel"
                onClick={() => navigate("/student/sessions")}
              >
                <FiX /> Cancel
              </button>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            className="qr-instructions-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="qi-header">
              <FiCamera /> Instructions
            </div>
            <ol>
              <li>
                Point your camera towards the QR code shown by your teacher.
              </li>
              <li>Keep the QR code steady inside the scanning frame.</li>
              <li>
                Ensure GPS / Location services are enabled on your device.
              </li>
              <li>
                Attendance is recorded only if you are within the allowed
                radius.
              </li>
            </ol>
          </motion.div>
        </div>

        {/* Right column — detected session / errors */}
        <div className="qr-info-column">
          <AnimatePresence mode="wait">
            {!scanned && !detectedSession && !error && (
              <motion.div
                key="waiting"
                className="qr-waiting-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="qr-waiting-icon"
                  animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  📷
                </motion.div>
                <h4>Waiting for QR Code</h4>
                <p>
                  Scan the QR code displayed by your teacher to see session
                  details here.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ScannerErrorCard errorType={error} onRetry={handleRetry} />
              </motion.div>
            )}

            {detectedSession && !error && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SessionPreviewCard
                  session={detectedSession}
                  onVerify={handleVerifyLocation}
                  verifying={verifying}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
