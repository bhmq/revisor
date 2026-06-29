import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'
import { ErrorMessage, Loading } from '../components/Feedback.jsx'

export default function TestsPage() {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTests = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setTests(await api.getTests())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTests()
  }, [loadTests])

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">URL monitoring made simple</p>
          <h1>Revisor</h1>
          <p className="hero-copy">URL Availability Checker</p>
        </div>
        <a className="button button-primary" href="/tests/new" data-link>
          Create Test
        </a>
      </section>

      <section>
        <div className="section-heading">
          <h2>Tests</h2>
          {!loading && !error && <span className="count">{tests.length}</span>}
        </div>

        {loading && <Loading label="Loading tests…" />}
        {error && <ErrorMessage message={error} onRetry={loadTests} />}
        {!loading && !error && tests.length === 0 && (
          <div className="state-card empty-state">
            <strong>No tests created.</strong>
            <p>Create your first test to start checking URLs.</p>
          </div>
        )}
        {!loading && !error && tests.length > 0 && (
          <div className="test-grid">
            {tests.map((test) => (
              <article className="card test-card" key={test.id}>
                <div>
                  <span className="item-id">Test #{test.id}</span>
                  <h3>{test.name}</h3>
                </div>
                <a className="button button-secondary" href={`/tests/${test.id}`} data-link>
                  Open
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
