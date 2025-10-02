import React, { useState } from 'react'
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  })
  if (!res.ok) throw new Error((await res.json().catch(()=>({error:res.statusText}))).error)
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

  return (
    <div className="container">
      <h2>Learning</h2>
      <p className="subtitle">Practice Java and English</p>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:16}}>
        <div className="card">
          <h3>Java</h3>
          <button onClick={async()=>{ setJavaResult(''); setJavaTip((await request('/api/java/tip')).data)}}>Get a Tip</button>
          {javaTip && <div className="muted" style={{marginTop:8}}>{javaTip}</div>}
          <hr/>
          <button onClick={async()=>{ setJavaResult(''); setJavaAns(''); setJavaQ((await request('/api/java/quiz')).question)}}>Get a Quiz</button>
          {javaQ && <div className="q">{javaQ}</div>}
          {javaQ && (
            <div style={{display:'grid',gap:8,marginTop:8}}>
              <input placeholder="Your answer" value={javaAns} onChange={e=>setJavaAns(e.target.value)} />
              <button onClick={async()=>{ const r=await request('/api/java/quiz/answer',{method:'POST',body:{question:javaQ,answer:javaAns}}); setJavaResult(r.correct?'✅ Correct':'❌ Expected: '+r.expected) }}>Check</button>
            </div>
          )}
          {javaResult && <div className="result">{javaResult}</div>}
        </div>

        <div className="card">
          <h3>English</h3>
          <button onClick={async()=>{ setEngResult(''); setEngPhrase((await request('/api/english/phrase')).data)}}>Get a Phrase</button>
          {engPhrase && <div className="muted" style={{marginTop:8}}>{engPhrase}</div>}
          <hr/>
          <button onClick={async()=>{ setEngResult(''); setEngAns(''); setEngQ((await request('/api/english/quiz')).question)}}>Get a Quiz</button>
          {engQ && <div className="q">{engQ}</div>}
          {engQ && (
            <div style={{display:'grid',gap:8,marginTop:8}}>
              <input placeholder="Your answer" value={engAns} onChange={e=>setEngAns(e.target.value)} />
              <button onClick={async()=>{ const r=await request('/api/english/quiz/answer',{method:'POST',body:{question:engQ,answer:engAns}}); setEngResult(r.correct?'✅ Correct':'❌ Expected: '+r.expected) }}>Check</button>
            </div>
          )}
          {engResult && <div className="result">{engResult}</div>}
        </div>
      </div>
    </div>
  )
}
