'use client'
import { useState, useEffect, useRef } from 'react'
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
  categoria: string
  taglie?: string[]
}

const empty: Product = { name:'', short_desc:'', long_desc:'', price:0, type:'fisico', image:'', images:[], active:true, categoria:'auto', taglie:[] }

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<Product>(empty)
  const [editing, setEditing] = useState<number|null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function loadProducts() {
    const { data } = await supabase.from('products').select('*').order('id')
    if (data) setProducts(data)
  }

  useEffect(() => { if (authed) loadProducts() }, [authed])

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('prodotti').upload(fileName, file, { upsert: true })
    if (error) { showToast('❌ Errore upload: ' + error.message); setUploading(false); return null }
    const { data } = supabase.storage.from('prodotti').getPublicUrl(fileName)
    setUploading(false)
    return data.publicUrl
  }

  async function handleFileChange(files: FileList | null) {
    if (!files || files.length === 0) return
    const urls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i])
      if (url) urls.push(url)
    }
    if (urls.length > 0) {
      setForm(prev => ({
        ...prev,
        image: prev.image || urls[0],
        images: [...prev.images, ...urls]
      }))
      showToast(`✅ ${urls.length} foto caricate!`)
    }
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.image) { showToast('❌ Compila nome, prezzo e foto'); return }
    setLoading(true)
    const payload = {
      ...form,
      images: form.images.length ? form.images : [form.image],
      taglie: form.taglie && form.taglie.length > 0 ? form.taglie : null
    }
    if (editing !== null) {
      await supabase.from('products').update(payload).eq('id', editing)
      showToast('✅ Prodotto aggiornato!')
    } else {
      await supabase.from('products').insert(payload)
      showToast('✅ Prodotto aggiunto!')
    }
    setForm(empty)
    setEditing(null)
    setLoading(false)
    loadProducts()
  }

  async function handleDelete(id: number) {
    if (!confirm('Sicuro di voler eliminare questo prodotto?')) return
    await supabase.from('products').delete().eq('id', id)
    showToast('🗑️ Prodotto eliminato!')
    loadProducts()
  }

  async function toggleActive(id: number, active: boolean) {
    await supabase.from('products').update({ active: !active }).eq('id', id)
    loadProducts()
  }

  function handleEdit(p: Product) {
    setForm({ ...p, taglie: p.taglie || [] })
    setEditing(p.id!)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const inputStyle: React.CSSProperties = { width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid rgba(201,168,76,0.2)', fontSize:14, marginBottom:10, outline:'none', background:'#1C1C1C', color:'#F5F5F0', fontFamily:'inherit' }
  const labelStyle: React.CSSProperties = { fontSize:12, color:'#888880', display:'block', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.5px' }

  if (!authed) return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'-apple-system, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap'); input::placeholder{color:#444440}`}</style>
      <div style={{ background:'#141414', padding:'2.5rem', borderRadius:20, border:'1px solid rgba(201,168,76,0.15)', width:320 }}>
        <h1 style={{ fontSize:22, fontWeight:700, fontFamily:'Playfair Display, serif', color:'#C9A84C', textAlign:'center', marginBottom:'2rem' }}>🔒 Admin</h1>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && password === 'gabry2007!' && setAuthed(true)} style={inputStyle} />
        <button onClick={() => password === 'gabry2007!' ? setAuthed(true) : showToast('❌ Password errata!')} style={{ width:'100%', background:'linear-gradient(135deg, #C9A84C, #E8C97A)', color:'#000', border:'none', padding:12, borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:600 }}>Accedi</button>
        {toast && <div style={{ marginTop:12, fontSize:13, color:'#f87171', textAlign:'center' }}>{toast}</div>}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#F5F5F0', fontFamily:'-apple-system, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        input::placeholder, textarea::placeholder { color: #444440; }
        input:focus, textarea:focus, select:focus { border-color: rgba(201,168,76,0.5) !important; }
        select option { background: #1C1C1C; color: #F5F5F0; }
      `}</style>

      <nav style={{ background:'#141414', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(201,168,76,0.1)' }}>
        <span style={{ fontWeight:700, fontSize:20, fontFamily:'Playfair Display, serif', color:'#C9A84C' }}>GabryShopss Admin</span>
        <a href="/" style={{ color:'#888880', fontSize:14, textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')} onMouseLeave={e=>(e.currentTarget.style.color='#888880')}>← Vai al sito</a>
      </nav>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'2rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>

        {/* FORM */}
        <div style={{ background:'#141414', borderRadius:16, border:'1px solid rgba(201,168,76,0.1)', padding:'1.5rem' }}>
          <h2 style={{ fontSize:18, fontWeight:700, fontFamily:'Playfair Display, serif', marginBottom:'1.5rem', color:'#F5F5F0' }}>{editing !== null ? '✏️ Modifica prodotto' : '➕ Nuovo prodotto'}</h2>

          <label style={labelStyle}>Nome prodotto</label>
          <input placeholder="Es. Felpa Premium Nera" value={form.name} onChange={e => setForm({...form, name:e.target.value})} style={inputStyle} />

          <label style={labelStyle}>Descrizione breve</label>
          <input placeholder="Es. Cotone 100%, slim fit" value={form.short_desc} onChange={e => setForm({...form, short_desc:e.target.value})} style={inputStyle} />

          <label style={labelStyle}>Descrizione completa</label>
          <textarea placeholder="Descrizione lunga del prodotto..." value={form.long_desc} onChange={e => setForm({...form, long_desc:e.target.value})} rows={3} style={{...inputStyle, resize:'vertical'}} />

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div>
              <label style={labelStyle}>Prezzo (€)</label>
              <input type="number" step="0.01" placeholder="9.99" value={form.price || ''} onChange={e => setForm({...form, price:parseFloat(e.target.value)})} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tipo</label>
              <select value={form.type} onChange={e => setForm({...form, type:e.target.value})} style={inputStyle}>
                <option value="fisico">Fisico</option>
                <option value="digitale">Digitale</option>
              </select>
            </div>
          </div>

          <label style={labelStyle}>Categoria</label>
          <select value={form.categoria} onChange={e => setForm({...form, categoria:e.target.value})} style={inputStyle}>
            <option value="auto">🚗 Accessori Auto</option>
            <option value="vestiti">👕 Abbigliamento</option>
            <option value="gioielli">💎 Gioielli</option>
            <option value="elettronica">📱 Elettronica</option>
          </select>

          <label style={labelStyle}>Taglie / Varianti (separate da virgola)</label>
          <input placeholder="Es. S, M, L, XL oppure Nero, Bianco" value={form.taglie?.join(', ') || ''} onChange={e => setForm({...form, taglie: e.target.value ? e.target.value.split(',').map(t => t.trim()).filter(t => t) : []})} style={inputStyle} />

          {/* UPLOAD FOTO */}
          <label style={labelStyle}>Foto prodotto</label>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files) }}
            onClick={() => fileRef.current?.click()}
            style={{ border: `2px dashed ${dragOver ? '#C9A84C' : 'rgba(201,168,76,0.2)'}`, borderRadius:12, padding:'1.5rem', textAlign:'center', cursor:'pointer', marginBottom:10, background: dragOver ? 'rgba(201,168,76,0.05)' : 'transparent', transition:'all 0.2s' }}
          >
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e => handleFileChange(e.target.files)} />
            {uploading ? (
              <div style={{ color:'#C9A84C', fontSize:14 }}>⏳ Caricamento in corso...</div>
            ) : (
              <>
                <div style={{ fontSize:32, marginBottom:8 }}>📸</div>
                <div style={{ fontSize:14, color:'#888880' }}>Trascina le foto qui o <span style={{ color:'#C9A84C' }}>clicca per caricare</span></div>
                <div style={{ fontSize:12, color:'#444440', marginTop:4 }}>JPG, PNG, WEBP — più file supportati</div>
              </>
            )}
          </div>

          {/* Preview foto caricate */}
          {form.images.length > 0 && (
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:12, color:'#888880', marginBottom:8 }}>Foto caricate ({form.images.length})</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ position:'relative' }}>
                    <img src={img} style={{ width:60, height:60, objectFit:'cover', borderRadius:8, border: form.image===img ? '2px solid #C9A84C' : '1px solid rgba(201,168,76,0.2)' }} onClick={() => setForm({...form, image:img})} />
                    <button onClick={() => setForm({...form, images: form.images.filter((_,j)=>j!==i), image: form.image===img ? '' : form.image})} style={{ position:'absolute', top:-6, right:-6, background:'#cc0000', border:'none', borderRadius:'50%', width:18, height:18, cursor:'pointer', fontSize:10, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, color:'#888880', marginTop:6 }}>Clicca una foto per impostarla come principale</div>
            </div>
          )}

          <label style={labelStyle}>URL foto principale</label>
          <input placeholder="Verrà compilato automaticamente dopo l'upload" value={form.image} onChange={e => setForm({...form, image:e.target.value})} style={inputStyle} />

          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            <button onClick={handleSave} disabled={loading || uploading} style={{ flex:1, background:'linear-gradient(135deg, #C9A84C, #E8C97A)', color:'#000', border:'none', padding:12, borderRadius:24, fontSize:14, cursor:'pointer', fontWeight:600, opacity: loading || uploading ? 0.7 : 1 }}>
              {loading ? 'Salvataggio...' : editing !== null ? 'Aggiorna prodotto' : 'Aggiungi prodotto'}
            </button>
            {editing !== null && (
              <button onClick={() => { setForm(empty); setEditing(null) }} style={{ background:'none', color:'#888880', border:'1px solid rgba(201,168,76,0.2)', padding:'12px 20px', borderRadius:24, fontSize:14, cursor:'pointer' }}>
                Annulla
              </button>
            )}
          </div>
        </div>

        {/* LISTA PRODOTTI */}
        <div>
          <h2 style={{ fontSize:18, fontWeight:700, fontFamily:'Playfair Display, serif', marginBottom:'1.5rem', color:'#F5F5F0' }}>📦 Prodotti ({products.length})</h2>
          {products.length === 0 ? (
            <div style={{ background:'#141414', borderRadius:16, border:'1px solid rgba(201,168,76,0.1)', padding:'2rem', textAlign:'center', color:'#444440' }}>Nessun prodotto ancora</div>
          ) : products.map(p => (
            <div key={p.id} style={{ background:'#141414', borderRadius:12, border:'1px solid rgba(201,168,76,0.1)', padding:'1rem', marginBottom:12, display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:56, height:56, borderRadius:10, background:'#1C1C1C', backgroundImage:`url(${p.image})`, backgroundSize:'cover', backgroundPosition:'center', flexShrink:0, border:'1px solid rgba(201,168,76,0.1)' }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color: p.active ? '#F5F5F0' : '#444440' }}>{p.name}</div>
                <div style={{ fontSize:12, color:'#888880' }}>€{Number(p.price).toFixed(2)} — {p.categoria}</div>
                <div style={{ fontSize:11, marginTop:4 }}>
                  <span style={{ background: p.active ? 'rgba(42,122,74,0.2)' : 'rgba(201,168,76,0.1)', color: p.active ? '#4ade80' : '#888880', padding:'2px 8px', borderRadius:10, border: `1px solid ${p.active ? 'rgba(74,222,128,0.2)' : 'rgba(201,168,76,0.1)'}` }}>
                    {p.active ? 'Attivo' : 'Nascosto'}
                  </span>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <button onClick={() => handleEdit(p)} style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', color:'#C9A84C', padding:'6px 12px', borderRadius:10, fontSize:12, cursor:'pointer' }}>✏️</button>
                <button onClick={() => toggleActive(p.id!, p.active)} style={{ background:'#1C1C1C', border:'1px solid rgba(255,255,255,0.1)', color:'#888880', padding:'6px 12px', borderRadius:10, fontSize:12, cursor:'pointer' }}>{p.active ? '🙈' : '👁️'}</button>
                <button onClick={() => handleDelete(p.id!)} style={{ background:'rgba(204,0,0,0.1)', border:'1px solid rgba(204,0,0,0.2)', color:'#f87171', padding:'6px 12px', borderRadius:10, fontSize:12, cursor:'pointer' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && <div style={{ position:'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)', background:'#141414', color:'#F5F5F0', padding:'12px 24px', borderRadius:24, fontSize:14, zIndex:200, border:'1px solid rgba(201,168,76,0.3)', boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>{toast}</div>}
    </div>
  )
}
