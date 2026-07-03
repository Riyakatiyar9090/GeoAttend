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
import "./AttendanceInsights.css";

const PIE_COLORS = { Present: "#10B981", Absent: "#EF4444", Late: "#F59E0B" };

const weeklyData = [
  { day: "Mon", pct: 91 },
  { day: "Tue", pct: 88 },
  { day: "Wed", pct: 94 },
  { day: "Thu", pct: 86 },
  { day: "Fri", pct: 92 },
];

const CustomPieTip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="insight-tooltip">
      <p>{payload[0].name}</p>
      <span>{payload[0].value}</span>
    </div>
  );
};

export default function AttendanceInsights({ records }) {
  const present = records.filter((r) => r.status === "Present").length;
  const absent = records.filter((r) => r.status === "Absent").length;
  const late = records.filter((r) => r.status === "Late").length;

  const pieData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    { name: "Late", value: late },
  ];

  // Top and lowest session attendance
  const sessionMap = {};
  records.forEach((r) => {
    if (!sessionMap[r.session])
      sessionMap[r.session] = { total: 0, present: 0, subject: r.subject };
    sessionMap[r.session].total++;
    if (r.status === "Present") sessionMap[r.session].present++;
  });
  const sessions = Object.entries(sessionMap).map(([id, v]) => ({
    id,
    subject: v.subject,
    pct: Math.round((v.present / v.total) * 100),
  }));
  sessions.sort((a, b) => b.pct - a.pct);
  const top = sessions[0];
  const low = sessions[sessions.length - 1];

  return (
    <div className="attendance-insights">
      <motion.div
        className="insight-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Attendance Breakdown</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              animationDuration={900}
            >
              {pieData.map((d) => (
                <Cell key={d.name} fill={PIE_COLORS[d.name]} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pie-legend">
          {pieData.map((d) => (
            <span key={d.name}>
              <i style={{ background: PIE_COLORS[d.name] }} />
              {d.name}: <strong>{d.value}</strong>
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="insight-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3>Weekly Attendance</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyData} barSize={22}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(15,23,42,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
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
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip />
            <Bar
              dataKey="pct"
              fill="#2563EB"
              radius={[5, 5, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="insight-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>Session Highlights</h3>
        {top && (
          <div className="insight-highlight top-highlight">
            <span className="hi-label">🏆 Highest Attendance</span>
            <p>{top.subject}</p>
            <strong>{top.pct}%</strong>
          </div>
        )}
        {low && (
          <div className="insight-highlight low-highlight">
            <span className="hi-label">⚠️ Lowest Attendance</span>
            <p>{low.subject}</p>
            <strong>{low.pct}%</strong>
          </div>
        )}
      </motion.div>
    </div>
  );
}
