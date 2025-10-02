import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const el = document.getElementById('root')
if (!el) {
  throw new Error('Root element #root not found. Check index.html')
}
createRoot(el).render(<App />)
