import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LiveSessionHeader from "../../components/LiveSessionHeader/LiveSessionHeader";
import QRCodeCard from "../../components/QRCodeCard/QRCodeCard";
import AttendanceTimer from "../../components/AttendanceTimer/AttendanceTimer";
import SessionControls from "../../components/SessionControls/SessionControls";
import AttendanceCounter from "../../components/AttendanceCounter/AttendanceCounter";
import StudentTable from "../../components/StudentTable/StudentTable";
import Timeline from "../../components/Timeline/Timeline";
import AnalyticsPanel from "../../components/AnalyticsPanel/AnalyticsPanel";
import SummaryModal from "../../components/SummaryModal/SummaryModal";
import ToastContainer from "../../components/Toast/Toast";
import "./LiveAttendance.css";

const mockSession = {
  subject: "Database Management Systems",
  faculty: "Dr. Neha Kapoor",
  className: "CSE-A",
  room: "Room 204",
  date: "2026-06-30",
  startTime: "10:00",
  endTime: "11:00",
  radius: 30,
  allowLateEntry: true,
};

const initialStudents = [
  {
    id: 1,
    name: "Rahul Sharma",
    rollNumber: "CS21B012",
    time: "10:01 AM",
    locationOk: true,
    status: "Present",
  },
  {
    id: 2,
    name: "Priya Singh",
    rollNumber: "CS21B045",
    time: "10:02 AM",
    locationOk: true,
    status: "Present",
  },
  {
    id: 3,
    name: "Arjun Mehta",
    rollNumber: "CS21B009",
    time: "10:03 AM",
    locationOk: false,
    status: "Outside Radius",
  },
];

const namesPool = [
  "Riya Verma",
  "Karan Patel",
  "Sneha Iyer",
  "Aman Gupta",
  "Tanya Roy",
  "Vikram Joshi",
];

let nextId = 4;

export default function LiveAttendance() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = { ...mockSession, ...(location.state?.liveSession || {}) };

  const sessionLink = `https://geoattend.app/join?session=GA-${session.className}-001`;

  const [students, setStudents] = useState(initialStudents);
  const [elapsed, setElapsed] = useState(72);
  const [paused, setPaused] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([
    { type: "created", text: "Session started", time: "Just now" },
  ]);
  const [showSummary, setShowSummary] = useState(false);
  const totalSeconds = 60 * 60;
  const toastIdRef = useRef(0);

  const pushToast = useCallback((message, type = "success") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  }, []);

  // Elapsed timer
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [paused]);

  // Simulate new students joining (mock real-time feed)
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.4 && namesPool.length > 0) {
        const name = namesPool[Math.floor(Math.random() * namesPool.length)];
        const newStudent = {
          id: nextId++,
          name,
          rollNumber: `CS21B0${Math.floor(Math.random() * 90 + 10)}`,
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          locationOk: Math.random() > 0.15,
          status: Math.random() > 0.85 ? "Late" : "Present",
        };
        setStudents((prev) => [newStudent, ...prev]);
        pushToast(`${name} marked attendance.`, "success");
        setTimelineEvents((prev) => [
          {
            type: "joined",
            text: `${name} marked attendance`,
            time: "Just now",
          },
          ...prev,
        ]);
      }
    }, 7000);
    return () => clearInterval(interval);
  }, [paused, pushToast]);

  const present = students.filter((s) => s.status === "Present").length;
  const late = students.filter((s) => s.status === "Late").length;
  const absent = Math.max(45 - students.length, 0); // mock total class size of 45
  const total = present + late + absent;

  const handleQrRefresh = () => {
    pushToast("QR code refreshed.", "info");
    setTimelineEvents((prev) => [
      { type: "qr", text: "QR refreshed", time: "Just now" },
      ...prev,
    ]);
  };

  const handlePause = () => {
    setPaused(true);
    pushToast("Session paused.", "warning");
    setTimelineEvents((prev) => [
      {
        type: "closed",
        text: "Attendance paused by teacher",
        time: "Just now",
      },
      ...prev,
    ]);
  };

  const handleResume = () => {
    setPaused(false);
    pushToast("Session resumed.", "success");
    setTimelineEvents((prev) => [
      { type: "created", text: "Attendance resumed", time: "Just now" },
      ...prev,
    ]);
  };

  const handleExtend = () => {
    pushToast("Session extended by 15 minutes.", "info");
    setTimelineEvents((prev) => [
      {
        type: "created",
        text: "Session extended by 15 minutes",
        time: "Just now",
      },
      ...prev,
    ]);
  };

  const handleClose = () => {
    setShowSummary(true);
  };

  const formatElapsed = (s) => {
    const h = Math.floor(s / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  return (
    <div className="live-attendance-page">
      <LiveSessionHeader
        subject={session.subject}
        duration={formatElapsed(elapsed)}
      />

      <AttendanceCounter
        present={present}
        absent={absent}
        late={late}
        total={total}
      />

      <div className="live-attendance-grid">
        <div className="la-col-1">
          <div className="session-info-card">
            <h3>Session Information</h3>
            <div className="info-rows">
              <div>
                <span>Subject</span>
                <strong>{session.subject}</strong>
              </div>
              <div>
                <span>Teacher</span>
                <strong>{session.faculty}</strong>
              </div>
              <div>
                <span>Class</span>
                <strong>{session.className}</strong>
              </div>
              <div>
                <span>Room</span>
                <strong>{session.room}</strong>
              </div>
              <div>
                <span>Date</span>
                <strong>{session.date}</strong>
              </div>
              <div>
                <span>Start - End</span>
                <strong>
                  {session.startTime} - {session.endTime}
                </strong>
              </div>
              <div>
                <span>Radius</span>
                <strong>{session.radius}m</strong>
              </div>
              <div>
                <span>Late Entry</span>
                <strong>
                  {session.allowLateEntry ? "Enabled" : "Disabled"}
                </strong>
              </div>
              <div>
                <span>Status</span>
                <strong className={paused ? "status-paused" : "status-live"}>
                  {paused ? "Paused" : "Live"}
                </strong>
              </div>
            </div>
          </div>

          <QRCodeCard sessionLink={sessionLink} onRefresh={handleQrRefresh} />
          <AttendanceTimer
            elapsedSeconds={elapsed}
            totalSeconds={totalSeconds}
          />
          <SessionControls
            paused={paused}
            onPause={handlePause}
            onResume={handleResume}
            onExtend={handleExtend}
            onClose={handleClose}
          />
        </div>

        <div className="la-col-2">
          <StudentTable students={students} />
          <Timeline events={timelineEvents.slice(0, 6)} />
        </div>

        <div className="la-col-3">
          <AnalyticsPanel
            present={present}
            absent={absent}
            late={late}
            growthData={[
              { time: "10:00", total: 0 },
              { time: "10:05", total: 18 },
              { time: "10:10", total: 42 },
              { time: "10:15", total: present + late },
            ]}
            timeData={[
              { time: "10:00", count: 12 },
              { time: "10:05", count: 28 },
              { time: "10:10", count: 19 },
              { time: "10:15", count: present + late > 59 ? 10 : 8 },
            ]}
            quickStats={{
              avgTime: "2m 14s",
              fastest: "Rahul Sharma (0m 38s)",
              latest: students[0]?.name || "—",
              radiusViolations: students.filter((s) => !s.locationOk).length,
              duplicates: 0,
            }}
          />
        </div>
      </div>

      <SummaryModal
        open={showSummary}
        summary={{ present, absent, late, total }}
      />
      <ToastContainer toasts={toasts} />
    </div>
  );
}
