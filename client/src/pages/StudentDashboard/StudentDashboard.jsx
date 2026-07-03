import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiAlertTriangle,
  FiActivity,
  FiPercent,
  FiPlay,
  FiCamera,
  FiClock as FiHistoryIcon,
  FiUser,
} from "react-icons/fi";
import { BsQrCodeScan } from "react-icons/bs";
import StatsCard from "../../components/StatsCard/StatsCard";
import QuickActionCard from "../../components/QuickActionCard/QuickActionCard";
import {
  MonthlyAttendanceChart,
  WeeklyAttendanceChart,
} from "../../components/AttendanceChart/AttendanceChart";
import ActiveSessionCard from "../../components/ActiveSessionCard/ActiveSessionCard";
import AttendanceTable from "../../components/AttendanceTable/AttendanceTable";
import CalendarWidget from "../../components/CalendarWidget/CalendarWidget";
import NotificationCard from "../../components/NotificationCard/NotificationCard";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import "./StudentDashboard.css";

const student = {
  name: "Riya Mehta",
  branch: "Computer Science",
  year: "3rd Year",
  rollNumber: "CS21B045",
};

const activeSession = {
  subject: "Database Management Systems",
  faculty: "Dr. Neha Kapoor",
  room: "Room 204",
  time: "10:00 AM - 11:00 AM",
};

const attendanceRecords = [
  {
    subject: "DBMS",
    faculty: "Dr. Neha Kapoor",
    date: "Jun 28, 2026",
    status: "Present",
    verified: true,
  },
  {
    subject: "Operating Systems",
    faculty: "Prof. Arjun Rao",
    date: "Jun 27, 2026",
    status: "Present",
    verified: true,
  },
  {
    subject: "Computer Networks",
    faculty: "Dr. Sana Iyer",
    date: "Jun 26, 2026",
    status: "Late",
    verified: true,
  },
  {
    subject: "Software Engineering",
    faculty: "Prof. Vivek Nair",
    date: "Jun 25, 2026",
    status: "Absent",
    verified: false,
  },
];

const notifications = [
  {
    type: "session",
    title: "DBMS attendance session is now live",
    time: "2m ago",
    unread: true,
  },
  {
    type: "reminder",
    title: "Don't forget to mark today's attendance",
    time: "1h ago",
    unread: true,
  },
  {
    type: "announcement",
    title: "Mid-sem schedule has been updated",
    time: "3h ago",
    unread: false,
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const today = new Date();

  return (
    <div className="student-dashboard">
      <motion.div
        className="dashboard-greeting"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Good Morning, {student.name.split(" ")[0]} 👋</h1>
          <p>Ready to mark today's attendance?</p>
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
        <StatsCard type="progress" value={92} label="Attendance" index={0} />
        <StatsCard
          type="number"
          icon={<FiBookOpen />}
          accent="var(--gradient-primary)"
          value={82}
          label="Classes Attended"
          index={1}
        />
        <StatsCard
          type="number"
          icon={<FiAlertTriangle />}
          accent="linear-gradient(135deg,#F59E0B,#EF4444)"
          value={7}
          label="Classes Missed"
          index={2}
        />
        <StatsCard
          type="live"
          icon={<FiActivity />}
          value="1 Live"
          label="Active Session"
          index={3}
        />
      </div>

      <div className="dashboard-section">
        <h2 className="section-heading">Quick Actions</h2>
        <div className="quick-actions-grid">
          <QuickActionCard
            icon={<FiPlay />}
            title="Join Active Session"
            description="Jump into your live class session."
            gradient="var(--gradient-primary)"
            onClick={() => navigate("/student/sessions")}
            index={0}
          />
          <QuickActionCard
            icon={<BsQrCodeScan />}
            title="Scan QR Code"
            description="Mark attendance instantly via QR."
            gradient="linear-gradient(135deg,#06B6D4,#2563EB)"
            onClick={() => navigate("/student/qr-scanner")}
            index={1}
          />
          <QuickActionCard
            icon={<FiHistoryIcon />}
            title="Attendance History"
            description="Review your full attendance record."
            gradient="linear-gradient(135deg,#4F46E5,#0F172A)"
            onClick={() => navigate("/student/attendance")}
            index={2}
          />
          <QuickActionCard
            icon={<FiUser />}
            title="View Profile"
            description="Update your personal information."
            gradient="linear-gradient(135deg,#10B981,#06B6D4)"
            onClick={() => navigate("/student/profile")}
            index={3}
          />
        </div>
      </div>

      <div className="dashboard-grid-main">
        <div className="dashboard-col-left">
          <div className="charts-row">
            <MonthlyAttendanceChart />
            <WeeklyAttendanceChart />
          </div>
          <AttendanceTable records={attendanceRecords} />
        </div>

        <div className="dashboard-col-right">
          <ActiveSessionCard
            session={activeSession}
            onJoin={() => navigate("/student/qr-scanner")}
            onRefresh={() => {}}
          />
          <CalendarWidget
            year={today.getFullYear()}
            month={today.getMonth()}
            today={today.getDate()}
            sessionDays={[2, 5, 9, 14, 18, 23, 27]}
          />
          <NotificationCard notifications={notifications} />
          <ProfileCard
            student={student}
            onEdit={() => navigate("/student/profile")}
          />
        </div>
      </div>

      <motion.button
        className="fab-qr-scanner"
        onClick={() => navigate("/student/qr-scanner")}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiCamera />
      </motion.button>
    </div>
  );
}
