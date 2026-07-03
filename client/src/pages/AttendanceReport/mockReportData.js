const students = [
  { name: "Rahul Sharma", roll: "CS21B012" },
  { name: "Priya Singh", roll: "CS21B045" },
  { name: "Arjun Mehta", roll: "CS21B009" },
  { name: "Riya Verma", roll: "CS21B031" },
  { name: "Karan Patel", roll: "CS21B022" },
  { name: "Sneha Iyer", roll: "CS21B058" },
  { name: "Aman Gupta", roll: "CS21B017" },
  { name: "Tanya Roy", roll: "CS21B063" },
  { name: "Vikram Joshi", roll: "CS21B007" },
  { name: "Anjali Nair", roll: "CS21B039" },
];

const subjects = [
  {
    name: "Database Management Systems",
    teacher: "Dr. Neha Kapoor",
    session: "GA-101",
  },
  { name: "Operating Systems", teacher: "Prof. Arjun Rao", session: "GA-102" },
  { name: "Computer Networks", teacher: "Dr. Sana Iyer", session: "GA-103" },
  {
    name: "Software Engineering",
    teacher: "Prof. Vivek Nair",
    session: "GA-104",
  },
];

const statuses = ["Present", "Present", "Present", "Present", "Late", "Absent"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatDate(d) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(d) {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export const REPORT_RECORDS = Array.from({ length: 120 }, (_, i) => {
  const date = new Date(2026, 5, 30 - (i % 28));
  const student = randomItem(students);
  const subject = randomItem(subjects);
  const status = randomItem(statuses);
  return {
    id: `RPT-${2000 + i}`,
    student: student.name,
    roll: student.roll,
    subject: subject.name,
    teacher: subject.teacher,
    session: subject.session,
    date: formatDate(date),
    rawDate: date,
    checkInTime:
      status !== "Absent"
        ? formatTime(
            new Date(date.getTime() + 3 * 60000 + Math.random() * 8 * 60000),
          )
        : "—",
    locationVerified: status !== "Absent" ? Math.random() > 0.1 : false,
    status,
  };
});

export const SUBJECTS_LIST = [...new Set(subjects.map((s) => s.name))];

export const TIMELINE_EVENTS = [
  {
    type: "present",
    text: "Rahul Sharma marked Present",
    sub: "DBMS · Session GA-101",
    time: "2m ago",
  },
  {
    type: "late",
    text: "Anjali Nair marked Late",
    sub: "Operating Systems · Session GA-102",
    time: "8m ago",
  },
  {
    type: "session",
    text: "Computer Networks session completed",
    sub: "Dr. Sana Iyer · 42 students",
    time: "22m ago",
  },
  {
    type: "export",
    text: "Attendance report exported as PDF",
    sub: "DBMS · June 30",
    time: "1h ago",
  },
  {
    type: "absent",
    text: "Karan Patel marked Absent",
    sub: "Software Engineering · Session GA-104",
    time: "2h ago",
  },
];
