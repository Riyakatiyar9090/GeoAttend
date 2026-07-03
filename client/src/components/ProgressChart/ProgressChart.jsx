import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./ProgressChart.css";

function buildMonthlyData(records) {
  const map = {};
  records.forEach((r) => {
    const key = r.rawDate.toLocaleString("default", { month: "short" });
    if (!map[key]) map[key] = { month: key, present: 0, total: 0 };
    map[key].total++;
    if (r.status === "Present") map[key].present++;
  });
  return Object.values(map).map((m) => ({
    month: m.month,
    pct: m.total > 0 ? Math.round((m.present / m.total) * 100) : 0,
  }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="pc-tooltip">
      <p>{label}</p>
      <span>{payload[0].value}%</span>
    </div>
  );
};

export default function ProgressChart({ records }) {
  const data = buildMonthlyData(records);
  return (
    <motion.div
      className="progress-chart-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Monthly Attendance</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={28}>
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
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(37,99,235,0.05)" }}
          />
          <Bar
            dataKey="pct"
            fill="#2563EB"
            radius={[6, 6, 0, 0]}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
