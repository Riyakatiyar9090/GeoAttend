import { motion } from "framer-motion";
import { FiDownload, FiCalendar } from "react-icons/fi";
import AnalyticsCards from "../../components/AnalyticsCards/AnalyticsCards";
import AttendanceLineChart from "../../components/AttendanceLineChart/AttendanceLineChart";
import AttendanceBarChart from "../../components/AttendanceBarChart/AttendanceBarChart";
import AttendancePieChart from "../../components/AttendancePieChart/AttendancePieChart";
import AttendanceHeatmap from "../../components/AttendanceHeatmap/AttendanceHeatmap";
import TopPerformers from "../../components/TopPerformers/TopPerformers";
import AnalyticsInsights from "../../components/AnalyticsInsights/AnalyticsInsights";
import LowAttendanceAlert from "../../components/LowAttendanceAlert/LowAttendanceAlert";
import AnalyticsSidebar from "../../components/AnalyticsSidebar/AnalyticsSidebar";
import { TOP_STUDENTS, TOP_CLASSES, TOP_SUBJECTS } from "./analyticsData";
import "./TeacherAnalytics.css";

export default function TeacherAnalytics() {
  return (
    <div className="teacher-analytics-page">
      {/* Header */}
      <motion.div
        className="ta-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Analytics Dashboard</h1>
          <p>
            Track attendance trends and student engagement across all sessions.
          </p>
        </div>
        <div className="ta-header-right">
          <div className="ta-date-range">
            <FiCalendar />
            <select defaultValue="month">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="semester">This Semester</option>
            </select>
          </div>
          <button
            className="ta-export-btn"
            onClick={() => alert("Export — backend pending")}
          >
            <FiDownload /> Export Analytics
          </button>
        </div>
      </motion.div>

      {/* Summary cards */}
      <AnalyticsCards />

      {/* Main layout */}
      <div className="ta-main-layout">
        {/* Left / center content */}
        <div className="ta-content-col">
          <AttendanceLineChart />

          <div className="ta-charts-row">
            <AttendanceBarChart />
            <AttendancePieChart />
          </div>

          <AttendanceHeatmap />

          <TopPerformers
            students={TOP_STUDENTS}
            classes={TOP_CLASSES}
            subjects={TOP_SUBJECTS}
          />

          <AnalyticsInsights />
          <LowAttendanceAlert />
        </div>

        {/* Right sidebar */}
        <div className="ta-sidebar-col">
          <AnalyticsSidebar />
        </div>
      </div>
    </div>
  );
}
