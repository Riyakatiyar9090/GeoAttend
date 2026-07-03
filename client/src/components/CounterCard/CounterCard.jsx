import useCountUp from "../../hooks/useCountUp";
import "./CounterCard.css";

export default function CounterCard({ value, suffix = "", label }) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="counter-card" ref={ref}>
      <h3>
        {count.toLocaleString()}
        {suffix}
      </h3>
      <p>{label}</p>
    </div>
  );
}
