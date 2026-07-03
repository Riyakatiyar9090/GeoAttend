import { motion } from "framer-motion";
import "./TopPerformers.css";

function PerformerRow({ name, subtitle, pct, index }) {
  return (
    <motion.div
      className="performer-row"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <span className="performer-rank">#{index + 1}</span>
      <div className="performer-info">
        <strong>{name}</strong>
        <span>{subtitle}</span>
      </div>
      <div className="performer-bar-wrapper">
        <motion.div
          className="performer-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.07 }}
        />
      </div>
      <span className="performer-pct">{pct}%</span>
    </motion.div>
  );
}

export default function TopPerformers({ students, classes, subjects }) {
  return (
    <div className="top-performers-grid">
      <div className="top-performer-card">
        <h3>🏆 Top 5 Students</h3>
        {students.map((s, i) => (
          <PerformerRow
            key={s.roll}
            name={s.name}
            subtitle={s.roll}
            pct={s.pct}
            index={i}
          />
        ))}
      </div>

      <div className="top-performer-card">
        <h3>📚 Top 5 Classes</h3>
        {classes.map((c, i) => (
          <PerformerRow
            key={c.name}
            name={c.name}
            subtitle={c.subject}
            pct={c.pct}
            index={i}
          />
        ))}
      </div>

      <div className="top-performer-card">
        <h3>⭐ Top 5 Subjects</h3>
        {subjects.map((s, i) => (
          <PerformerRow
            key={s.name}
            name={s.name}
            subtitle={`${s.sessions} sessions`}
            pct={s.pct}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
