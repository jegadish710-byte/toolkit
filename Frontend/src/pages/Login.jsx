import React, { useState } from 'react'
import { setToken } from '../lib/auth'

const STATIC_USER = { email: 'demo@user.com', password: 'secret123' }

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(true)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // simulate quick check
      await new Promise(r => setTimeout(r, 400))

      const ok =
        email.trim().toLowerCase() === STATIC_USER.email &&
        password === STATIC_USER.password

      if (!ok) {
        setError('Invalid email or password.')
        return
      }

      // store fake token; respect "remember me"
      setToken('demo-static-token')
      if (!remember) {
        // session-only: remove on tab close
        window.addEventListener('beforeunload', () => localStorage.removeItem('token'), { once: true })
      }

      onSuccess?.()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ display: 'grid', placeItems: 'start', minHeight: '60vh' }}>
      <div className="card" style={{ maxWidth: 420, width: '100%', marginTop: 40 }}>
        <h2 style={{ marginBottom: 6 }}>Welcome back</h2>
        <p className="subtitle">Use demo credentials below to sign in</p>

        <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
          <div>Email: <code>demo@user.com</code></div>
          <div>Password: <code>secret123</code></div>
        </div>

        {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingRight: 80 }}
              />
              <button
                type="button"
                className="button--ghost"
                onClick={() => setShow(s => !s)}
                style={{ position: 'absolute', right: 6, top: 6, height: 36, padding: '0 10px' }}
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
            Remember me
          </label>

          <button data-loading={loading ? 'true' : 'false'}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

// credentials
// demo@user.com
//  / secret123