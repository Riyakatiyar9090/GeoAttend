export const DAILY_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 5, i + 1);
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    attendance: Math.round(75 + Math.random() * 22),
    present: Math.round(40 + Math.random() * 20),
    absent: Math.round(3 + Math.random() * 10),
  };
});

export const SUBJECT_DATA = [
  { subject: "DBMS", attendance: 94 },
  { subject: "OS", attendance: 88 },
  { subject: "Networks", attendance: 76 },
  { subject: "SE", attendance: 82 },
  { subject: "DSA", attendance: 91 },
  { subject: "Web Dev", attendance: 86 },
];

export const PIE_DATA = [
  { name: "Present", value: 68, color: "#10B981" },
  { name: "Absent", value: 18, color: "#EF4444" },
  { name: "Late", value: 14, color: "#F59E0B" },
];

export const MONTHLY_DATA = [
  { month: "Jan", attendance: 88 },
  { month: "Feb", attendance: 82 },
  { month: "Mar", attendance: 91 },
  { month: "Apr", attendance: 85 },
  { month: "May", attendance: 89 },
  { month: "Jun", attendance: 93 },
];

export const TOP_STUDENTS = [
  { name: "Rahul Sharma", roll: "CS21B012", pct: 98 },
  { name: "Priya Singh", roll: "CS21B045", pct: 97 },
  { name: "Sneha Iyer", roll: "CS21B058", pct: 96 },
  { name: "Riya Verma", roll: "CS21B031", pct: 95 },
  { name: "Aman Gupta", roll: "CS21B017", pct: 94 },
];

export const TOP_CLASSES = [
  { name: "CSE-A", subject: "DBMS", pct: 94 },
  { name: "IT-A", subject: "Operating Systems", pct: 91 },
  { name: "CSE-B", subject: "DSA", pct: 89 },
  { name: "EC-A", subject: "Networks", pct: 86 },
  { name: "ME-A", subject: "Software Engg.", pct: 82 },
];

export const TOP_SUBJECTS = [
  { name: "Database Management", sessions: 24, pct: 94 },
  { name: "Data Structures", sessions: 22, pct: 91 },
  { name: "Operating Systems", sessions: 20, pct: 88 },
  { name: "Web Development", sessions: 18, pct: 86 },
  { name: "Computer Networks", sessions: 19, pct: 76 },
];

export const LOW_ATTENDANCE = [
  {
    name: "Karan Patel",
    roll: "CS21B022",
    pct: 62,
    subject: "Computer Networks",
  },
  {
    name: "Tanya Roy",
    roll: "CS21B063",
    pct: 68,
    subject: "Software Engineering",
  },
  { name: "Vikram Joshi", roll: "CS21B007", pct: 71, subject: "DBMS" },
  {
    name: "Anjali Nair",
    roll: "CS21B039",
    pct: 73,
    subject: "Operating Systems",
  },
];

export const INSIGHTS = [
  {
    emoji: "📈",
    text: "Attendance increased by 8% this week compared to last week.",
    tone: "success",
  },
  {
    emoji: "📅",
    text: "Monday has the highest attendance (94%) across all subjects.",
    tone: "primary",
  },
  {
    emoji: "⚠️",
    text: "Computer Networks has the lowest attendance rate (76%).",
    tone: "warning",
  },
  {
    emoji: "🏆",
    text: "CSE-A is the best performing class this month.",
    tone: "success",
  },
  {
    emoji: "📉",
    text: "Friday attendance dips by an average of 12% vs weekdays.",
    tone: "danger",
  },
];

export const UPCOMING_SESSIONS = [
  { subject: "DBMS", className: "CSE-A", time: "10:00 AM", room: "Room 204" },
  {
    subject: "Software Engineering",
    className: "CSE-B",
    time: "12:00 PM",
    room: "Room 301",
  },
  {
    subject: "Computer Networks",
    className: "EC-A",
    time: "2:00 PM",
    room: "Lab 3",
  },
];

export const HEATMAP_DATA = (() => {
  const data = {};
  for (let d = 1; d <= 30; d++) {
    data[d] = Math.floor(Math.random() * 5); // 0-4 intensity
  }
  return data;
})();
