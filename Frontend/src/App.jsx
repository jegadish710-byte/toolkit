import React, { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import Notes from './components/Notes.jsx'
import Login from './pages/Login.jsx'
import { getToken, clearToken } from './lib/auth'
import './index.css'

export default function App() {
  const [authed, setAuthed] = useState(!!getToken())

  // keep in sync if token changes in another tab
  useEffect(() => {
    const onStorage = e => { if (e.key === 'token') setAuthed(!!e.newValue) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />
  }

  return (
    <div>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24 }}>
        <h1>My Learning App</h1>
        <button className="button--ghost" onClick={() => { clearToken(); setAuthed(false) }}>
          Logout
        </button>
      </div>

      <Dashboard />
      <Notes />
    </div>
  )
}
