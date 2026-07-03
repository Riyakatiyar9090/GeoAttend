import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiClock, FiUsers } from "react-icons/fi";
import useCountUp from "../../hooks/useCountUp";
import "./AttendanceCounter.css";

const iconMap = {
  present: <FiCheckCircle />,
  absent: <FiXCircle />,
  late: <FiClock />,
  total: <FiUsers />,
};

const colorMap = {
  present: "var(--success)",
  absent: "var(--danger)",
  late: "var(--warning)",
  total: "var(--primary)",
};

function CounterCardItem({ type, value, label, index }) {
  const { count, ref } = useCountUp(value, 1000);
  return (
    <motion.div
      className="attendance-counter-item"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      ref={ref}
    >
      <span
        className="ac-icon"
        style={{ color: colorMap[type], background: `${colorMap[type]}1A` }}
      >
        {iconMap[type]}
      </span>
      <div>
        <h3>{count}</h3>
        <p>{label}</p>
      </div>
    </motion.div>
  );
}

export default function AttendanceCounter({ present, absent, late, total }) {
  return (
    <div className="attendance-counter-grid">
      <CounterCardItem
        type="present"
        value={present}
        label="Present"
        index={0}
      />
      <CounterCardItem type="absent" value={absent} label="Absent" index={1} />
      <CounterCardItem type="late" value={late} label="Late" index={2} />
      <CounterCardItem
        type="total"
        value={total}
        label="Total Students"
        index={3}
      />
    </div>
  );
}
