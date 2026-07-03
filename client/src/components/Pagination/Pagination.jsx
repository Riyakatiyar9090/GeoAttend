import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Pagination.css";

export default function Pagination({ page, totalPages, onPage }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="pagination">
      <button
        className="pg-btn"
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
      >
        <FiChevronLeft />
      </button>

      {visible.reduce((acc, p, i, arr) => {
        if (i > 0 && p - arr[i - 1] > 1)
          acc.push(
            <span key={`gap-${p}`} className="pg-gap">
              …
            </span>,
          );
        acc.push(
          <button
            key={p}
            className={`pg-btn ${p === page ? "pg-active" : ""}`}
            onClick={() => onPage(p)}
          >
            {p}
          </button>,
        );
        return acc;
      }, [])}

      <button
        className="pg-btn"
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
      >
        <FiChevronRight />
      </button>

      <span className="pg-info">
        Page {page} of {totalPages}
      </span>
    </div>
  );
}
