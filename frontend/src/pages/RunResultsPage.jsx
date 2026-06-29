import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { ErrorMessage, Loading } from '../components/Feedback.jsx'
import { ProgressBar, StatusBadge } from '../components/RunStatus.jsx'

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(value))
}

function formatDuration(createdAt, finishedAt) {
  if (!createdAt || !finishedAt) return '-'

  const durationMs = Math.max(0, new Date(finishedAt) - new Date(createdAt))
  const totalSeconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

function formatErrorMessage(errorMessage) {
  if (!errorMessage) return '—'

  const error = errorMessage.toLowerCase()
  if (error.includes('unknownhostexception')) return 'Unknown host'
  if (error.includes('sockettimeoutexception') || error.includes('connecttimeoutexception')) {
    return 'Connection timeout'
  }
  if (error.includes('sslhandshakeexception')) return 'SSL handshake failed'
  if (error.includes('connectexception')) return 'Connection failed'
  return 'Request failed'
}

export default function RunResultsPage({ id }) {
  const [run, setRun] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let timer

    async function loadRun() {
      try {
        const nextRun = await api.getRun(id)
        if (!active) return
        setRun(nextRun)
        setError('')
        setLoading(false)
        if (nextRun.status !== 'FINISHED') {
          timer = window.setTimeout(loadRun, 2000)
        }
      } catch (requestError) {
        if (!active) return
        setError(requestError.message)
        setLoading(false)
      }
    }

    loadRun()
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [id])

  if (loading) return <Loading label="Loading run…" />
  if (error && !run) return <ErrorMessage message={error} />

  const stats = [
    ['Total', run.total, 'URLs in this run'],
    ['Checked', run.checked, 'Checks completed'],
    ['OK', run.okCount, 'Available URLs'],
    ['HTTP Errors', run.httpErrorCount, 'Non-2xx responses'],
    ['Failed', run.failedCount, 'Network errors'],
  ]

  return (
    <>
      <a className="back-link" href={`/tests/${run.testId}`} data-link>← Back to test</a>
      <section className="details-header run-heading">
        <div>
          <p className="eyebrow">Run #{run.runId}</p>
          <h1>{run.testName}</h1>
        </div>
        <StatusBadge status={run.status} />
      </section>

      {error && <ErrorMessage message={error} />}

      <section className="card summary-card">
        <div className="summary-item">
          <span>Run ID</span>
          <strong>#{run.runId}</strong>
        </div>
        <div className="summary-item summary-name">
          <span>Test Name</span>
          <strong>{run.testName}</strong>
        </div>
        <div className="summary-item">
          <span>Started At</span>
          <strong>{formatDate(run.createdAt)}</strong>
        </div>
        <div className="summary-item">
          <span>Finished At</span>
          <strong>{formatDate(run.finishedAt)}</strong>
        </div>
        <div className="summary-item">
          <span>Duration</span>
          <strong>{formatDuration(run.createdAt, run.finishedAt)}</strong>
        </div>
      </section>

      <section className="card progress-card">
        <ProgressBar value={run.progressPercent} />
        <div className="stats-grid">
          {stats.map(([label, value, description]) => (
            <div className="stat" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{description}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="results-section">
        <div className="section-heading">
          <h2>Results</h2>
          {run.status !== 'FINISHED' && <span className="polling-label">Updating every 2s</span>}
        </div>
        <div className="table-wrap card">
          <table className="results-table">
            <colgroup>
              <col className="col-url" />
              <col className="col-status" />
              <col className="col-code" />
              <col className="col-error" />
              <col className="col-date" />
            </colgroup>
            <thead>
              <tr>
                <th>URL</th>
                <th>Status</th>
                <th>HTTP code</th>
                <th>Error message</th>
                <th>Checked at</th>
              </tr>
            </thead>
            <tbody>
              {(run.results || []).map((result, index) => (
                <tr key={`${result.url}-${index}`}>
                  <td className="url-cell" title={result.url}>{result.url}</td>
                  <td><StatusBadge status={result.status} /></td>
                  <td>{result.httpCode ?? '—'}</td>
                  <td className="error-cell">{formatErrorMessage(result.errorMessage)}</td>
                  <td className="date-cell">{formatDate(result.checkedAt)}</td>
                </tr>
              ))}
              {(!run.results || run.results.length === 0) && (
                <tr>
                  <td className="table-empty" colSpan="5">No results yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
