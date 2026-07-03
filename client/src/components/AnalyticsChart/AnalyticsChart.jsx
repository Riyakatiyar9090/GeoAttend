import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./AnalyticsChart.css";

const weeklyAttendance = [
  { day: "Mon", attendance: 89 },
  { day: "Tue", attendance: 92 },
  { day: "Wed", attendance: 85 },
  { day: "Thu", attendance: 94 },
  { day: "Fri", attendance: 90 },
  { day: "Sat", attendance: 78 },
];

const classPerformance = [
  { class: "CS-A", attendance: 94 },
  { class: "CS-B", attendance: 87 },
  { class: "IT-A", attendance: 91 },
  { class: "EC-A", attendance: 83 },
  { class: "ME-A", attendance: 76 },
];

const barColor = (value) =>
  value >= 90 ? "#10B981" : value >= 80 ? "#06B6D4" : "#F59E0B";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ac-tooltip">
      <p>{label}</p>
      <span>{payload[0].value}%</span>
    </div>
  );
};

export function WeeklyAttendanceLineChart() {
  return (
    <motion.div
      className="analytics-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="analytics-header">
        <h3>Attendance Analytics</h3>
        <span>Weekly trend</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={weeklyAttendance}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(15,23,42,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[60, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#2563EB"
            strokeWidth={3}
            dot={{ fill: "#2563EB", r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function ClassPerformanceBarChart() {
  return (
    <motion.div
      className="analytics-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="analytics-header">
        <h3>Class Performance</h3>
        <span>Attendance % by class</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={classPerformance}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(15,23,42,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="class"
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="attendance"
            radius={[6, 6, 0, 0]}
            animationDuration={1200}
          >
            {classPerformance.map((entry, i) => (
              <Cell key={i} fill={barColor(entry.attendance)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
