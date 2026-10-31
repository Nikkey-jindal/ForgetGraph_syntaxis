/**
 * FORGETGRAPH API client — every number in the UI comes from the FastAPI
 * backend (PS09/api.py), which reads the live SQLite DB and Ridge model.
 * No fabricated data.
 */

const BASE = import.meta.env?.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || `API error ${res.status}`)
  }
  return res.json()
}

export const api = {
  getStats: () => request('/stats'),
  deleteUser: (userId) =>
    request('/delete', { method: 'POST', body: JSON.stringify({ user_id: Number(userId) }) }),
  ingestUser: (user) =>
    request('/ingest', { method: 'POST', body: JSON.stringify(user) }),
  getLog: (limit = 200) => request(`/log?limit=${limit}`),
  getTombstones: () => request('/tombstones'),
  getVerification: () => request('/verification'),
}
