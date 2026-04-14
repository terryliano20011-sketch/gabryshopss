'use client'
import { useState } from 'react'

export default function Contatti() {
  const [form, setForm] = useState({ nome:'', email:'', messaggio:'' })
  const [inviato, setInviato] = useState(false)

  function handleSubmit() {
    if (!form.nome || !form.email || !form.messaggio) return
    window.location.href = `mailto:terryliano20011@gmail.com?subject=Messaggio da ${form.nome}&body=${encodeURIComponent(form.messaggio)}%0A%0AEmail: ${form.email}`
    setInviato(true)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 2rem', borderBottom:'1px solid #eee', position:'sticky', top:0, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)', zIndex:50 }}>
        <a href="/" style={{ fontSize:20, fontWeight:600, letterSpacing:'-0.5px', textDecoration:'none', color:'#1a1a1a' }}>GabryShopss</a>
        <div style={{ display:'flex', gap:'2rem' }}>
          <a href="/" style={{ fontSize:14, color:'#666', textDecoration:'none' }}>Prodotti</a>
          <a href="/chi-siamo" style={{ fontSize:14, color:'#666', textDecoration:'none' }}>Chi siamo</a>
          <a href="/contatti" style={{ fontSize:14, color:'#1a1a1a', fontWeight:500, textDecoration:'none' }}>Contatti</a>
        </div>
      </nav>

      <div style={{ maxWidth:600, margin:'0 auto', padding:'5rem 2rem' }}>
        <h1 style={{ fontSize:42, fontWeight:700, letterSpacing:'-1.5px', marginBottom:'0.5rem', color:'#000' }}>Contattaci</h1>
        <p style={{ fontSize:16, color:'#888', marginBottom:'3rem' }}>Rispondiamo entro 24 ore.</p>

        {inviato ? (
          <div style={{ textAlign:'center', padding:'3rem', border:'1px solid #eee', borderRadius:16 }}>
            <div style={{ fontSize:48, marginBottom:'1rem' }}>✅</div>
            <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Messaggio inviato!</div>
            <div style={{ fontSize:14, color:'#888' }}>Ti risponderemo al più presto.</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <input
              placeholder="Nome e Cognome"
              value={form.nome}
              onChange={e => setForm({...form, nome:e.target.value})}
              style={{ padding:'12px 16px', borderRadius:12, border:'1px solid #ddd', fontSize:15, outline:'none' }}
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({...form, email:e.target.value})}
              style={{ padding:'12px 16px', borderRadius:12, border:'1px solid #ddd', fontSize:15, outline:'none' }}
            />
            <textarea
              placeholder="Il tuo messaggio..."
              value={form.messaggio}
              onChange={e => setForm({...form, messaggio:e.target.value})}
              rows={5}
              style={{ padding:'12px 16px', borderRadius:12, border:'1px solid #ddd', fontSize:15, outline:'none', resize:'vertical' }}
            />
            <button
              onClick={handleSubmit}
              style={{ background:'#1a1a1a', color:'#fff', border:'none', padding:'14px', borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:500, marginTop:4 }}
            >
              Invia messaggio
            </button>
          </div>
        )}

        <div style={{ marginTop:'3rem', padding:'1.5rem', background:'#f8f8f8', borderRadius:16 }}>
          <div style={{ fontSize:14, color:'#888', marginBottom:8 }}>Oppure scrivici direttamente:</div>
          <a href="mailto:terryliano20011@gmail.com" style={{ fontSize:15, color:'#1a1a1a', fontWeight:500, textDecoration:'none' }}>terryliano20011@gmail.com</a>
        </div>
      </div>

      <footer style={{ borderTop:'1px solid #eee', padding:'2rem', textAlign:'center' }}>
        <p style={{ fontSize:13, color:'#aaa', marginBottom:8 }}>© 2025 GabryShopss — Tutti i diritti riservati</p>
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center' }}>
          <a href="/privacy" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Privacy Policy</a>
          <a href="/termini" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Termini e Condizioni</a>
          <a href="/contatti" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Contatti</a>
        </div>
      </footer>
    </div>
  )
}
