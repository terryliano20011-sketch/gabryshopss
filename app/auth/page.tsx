'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Auth() {
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMsg('❌ ' + error.message); setLoading(false); return }
    router.push('/')
  }

  async function handleRegister() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { nome } }
    })
    if (error) { setMsg('❌ ' + error.message); setLoading(false); return }
    setMsg('✅ Registrazione completata! Controlla la tua email per confermare.')
    setLoading(false)
  }

  const inputStyle = { width:'100%', padding:'12px 16px', borderRadius:12, border:'1px solid #ddd', fontSize:15, marginBottom:12, outline:'none', fontFamily:'inherit' }

  return (
    <div style={{ minHeight:'100vh', background:'#f8f8f8', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ background:'#fff', padding:'2.5rem', borderRadius:20, border:'1px solid #eee', width:'100%', maxWidth:400 }}>
        <a href="/" style={{ fontSize:20, fontWeight:700, textDecoration:'none', color:'#1a1a1a', display:'block', textAlign:'center', marginBottom:'2rem' }}>GabryShopss</a>

        <div style={{ display:'flex', background:'#f8f8f8', borderRadius:12, padding:4, marginBottom:'1.5rem' }}>
          {(['login','register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setMsg('') }} style={{ flex:1, padding:'8px', borderRadius:10, border:'none', background: mode===m ? '#fff' : 'none', fontWeight: mode===m ? 600 : 400, fontSize:14, cursor:'pointer', color:'#1a1a1a', boxShadow: mode===m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
              {m === 'login' ? 'Accedi' : 'Registrati'}
            </button>
          ))}
        </div>

        {mode === 'register' && (
          <input placeholder="Nome e Cognome" value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} />
        )}
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />

        {msg && <div style={{ fontSize:13, marginBottom:12, color: msg.startsWith('✅') ? '#2a7a4a' : '#cc0000' }}>{msg}</div>}

        <button onClick={mode === 'login' ? handleLogin : handleRegister} disabled={loading} style={{ width:'100%', background:'#1a1a1a', color:'#fff', border:'none', padding:14, borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:500, marginBottom:12 }}>
          {loading ? 'Caricamento...' : mode === 'login' ? 'Accedi' : 'Registrati'}
        </button>

        <div style={{ textAlign:'center' }}>
          <a href="/" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>← Continua senza account</a>
        </div>
      </div>
    </div>
  )
}
