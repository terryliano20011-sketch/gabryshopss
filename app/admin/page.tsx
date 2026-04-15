'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

type Product = {
  id?: number
  name: string
  short_desc: string
  long_desc: string
  price: number
  type: string
  image: string
  images: string[]
  active: boolean
}

const empty: Product = { name:'', short_desc:'', long_desc:'', price:0, type:'fisico', image:'', images:[], active:true }

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<Product>(empty)
  const [editing, setEditing] = useState<number|null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function loadProducts() {
    const { data } = await supabase.from('products').select('*').order('id')
    if (data) setProducts(data)
  }

  useEffect(() => { if (authed) loadProducts() }, [authed])

  async function handleSave() {
    setLoading(true)
    const payload = { ...form, images: form.images.length ? form.images : [form.image] }
    if (editing !== null) {
      await supabase.from('products').update(payload).eq('id', editing)
      showToast('Prodotto aggiornato!')
    } else {
      await supabase.from('products').insert(payload)
      showToast('Prodotto aggiunto!')
    }
    setForm(empty)
    setEditing(null)
    setLoading(false)
    loadProducts()
  }

  async function handleDelete(id: number) {
    if (!confirm('Sicuro di voler eliminare questo prodotto?')) return
    await supabase.from('products').delete().eq('id', id)
    showToast('Prodotto eliminato!')
    loadProducts()
  }

  async function toggleActive(id: number, active: boolean) {
    await supabase.from('products').update({ active: !active }).eq('id', id)
    loadProducts()
  }

  function handleEdit(p: Product) {
    setForm(p)
    setEditing(p.id!)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const inputStyle = { width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #ddd', fontSize:14, marginBottom:10, outline:'none', fontFamily:'inherit' }
  const labelStyle = { fontSize:12, color:'#888', display:'block' as const, marginBottom:4 }

  if (!authed) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8f8f8' }}>
      <div style={{ background:'#fff', padding:'2rem', borderRadius:16, border:'1px solid #eee', width:320 }}>
        <h1 style={{ fontSize:20, fontWeight:700, marginBottom:'1.5rem', textAlign:'center' }}>🔒 Admin GabryShopss</h1>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && password === 'Gabry2007!' && setAuthed(true)} style={inputStyle} />
        <button onClick={() => password === 'Gabry2007!' ? setAuthed(true) : alert('Password errata!')} style={{ width:'100%', background:'#1a1a1a', color:'#fff', border:'none', padding:12, borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:500 }}>
          Accedi
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#f8f8f8', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <nav style={{ background:'#1a1a1a', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ color:'#fff', fontWeight:600, fontSize:18 }}>GabryShopss Admin</span>
        <a href="/" style={{ color:'#aaa', fontSize:14, textDecoration:'none' }}>← Vai al sito</a>
      </nav>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>

        {/* FORM */}
        <div style={{ background:'#fff', borderRadius:16, border:'1px solid #eee', padding:'1.5rem' }}>
          <h2 style={{ fontSize:18, fontWeight:600, marginBottom:'1.5rem' }}>{editing !== null ? '✏️ Modifica prodotto' : '➕ Nuovo prodotto'}</h2>

          <label style={labelStyle}>Nome prodotto</label>
          <input placeholder="Es. Panno Microfibra 500GSM" value={form.name} onChange={e => setForm({...form, name:e.target.value})} style={inputStyle} />

          <label style={labelStyle}>Descrizione breve (nella card)</label>
          <input placeholder="Es. 30x40cm — Pulizia perfetta" value={form.short_desc} onChange={e => setForm({...form, short_desc:e.target.value})} style={inputStyle} />

          <label style={labelStyle}>Descrizione completa (pagina dettaglio)</label>
          <textarea placeholder="Descrizione lunga del prodotto..." value={form.long_desc} onChange={e => setForm({...form, long_desc:e.target.value})} rows={4} style={{...inputStyle, resize:'vertical'}} />

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <label style={labelStyle}>Prezzo (€)</label>
              <input type="number" step="0.01" placeholder="9.99" value={form.price} onChange={e => setForm({...form, price:parseFloat(e.target.value)})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tipo</label>
              <select value={form.type} onChange={e => setForm({...form, type:e.target.value})} style={inputStyle}>
                <option value="fisico">Fisico</option>
                <option value="digitale">Digitale</option>
              </select>
            </div>
          </div>

          <label style={labelStyle}>URL foto principale (in /images/)</label>
          <input placeholder="/images/prodotto.jpg" value={form.image} onChange={e => setForm({...form, image:e.target.value})} style={inputStyle} />

          <label style={labelStyle}>URL foto galleria (separate da virgola)</label>
          <input placeholder="/images/foto1.jpg, /images/foto2.jpg" value={form.images.join(', ')} onChange={e => setForm({...form, images:e.target.value.split(',').map(s => s.trim())})} style={inputStyle} />

          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button onClick={handleSave} disabled={loading} style={{ flex:1, background:'#1a1a1a', color:'#fff', border:'none', padding:12, borderRadius:24, fontSize:14, cursor:'pointer', fontWeight:500 }}>
              {loading ? 'Salvataggio...' : editing !== null ? 'Aggiorna prodotto' : 'Aggiungi prodotto'}
            </button>
            {editing !== null && (
              <button onClick={() => { setForm(empty); setEditing(null) }} style={{ background:'none', color:'#888', border:'1px solid #ddd', padding:'12px 20px', borderRadius:24, fontSize:14, cursor:'pointer' }}>
                Annulla
              </button>
            )}
          </div>
        </div>

        {/* LISTA PRODOTTI */}
        <div>
          <h2 style={{ fontSize:18, fontWeight:600, marginBottom:'1.5rem' }}>📦 Prodotti ({products.length})</h2>
          {products.length === 0 ? (
            <div style={{ background:'#fff', borderRadius:16, border:'1px solid #eee', padding:'2rem', textAlign:'center', color:'#aaa' }}>
              Nessun prodotto ancora. Aggiungine uno!
            </div>
          ) : products.map(p => (
            <div key={p.id} style={{ background:'#fff', borderRadius:12, border:'1px solid #eee', padding:'1rem', marginBottom:12, display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:56, height:56, borderRadius:10, background:'#f8f8f8', backgroundImage:`url(${p.image})`, backgroundSize:'cover', backgroundPosition:'center', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:600, color: p.active ? '#1a1a1a' : '#aaa' }}>{p.name}</div>
                <div style={{ fontSize:13, color:'#888' }}>€{Number(p.price).toFixed(2)} — {p.type}</div>
                <div style={{ fontSize:12, marginTop:4 }}>
                  <span style={{ background: p.active ? '#e8f5e9' : '#ffeee0', color: p.active ? '#2a7a4a' : '#cc5500', padding:'2px 8px', borderRadius:10 }}>
                    {p.active ? 'Attivo' : 'Nascosto'}
                  </span>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <button onClick={() => handleEdit(p)} style={{ background:'#f0f0f0', border:'none', padding:'6px 12px', borderRadius:10, fontSize:12, cursor:'pointer' }}>✏️ Modifica</button>
                <button onClick={() => toggleActive(p.id!, p.active)} style={{ background:'#f0f0f0', border:'none', padding:'6px 12px', borderRadius:10, fontSize:12, cursor:'pointer' }}>{p.active ? '🙈 Nascondi' : '👁️ Mostra'}</button>
                <button onClick={() => handleDelete(p.id!)} style={{ background:'#fff0f0', border:'none', padding:'6px 12px', borderRadius:10, fontSize:12, cursor:'pointer', color:'#cc0000' }}>🗑️ Elimina</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && <div style={{ position:'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)', background:'#1a1a1a', color:'#fff', padding:'10px 22px', borderRadius:24, fontSize:14, zIndex:200 }}>{toast}</div>}
    </div>
  )
}
