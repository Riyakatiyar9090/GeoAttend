const firstNames = [
  "Rahul",
  "Priya",
  "Arjun",
  "Riya",
  "Karan",
  "Sneha",
  "Aman",
  "Tanya",
  "Vikram",
  "Anjali",
  "Rohan",
  "Divya",
  "Nikhil",
  "Pooja",
  "Sanjay",
  "Meera",
  "Kartik",
  "Shreya",
  "Aditya",
  "Kavya",
];
const lastNames = [
  "Sharma",
  "Singh",
  "Mehta",
  "Verma",
  "Patel",
  "Iyer",
  "Gupta",
  "Roy",
  "Joshi",
  "Nair",
  "Kumar",
  "Reddy",
  "Rao",
  "Shah",
  "Das",
  "Pillai",
  "Chaudhary",
  "Mishra",
  "Pandey",
  "Bose",
];
const departments = [
  "Computer Science",
  "Information Technology",
  "Electronics & Comm.",
  "Mechanical Engg.",
];
const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
const sections = ["A", "B", "C"];
const statuses = [
  "Active",
  "Active",
  "Active",
  "Active",
  "Inactive",
  "Active",
  "Blocked",
  "Active",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const STUDENTS = Array.from({ length: 100 }, (_, i) => {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const dept = randomItem(departments);
  const sem = randomItem(semesters);
  const sec = randomItem(sections);
  const deptCode = {
    "Computer Science": "CS",
    "Information Technology": "IT",
    "Electronics & Comm.": "EC",
    "Mechanical Engg.": "ME",
  }[dept];
  const pct = randomInt(52, 99);
  const joinDate = new Date(2025, randomInt(6, 11), randomInt(1, 28));
  const lastAttDate = new Date(2026, 5, randomInt(20, 30));
  return {
    id: `STU-${1000 + i}`,
    name: `${firstName} ${lastName}`,
    roll: `${deptCode}21B0${String(i + 1).padStart(2, "0")}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@college.edu`,
    department: dept,
    semester: sem,
    section: sec,
    attendance: pct,
    status: randomItem(statuses),
    lastAttendance: lastAttDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    joinDate: joinDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    regNo: `2021${deptCode}${String(i + 1).padStart(4, "0")}`,
    phone: `+91 ${randomInt(7, 9)}${randomInt(100000000, 999999999)}`,
  };
});

export const DEPARTMENTS = [
  "All",
  ...new Set(STUDENTS.map((s) => s.department)),
];
export const SEMESTERS = ["All", "1st", "2nd", "3rd", "4th", "5th", "6th"];
export const SECTIONS = ["All", "A", "B", "C"];
