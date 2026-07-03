import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiRefreshCw, FiBell } from "react-icons/fi";
import StudentSessionCard from "../../components/StudentSessionCard/StudentSessionCard";
import DetailsDrawer from "../../components/DetailsDrawer/DetailsDrawer";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import NotificationBanner from "../../components/NotificationBanner/NotificationBanner";
import SkeletonCard from "../../components/SkeletonCard/SkeletonCard";
import "./StudentActiveSessions.css";

const mockSessions = [
  {
    id: "GA-101",
    subject: "Database Management Systems",
    teacher: "Dr. Neha Kapoor",
    department: "Computer Science",
    room: "Room 204",
    building: "Block C",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    radius: 30,
    status: "Live",
    remainingSeconds: 9 * 60 + 42,
    studentsJoined: 56,
    location: { latitude: 28.4595, longitude: 77.0266 },
    instructions:
      "Ensure location services are enabled before scanning the QR code. Attendance is marked only within the specified radius.",
    rules: [
      "One scan per student",
      "GPS must be enabled",
      "No attendance after session ends",
    ],
  },
  {
    id: "GA-102",
    subject: "Computer Networks",
    teacher: "Dr. Sana Iyer",
    department: "Electronics & Comm.",
    room: "Room 112",
    building: "Block B",
    startTime: "10:30 AM",
    endTime: "11:15 AM",
    radius: 20,
    status: "Ending Soon",
    remainingSeconds: 4 * 60 + 12,
    studentsJoined: 38,
    location: { latitude: 28.4601, longitude: 77.0271 },
    instructions:
      "This session is ending soon — scan the QR code immediately to mark your attendance.",
    rules: [
      "One scan per student",
      "GPS must be enabled",
      "Late entries are not accepted",
    ],
  },
  {
    id: "GA-103",
    subject: "Operating Systems",
    teacher: "Prof. Arjun Rao",
    department: "Computer Science",
    room: "Room 301",
    building: "Block A",
    startTime: "12:00 PM",
    endTime: "1:00 PM",
    radius: 50,
    status: "Upcoming",
    remainingSeconds: 95 * 60,
    studentsJoined: 0,
    location: { latitude: 28.4589, longitude: 77.0259 },
    instructions:
      "This session has not started yet. You will be able to join once your teacher activates it.",
    rules: ["One scan per student", "GPS must be enabled"],
  },
];

const upcomingSessions = [
  {
    id: "up-1",
    subject: "Software Engineering",
    teacher: "Prof. Vivek Nair",
    room: "Room 208",
    startsIn: "2h 15m",
  },
  {
    id: "up-2",
    subject: "Web Development Lab",
    teacher: "Ms. Kavya Reddy",
    room: "Lab 3",
    startsIn: "4h 30m",
  },
];

export default function StudentActiveSessions() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Sessions");
  const [drawerSession, setDrawerSession] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [now, setNow] = useState(new Date());

  // Initial load (mock fetch)
  useEffect(() => {
    const id = setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 1100);
    return () => clearTimeout(id);
  }, []);

  // Live clock for header
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Simulate a teacher starting a new session after a few seconds
  useEffect(() => {
    const id = setTimeout(() => setShowBanner(true), 5000);
    return () => clearTimeout(id);
  }, []);

  const filterMap = {
    "All Sessions": () => true,
    Active: (s) => s.status === "Live",
    "Ending Soon": (s) => s.status === "Ending Soon",
    Upcoming: (s) => s.status === "Upcoming",
  };

  const filteredSessions = useMemo(() => {
    return sessions
      .filter(filterMap[filter] || (() => true))
      .filter(
        (s) =>
          s.subject.toLowerCase().includes(search.toLowerCase()) ||
          s.teacher.toLowerCase().includes(search.toLowerCase()) ||
          s.room.toLowerCase().includes(search.toLowerCase()),
      );
  }, [sessions, search, filter]);

  const activeCount = sessions.filter(
    (s) => s.status === "Live" || s.status === "Ending Soon",
  ).length;

  const handleJoin = (session) => {
    navigate("/student/qr-scanner", {
      state: {
        sessionId: session.id,
        subject: session.subject,
        teacher: session.teacher,
        room: session.room,
        radius: session.radius,
        location: session.location,
      },
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="student-sessions-page">
      <motion.div
        className="sas-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Active Attendance Sessions</h1>
          <p>Join your ongoing attendance sessions before they expire.</p>
        </div>
        <div className="sas-header-meta">
          <span>
            {now.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>
            {now.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
          <span className="sas-active-count">{activeCount} Active Now</span>
        </div>
      </motion.div>

      <NotificationBanner
        show={showBanner}
        message="New Attendance Session Available — Computer Networks just went live."
        onDismiss={() => setShowBanner(false)}
      />

      <div className="sas-toolbar">
        <div className="sas-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by subject, faculty, or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <FilterDropdown value={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div className="sas-grid">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredSessions.length > 0 ? (
        <div className="sas-grid">
          {filteredSessions.map((session, i) => (
            <StudentSessionCard
              key={session.id}
              session={session}
              index={i}
              onJoin={handleJoin}
              onViewDetails={setDrawerSession}
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="sas-empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="sas-empty-illustration">📭</div>
          <h3>No Active Attendance Sessions</h3>
          <p>
            You'll see attendance sessions here once your teacher starts one.
          </p>
          <button className="sas-refresh-btn" onClick={handleRefresh}>
            <FiRefreshCw /> Refresh
          </button>
        </motion.div>
      )}

      <div className="sas-upcoming-section">
        <h2>Upcoming Sessions</h2>
        <div className="sas-upcoming-list">
          {upcomingSessions.map((s, i) => (
            <motion.div
              key={s.id}
              className="upcoming-row"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div>
                <h4>{s.subject}</h4>
                <p>
                  {s.teacher} · {s.room}
                </p>
              </div>
              <div className="upcoming-row-right">
                <span className="upcoming-starts-in">
                  Starts in {s.startsIn}
                </span>
                <button className="upcoming-remind-btn">
                  <FiBell /> Remind Me
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <DetailsDrawer
        session={drawerSession}
        onClose={() => setDrawerSession(null)}
      />
    </div>
  );
}
