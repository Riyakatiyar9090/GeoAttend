import "./SkeletonCard.css";

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-badge" />
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-subtitle" />
      <div className="skeleton-line skeleton-meta" />
      <div className="skeleton-line skeleton-meta short" />
      <div className="skeleton-actions">
        <div className="skeleton-btn" />
        <div className="skeleton-btn small" />
      </div>
    </div>
  );
}
