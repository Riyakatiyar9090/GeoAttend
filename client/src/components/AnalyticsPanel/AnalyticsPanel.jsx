import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./AnalyticsPanel.css";

const COLORS = { Present: "#10B981", Absent: "#EF4444", Late: "#F59E0B" };

export default function AnalyticsPanel({
  present,
  absent,
  late,
  growthData,
  timeData,
  quickStats,
}) {
  const doughnutData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    { name: "Late", value: late },
  ];

  return (
    <div className="analytics-panel">
      <motion.div
        className="analytics-mini-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h4>Attendance Breakdown</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={doughnutData}
              dataKey="value"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              animationDuration={1000}
            >
              {doughnutData.map((d) => (
                <Cell key={d.name} fill={COLORS[d.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="analytics-mini-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h4>Attendance by Time</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={timeData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(15,23,42,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
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
              fill="#06B6D4"
              radius={[5, 5, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="analytics-mini-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h4>Attendance Growth</h4>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={growthData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(15,23,42,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
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
            <Line
              type="monotone"
              dataKey="total"
              stroke="#2563EB"
              strokeWidth={2.5}
              dot={false}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="analytics-mini-card quick-stats-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h4>Quick Statistics</h4>
        <div className="quick-stats-list">
          <div>
            <span>Avg. Attendance Time</span>
            <strong>{quickStats.avgTime}</strong>
          </div>
          <div>
            <span>Fastest Student</span>
            <strong>{quickStats.fastest}</strong>
          </div>
          <div>
            <span>Latest Student</span>
            <strong>{quickStats.latest}</strong>
          </div>
          <div>
            <span>Radius Violations</span>
            <strong>{quickStats.radiusViolations}</strong>
          </div>
          <div>
            <span>Duplicate Attempts</span>
            <strong>{quickStats.duplicates}</strong>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
