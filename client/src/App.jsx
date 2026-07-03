import { BrowserRouter, Routes, Route } from "react-router-dom";

// ========================= Marketing =========================
import Navbar from "./components/Navbar/Navbar";
import LandingPage from "./pages/LandingPage/LandingPage";

// ========================= Authentication =========================
import SelectRole from "./pages/SelectRole/SelectRole";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import OTPVerification from "./pages/OTPVerification/OTPVerification";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

// ========================= Layout =========================
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";

// ========================= Dashboards =========================
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard/TeacherDashboard";

// ========================= Teacher Pages =========================
import CreateSession from "./pages/CreateSession/CreateSession";
import SessionPreview from "./pages/SessionPreview/SessionPreview";
import LiveAttendance from "./pages/LiveAttendance/LiveAttendance";
import AttendanceReport from "./pages/AttendanceReport/AttendanceReport";
import TeacherAnalytics from "./pages/TeacherAnalytics/TeacherAnalytics";
import TeacherNotifications from "./pages/TeacherNotifications/TeacherNotifications";
import TeacherProfile from "./pages/TeacherProfile/TeacherProfile";
import TeacherSettings from "./pages/TeacherSettings/TeacherSettings";

// ========================= Student Pages =========================
import StudentActiveSessions from "./pages/StudentActiveSessions/StudentActiveSessions";
import QRScanner from "./pages/QRScanner/QRScanner";
import LocationVerification from "./pages/LocationVerification/LocationVerification";
import AttendanceSuccess from "./pages/AttendanceSuccess/AttendanceSuccess";
import AttendanceHistory from "./pages/AttendanceHistory/AttendanceHistory";
import AttendanceDetails from "./pages/AttendanceDetails/AttendanceDetails";
import ManageStudents from "./pages/ManageStudents/ManageStudents";
import StudentAnalytics from "./pages/StudentAnalytics/StudentAnalytics";

// ========================= Global Styles =========================
import "./styles/globals.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========================= PUBLIC ========================= */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
            </>
          }
        />

        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ========================= STUDENT ========================= */}

        <Route
          path="/student"
          element={
            <DashboardLayout
              basePath="/student"
              baseLabel="Student"
              role="student"
              userName="Riya Mehta"
            />
          }
        >
          {/* Dashboard */}
          <Route index element={<StudentDashboard />} />

          {/* Attendance Flow */}
          <Route path="sessions" element={<StudentActiveSessions />} />
          <Route path="qr-scanner" element={<QRScanner />} />
          <Route path="location-verify" element={<LocationVerification />} />
          <Route path="attendance-success" element={<AttendanceSuccess />} />

          {/* Attendance History */}
          <Route path="history" element={<AttendanceHistory />} />
          <Route path="history/details/:id" element={<AttendanceDetails />} />
          <Route path="analytics" element={<StudentAnalytics />} />
          {/* Future Student Pages */}
          {/*
         
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<StudentSettings />} />
          */}
        </Route>

        {/* ========================= TEACHER ========================= */}

        <Route
          path="/teacher"
          element={
            <DashboardLayout
              basePath="/teacher"
              baseLabel="Teacher"
              role="teacher"
              userName="Dr. Neha Kapoor"
            />
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="sessions" element={<CreateSession />} />
          <Route path="sessions/preview" element={<SessionPreview />} />
          <Route path="sessions/live" element={<LiveAttendance />} />
          <Route path="attendance-report" element={<AttendanceReport />} />
          <Route path="analytics" element={<TeacherAnalytics />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="profile" element={<TeacherProfile />} />
          <Route path="notifications" element={<TeacherNotifications />} />
          <Route path="settings" element={<TeacherSettings />} />
        </Route>

        {/* ========================= 404 ========================= */}

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
