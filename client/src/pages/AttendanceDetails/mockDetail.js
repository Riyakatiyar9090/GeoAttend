export const MOCK_DETAIL = {
  id: "ATT-1042",
  sessionId: "GA-101",
  studentId: "STU-CS21B045",
  qrCodeId: "QR-GA101-1719723600",

  subject: "Database Management Systems",
  teacher: "Dr. Neha Kapoor",
  department: "Computer Science",
  courseCode: "CS501",
  semester: "5th Semester",
  room: "Room 204",
  building: "Block C — Computer Science Dept.",
  classTiming: "10:00 AM – 11:00 AM",
  attendanceWindow: "10:00 AM – 10:15 AM",

  date: "June 30, 2026",
  rawDate: new Date(2026, 5, 30),
  checkInTime: "10:03 AM",
  verificationTime: "10:03:18 AM",
  duration: "0m 18s",
  attendanceType: "QR + Geolocation",

  status: "Present",
  attendancePct: 92,
  streak: 10,
  presentCount: 44,
  monthlyPct: 96,

  verification: {
    qr: { status: true, time: "10:03:05 AM" },
    location: { status: true, time: "10:03:12 AM" },
    recorded: { status: true, time: "10:03:18 AM" },
    confirmation: { status: true, time: "10:03:19 AM" },
  },

  teacherCoords: { latitude: 28.6139, longitude: 77.209 },
  studentCoords: { latitude: 28.6141, longitude: 77.2093 },
  distance: 18.4,
  radius: 50,

  browser: "Chrome 126.0",
  device: "Desktop — Windows 11",
  ip: "192.168.1.***",
  network: "College Wi-Fi",

  qrGeneratedAt: "10:00:00 AM",
  qrExpiresAt: "10:01:00 AM",
};
