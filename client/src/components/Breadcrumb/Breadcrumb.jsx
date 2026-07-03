import { useLocation } from "react-router-dom";
import "./Breadcrumb.css";

export default function Breadcrumb({ basePath, baseLabel }) {
  const location = useLocation();
  const relative = location.pathname
    .replace(basePath, "")
    .split("/")
    .filter(Boolean);

  const crumbs = [
    baseLabel,
    ...relative.map((segment) =>
      segment
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    ),
  ];

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={i} className="breadcrumb-segment">
          {i > 0 && <span className="breadcrumb-separator">/</span>}
          <span
            className={
              i === crumbs.length - 1 ? "breadcrumb-current" : "breadcrumb-item"
            }
          >
            {crumb}
          </span>
        </span>
      ))}
    </nav>
  );
}
