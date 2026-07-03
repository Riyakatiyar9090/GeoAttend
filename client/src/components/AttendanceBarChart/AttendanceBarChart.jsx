import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { SUBJECT_DATA } from "../../pages/TeacherAnalytics/analyticsData";
import "./AttendanceBarChart.css";

const getColor = (pct) =>
  pct >= 90 ? "#10B981" : pct >= 80 ? "#2563EB" : "#F59E0B";

const CustomTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      <p>{label}</p>
      <span style={{ color: getColor(payload[0].value) }}>
        {payload[0].value}%
      </span>
    </div>
  );
};

export default function AttendanceBarChart() {
  return (
    <motion.div
      className="bar-chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="chart-card-header">
        <div>
          <h3>Attendance by Subject</h3>
          <p>Percentage comparison across courses</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={SUBJECT_DATA} barSize={32}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(15,23,42,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="subject"
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
          <Tooltip
            content={<CustomTip />}
            cursor={{ fill: "rgba(37,99,235,0.04)" }}
          />
          <Bar
            dataKey="attendance"
            radius={[7, 7, 0, 0]}
            animationDuration={1200}
          >
            {SUBJECT_DATA.map((entry, i) => (
              <Cell key={i} fill={getColor(entry.attendance)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
