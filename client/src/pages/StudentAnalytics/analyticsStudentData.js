const SUBJECTS_RAW = [
  {
    name: "Database Management",
    faculty: "Dr. Neha Kapoor",
    total: 24,
    attended: 23,
  },
  {
    name: "Operating Systems",
    faculty: "Prof. Arjun Rao",
    total: 22,
    attended: 20,
  },
  {
    name: "Computer Networks",
    faculty: "Dr. Sana Iyer",
    total: 20,
    attended: 14,
  },
  {
    name: "Software Engineering",
    faculty: "Prof. Vivek Nair",
    total: 18,
    attended: 15,
  },
  {
    name: "Data Structures",
    faculty: "Dr. Priya Mehta",
    total: 22,
    attended: 22,
  },
  {
    name: "Web Development",
    faculty: "Ms. Kavya Reddy",
    total: 18,
    attended: 16,
  },
];

export const SUBJECT_PERFORMANCE = SUBJECTS_RAW.map((s) => ({
  ...s,
  pct: Math.round((s.attended / s.total) * 100),
  missed: s.total - s.attended,
  status:
    Math.round((s.attended / s.total) * 100) >= 90
      ? "Excellent"
      : Math.round((s.attended / s.total) * 100) >= 75
        ? "Good"
        : Math.round((s.attended / s.total) * 100) >= 60
          ? "Warning"
          : "Critical",
}));

export const DAILY_TREND = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 5, i + 1);
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    pct: Math.round(70 + Math.random() * 28),
  };
});

export const PIE_DATA = [
  { name: "Present", value: 110, color: "#10B981" },
  { name: "Absent", value: 14, color: "#EF4444" },
  { name: "Late", value: 8, color: "#F59E0B" },
];

export const MONTHLY_DATA = [
  { month: "Jan", pct: 88 },
  { month: "Feb", pct: 82 },
  { month: "Mar", pct: 91 },
  { month: "Apr", pct: 85 },
  { month: "May", pct: 89 },
  { month: "Jun", pct: 92 },
];

export const HEATMAP_DATA = (() => {
  const d = {};
  for (let i = 1; i <= 30; i++) d[i] = Math.floor(Math.random() * 5);
  return d;
})();

export const SUMMARY_SPARKS = {
  overall: [78, 82, 85, 88, 91, 92],
  attended: [88, 94, 102, 108, 112, 118],
  missed: [14, 12, 10, 9, 8, 14],
  streak: [4, 6, 8, 10, 10, 10],
  longest: [10, 10, 12, 12, 14, 14],
  below75: [3, 2, 2, 1, 1, 1],
};

export const TIMELINE_EVENTS = [
  {
    status: "Present",
    subject: "DBMS",
    time: "10:03 AM",
    date: "Today",
    icon: "✅",
    verified: true,
  },
  {
    status: "Late",
    subject: "Operating Systems",
    time: "11:14 AM",
    date: "Today",
    icon: "🟡",
    verified: true,
  },
  {
    status: "Present",
    subject: "Data Structures",
    time: "9:01 AM",
    date: "Yesterday",
    icon: "✅",
    verified: true,
  },
  {
    status: "Absent",
    subject: "Computer Networks",
    time: "—",
    date: "Yesterday",
    icon: "🔴",
    verified: false,
  },
  {
    status: "Present",
    subject: "Web Development",
    time: "2:05 PM",
    date: "Jun 28",
    icon: "✅",
    verified: true,
  },
];
