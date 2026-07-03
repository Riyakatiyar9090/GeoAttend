import "./RadiusSlider.css";

const STOPS = [10, 20, 30, 50, 100];

export default function RadiusSlider({ value, onChange }) {
  const index = STOPS.indexOf(value) === -1 ? 1 : STOPS.indexOf(value);

  return (
    <div className="radius-slider-group">
      <div className="radius-slider-head">
        <span>Attendance Radius</span>
        <span className="radius-value">{value}m</span>
      </div>

      <input
        type="range"
        min={0}
        max={STOPS.length - 1}
        step={1}
        value={index}
        onChange={(e) => onChange(STOPS[Number(e.target.value)])}
        className="radius-range"
      />

      <div className="radius-stops">
        {STOPS.map((s) => (
          <span key={s} className={s === value ? "stop-active" : ""}>
            {s}m
          </span>
        ))}
      </div>
    </div>
  );
}
