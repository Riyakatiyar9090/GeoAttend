import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PIE_DATA } from "../../pages/TeacherAnalytics/analyticsData";
import "./AttendancePieChart.css";

const CustomTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      <p>{payload[0].name}</p>
      <span style={{ color: payload[0].payload.color }}>
        {payload[0].value}%
      </span>
    </div>
  );
};

export default function AttendancePieChart() {
  return (
    <motion.div
      className="pie-chart-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      <div className="chart-card-header">
        <div>
          <h3>Attendance Distribution</h3>
          <p>Present, Absent & Late breakdown</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={PIE_DATA}
            dataKey="value"
            innerRadius={60}
            outerRadius={88}
            paddingAngle={3}
            animationDuration={1000}
          >
            {PIE_DATA.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTip />} />
          <Legend
            iconType="circle"
            iconSize={9}
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pie-center-stat">
        <strong>91%</strong>
        <span>Overall</span>
      </div>
    </motion.div>
  );
}
