import React from 'react'
import Dashboard from './components/Dashboard.jsx'
import Notes from './components/Notes.jsx'
import './index.css'

export default function App() {
  return (
    <div>
      <h1 style={{ fontFamily: 'system-ui', padding: '24px 24px 0' }}>
        My Learning App
      </h1>

      {/* Java & English blocks */}
      <Dashboard />

      {/* Notes block */}
      <Notes />
    </div>
  )
}
