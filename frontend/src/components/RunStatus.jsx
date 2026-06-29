export function StatusBadge({ status }) {
  const normalized = status || 'UNKNOWN'
  const icons = {
    OK: '🟢',
    HTTP_ERROR: '🟠',
    FAILED: '🔴',
  }

  return (
    <span className={`status status-${normalized.toLowerCase()}`}>
      {icons[normalized] && <span className="status-icon" aria-hidden="true">{icons[normalized]}</span>}
      {normalized}
    </span>
  )
}

export function ProgressBar({ value = 0 }) {
  const progress = Math.min(100, Math.max(0, value))

  return (
    <div className="progress-group">
      <div className="progress-label">
        <span>Progress</span>
        <strong>{progress}%</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
      >
        <div className="progress-value" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
