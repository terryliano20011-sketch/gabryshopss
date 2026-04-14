'use client'
import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

type Product = { id: number; name: string; desc: string; price: number; type: string; icon: string }
type CartItem = Product & { qty: number }

const products: Product[] = [
  { id:1, name:'T-Shirt Premium', desc:'Cotone 100%, vestibilità regolare', price:24.99, type:'fisico', icon:'👕' },
  { id:2, name:'Guida PDF Pro', desc:'Corso completo in formato digitale', price:9.99, type:'digitale', icon:'📄' },
  { id:3, name:'Hoodie Oversize', desc:'Felpa pesante, più colori disponibili', price:44.99, type:'fisico', icon:'🧥' },
  { id:4, name:'Pack Preset Foto', desc:'50 preset Lightroom pronti all uso', price:14.99, type:'digitale', icon:'🎨' },
  { id:5, name:'Cap Snapback', desc:'Cappellino regolabile, ricamo frontale', price:19.99, type:'fisico', icon:'🧢' },
  { id:6, name:'Template CV', desc:'3 template Word professionali', price:4.99, type:'digitale', icon:'📝' },
]

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [filter, setFilter] = useState('tutti')
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [paid, setPaid] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)

  const filtered = filter === 'tutti' ? products : products.filter(p => p.type === filter)
  const totalQty = cart.reduce((s, c) => s + c.qty, 0)
  const totalPrice = cart.reduce((s, c) => s + c.price * c.qty, 0)

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

  return (
    <PayPalScriptProvider options={{ clientId: 'Aaw-5XjE4JVOxAo86vZE7hUP5IpaAXmGxBf-8VflGfr9KjtF21hsJ7SViQkaV5FKDEPmXvWrW2D608CS', currency: 'EUR' }}>
    <div style={{ minHeight: '100vh', background: '#fff' }}>

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 2rem', borderBottom:'1px solid #eee', position:'sticky', top:0, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)', zIndex:50 }}>
        <div style={{ fontSize:20, fontWeight:600, letterSpacing:'-0.5px' }}>GabryShopss</div>
        <div style={{ display:'flex', gap:'2rem' }}>
          {['Prodotti','Chi siamo','Contatti'].map(l => (
            <span key={l} style={{ fontSize:14, color:'#666', cursor:'pointer' }}>{l}</span>
          ))}
        </div>
        <button onClick={() => setCartOpen(true)} style={{ position:'relative', background:'none', border:'none', fontSize:22, cursor:'pointer' }}>
          🛒
          {totalQty > 0 && <span style={{ position:'absolute', top:-6, right:-8, background:'#1a1a1a', color:'#fff', fontSize:10, width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600 }}>{totalQty}</span>}
        </button>
      </nav>

      {/* HERO */}
      <div style={{ textAlign:'center', padding:'5rem 2rem 3rem', background:'#fff' }}>
        <h1 style={{ fontSize:48, fontWeight:700, letterSpacing:'-2px', marginBottom:'1rem', lineHeight:1.1, color:'#000' }}>Qualità senza<br />compromessi.</h1>
        <p style={{ fontSize:16, color:'#666', maxWidth:420, margin:'0 auto 2rem' }}>Prodotti fisici e digitali selezionati. Spedizione rapida, download immediato.</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <button style={{ background:'#1a1a1a', color:'#fff', border:'none', padding:'12px 28px', borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:500 }}>Scopri i prodotti</button>
          <button style={{ background:'none', color:'#1a1a1a', border:'1px solid #ddd', padding:'12px 28px', borderRadius:24, fontSize:15, cursor:'pointer' }}>Chi siamo</button>
        </div>
      </div>

      {/* FILTRI */}
      <div style={{ display:'flex', gap:8, justifyContent:'center', padding:'1rem 2rem' }}>
        {['tutti','fisico','digitale'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding:'7px 20px', borderRadius:20, border:'1px solid #ddd', background: filter===f ? '#1a1a1a' : 'none', color: filter===f ? '#fff' : '#666', fontSize:13, cursor:'pointer', fontWeight: filter===f ? 500 : 400 }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* PRODOTTI */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'1.5rem', padding:'1.5rem 2rem 4rem', maxWidth:1200, margin:'0 auto' }}>
        {filtered.map(p => {
          const inCart = cart.find(c => c.id === p.id)
          return (
            <div key={p.id} style={{ border:'1px solid #eee', borderRadius:16, overflow:'hidden', background:'#fff' }}>
              <div style={{ height:180, background:'#f8f8f8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:52 }}>{p.icon}</div>
              <div style={{ padding:'1rem' }}>
                <div style={{ fontSize:11, color:'#aaa', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{p.type}</div>
                <div style={{ fontSize:16, fontWeight:600, marginBottom:4 }}>{p.name}</div>
                <div style={{ fontSize:13, color:'#888', marginBottom:14, lineHeight:1.5 }}>{p.desc}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:18, fontWeight:600 }}>€{p.price.toFixed(2)}</span>
                  <button onClick={() => addToCart(p)} style={{ background: inCart ? '#2a7a4a' : '#1a1a1a', color:'#fff', border:'none', padding:'8px 16px', borderRadius:20, fontSize:13, cursor:'pointer', fontWeight:500 }}>
                    {inCart ? '✓ Aggiunto' : '+ Aggiungi'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* OVERLAY */}
      {cartOpen && <div onClick={() => { setCartOpen(false); setCheckingOut(false) }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:99 }} />}

      {/* CARRELLO */}
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
                  <div style={{ width:48, height:48, background:'#f8f8f8', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{c.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:500 }}>{c.name}</div>
                    <div style={{ fontSize:13, color:'#888' }}>€{c.price.toFixed(2)}</div>
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
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
                  <span style={{ fontWeight:500 }}>Totale</span>
                  <span style={{ fontWeight:600, fontSize:17 }}>€{totalPrice.toFixed(2)}</span>
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
                <div style={{ fontSize:14, color:'#888' }}>Grazie per il tuo acquisto.</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom:'1.5rem' }}>
                  <div style={{ fontSize:15, fontWeight:500, marginBottom:8 }}>Riepilogo ordine</div>
                  {cart.map(c => (
                    <div key={c.id} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#666', padding:'4px 0' }}>
                      <span>{c.name} x{c.qty}</span>
                      <span>€{(c.price * c.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display:'flex', justifyContent:'space-between', fontWeight:600, fontSize:15, marginTop:12, paddingTop:12, borderTop:'1px solid #eee' }}>
                    <span>Totale</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <PayPalButtons
                  style={{ layout: 'vertical', shape: 'pill' }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [{
                        amount: {
                          currency_code: 'EUR',
                          value: totalPrice.toFixed(2)
                        },
                        description: 'Ordine GabryShopss'
                      }]
                    })
                  }}
                  onApprove={(data, actions) => {
                    return actions.order!.capture().then(() => {
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

      {/* TOAST */}
      {toast && <div style={{ position:'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)', background:'#1a1a1a', color:'#fff', padding:'10px 22px', borderRadius:24, fontSize:14, zIndex:200 }}>{toast}</div>}
    </div>
    </PayPalScriptProvider>
  )
}
