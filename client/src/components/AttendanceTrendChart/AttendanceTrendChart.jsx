import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DAILY_TREND,
  MONTHLY_DATA,
  PIE_DATA,
} from "../../pages/StudentAnalytics/analyticsStudentData";
import "./AttendanceTrendChart.css";

const CustomTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="atc-tip">
      <p>{label}</p>
      <span style={{ color: payload[0].color || "#2563EB" }}>
        {payload[0].value}%
      </span>
    </div>
  );
};

export function TrendLineChart() {
  return (
    <motion.div
      className="atc-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="atc-header">
        <h3>Attendance Trend — Last 30 Days</h3>
        <p>Daily attendance percentage</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={DAILY_TREND}>
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
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
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval={5}
          />
          <YAxis
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            domain={[50, 100]}
            unit="%"
          />
          <Tooltip content={<CustomTip />} />
          <Area
            type="monotone"
            dataKey="pct"
            stroke="#2563EB"
            strokeWidth={2.5}
            fill="url(#trendGrad)"
            dot={false}
            activeDot={{ r: 5 }}
            animationDuration={1400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function SubjectBarChart({ data }) {
  const getColor = (pct) =>
    pct >= 90
      ? "#10B981"
      : pct >= 75
        ? "#2563EB"
        : pct >= 60
          ? "#F59E0B"
          : "#EF4444";
  return (
    <motion.div
      className="atc-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="atc-header">
        <h3>Subject-wise Attendance</h3>
        <p>Percentage by course</p>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(15,23,42,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.split(" ")[0]}
          />
          <YAxis
            stroke="#64748B"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip
            content={<CustomTip />}
            cursor={{ fill: "rgba(37,99,235,0.04)" }}
          />
          <Bar dataKey="pct" radius={[6, 6, 0, 0]} animationDuration={1200}>
            {data.map((d, i) => (
              <Cell key={i} fill={getColor(d.pct)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function PieDistribution() {
  return (
    <motion.div
      className="atc-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div className="atc-header">
        <h3>Attendance Distribution</h3>
        <p>Present · Absent · Late</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={PIE_DATA}
            dataKey="value"
            innerRadius={52}
            outerRadius={78}
            paddingAngle={4}
            animationDuration={900}
          >
            {PIE_DATA.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            iconType="circle"
            iconSize={9}
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function MonthlyAreaChart() {
  return (
    <motion.div
      className="atc-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="atc-header">
        <h3>Monthly Attendance Trend</h3>
        <p>6-month overview</p>
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
            dataKey="pct"
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
