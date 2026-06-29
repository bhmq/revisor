import { useState } from 'react'
import { api } from '../api.js'

export default function CreateTestPage({ navigate }) {
  const [name, setName] = useState('')
  const [urls, setUrls] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const cleanName = name.trim()
    const urlList = urls
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean)

    if (!cleanName || urlList.length === 0) {
      setError('Enter a name and at least one URL.')
      return
    }

    setSaving(true)
    setError('')
    try {
      const createdTest = await api.createTest({ name: cleanName, urls: urlList })
      navigate(`/tests/${createdTest.id}`)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-narrow">
      <a className="back-link" href="/" data-link>← Back to tests</a>
      <div className="page-heading">
        <p className="eyebrow">New availability check</p>
        <h1>Create Test</h1>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Production websites"
            autoFocus
            required
          />
        </label>

        <label className="field">
          <span>URLs</span>
          <textarea
            value={urls}
            onChange={(event) => setUrls(event.target.value)}
            placeholder={'https://example.com\nhttps://example.org/health'}
            rows="9"
            required
          />
          <small>Enter one URL per line. Empty lines are ignored.</small>
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <a className="button button-secondary" href="/" data-link>Cancel</a>
          <button className="button button-primary" type="submit" disabled={saving}>
            {saving ? 'Creating…' : 'Create Test'}
          </button>
        </div>
      </form>
    </div>
  )
}
