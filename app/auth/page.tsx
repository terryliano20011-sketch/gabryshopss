'use client'
import { useState, useEffect } from 'react'
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

  useEffect(() => {
    // Controlla se l'utente è già loggato
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/')
    })

    // Gestisci il callback di verifica email
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/')
      }
    })
  }, [])

  async function handleLogin() {
    if (!email || !password) { setMsg('❌ Inserisci email e password'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setMsg('📧 Controlla la tua email e clicca il link di verifica prima di accedere.')
      } else if (error.message.includes('Invalid login credentials')) {
        setMsg('❌ Email o password errati')
      } else {
        setMsg('❌ ' + error.message)
      }
      setLoading(false)
      return
    }
    router.push('/')
  }

  async function handleRegister() {
    if (!nome || !email || !password) { setMsg('❌ Compila tutti i campi'); return }
    if (password.length < 6) { setMsg('❌ La password deve essere di almeno 6 caratteri'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome },
        emailRedirectTo: 'https://gabryshopss.vercel.app/auth'
      }
    })
    if (error) { setMsg('❌ ' + error.message); setLoading(false); return }
    setMsg('✅ Registrazione completata! Controlla la tua email e clicca il link di verifica per attivare l\'account.')
    setLoading(false)
  }

  async function handleResendEmail() {
    if (!email) { setMsg('❌ Inserisci la tua email prima'); return }
    const { error } = await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: 'https://gabryshopss.vercel.app/auth' } })
    if (error) { setMsg('❌ ' + error.message); return }
    setMsg('📧 Email di verifica inviata di nuovo!')
  }

  const inputStyle: React.CSSProperties = { width:'100%', padding:'12px 16px', borderRadius:12, border:'1px solid rgba(201,168,76,0.2)', fontSize:15, marginBottom:12, outline:'none', background:'#1C1C1C', color:'#F5F5F0', fontFamily:'inherit' }

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif', padding:'1rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        input::placeholder { color: #444440; }
        input:focus { border-color: rgba(201,168,76,0.5) !important; }
      `}</style>
      <div style={{ background:'#141414', padding:'2.5rem', borderRadius:20, border:'1px solid rgba(201,168,76,0.15)', width:'100%', maxWidth:400 }}>
        <a href="/" style={{ fontSize:22, fontWeight:700, textDecoration:'none', color:'#C9A84C', display:'block', textAlign:'center', marginBottom:'2rem', fontFamily:'Playfair Display, serif' }}>GabryShopss</a>

        <div style={{ display:'flex', background:'#1C1C1C', borderRadius:12, padding:4, marginBottom:'1.5rem' }}>
          {(['login','register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setMsg('') }} style={{ flex:1, padding:'9px', borderRadius:10, border:'none', background: mode===m ? 'linear-gradient(135deg, #C9A84C, #E8C97A)' : 'none', fontWeight: mode===m ? 600 : 400, fontSize:14, cursor:'pointer', color: mode===m ? '#000' : '#888880', transition:'all 0.2s' }}>
              {m === 'login' ? 'Accedi' : 'Registrati'}
            </button>
          ))}
        </div>

        {mode === 'register' && (
          <input placeholder="Nome e Cognome" value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} />
        )}
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder="Password (min. 6 caratteri)" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())} style={inputStyle} />

        {msg && (
          <div style={{ fontSize:13, marginBottom:12, padding:'10px 14px', borderRadius:10, background: msg.startsWith('✅') || msg.startsWith('📧') ? 'rgba(42,122,74,0.15)' : 'rgba(204,0,0,0.1)', color: msg.startsWith('✅') || msg.startsWith('📧') ? '#4ade80' : '#f87171', border: `1px solid ${msg.startsWith('✅') || msg.startsWith('📧') ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
            {msg}
          </div>
        )}

        <button onClick={mode === 'login' ? handleLogin : handleRegister} disabled={loading} style={{ width:'100%', background:'linear-gradient(135deg, #C9A84C, #E8C97A)', color:'#000', border:'none', padding:14, borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:600, marginBottom:12, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Caricamento...' : mode === 'login' ? 'Accedi' : 'Registrati'}
        </button>

        {mode === 'login' && (
          <button onClick={handleResendEmail} style={{ width:'100%', background:'none', color:'#888880', border:'1px solid rgba(201,168,76,0.2)', padding:'10px', borderRadius:24, fontSize:13, cursor:'pointer', marginBottom:12 }}>
            Reinvia email di verifica
          </button>
        )}

        <div style={{ textAlign:'center' }}>
          <a href="/" style={{ fontSize:13, color:'#888880', textDecoration:'none' }}>← Continua senza account</a>
        </div>
      </div>
    </div>
  )
}
