'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { supabase } from '../lib/supabase'

type Product = { id: number; name: string; short_desc: string; long_desc: string; price: number; type: string; image: string; images: string[] }
type CartItem = Product & { qty: number }

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [filter, setFilter] = useState('tutti')
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [paid, setPaid] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product|null>(null)
  const [selectedImg, setSelectedImg] = useState(0)
  const [shipping, setShipping] = useState({ name:'', email:'', address:'', city:'', cap:'' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('*').eq('active', true).order('id').then(({ data }) => {
      if (data) setProducts(data)
      setLoading(false)
    })
  }, [])

  const filtered = filter === 'tutti' ? products : products.filter(p => p.type === filter)
  const totalQty = cart.reduce((s, c) => s + c.qty, 0)
  const shippingCost = cart.some(c => c.type === 'fisico') ? 4.99 : 0
  const totalPrice = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const grandTotal = totalPrice + shippingCost

  function addToCart(p: Product) {
    setCart(prev => {
      const ex = prev.find(c => c.id === p.id)
      if (ex) return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { ...p, qty: 1 }]
    })
    setToast(p.name + ' aggiunto!')
    setTimeout(() => setToast(''), 2500)
  }

  function changeQty(id: number, delta: number) {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0))
  }

  const inputStyle = { width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #ddd', fontSize:14, marginBottom:10, outline:'none' }

  return (
    <PayPalScriptProvider options={{ clientId: 'Aaw-5XjE4JVOxAo86vZE7hUP5IpaAXmGxBf-8VflGfr9KjtF21hsJ7SViQkaV5FKDEPmXvWrW2D608CS', currency: 'EUR' }}>
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 2rem', borderBottom:'1px solid #eee', position:'sticky', top:0, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)', zIndex:50 }}>
        <div onClick={() => setSelectedProduct(null)} style={{ fontSize:20, fontWeight:600, letterSpacing:'-0.5px', cursor:'pointer' }}>GabryShopss</div>
        <div style={{ display:'flex', gap:'2rem' }}>
          <a href="/" style={{ fontSize:14, color:'#666', textDecoration:'none' }}>Prodotti</a>
          <a href="/chi-siamo" style={{ fontSize:14, color:'#666', textDecoration:'none' }}>Chi siamo</a>
          <a href="/contatti" style={{ fontSize:14, color:'#666', textDecoration:'none' }}>Contattaci</a>
        </div>
        <button onClick={() => setCartOpen(true)} style={{ position:'relative', background:'none', border:'none', fontSize:22, cursor:'pointer' }}>
          🛒
          {totalQty > 0 && <span style={{ position:'absolute', top:-6, right:-8, background:'#1a1a1a', color:'#fff', fontSize:10, width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600 }}>{totalQty}</span>}
        </button>
      </nav>

      {selectedProduct ? (
        <div style={{ maxWidth:1000, margin:'0 auto', padding:'2rem' }}>
          <button onClick={() => setSelectedProduct(null)} style={{ background:'none', border:'none', fontSize:14, color:'#888', cursor:'pointer', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:6 }}>← Torna ai prodotti</button>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem' }}>
            <div>
              <div style={{ position:'relative', height:380, borderRadius:16, overflow:'hidden', background:'#f8f8f8', marginBottom:12 }}>
                <Image src={selectedProduct.images[selectedImg]} alt={selectedProduct.name} fill style={{ objectFit:'cover' }} />
              </div>
              <div style={{ display:'flex', gap:8 }}>
                {selectedProduct.images.map((img, i) => (
                  <div key={i} onClick={() => setSelectedImg(i)} style={{ position:'relative', width:72, height:72, borderRadius:10, overflow:'hidden', cursor:'pointer', border: selectedImg===i ? '2px solid #1a1a1a' : '2px solid transparent', background:'#f8f8f8' }}>
                    <Image src={img} alt="" fill style={{ objectFit:'cover' }} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div style={{ fontSize:11, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>{selectedProduct.type}</div>
              <h1 style={{ fontSize:28, fontWeight:700, marginBottom:12, letterSpacing:'-0.5px', color:'#000' }}>{selectedProduct.name}</h1>
              <p style={{ fontSize:15, color:'#555', lineHeight:1.7, marginBottom:24 }}>{selectedProduct.long_desc}</p>
              {selectedProduct.type === 'fisico' && <p style={{ fontSize:13, color:'#888', marginBottom:16 }}>🚚 Spedizione: €4.99</p>}
              {selectedProduct.type === 'digitale' && <p style={{ fontSize:13, color:'#2a7a4a', marginBottom:16 }}>✅ Download immediato — spedizione gratuita</p>}
              <div style={{ fontSize:32, fontWeight:700, marginBottom:24, color:'#000' }}>€{Number(selectedProduct.price).toFixed(2)}</div>
              <button onClick={() => addToCart(selectedProduct)} style={{ background:'#1a1a1a', color:'#fff', border:'none', padding:'14px 28px', borderRadius:24, fontSize:16, cursor:'pointer', fontWeight:500, marginBottom:12 }}>
                {cart.find(c => c.id === selectedProduct.id) ? '✓ Aggiunto al carrello' : '+ Aggiungi al carrello'}
              </button>
              <button onClick={() => { addToCart(selectedProduct); setCartOpen(true); }} style={{ background:'none', color:'#1a1a1a', border:'1px solid #ddd', padding:'14px 28px', borderRadius:24, fontSize:16, cursor:'pointer', fontWeight:500 }}>
                Acquista subito
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div style={{ textAlign:'center', padding:'5rem 2rem 3rem' }}>
            <h1 style={{ fontSize:48, fontWeight:700, letterSpacing:'-2px', marginBottom:'1rem', lineHeight:1.1, color:'#000' }}>Prodotti Auto<br />di Qualità.</h1>
            <p style={{ fontSize:16, color:'#666', maxWidth:420, margin:'0 auto 2rem' }}>Tutto quello che serve per la cura e la protezione della tua auto.</p>
            <button style={{ background:'#1a1a1a', color:'#fff', border:'none', padding:'12px 28px', borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:500 }}>Scopri i prodotti</button>
          </div>

          <div style={{ display:'flex', gap:8, justifyContent:'center', padding:'1rem 2rem' }}>
            {['tutti','fisico','digitale'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding:'7px 20px', borderRadius:20, border:'1px solid #ddd', background: filter===f ? '#1a1a1a' : 'none', color: filter===f ? '#fff' : '#666', fontSize:13, cursor:'pointer', fontWeight: filter===f ? 500 : 400 }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'4rem', color:'#aaa', fontSize:15 }}>Caricamento prodotti...</div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'1.5rem', padding:'1.5rem 2rem 4rem', maxWidth:1200, margin:'0 auto' }}>
              {filtered.map(p => {
                const inCart = cart.find(c => c.id === p.id)
                return (
                  <div key={p.id} style={{ border:'1px solid #eee', borderRadius:16, overflow:'hidden', background:'#fff', cursor:'pointer' }} onClick={() => { setSelectedProduct(p); setSelectedImg(0); }}>
                    <div style={{ position:'relative', height:240, background:'#f8f8f8' }}>
                      <Image src={p.image} alt={p.name} fill style={{ objectFit:'cover' }} />
                    </div>
                    <div style={{ padding:'1rem' }}>
                      <div style={{ fontSize:11, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{p.type}</div>
                      <div style={{ fontSize:16, fontWeight:600, marginBottom:4 }}>{p.name}</div>
                      <div style={{ fontSize:13, color:'#888', marginBottom:14, lineHeight:1.5 }}>{p.short_desc}</div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span style={{ fontSize:18, fontWeight:600 }}>€{Number(p.price).toFixed(2)}</span>
                        <button onClick={e => { e.stopPropagation(); addToCart(p); }} style={{ background: inCart ? '#2a7a4a' : '#1a1a1a', color:'#fff', border:'none', padding:'8px 16px', borderRadius:20, fontSize:13, cursor:'pointer', fontWeight:500 }}>
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

      {cartOpen && <div onClick={() => { setCartOpen(false); setCheckingOut(false) }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:99 }} />}

      <div style={{ position:'fixed', top:0, right: cartOpen ? 0 : -420, width:400, height:'100%', background:'#fff', borderLeft:'1px solid #eee', zIndex:100, display:'flex', flexDirection:'column', transition:'right 0.3s' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.25rem 1.5rem', borderBottom:'1px solid #eee' }}>
          <span style={{ fontSize:17, fontWeight:600 }}>{checkingOut ? 'Pagamento' : 'Carrello'}</span>
          <button onClick={() => { setCartOpen(false); setCheckingOut(false) }} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#888' }}>✕</button>
        </div>
        {!checkingOut ? (
          <>
            <div style={{ flex:1, overflowY:'auto', padding:'1rem 1.5rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign:'center', padding:'3rem 1rem', color:'#aaa', fontSize:14 }}>Il carrello è vuoto</div>
              ) : cart.map(c => (
                <div key={c.id} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom:'1px solid #f0f0f0', alignItems:'center' }}>
                  <div style={{ position:'relative', width:48, height:48, borderRadius:10, overflow:'hidden', flexShrink:0, background:'#f8f8f8' }}>
                    <Image src={c.image} alt={c.name} fill style={{ objectFit:'cover' }} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500 }}>{c.name}</div>
                    <div style={{ fontSize:13, color:'#888' }}>€{Number(c.price).toFixed(2)}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:6 }}>
                      <button onClick={() => changeQty(c.id, -1)} style={{ width:24, height:24, borderRadius:'50%', border:'1px solid #ddd', background:'none', cursor:'pointer', fontSize:16 }}>−</button>
                      <span style={{ fontSize:13, fontWeight:500 }}>{c.qty}</span>
                      <button onClick={() => changeQty(c.id, 1)} style={{ width:24, height:24, borderRadius:'50%', border:'1px solid #ddd', background:'none', cursor:'pointer', fontSize:16 }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding:'1.25rem 1.5rem', borderTop:'1px solid #eee' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:14, color:'#888' }}>Subtotale</span>
                  <span style={{ fontSize:14 }}>€{totalPrice.toFixed(2)}</span>
                </div>
                {shippingCost > 0 && (
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                    <span style={{ fontSize:14, color:'#888' }}>🚚 Spedizione</span>
                    <span style={{ fontSize:14 }}>€{shippingCost.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem', paddingTop:10, borderTop:'1px solid #eee' }}>
                  <span style={{ fontWeight:600 }}>Totale</span>
                  <span style={{ fontWeight:600, fontSize:17 }}>€{grandTotal.toFixed(2)}</span>
                </div>
                <button onClick={() => setCheckingOut(true)} style={{ width:'100%', background:'#1a1a1a', color:'#fff', border:'none', padding:14, borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:500 }}>
                  Procedi al pagamento
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex:1, padding:'1.5rem', overflowY:'auto' }}>
            {paid ? (
              <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
                <div style={{ fontSize:48, marginBottom:'1rem' }}>✅</div>
                <div style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>Pagamento completato!</div>
                <div style={{ fontSize:14, color:'#888' }}>Grazie per il tuo acquisto. Riceverai una conferma via email.</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom:'1rem' }}>
                  <div style={{ fontSize:15, fontWeight:600, marginBottom:12 }}>Dati di spedizione</div>
                  <input placeholder="Nome e Cognome" value={shipping.name} onChange={e => setShipping({...shipping, name:e.target.value})} style={inputStyle} />
                  <input placeholder="Email (per conferma ordine)" value={shipping.email} onChange={e => setShipping({...shipping, email:e.target.value})} style={inputStyle} />
                  <input placeholder="Indirizzo" value={shipping.address} onChange={e => setShipping({...shipping, address:e.target.value})} style={inputStyle} />
                  <div style={{ display:'flex', gap:8 }}>
                    <input placeholder="Città" value={shipping.city} onChange={e => setShipping({...shipping, city:e.target.value})} style={{...inputStyle, flex:1}} />
                    <input placeholder="CAP" value={shipping.cap} onChange={e => setShipping({...shipping, cap:e.target.value})} style={{...inputStyle, width:90}} />
                  </div>
                </div>
                <div style={{ marginBottom:'1.5rem' }}>
                  <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>Riepilogo ordine</div>
                  {cart.map(c => (
                    <div key={c.id} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#666', padding:'4px 0' }}>
                      <span>{c.name} x{c.qty}</span>
                      <span>€{(Number(c.price) * c.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  {shippingCost > 0 && (
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#666', padding:'4px 0' }}>
                      <span>🚚 Spedizione</span>
                      <span>€{shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', fontWeight:600, fontSize:15, marginTop:12, paddingTop:12, borderTop:'1px solid #eee' }}>
                    <span>Totale</span>
                    <span>€{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <PayPalButtons
                  style={{ layout: 'vertical', shape: 'pill' }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [{ amount: { currency_code: 'EUR', value: grandTotal.toFixed(2) }, description: 'Ordine GabryShopss' }]
                    })
                  }}
                  onApprove={(data, actions) => {
                    return actions.order!.capture().then(() => {
                      fetch('/api/ordine', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cart, shipping, total: grandTotal.toFixed(2), customerEmail: shipping.email }) })
                      setPaid(true)
                      setCart([])
                    })
                  }}
                />
              </>
            )}
          </div>
        )}
      </div>

      {toast && <div style={{ position:'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)', background:'#1a1a1a', color:'#fff', padding:'10px 22px', borderRadius:24, fontSize:14, zIndex:200 }}>{toast}</div>}

      <footer style={{ borderTop:'1px solid #eee', padding:'2rem', textAlign:'center' }}>
        <p style={{ fontSize:13, color:'#aaa', marginBottom:8 }}>© 2025 GabryShopss — Tutti i diritti riservati</p>
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center' }}>
          <a href="/privacy" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Privacy Policy</a>
          <a href="/termini" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Termini e Condizioni</a>
          <a href="/contatti" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Contattaci</a>
        </div>
      </footer>
    </div>
    </PayPalScriptProvider>
  )
}
