import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { STUDENTS } from "../../pages/ManageStudents/studentData";
import "./StudentDistribution.css";

const DEPT_COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444"];

export default function StudentDistribution() {
  const deptMap = {};
  STUDENTS.forEach((s) => {
    deptMap[s.department] = (deptMap[s.department] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([dept, count], i) => ({
    name: dept.split(" ")[0],
    value: count,
    color: DEPT_COLORS[i % DEPT_COLORS.length],
  }));

  const semMap = {};
  STUDENTS.forEach((s) => {
    semMap[s.semester] = (semMap[s.semester] || 0) + 1;
  });
  const semData = Object.entries(semMap)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([sem, count]) => ({ sem: `${sem} Sem`, count }));

  return (
    <div className="sd-grid">
      <motion.div
        className="sd-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Department Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={deptData}
              dataKey="value"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              animationDuration={900}
            >
              {deptData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="sd-legend">
          {deptData.map((d) => (
            <span key={d.name}>
              <i style={{ background: d.color }} />
              {d.name}: <strong>{d.value}</strong>
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="sd-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>Semester-wise Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={semData} barSize={28}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(15,23,42,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="sem"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#2563EB"
              radius={[6, 6, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="sd-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>Section Cards</h3>
        <div className="sd-section-cards">
          {["A", "B", "C"].map((sec) => {
            const count = STUDENTS.filter((s) => s.section === sec).length;
            return (
              <div key={sec} className="sd-sec-card">
                <h4>Section {sec}</h4>
                <strong>{count}</strong>
                <span>students</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
