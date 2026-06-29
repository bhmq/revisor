const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`
    throw new Error(message)
  }

  return data
}

export const api = {
  getTests: () => request('/tests'),
  getTest: (id) => request(`/tests/${id}`),
  createTest: (payload) =>
    request('/tests', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  startRun: (testId) => request(`/tests/${testId}/runs`, { method: 'POST' }),
  getRun: (id) => request(`/runs/${id}`),
}
