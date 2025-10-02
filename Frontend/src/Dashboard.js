import React, { useState } from 'react'

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
  return res.json()
}

export default function Dashboard() {
  const [javaTip, setJavaTip] = useState('')
  const [javaQ, setJavaQ] = useState('')
  const [javaAns, setJavaAns] = useState('')
  const [javaResult, setJavaResult] = useState('')

  const [engPhrase, setEngPhrase] = useState('')
  const [engQ, setEngQ] = useState('')
  const [engAns, setEngAns] = useState('')
  const [engResult, setEngResult] = useState('')

  async function getJavaTip() {
    setJavaResult('')
    const { data } = await request('/api/java/tip')
    setJavaTip(data)
  }

  async function getJavaQuiz() {
    setJavaResult(''); setJavaAns('')
    const { question } = await request('/api/java/quiz')
    setJavaQ(question)
  }

  async function checkJava() {
    if (!javaQ) return
    const { correct, expected } = await request('/api/java/quiz/answer', { method: 'POST', body: { question: javaQ, answer: javaAns }})
    setJavaResult(correct ? '✅ Correct!' : `❌ Expected: ${expected}`)
  }

  async function getEngPhrase() {
    setEngResult('')
    const { data } = await request('/api/english/phrase')
    setEngPhrase(data)
  }

  async function getEngQuiz() {
    setEngResult(''); setEngAns('')
    const { question } = await request('/api/english/quiz')
    setEngQ(question)
  }

  async function checkEng() {
    if (!engQ) return
    const { correct, expected } = await request('/api/english/quiz/answer', { method: 'POST', body: { question: engQ, answer: engAns }})
    setEngResult(correct ? '✅ Correct!' : `❌ Expected: ${expected}`)
  }

  return (
    <div className="container">
      <h1>Learning</h1>
      <p className="subtitle">Two quick blocks to practice Java and English.</p>

      <div className="grid">
        {/* Java Block */}
        <div className="card">
          <h2>Java</h2>
          <div className="row">
            <button onClick={getJavaTip}>Get a Java Tip</button>
            {javaTip && <div className="muted" style={{ marginTop: 8 }}>{javaTip}</div>}
          </div>

          <hr />

          <div className="row">
            <button onClick={getJavaQuiz}>Get a Java Quiz</button>
            {javaQ && <div className="q">{javaQ}</div>}
          </div>
          {javaQ && (
            <div className="row">
              <input placeholder="Your answer" value={javaAns} onChange={e => setJavaAns(e.target.value)} />
              <button onClick={checkJava}>Check</button>
            </div>
          )}
          {javaResult && <div className="result">{javaResult}</div>}
        </div>

        {/* English Block */}
        <div className="card">
          <h2>English</h2>
          <div className="row">
            <button onClick={getEngPhrase}>Get a Phrase</button>
            {engPhrase && <div className="muted" style={{ marginTop: 8 }}>{engPhrase}</div>}
          </div>

          <hr />

          <div className="row">
            <button onClick={getEngQuiz}>Get an English Quiz</button>
            {engQ && <div className="q">{engQ}</div>}
          </div>
          {engQ && (
            <div className="row">
              <input placeholder="Your answer" value={engAns} onChange={e => setEngAns(e.target.value)} />
              <button onClick={checkEng}>Check</button>
            </div>
          )}
          {engResult && <div className="result">{engResult}</div>}
        </div>
      </div>
    </div>
  )
}
