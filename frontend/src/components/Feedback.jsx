export function Loading({ label = 'Loading…' }) {
  return <div className="state-card muted">{label}</div>
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-card error-state" role="alert">
      <div>
        <strong>Something went wrong</strong>
        <p>{message}</p>
      </div>
      {onRetry && (
        <button className="button button-secondary" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
