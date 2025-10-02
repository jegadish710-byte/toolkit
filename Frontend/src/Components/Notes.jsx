import React, { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  if (res.status === 204) return null
  return res.json()
}

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setError('')
    try {
      const data = await request('/api/notes')
      setNotes(data)
    } catch (e) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  async function add(e) {
    e.preventDefault()
    setError('')
    try {
      const n = await request('/api/notes', { method: 'POST', body: { title, body } })
      setNotes([n, ...notes]); setTitle(''); setBody('')
    } catch (e) { setError(e.message) }
  }

  async function remove(id) {
    try {
      await request(`/api/notes/${id}`, { method: 'DELETE' })
      setNotes(notes.filter(n => n.id !== id))
    } catch (e) { setError(e.message) }
  }

  async function update(id, fields) {
    try {
      const u = await request(`/api/notes/${id}`, { method: 'PUT', body: fields })
      setNotes(notes.map(n => (n.id === id ? u : n)))
    } catch (e) { setError(e.message) }
  }

  return (
    <div className="container">
      <h2>Notes</h2>
      <p className="subtitle">Simple in-memory notes (reset on server restart)</p>
      {error && <div className="error">{error}</div>}

      <form onSubmit={add} style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} />
        <button>Add</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        {notes.map(n => (
          <li key={n.id} className="card">
            <strong
              contentEditable
              suppressContentEditableWarning
              onBlur={e => update(n.id, { title: e.currentTarget.textContent })}
            >
              {n.title}
            </strong>
            <div
              style={{ whiteSpace: 'pre-wrap', marginTop: 6 }}
              contentEditable
              suppressContentEditableWarning
              onBlur={e => update(n.id, { body: e.currentTarget.textContent })}
            >
              {n.body}
            </div>
            <button style={{ marginTop: 8, background: '#dc2626' }} onClick={() => remove(n.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
