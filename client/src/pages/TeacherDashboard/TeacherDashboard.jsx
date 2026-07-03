import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiActivity,
  FiCheckCircle,
  FiPlusCircle,
  FiGrid,
  FiEye,
  FiBarChart2,
  FiUserCheck,
} from "react-icons/fi";
import StatsCard from "../../components/StatsCard/StatsCard";
import QuickActionCard from "../../components/QuickActionCard/QuickActionCard";
import SessionCard from "../../components/SessionCard/SessionCard";
import {
  WeeklyAttendanceLineChart,
  ClassPerformanceBarChart,
} from "../../components/AnalyticsChart/AnalyticsChart";
import TeacherAttendanceTable from "../../components/TeacherAttendanceTable/TeacherAttendanceTable";
import StudentOverviewCard from "../../components/StudentOverviewCard/StudentOverviewCard";
import Timeline from "../../components/Timeline/Timeline";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import "./TeacherDashboard.css";

const teacher = { name: "Dr. Neha Kapoor" };

const todaysSessions = [
  {
    subject: "Database Management",
    className: "CS-A, 3rd Year",
    time: "10:00 - 11:00 AM",
    status: "Live",
    studentsPresent: 56,
    totalStudents: 60,
  },
  {
    subject: "Software Engineering",
    className: "CS-B, 3rd Year",
    time: "12:00 - 1:00 PM",
    status: "Scheduled",
    studentsPresent: 0,
    totalStudents: 58,
  },
  {
    subject: "Operating Systems",
    className: "IT-A, 2nd Year",
    time: "9:00 - 10:00 AM",
    status: "Ended",
    studentsPresent: 52,
    totalStudents: 55,
  },
];

const attendanceRecords = [
  {
    subject: "Database Management",
    className: "CS-A",
    present: 56,
    absent: 4,
    percentage: 93,
  },
  {
    subject: "Operating Systems",
    className: "IT-A",
    present: 52,
    absent: 3,
    percentage: 95,
  },
  {
    subject: "Computer Networks",
    className: "EC-A",
    present: 38,
    absent: 8,
    percentage: 83,
  },
  {
    subject: "Software Engineering",
    className: "CS-B",
    present: 41,
    absent: 17,
    percentage: 71,
  },
];

const overviewStats = [
  { label: "Highest Attendance", value: "CS-A · 95%", tone: "success" },
  { label: "Lowest Attendance", value: "CS-B · 71%", tone: "danger" },
  { label: "Most Active Class", value: "IT-A", tone: "primary" },
  { label: "Average Attendance", value: "91%", tone: "accent" },
];

const timelineEvents = [
  {
    type: "created",
    text: "Created session for Database Management (CS-A)",
    time: "9 minutes ago",
  },
  {
    type: "qr",
    text: "QR code generated for active session",
    time: "8 minutes ago",
  },
  {
    type: "joined",
    text: "12 students joined via QR scan",
    time: "5 minutes ago",
  },
  {
    type: "closed",
    text: "Closed Operating Systems session (IT-A)",
    time: "1 hour ago",
  },
];

const notifications = [
  {
    type: "session",
    title: "Software Engineering session starts in 30 minutes",
    time: "15m ago",
    unread: true,
  },
  {
    type: "reminder",
    title: "CS-B attendance dropped below 75% this week",
    time: "2h ago",
    unread: true,
  },
  {
    type: "announcement",
    title: "New semester timetable has been published",
    time: "5h ago",
    unread: false,
  },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const today = new Date();
  const hasSessions = todaysSessions.length > 0;

  return (
    <div className="teacher-dashboard">
      <motion.div
        className="dashboard-greeting"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Good Morning, Professor 👋</h1>
          <p>Ready to take today's attendance?</p>
        </div>
        <span className="greeting-date">
          {today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>
      </motion.div>

      <div className="stats-grid">
        <StatsCard
          type="number"
          icon={<FiUsers />}
          accent="var(--gradient-primary)"
          value={240}
          label="Total Students"
          index={0}
        />
        <StatsCard
          type="live"
          icon={<FiActivity />}
          value="3 Active"
          label="Active Sessions"
          index={1}
        />
        <StatsCard
          type="number"
          icon={<FiCheckCircle />}
          accent="linear-gradient(135deg,#10B981,#06B6D4)"
          value={188}
          label="Attendance Today"
          index={2}
        />
        <StatsCard
          type="progress"
          value={91}
          label="Average Attendance"
          index={3}
        />
      </div>

      <div className="dashboard-section">
        <h2 className="section-heading">Quick Actions</h2>
        <div className="quick-actions-grid">
          <QuickActionCard
            icon={<FiPlusCircle />}
            title="Create Session"
            description="Start a new attendance session."
            gradient="var(--gradient-primary)"
            onClick={() => navigate("/teacher/sessions")}
            index={0}
          />
          <QuickActionCard
            icon={<FiGrid />}
            title="Generate QR Code"
            description="Create a QR code for check-in."
            gradient="linear-gradient(135deg,#06B6D4,#2563EB)"
            onClick={() => navigate("/teacher/qr-scanner")}
            index={1}
          />
          <QuickActionCard
            icon={<FiEye />}
            title="View Attendance"
            description="Browse attendance by class."
            gradient="linear-gradient(135deg,#4F46E5,#0F172A)"
            onClick={() => navigate("/teacher/attendance")}
            index={2}
          />
          <QuickActionCard
            icon={<FiBarChart2 />}
            title="Analytics"
            description="See trends across all classes."
            gradient="linear-gradient(135deg,#10B981,#06B6D4)"
            onClick={() => navigate("/teacher/analytics")}
            index={3}
          />
          <QuickActionCard
            icon={<FiUserCheck />}
            title="Manage Students"
            description="View and manage your roster."
            gradient="linear-gradient(135deg,#F59E0B,#EF4444)"
            onClick={() => navigate("/teacher/students")}
            index={4}
          />
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-heading">Today's Sessions</h2>
        {hasSessions ? (
          <div className="sessions-grid">
            {todaysSessions.map((s, i) => (
              <SessionCard
                key={i}
                session={s}
                index={i}
                onStart={() => navigate("/teacher/sessions")}
                onEdit={() => navigate("/teacher/sessions")}
              />
            ))}
          </div>
        ) : (
          <div className="empty-sessions-card">
            <div className="empty-illustration">🗓️</div>
            <h4>No active sessions</h4>
            <p>Create a session to start taking attendance today.</p>
            <button
              className="create-session-btn"
              onClick={() => navigate("/teacher/sessions")}
            >
              Create Session
            </button>
          </div>
        )}
      </div>

      <div className="dashboard-grid-main">
        <div className="dashboard-col-left">
          <div className="charts-row">
            <WeeklyAttendanceLineChart />
            <ClassPerformanceBarChart />
          </div>
          <TeacherAttendanceTable
            records={attendanceRecords}
            onView={(r) => navigate("/teacher/attendance")}
          />
        </div>

        <div className="dashboard-col-right">
          <StudentOverviewCard stats={overviewStats} />
          <Timeline events={timelineEvents} />
          <NotificationCard notifications={notifications} />
        </div>
      </div>

      <motion.button
        className="fab-create-session"
        onClick={() => navigate("/teacher/sessions")}
        animate={{
          boxShadow: [
            "0 8px 28px rgba(37,99,235,0.35)",
            "0 8px 36px rgba(37,99,235,0.55)",
            "0 8px 28px rgba(37,99,235,0.35)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiPlusCircle />
      </motion.button>
    </div>
  );
}
