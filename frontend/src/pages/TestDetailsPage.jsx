import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'
import { ErrorMessage, Loading } from '../components/Feedback.jsx'

export default function TestDetailsPage({ id, navigate }) {
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [starting, setStarting] = useState(false)

  const loadTest = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setTest(await api.getTest(id))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadTest()
  }, [loadTest])

  async function startRun() {
    setStarting(true)
    setError('')
    try {
      const run = await api.startRun(id)
      navigate(`/runs/${run.runId}`)
    } catch (requestError) {
      setError(requestError.message)
      setStarting(false)
    }
  }

  return (
    <>
      <a className="back-link" href="/" data-link>← Back to tests</a>
      {loading && <Loading label="Loading test…" />}
      {error && !test && <ErrorMessage message={error} onRetry={loadTest} />}
      {!loading && test && (
        <>
          <section className="details-header">
            <div>
              <p className="eyebrow">Test #{test.id}</p>
              <h1>{test.name}</h1>
              {test.description && <p className="muted">{test.description}</p>}
            </div>
            <button className="button button-primary" type="button" onClick={startRun} disabled={starting}>
              {starting ? 'Starting…' : 'Start Run'}
            </button>
          </section>

          {error && <ErrorMessage message={error} />}

          <section className="card url-card">
            <div className="section-heading">
              <h2>URLs</h2>
              <span className="count">{test.urls?.length || 0}</span>
            </div>
            <ul className="url-list">
              {(test.urls || []).map((item) => (
                <li key={item.id || item.url}>{item.url}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  )
}
