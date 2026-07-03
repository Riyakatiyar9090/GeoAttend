import { useState } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiCalendar } from "react-icons/fi";
import AnalyticsSummary from "../../components/AnalyticsSummary/AnalyticsSummary";
import {
  TrendLineChart,
  SubjectBarChart,
  PieDistribution,
  MonthlyAreaChart,
} from "../../components/AttendanceTrendChart/AttendanceTrendChart";
import SubjectPerformanceTable from "../../components/SubjectPerformanceTable/SubjectPerformanceTable";
import AttendanceGoal from "../../components/AttendanceGoal/AttendanceGoal";
import AttendanceHeatmap from "../../components/AttendanceHeatmap/AttendanceHeatmap";
import InsightsCards from "../../components/InsightsCards/InsightsCards";
import StudentAchievements from "../../components/StudentAchievements/StudentAchievements";
import StudentAnalyticsSidebar from "../../components/StudentAnalyticsSidebar/StudentAnalyticsSidebar";
import StudentAttendanceTimeline from "../../components/StudentAttendanceTimeline/StudentAttendanceTimeline";
import { SUBJECT_PERFORMANCE } from "./analyticsStudentData";
import "./StudentAnalytics.css";

export default function StudentAnalytics() {
  const [semester, setSemester] = useState("5th Semester");

  return (
    <div className="student-analytics-page">
      {/* Header */}
      <motion.div
        className="sa-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1>Attendance Analytics</h1>
          <p>Monitor your attendance performance and academic progress.</p>
        </div>
        <div className="sa-header-right">
          <div className="sa-semester-picker">
            <FiCalendar />
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              {["1st", "2nd", "3rd", "4th", "5th", "6th"].map((s) => (
                <option key={s} value={`${s} Semester`}>
                  {s} Semester
                </option>
              ))}
            </select>
          </div>
          <button
            className="sa-export-btn"
            onClick={() => alert("Export — backend pending")}
          >
            <FiDownload /> Export Report
          </button>
        </div>
      </motion.div>

      {/* Summary */}
      <AnalyticsSummary />

      {/* Charts row 1 */}
      <TrendLineChart />

      <div className="sa-charts-row">
        <SubjectBarChart data={SUBJECT_PERFORMANCE} />
        <PieDistribution />
      </div>

      <MonthlyAreaChart />

      {/* Main grid */}
      <div className="sa-main-layout">
        <div className="sa-content-col">
          <SubjectPerformanceTable subjects={SUBJECT_PERFORMANCE} />
          <AttendanceHeatmap />
          <InsightsCards />
          <StudentAchievements />
          <StudentAttendanceTimeline />
        </div>

        <div className="sa-sidebar-col">
          <AttendanceGoal current={92} target={90} totalClasses={132} />
          <StudentAnalyticsSidebar />
        </div>
      </div>
    </div>
  );
}
