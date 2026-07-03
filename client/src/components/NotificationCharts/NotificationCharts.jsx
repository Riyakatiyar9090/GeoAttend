import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./NotificationCharts.css";

const PIE_COLORS = ["#10B981", "#EF4444"];
const BAR_COLORS = {
  Attendance: "#2563EB",
  Sessions: "#10B981",
  Students: "#06B6D4",
  Announcements: "#F59E0B",
  System: "#4F46E5",
};

const CustomTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      <p>{payload[0].name}</p>
      <span>{payload[0].value}</span>
    </div>
  );
};

export default function NotificationCharts({ notifications }) {
  const read = notifications.filter((n) => n.read).length;
  const unread = notifications.filter((n) => !n.read).length;
  const pieData = [
    { name: "Read", value: read },
    { name: "Unread", value: unread },
  ];

  const catMap = {};
  notifications.forEach((n) => {
    catMap[n.category] = (catMap[n.category] || 0) + 1;
  });
  const barData = Object.entries(catMap).map(([cat, count]) => ({
    cat,
    count,
    fill: BAR_COLORS[cat] || "#64748B",
  }));

  return (
    <div className="nc-charts-grid">
      <motion.div
        className="nc-chart-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Read vs Unread</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              animationDuration={900}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="nc-pie-legend">
          {pieData.map((d, i) => (
            <span key={d.name}>
              <i style={{ background: PIE_COLORS[i] }} />
              {d.name}: <strong>{d.value}</strong>
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="nc-chart-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>Notifications by Category</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barSize={26}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(15,23,42,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="cat"
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
            <Tooltip
              content={<CustomTip />}
              cursor={{ fill: "rgba(37,99,235,0.04)" }}
            />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              animationDuration={1000}
              fill="#2563EB"
            >
              {barData.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
