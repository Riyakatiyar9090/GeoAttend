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
} from "recharts";
import "./AttendanceChart.css";

const monthlyData = [
  { month: "Jan", attendance: 88 },
  { month: "Feb", attendance: 91 },
  { month: "Mar", attendance: 85 },
  { month: "Apr", attendance: 94 },
  { month: "May", attendance: 90 },
  { month: "Jun", attendance: 92 },
];

const weeklyData = [
  { day: "Mon", classes: 5 },
  { day: "Tue", classes: 4 },
  { day: "Wed", classes: 6 },
  { day: "Thu", classes: 3 },
  { day: "Fri", classes: 5 },
  { day: "Sat", classes: 2 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p>{label}</p>
      <span>
        {payload[0].value}
        {payload[0].dataKey === "attendance" ? "%" : " classes"}
      </span>
    </div>
  );
};

export function MonthlyAttendanceChart() {
  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="chart-header">
        <h3>Attendance Analytics</h3>
        <span className="chart-subtitle">Monthly trend</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={monthlyData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(15,23,42,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
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

export function WeeklyAttendanceChart() {
  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="chart-header">
        <h3>Weekly Attendance</h3>
        <span className="chart-subtitle">Classes this week</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={weeklyData}>
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
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="classes"
            fill="#06B6D4"
            radius={[6, 6, 0, 0]}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
