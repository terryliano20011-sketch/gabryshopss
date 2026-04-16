'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { supabase } from '../../../lib/supabase'
import { useParams } from 'next/navigation'

type Product = { id: number; name: string; short_desc: string; long_desc: string; price: number; type: string; image: string; images: string[]; categoria: string; taglie?: string[] }
type CartItem = Product & { qty: number; taglia?: string }
type Review = { id: number; nome: string; stelle: number; testo: string; created_at: string }

const G = '#C9A84C'

export default function CategoriaPage() {
  const params = useParams()
  const slug = params.slug as string

  const [products, setProducts] = useState<Product[]>([])
  const [categoria, setCategoria] = useState<any>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [paid, setPaid] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product|null>(null)
  const [selectedImg, setSelectedImg] = useState(0)
  const [shipping, setShipping] = useState({ name:'', email:'', address:'', city:'', cap:'' })
  const [loading, setLoading] = useState(true)
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')
  const [user, setUser] = useState<any>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({ nome:'', stelle:5, testo:'' })
  const [zoomedImg, setZoomedImg] = useState<string|null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const [selectedTaglia, setSelectedTaglia] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null))
    supabase.from('categorie').select('*').eq('slug', slug).single().then(({ data }) => setCategoria(data))
    supabase.from('products').select('*').eq('active', true).eq('categoria', slug).order('id').then(({ data }) => {
      if (data) setProducts(data)
      setLoading(false)
    })
  }, [slug])

  useEffect(() => {
    if (selectedProduct) {
      supabase.from('reviews').select('*').eq('product_id', selectedProduct.id).order('created_at', { ascending: false }).then(({ data }) => {
        if (data) setReviews(data)
      })
    }
  }, [selectedProduct])

  const totalQty = cart.reduce((s, c) => s + c.qty, 0)
  const totalPrice = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const shippingCost = cart.some(c => c.type === 'fisico') ? (totalPrice >= 50 ? 0 : 4.99) : 0
  const discountAmount = totalPrice * discount
  const grandTotal = totalPrice - discountAmount + shippingCost
  const avgStelle = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.stelle, 0) / reviews.length).toFixed(1) : null

  function addToCart(p: Product, taglia?: string) {
    setCart(prev => {
      const ex = prev.find(c => c.id === p.id && c.taglia === taglia)
      if (ex) return prev.map(c => c.id === p.id && c.taglia === taglia ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...p, qty: 1, taglia }]
    })
    setToast('✓ ' + p.name + ' aggiunto!')
    setTimeout(() => setToast(''), 2500)
  }

  function changeQty(id: number, delta: number) {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0))
  }

  function applyCoupon() {
    if (coupon.toUpperCase() === 'GABRY10') { setDiscount(0.10); setCouponMsg('✅ -10%') }
    else if (coupon.toUpperCase() === 'WELCOME') { setDiscount(0.15); setCouponMsg('✅ -15%') }
    else { setDiscount(0); setCouponMsg('❌ Non valido') }
  }

  async function submitReview() {
    if (!newReview.nome || !newReview.testo) return
    await supabase.from('reviews').insert({ product_id: selectedProduct!.id, nome: newReview.nome, stelle: newReview.stelle, testo: newReview.testo, user_id: user?.id || null })
    const { data } = await supabase.from('reviews').select('*').eq('product_id', selectedProduct!.id).order('created_at', { ascending: false })
    if (data) setReviews(data)
    setNewReview({ nome:'', stelle:5, testo:'' })
    setToast('✅ Recensione inviata!')
    setTimeout(() => setToast(''), 2500)
  }

  const inputStyle: React.CSSProperties = { width:'100%', padding:'12px 16px', borderRadius:10, border:'1px solid rgba(201,168,76,0.2)', fontSize:14, marginBottom:10, outline:'none', background:'#1C1C1C', color:'#F5F5F0', fontFamily:'inherit' }

  return (
    <PayPalScriptProvider options={{ clientId: 'Aaw-5XjE4JVOxAo86vZE7hUP5IpaAXmGxBf-8VflGfr9KjtF21hsJ7SViQkaV5FKDEPmXvWrW2D608CS', currency: 'EUR' }}>
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#F5F5F0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }
        ::selection { background: #C9A84C; color: #000; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #8B6914; border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

        @keyframes slideDown { from { transform:translateY(-100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
        .card { transition: transform 0.3s, border-color 0.3s; border: 1px solid rgba(201,168,76,0.1) !important; }
        .card:hover { transform: translateY(-6px); border-color: rgba(201,168,76,0.4) !important; }
        .btn-gold { transition: all 0.2s; background: linear-gradient(135deg, #C9A84C, #E8C97A) !important; color: #000 !important; }
        .btn-gold:hover { transform: scale(1.03); box-shadow: 0 8px 30px rgba(201,168,76,0.4); }
        .btn-ghost { transition: all 0.2s; border: 1px solid rgba(201,168,76,0.3) !important; color: #C9A84C !important; background: transparent !important; }
        .btn-ghost:hover { background: rgba(201,168,76,0.1) !important; }
        input::placeholder, textarea::placeholder { color: #444440; }
        input:focus, textarea:focus { border-color: rgba(201,168,76,0.5) !important; }
      `}</style>

      {/* ZOOM */}
      {zoomedImg && (
        <div onClick={() => setZoomedImg(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.95)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', cursor:'zoom-out' }}>
          <img src={zoomedImg} style={{ maxWidth:'90vw', maxHeight:'90vh', objectFit:'contain', borderRadius:12, border:'1px solid rgba(201,168,76,0.3)' }} />
          <button onClick={() => setZoomedImg(null)} style={{ position:'absolute', top:24, right:24, background:'none', border:'none', color:'#C9A84C', fontSize:32, cursor:'pointer' }}>✕</button>
        </div>
      )}

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding: isMobile ? '1rem 1.25rem' : '1.25rem 2.5rem', borderBottom:'1px solid rgba(201,168,76,0.1)', position:'sticky', top:0, background:'rgba(10,10,10,0.95)', backdropFilter:'blur(20px)', zIndex:50 }}>
        <a href="/" style={{ fontSize:22, fontWeight:700, fontFamily:'Playfair Display, serif', color:'#C9A84C', textDecoration:'none' }}>GabryShopss</a>
        <div style={{ display: isMobile ? 'none' : 'flex', gap:'2rem', alignItems:'center' }}>
          <a href="/" style={{ fontSize:14, color:'#888880', textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')} onMouseLeave={e=>(e.currentTarget.style.color='#888880')}>Home</a>
          <a href="/chi-siamo" style={{ fontSize:14, color:'#888880', textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')} onMouseLeave={e=>(e.currentTarget.style.color='#888880')}>Chi siamo</a>
          <a href="/contatti" style={{ fontSize:14, color:'#888880', textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')} onMouseLeave={e=>(e.currentTarget.style.color='#888880')}>Contattaci</a>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <a href={user ? '/ordini' : '/auth'} style={{ fontSize:13, color:'#888880', textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')} onMouseLeave={e=>(e.currentTarget.style.color='#888880')}>{user ? '👤 Account' : 'Accedi'}</a>
          <button onClick={() => setCartOpen(true)} style={{ position:'relative', background:'none', border:'1px solid rgba(201,168,76,0.3)', borderRadius:10, padding:'8px 12px', cursor:'pointer', fontSize:18, color:'#C9A84C', transition:'all 0.2s' }} onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,168,76,0.1)'}} onMouseLeave={e=>{e.currentTarget.style.background='none'}}>
            🛒
            {totalQty > 0 && <span style={{ position:'absolute', top:-6, right:-6, background:'#C9A84C', color:'#000', fontSize:10, width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{totalQty}</span>}
          </button>
        </div>
      </nav>

      {selectedProduct ? (
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'2.5rem 2rem', animation:'fadeUp 0.4s ease' }}>
          <button onClick={() => setSelectedProduct(null)} style={{ background:'none', border:'none', fontSize:14, color:'#888880', cursor:'pointer', marginBottom:'2rem', display:'flex', alignItems:'center', gap:8 }} onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')} onMouseLeave={e=>(e.currentTarget.style.color='#888880')}>← Torna a {categoria?.nome}</button>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '1.5rem' : '4rem', marginBottom:'4rem' }}>
            <div>
              <div onClick={() => setZoomedImg(selectedProduct.images[selectedImg])} style={{ position:'relative', height: isMobile ? 280 : 420, borderRadius:16, overflow:'hidden', background:'#141414', marginBottom:12, cursor:'zoom-in', border:'1px solid rgba(201,168,76,0.1)' }}>
                <Image src={selectedProduct.images[selectedImg]} alt={selectedProduct.name} fill style={{ objectFit:'cover', transition:'transform 0.4s' }} />
                <div style={{ position:'absolute', top:12, right:12, background:'rgba(0,0,0,0.7)', color:'#C9A84C', padding:'6px 12px', borderRadius:20, fontSize:11, border:'1px solid rgba(201,168,76,0.3)' }}>🔍 Zoom</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                {selectedProduct.images.map((img, i) => (
                  <div key={i} onClick={() => setSelectedImg(i)} style={{ position:'relative', width:76, height:76, borderRadius:10, overflow:'hidden', cursor:'pointer', border: selectedImg===i ? `2px solid ${G}` : '2px solid rgba(201,168,76,0.1)', background:'#141414', transition:'border-color 0.2s' }}>
                    <Image src={img} alt="" fill style={{ objectFit:'cover' }} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div style={{ fontSize:11, color:'#C9A84C', textTransform:'uppercase', letterSpacing:'2px', marginBottom:12, fontWeight:500 }}>{selectedProduct.type}</div>
              <h1 style={{ fontSize: isMobile ? 22 : 32, fontWeight:700, marginBottom:10, color:'#F5F5F0', fontFamily:'Playfair Display, serif', lineHeight:1.2 }}>{selectedProduct.name}</h1>
              {avgStelle && <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}><span style={{ color:'#C9A84C', fontSize:16 }}>{'★'.repeat(Math.round(Number(avgStelle)))}</span><span style={{ fontSize:13, color:'#888880' }}>{avgStelle} ({reviews.length} recensioni)</span></div>}
              <p style={{ fontSize:15, color:'#888880', lineHeight:1.8, marginBottom:28 }}>{selectedProduct.long_desc}</p>
              {selectedProduct.taglie && selectedProduct.taglie.length > 0 && (
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:13, color:'#888880', marginBottom:10 }}>Seleziona taglia</div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {selectedProduct.taglie.map(t => (
                      <button key={t} onClick={() => setSelectedTaglia(t)} style={{ padding:'8px 16px', borderRadius:10, border: selectedTaglia===t ? '2px solid #C9A84C' : '1px solid rgba(201,168,76,0.2)', background: selectedTaglia===t ? 'rgba(201,168,76,0.15)' : 'transparent', color: selectedTaglia===t ? '#C9A84C' : '#888880', fontSize:13, cursor:'pointer', fontWeight: selectedTaglia===t ? 600 : 400, transition:'all 0.2s' }}>{t}</button>
                    ))}
                  </div>
                </div>
              )}
              {selectedProduct.type === 'fisico' && <p style={{ fontSize:13, color:'#888880', marginBottom:20 }}>🚚 Spedizione €4.99 · Gratuita sopra €50</p>}
              {selectedProduct.type === 'digitale' && <p style={{ fontSize:13, color:'#C9A84C', marginBottom:20 }}>✅ Download immediato</p>}
              <div style={{ fontSize: isMobile ? 28 : 38, fontWeight:700, marginBottom:28, color:'#C9A84C', fontFamily:'Playfair Display, serif' }}>€{Number(selectedProduct.price).toFixed(2)}</div>
              <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                <button className="btn-gold" onClick={() => addToCart(selectedProduct, selectedTaglia)} style={{ flex:1, border:'none', padding:'15px', borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:600 }}>
                  {cart.find(c => c.id === selectedProduct.id) ? '✓ Aggiunto' : '+ Aggiungi al carrello'}
                </button>
                <button className="btn-ghost" onClick={() => { navigator.clipboard.writeText(window.location.href).then(() => setToast('🔗 Link copiato!')) }} style={{ border:'none', padding:'15px 18px', borderRadius:24, fontSize:18, cursor:'pointer' }}>📤</button>
              </div>
              <button className="btn-ghost" onClick={() => { addToCart(selectedProduct, selectedTaglia); setCartOpen(true); }} style={{ border:'none', padding:'15px', borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:500 }}>Acquista subito</button>
            </div>
          </div>

          {/* RECENSIONI */}
          <div style={{ borderTop:'1px solid rgba(201,168,76,0.15)', paddingTop:'3rem', marginBottom:'3rem' }}>
            <h2 style={{ fontSize:26, fontWeight:700, marginBottom:'2rem', fontFamily:'Playfair Display, serif' }}>Recensioni {reviews.length > 0 && <span style={{ color:'#C9A84C' }}>({reviews.length})</span>}</h2>
            <div style={{ background:'#141414', border:'1px solid rgba(201,168,76,0.15)', borderRadius:16, padding:'1.5rem', marginBottom:'2rem' }}>
              <input placeholder="Il tuo nome" value={newReview.nome} onChange={e => setNewReview({...newReview, nome:e.target.value})} style={inputStyle} />
              <div style={{ display:'flex', gap:4, marginBottom:12 }}>
                {[1,2,3,4,5].map(s => <button key={s} onClick={() => setNewReview({...newReview, stelle:s})} style={{ background:'none', border:'none', fontSize:26, cursor:'pointer', color: s <= newReview.stelle ? '#C9A84C' : '#333' }}>★</button>)}
              </div>
              <textarea placeholder="La tua opinione..." value={newReview.testo} onChange={e => setNewReview({...newReview, testo:e.target.value})} rows={3} style={{...inputStyle, resize:'vertical'}} />
              <button className="btn-gold" onClick={submitReview} style={{ border:'none', padding:'10px 24px', borderRadius:24, fontSize:14, cursor:'pointer', fontWeight:600 }}>Invia</button>
            </div>
            {reviews.map(r => (
              <div key={r.id} style={{ background:'#141414', border:'1px solid rgba(201,168,76,0.1)', borderRadius:12, padding:'1.25rem', marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontWeight:600 }}>{r.nome}</span><span style={{ fontSize:12, color:'#444440' }}>{new Date(r.created_at).toLocaleDateString('it-IT')}</span></div>
                <div style={{ color:'#C9A84C', fontSize:16, marginBottom:8 }}>{'★'.repeat(r.stelle)}{'☆'.repeat(5-r.stelle)}</div>
                <p style={{ fontSize:14, color:'#888880', lineHeight:1.6, margin:0 }}>{r.testo}</p>
              </div>
            ))}
          </div>

          {/* CORRELATI */}
          <div style={{ borderTop:'1px solid rgba(201,168,76,0.15)', paddingTop:'3rem' }}>
            <h2 style={{ fontSize:26, fontWeight:700, marginBottom:'1.5rem', fontFamily:'Playfair Display, serif' }}>Potrebbe interessarti</h2>
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', gap:'1rem' }}>
              {products.filter(p => p.id !== selectedProduct.id).slice(0,3).map(p => (
                <div key={p.id} className="card" onClick={() => { setSelectedProduct(p); setSelectedImg(0); window.scrollTo({top:0,behavior:'smooth'}); }} style={{ background:'#141414', borderRadius:12, overflow:'hidden', cursor:'pointer' }}>
                  <div style={{ position:'relative', height:140, background:'#1C1C1C' }}><Image src={p.image} alt={p.name} fill style={{ objectFit:'cover' }} /></div>
                  <div style={{ padding:'0.875rem' }}>
                    <div style={{ fontSize:13, fontWeight:600, marginBottom:4, color:'#F5F5F0' }}>{p.name}</div>
                    <div style={{ fontSize:15, fontWeight:700, color:'#C9A84C' }}>€{Number(p.price).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* HEADER CATEGORIA */}
          <div style={{ padding: isMobile ? '2rem 1.25rem 1.5rem' : '4rem 2.5rem 3rem', maxWidth:1200, margin:'0 auto' }}>
            <a href="/" style={{ fontSize:13, color:'#888880', textDecoration:'none', display:'flex', alignItems:'center', gap:6, marginBottom:'2rem', transition:'color 0.2s' }} onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')} onMouseLeave={e=>(e.currentTarget.style.color='#888880')}>← Tutte le categorie</a>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:'0.5rem' }}>
              <span style={{ fontSize:48 }}>{categoria?.emoji}</span>
              <h1 style={{ fontSize:48, fontWeight:700, fontFamily:'Playfair Display, serif', color:'#F5F5F0' }}>{categoria?.nome || '...'}</h1>
            </div>
            <p style={{ fontSize:16, color:'#888880' }}>{categoria?.descrizione}</p>
          </div>

          {/* PRODOTTI */}
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'1.5rem', padding:'0 2rem 4rem', maxWidth:1200, margin:'0 auto' }}>
              {[1,2,3].map(i => <div key={i} style={{ height:360, borderRadius:16, background:'linear-gradient(90deg, #141414 25%, #1C1C1C 50%, #141414 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />)}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign:'center', padding:'6rem 2rem', color:'#444440' }}>
              <div style={{ fontSize:48, marginBottom:'1rem' }}>📦</div>
              <div style={{ fontSize:18, fontWeight:600, marginBottom:8, color:'#888880' }}>Nessun prodotto in questa categoria</div>
              <p style={{ fontSize:14, marginBottom:'2rem' }}>Aggiungi prodotti dall'admin panel</p>
              <a href="/" style={{ color:'#C9A84C', textDecoration:'none', fontSize:14 }}>← Torna alle categorie</a>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: isMobile ? '10px' : '1.5rem', padding: isMobile ? '0 1rem 3rem' : '0 2rem 5rem', maxWidth:1200, margin:'0 auto' }}>
              {products.map((p, idx) => {
                const inCart = cart.find(c => c.id === p.id)
                return (
                  <div key={p.id} className="card" style={{ background:'#141414', borderRadius:16, overflow:'hidden', cursor:'pointer', animation:`fadeUp 0.5s ease ${idx*0.1}s both` }} onClick={() => { setSelectedProduct(p); setSelectedImg(0); }}>
                    <div style={{ position:'relative', height: isMobile ? 150 : 260, background:'#1C1C1C' }}>
                      <Image src={p.image} alt={p.name} fill style={{ objectFit:'cover' }} />
                    </div>
                    <div style={{ padding: isMobile ? '0.75rem' : '1.25rem' }}>
                      <div style={{ fontSize:10, color:'#C9A84C', textTransform:'uppercase', letterSpacing:'2px', marginBottom:6, fontWeight:500 }}>{p.type}</div>
                      <div style={{ fontSize: isMobile ? 13 : 17, fontWeight:600, marginBottom:6, color:'#F5F5F0' }}>{p.name}</div>
                      <div style={{ fontSize:13, color:'#888880', marginBottom:16, lineHeight:1.6 }}>{p.short_desc}</div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span style={{ fontSize: isMobile ? 16 : 22, fontWeight:700, color:'#C9A84C', fontFamily:'Playfair Display, serif' }}>€{Number(p.price).toFixed(2)}</span>
                        <button className={inCart ? '' : 'btn-gold'} onClick={e => { e.stopPropagation(); if (p.taglie && p.taglie.length > 0) { setSelectedProduct(p); setSelectedImg(0); } else { addToCart(p); } }} style={{ border: inCart ? '1px solid #2a7a4a' : 'none', background: inCart ? 'rgba(42,122,74,0.2)' : undefined, color: inCart ? '#4ade80' : undefined, padding:'8px 18px', borderRadius:20, fontSize:13, cursor:'pointer', fontWeight:600, transition:'all 0.2s' }}>
                          {inCart ? '✓ Aggiunto' : '+ Aggiungi'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* OVERLAY + CARRELLO */}
      {cartOpen && <div onClick={() => { setCartOpen(false); setCheckingOut(false) }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:99, backdropFilter:'blur(4px)' }} />}
      <div style={{ position:'fixed', top:0, right: cartOpen ? 0 : (isMobile ? '-100%' : -440), width: isMobile ? '100%' : 420, height:'100%', background:'#0F0F0F', borderLeft:'1px solid rgba(201,168,76,0.15)', zIndex:100, display:'flex', flexDirection:'column', transition:'right 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.5rem', borderBottom:'1px solid rgba(201,168,76,0.1)' }}>
          <span style={{ fontSize:18, fontWeight:700, fontFamily:'Playfair Display, serif' }}>{checkingOut ? 'Pagamento' : 'Carrello'}</span>
          <button onClick={() => { setCartOpen(false); setCheckingOut(false) }} style={{ background:'none', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, padding:'6px 10px', cursor:'pointer', color:'#888880', fontSize:16 }}>✕</button>
        </div>
        {!checkingOut ? (
          <>
            <div style={{ flex:1, overflowY:'auto', padding:'1rem 1.5rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign:'center', padding:'4rem 1rem', color:'#444440' }}><div style={{ fontSize:48, marginBottom:'1rem', opacity:0.5 }}>🛒</div><div style={{ fontSize:14 }}>Il carrello è vuoto</div></div>
              ) : cart.map(c => (
                <div key={c.id} style={{ display:'flex', gap:12, padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center' }}>
                  <div style={{ position:'relative', width:52, height:52, borderRadius:10, overflow:'hidden', flexShrink:0, background:'#1C1C1C', border:'1px solid rgba(201,168,76,0.1)' }}><Image src={c.image} alt={c.name} fill style={{ objectFit:'cover' }} /></div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500, color:'#F5F5F0' }}>{c.name}</div>
                    <div style={{ fontSize:13, color:'#C9A84C', fontWeight:600 }}>€{Number(c.price).toFixed(2)}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:8 }}>
                      <button onClick={() => changeQty(c.id, -1)} style={{ width:26, height:26, borderRadius:'50%', border:'1px solid rgba(201,168,76,0.2)', background:'none', cursor:'pointer', fontSize:16, color:'#C9A84C' }}>−</button>
                      <span style={{ fontSize:13, fontWeight:600, color:'#F5F5F0', minWidth:16, textAlign:'center' }}>{c.qty}</span>
                      <button onClick={() => changeQty(c.id, 1)} style={{ width:26, height:26, borderRadius:'50%', border:'1px solid rgba(201,168,76,0.2)', background:'none', cursor:'pointer', fontSize:16, color:'#C9A84C' }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding:'1.25rem 1.5rem', borderTop:'1px solid rgba(201,168,76,0.1)' }}>
                <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                  <input placeholder="Codice sconto" value={coupon} onChange={e => setCoupon(e.target.value)} style={{ flex:1, padding:'9px 12px', borderRadius:10, border:'1px solid rgba(201,168,76,0.2)', fontSize:13, outline:'none', background:'#1C1C1C', color:'#F5F5F0', fontFamily:'inherit' }} />
                  <button className="btn-ghost" onClick={applyCoupon} style={{ border:'none', padding:'9px 14px', borderRadius:10, fontSize:13, cursor:'pointer', fontWeight:500 }}>Applica</button>
                </div>
                {couponMsg && <div style={{ fontSize:13, marginBottom:10, color: discount > 0 ? '#4ade80' : '#f87171' }}>{couponMsg}</div>}
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontSize:14, color:'#888880' }}>Subtotale</span><span style={{ fontSize:14, color:'#F5F5F0' }}>€{totalPrice.toFixed(2)}</span></div>
                {discount > 0 && <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontSize:14, color:'#4ade80' }}>Sconto {discount*100}%</span><span style={{ fontSize:14, color:'#4ade80' }}>-€{discountAmount.toFixed(2)}</span></div>}
                {shippingCost > 0 && <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}><span style={{ fontSize:14, color:'#888880' }}>🚚 Spedizione</span><span style={{ fontSize:14, color:'#F5F5F0' }}>€{shippingCost.toFixed(2)}</span></div>}
                {shippingCost === 0 && cart.some(c => c.type === 'fisico') && <div style={{ fontSize:13, color:'#4ade80', marginBottom:8 }}>✅ Spedizione gratuita!</div>}
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem', paddingTop:12, borderTop:'1px solid rgba(201,168,76,0.1)' }}>
                  <span style={{ fontWeight:600, color:'#F5F5F0' }}>Totale</span>
                  <span style={{ fontWeight:700, fontSize:20, color:'#C9A84C', fontFamily:'Playfair Display, serif' }}>€{grandTotal.toFixed(2)}</span>
                </div>
                <button className="btn-gold" onClick={() => setCheckingOut(true)} style={{ width:'100%', border:'none', padding:14, borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:600 }}>Procedi al pagamento →</button>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex:1, padding:'1.5rem', overflowY:'auto' }}>
            {paid ? (
              <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
                <div style={{ fontSize:64, marginBottom:'1rem' }}>✅</div>
                <div style={{ fontSize:22, fontWeight:700, marginBottom:8, fontFamily:'Playfair Display, serif' }}>Ordine confermato!</div>
                <div style={{ fontSize:14, color:'#888880', marginBottom:'1.5rem' }}>Controlla la tua email.</div>
                <button className="btn-gold" onClick={() => { setCartOpen(false); setCheckingOut(false); setPaid(false); }} style={{ border:'none', padding:'12px 28px', borderRadius:24, fontSize:14, cursor:'pointer', fontWeight:600 }}>Chiudi</button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom:'1rem' }}>
                  <div style={{ fontSize:15, fontWeight:600, marginBottom:14, color:'#F5F5F0' }}>Dati di spedizione</div>
                  <input placeholder="Nome e Cognome" value={shipping.name} onChange={e => setShipping({...shipping, name:e.target.value})} style={inputStyle} />
                  <input placeholder="Email" value={shipping.email} onChange={e => setShipping({...shipping, email:e.target.value})} style={inputStyle} />
                  <input placeholder="Indirizzo" value={shipping.address} onChange={e => setShipping({...shipping, address:e.target.value})} style={inputStyle} />
                  <div style={{ display:'flex', gap:8 }}>
                    <input placeholder="Città" value={shipping.city} onChange={e => setShipping({...shipping, city:e.target.value})} style={{...inputStyle, flex:1}} />
                    <input placeholder="CAP" value={shipping.cap} onChange={e => setShipping({...shipping, cap:e.target.value})} style={{...inputStyle, width:90}} />
                  </div>
                </div>
                <div style={{ marginBottom:'1.5rem', background:'#141414', borderRadius:12, padding:'1rem', border:'1px solid rgba(201,168,76,0.1)' }}>
                  <div style={{ fontSize:14, fontWeight:600, marginBottom:10, color:'#F5F5F0' }}>Riepilogo</div>
                  {cart.map(c => <div key={c.id} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#888880', padding:'4px 0' }}><span>{c.name}{c.taglia ? " (" + c.taglia + ")" : ""} x{c.qty}</span><span>€{(Number(c.price)*c.qty).toFixed(2)}</span></div>)}
                  <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:16, marginTop:10, paddingTop:10, borderTop:'1px solid rgba(201,168,76,0.1)', color:'#C9A84C' }}><span>Totale</span><span>€{grandTotal.toFixed(2)}</span></div>
                </div>
                <PayPalButtons
                  style={{ layout:'vertical', shape:'pill', color:'gold' }}
                  createOrder={(data, actions) => actions.order.create({ intent:'CAPTURE', purchase_units:[{ amount:{ currency_code:'EUR', value:grandTotal.toFixed(2) }, description:'Ordine GabryShopss' }] })}
                  onApprove={(data, actions) => actions.order!.capture().then(() => {
                    fetch('/api/ordine', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ cart, shipping, total:grandTotal.toFixed(2), customerEmail:shipping.email }) })
                    if (user) supabase.from('orders').insert({ user_id:user.id, items:cart, shipping, total:grandTotal })
                    setPaid(true); setCart([])
                  })}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* WHATSAPP */}
      <a href="https://wa.me/393518435322" target="_blank" style={{ position:'fixed', bottom:'2rem', right:'2rem', background:'#25D366', color:'#fff', width:58, height:58, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, textDecoration:'none', boxShadow:'0 4px 24px rgba(37,211,102,0.35)', zIndex:90, transition:'transform 0.2s' }} onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.12)'}} onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)'}}>💬</a>

      {toast && <div style={{ position:'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)', background:'#141414', color:'#F5F5F0', padding:'12px 24px', borderRadius:24, fontSize:14, zIndex:200, border:'1px solid rgba(201,168,76,0.3)', boxShadow:'0 8px 32px rgba(0,0,0,0.5)', animation:'slideDown 0.3s ease' }}>{toast}</div>}

      <footer style={{ borderTop:'1px solid rgba(201,168,76,0.1)', padding:'2.5rem', textAlign:'center' }}>
        <div style={{ fontSize:20, fontWeight:700, fontFamily:'Playfair Display, serif', color:'#C9A84C', marginBottom:'1rem' }}>GabryShopss</div>
        <p style={{ fontSize:13, color:'#444440', marginBottom:'1rem' }}>© 2025 GabryShopss — Tutti i diritti riservati</p>
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap' }}>
          {[['Privacy','/privacy'],['Termini','/termini'],['FAQ','/faq'],['Contattaci','/contatti']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize:13, color:'#444440', textDecoration:'none', transition:'color 0.2s' }} onMouseEnter={e=>(e.currentTarget.style.color='#C9A84C')} onMouseLeave={e=>(e.currentTarget.style.color='#444440')}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
    </PayPalScriptProvider>
  )
}
