import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DAILY_DATA,
  MONTHLY_DATA,
} from "../../pages/TeacherAnalytics/analyticsData";
import "./AttendanceLineChart.css";

const CustomTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      <p>{label}</p>
      {payload.map((p) => (
        <span key={p.name} style={{ color: p.color }}>
          {p.name}:{" "}
          <strong>
            {p.value}
            {p.name === "attendance" ? "%" : ""}
          </strong>
        </span>
      ))}
    </div>
  );
};

export default function AttendanceLineChart() {
  return (
    <motion.div
      className="line-chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chart-card-header">
        <div>
          <h3>Daily Attendance — Last 30 Days</h3>
          <p>Attendance percentage trend over the past month</p>
        </div>
        <span className="chart-badge">Live Data</span>
      </div>
      <ResponsiveContainer width="100%" height={270}>
        <AreaChart data={DAILY_DATA}>
          <defs>
            <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(15,23,42,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={[60, 100]}
            unit="%"
          />
          <Tooltip content={<CustomTip />} />
          <Area
            type="monotone"
            dataKey="attendance"
            name="attendance"
            stroke="#2563EB"
            strokeWidth={2.5}
            fill="url(#attendanceGrad)"
            dot={false}
            activeDot={{ r: 5 }}
            animationDuration={1400}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="chart-card-header" style={{ marginTop: 28 }}>
        <div>
          <h3>Monthly Attendance Trend</h3>
          <p>6-month overview</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={MONTHLY_DATA}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(15,23,42,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
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
            domain={[60, 100]}
            unit="%"
          />
          <Tooltip content={<CustomTip />} />
          <Line
            type="monotone"
            dataKey="attendance"
            name="attendance"
            stroke="#06B6D4"
            strokeWidth={3}
            dot={{ fill: "#06B6D4", r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
