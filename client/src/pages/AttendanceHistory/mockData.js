const subjects = [
  {
    name: "Database Management Systems",
    faculty: "Dr. Neha Kapoor",
    dept: "Computer Science",
  },
  {
    name: "Operating Systems",
    faculty: "Prof. Arjun Rao",
    dept: "Computer Science",
  },
  {
    name: "Computer Networks",
    faculty: "Dr. Sana Iyer",
    dept: "Electronics & Comm.",
  },
  {
    name: "Software Engineering",
    faculty: "Prof. Vivek Nair",
    dept: "Computer Science",
  },
  {
    name: "Data Structures",
    faculty: "Dr. Priya Mehta",
    dept: "Computer Science",
  },
  {
    name: "Web Development",
    faculty: "Ms. Kavya Reddy",
    dept: "Information Technology",
  },
];

const rooms = ["Room 204", "Room 112", "Room 301", "Lab 3", "Room 108"];
const statuses = [
  "Present",
  "Present",
  "Present",
  "Present",
  "Present",
  "Late",
  "Absent",
];
const verifications = [
  "Both",
  "Both",
  "QR Only",
  "Both",
  "Location Only",
  "Both",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const MOCK_RECORDS = Array.from({ length: 100 }, (_, i) => {
  const date = new Date(2026, 5, 30 - (i % 90));
  const subj = randomItem(subjects);
  const status = randomItem(statuses);
  return {
    id: `ATT-${1000 + i}`,
    date: formatDate(date),
    rawDate: date,
    subject: subj.name,
    faculty: subj.faculty,
    department: subj.dept,
    room: randomItem(rooms),
    checkInTime:
      status !== "Absent"
        ? formatTime(
            new Date(date.getTime() + Math.random() * 8 * 60000 + 2 * 60000),
          )
        : "—",
    status,
    verification: status === "Absent" ? "None" : randomItem(verifications),
  };
});

export const SUBJECTS = [...new Set(subjects.map((s) => s.name))];
