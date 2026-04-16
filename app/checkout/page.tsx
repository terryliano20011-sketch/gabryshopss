'use client'
import { useState, useEffect } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Checkout() {
  const [cart, setCart] = useState<any[]>([])
  const [step, setStep] = useState<1|2|3>(1)
  const [shipping, setShipping] = useState({ name:'', email:'', address:'', city:'', cap:'', phone:'' })
  const [paid, setPaid] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    const saved = localStorage.getItem('gabryshopss_cart')
    if (saved) setCart(JSON.parse(saved))
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user?.email) setShipping(prev => ({ ...prev, email: data.user!.email! }))
      if (data.user?.user_metadata?.nome) setShipping(prev => ({ ...prev, name: data.user!.user_metadata.nome }))
    })
  }, [])

  const totalPrice = cart.reduce((s: number, c: any) => s + c.price * c.qty, 0)
  const shippingCost = cart.some((c: any) => c.type === 'fisico') ? (totalPrice >= 50 ? 0 : 4.99) : 0
  const discountAmount = totalPrice * discount
  const grandTotal = totalPrice - discountAmount + shippingCost

  function applyCoupon() {
    if (coupon.toUpperCase() === 'GABRY10') { setDiscount(0.10); setCouponMsg('✅ -10% applicato!') }
    else if (coupon.toUpperCase() === 'WELCOME') { setDiscount(0.15); setCouponMsg('✅ -15% applicato!') }
    else { setDiscount(0); setCouponMsg('❌ Coupon non valido') }
  }

  const inputStyle: React.CSSProperties = { width:'100%', padding:'12px 16px', borderRadius:10, border:'1px solid rgba(201,168,76,0.2)', fontSize:14, marginBottom:10, outline:'none', background:'#1C1C1C', color:'#F5F5F0', fontFamily:'inherit' }
  const labelStyle: React.CSSProperties = { fontSize:12, color:'#888880', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }

  if (cart.length === 0 && !paid) return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', alignItems:'center', justifyContent:'center', color:'#F5F5F0', fontFamily:'sans-serif' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:'1rem' }}>🛒</div>
        <h2 style={{ marginBottom:'1rem' }}>Il carrello è vuoto</h2>
        <a href="/" style={{ color:'#C9A84C', textDecoration:'none' }}>← Torna ai prodotti</a>
      </div>
    </div>
  )

  return (
    <PayPalScriptProvider options={{ clientId: 'Aaw-5XjE4JVOxAo86vZE7hUP5IpaAXmGxBf-8VflGfr9KjtF21hsJ7SViQkaV5FKDEPmXvWrW2D608CS', currency: 'EUR' }}>
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#F5F5F0', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        input::placeholder { color: #444440; }
        input:focus { border-color: rgba(201,168,76,0.5) !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 2rem', borderBottom:'1px solid rgba(201,168,76,0.1)', background:'rgba(10,10,10,0.95)', backdropFilter:'blur(20px)' }}>
        <a href="/" style={{ fontSize:20, fontWeight:700, fontFamily:'Playfair Display, serif', color:'#C9A84C', textDecoration:'none' }}>GabryShopss</a>
        <span style={{ fontSize:14, color:'#888880' }}>Checkout sicuro 🔒</span>
      </nav>

      {paid ? (
        <div style={{ maxWidth:500, margin:'5rem auto', padding:'2rem', textAlign:'center' }}>
          <div style={{ fontSize:72, marginBottom:'1.5rem' }}>✅</div>
          <h1 style={{ fontSize:28, fontWeight:700, fontFamily:'Playfair Display, serif', marginBottom:'1rem', color:'#C9A84C' }}>Ordine confermato!</h1>
          <p style={{ fontSize:15, color:'#888880', marginBottom:'2rem', lineHeight:1.7 }}>Grazie per il tuo acquisto! Riceverai una email di conferma a <strong style={{ color:'#F5F5F0' }}>{shipping.email}</strong></p>
          <a href="/" style={{ background:'linear-gradient(135deg, #C9A84C, #E8C97A)', color:'#000', padding:'14px 36px', borderRadius:24, fontSize:15, fontWeight:600, textDecoration:'none' }}>Torna allo shop</a>
        </div>
      ) : (
        <div style={{ maxWidth:1000, margin:'0 auto', padding:'2rem', display:'grid', gridTemplateColumns:'1fr 380px', gap:'2rem' }}>
          
          {/* COLONNA SINISTRA - STEPS */}
          <div>
            {/* STEP INDICATOR */}
            <div style={{ display:'flex', alignItems:'center', marginBottom:'2rem', gap:0 }}>
              {[{n:1,label:'Riepilogo'},{n:2,label:'Spedizione'},{n:3,label:'Pagamento'}].map((s, i) => (
                <div key={s.n} style={{ display:'flex', alignItems:'center', flex:1 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background: step >= s.n ? 'linear-gradient(135deg, #C9A84C, #E8C97A)' : '#1C1C1C', color: step >= s.n ? '#000' : '#444440', fontSize:14, fontWeight:700, border: step >= s.n ? 'none' : '1px solid rgba(201,168,76,0.2)', transition:'all 0.3s', cursor: step > s.n ? 'pointer' : 'default' }} onClick={() => step > s.n && setStep(s.n as 1|2|3)}>
                      {step > s.n ? '✓' : s.n}
                    </div>
                    <span style={{ fontSize:12, color: step >= s.n ? '#C9A84C' : '#444440', fontWeight: step === s.n ? 600 : 400 }}>{s.label}</span>
                  </div>
                  {i < 2 && <div style={{ flex:1, height:2, background: step > s.n ? 'linear-gradient(90deg, #C9A84C, #E8C97A)' : 'rgba(201,168,76,0.1)', margin:'0 8px', marginBottom:20 }} />}
                </div>
              ))}
            </div>

            {/* STEP 1 - RIEPILOGO */}
            {step === 1 && (
              <div style={{ background:'#141414', borderRadius:16, border:'1px solid rgba(201,168,76,0.1)', padding:'1.5rem' }}>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:'Playfair Display, serif', marginBottom:'1.5rem' }}>📦 Riepilogo ordine</h2>
                {cart.map((c: any, i: number) => (
                  <div key={i} style={{ display:'flex', gap:14, padding:'14px 0', borderBottom:'1px solid rgba(201,168,76,0.08)', alignItems:'center' }}>
                    <img src={c.image} style={{ width:60, height:60, objectFit:'cover', borderRadius:10, border:'1px solid rgba(201,168,76,0.1)' }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:15, fontWeight:600 }}>{c.name}</div>
                      {c.taglia && <div style={{ fontSize:12, color:'#C9A84C', marginTop:3 }}>Variante: <strong>{c.taglia}</strong></div>}
                      <div style={{ fontSize:13, color:'#888880', marginTop:2 }}>Quantità: {c.qty}</div>
                    </div>
                    <div style={{ fontSize:16, fontWeight:700, color:'#C9A84C' }}>€{(c.price * c.qty).toFixed(2)}</div>
                  </div>
                ))}

                {/* Coupon */}
                <div style={{ marginTop:'1.5rem', display:'flex', gap:8 }}>
                  <input placeholder="Codice sconto" value={coupon} onChange={e => setCoupon(e.target.value)} style={{ ...inputStyle, marginBottom:0, flex:1 }} />
                  <button onClick={applyCoupon} style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', color:'#C9A84C', padding:'12px 16px', borderRadius:10, fontSize:13, cursor:'pointer', fontWeight:500, whiteSpace:'nowrap' }}>Applica</button>
                </div>
                {couponMsg && <div style={{ fontSize:13, marginTop:8, color: discount > 0 ? '#4ade80' : '#f87171' }}>{couponMsg}</div>}

                <button onClick={() => setStep(2)} style={{ width:'100%', background:'linear-gradient(135deg, #C9A84C, #E8C97A)', color:'#000', border:'none', padding:14, borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:600, marginTop:'1.5rem' }}>
                  Continua → Spedizione
                </button>
              </div>
            )}

            {/* STEP 2 - SPEDIZIONE */}
            {step === 2 && (
              <div style={{ background:'#141414', borderRadius:16, border:'1px solid rgba(201,168,76,0.1)', padding:'1.5rem' }}>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:'Playfair Display, serif', marginBottom:'1.5rem' }}>🚚 Dati di spedizione</h2>

                <label style={labelStyle}>Nome e Cognome</label>
                <input placeholder="Mario Rossi" value={shipping.name} onChange={e => setShipping({...shipping, name:e.target.value})} style={inputStyle} />

                <label style={labelStyle}>Email</label>
                <input placeholder="mario@email.com" type="email" value={shipping.email} onChange={e => setShipping({...shipping, email:e.target.value})} style={inputStyle} />

                <label style={labelStyle}>Telefono</label>
                <input placeholder="+39 333 1234567" value={shipping.phone} onChange={e => setShipping({...shipping, phone:e.target.value})} style={inputStyle} />

                <label style={labelStyle}>Indirizzo</label>
                <input placeholder="Via Roma 1" value={shipping.address} onChange={e => setShipping({...shipping, address:e.target.value})} style={inputStyle} />

                <div style={{ display:'grid', gridTemplateColumns:'1fr 100px', gap:10 }}>
                  <div>
                    <label style={labelStyle}>Città</label>
                    <input placeholder="Milano" value={shipping.city} onChange={e => setShipping({...shipping, city:e.target.value})} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>CAP</label>
                    <input placeholder="20100" value={shipping.cap} onChange={e => setShipping({...shipping, cap:e.target.value})} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display:'flex', gap:10, marginTop:8 }}>
                  <button onClick={() => setStep(1)} style={{ flex:1, background:'none', color:'#888880', border:'1px solid rgba(201,168,76,0.2)', padding:14, borderRadius:24, fontSize:15, cursor:'pointer' }}>← Indietro</button>
                  <button onClick={() => {
                    if (!shipping.name || !shipping.email || !shipping.address || !shipping.city || !shipping.cap) { alert('Compila tutti i campi obbligatori'); return }
                    setStep(3)
                  }} style={{ flex:2, background:'linear-gradient(135deg, #C9A84C, #E8C97A)', color:'#000', border:'none', padding:14, borderRadius:24, fontSize:15, cursor:'pointer', fontWeight:600 }}>
                    Continua → Pagamento
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 - PAGAMENTO */}
            {step === 3 && (
              <div style={{ background:'#141414', borderRadius:16, border:'1px solid rgba(201,168,76,0.1)', padding:'1.5rem' }}>
                <h2 style={{ fontSize:20, fontWeight:700, fontFamily:'Playfair Display, serif', marginBottom:'1.5rem' }}>💳 Metodo di pagamento</h2>

                <div style={{ background:'rgba(201,168,76,0.05)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:12, padding:'1rem', marginBottom:'1.5rem' }}>
                  <div style={{ fontSize:13, color:'#888880', marginBottom:8 }}>🔒 Pagamento sicuro tramite PayPal</div>
                  <div style={{ fontSize:12, color:'#444440' }}>Puoi pagare con carta di credito/debito o account PayPal</div>
                </div>

                <PayPalButtons
                  style={{ layout:'vertical', shape:'pill', color:'gold' }}
                  createOrder={(data, actions) => actions.order.create({
                    intent:'CAPTURE',
                    purchase_units:[{ amount:{ currency_code:'EUR', value:grandTotal.toFixed(2) }, description:'Ordine GabryShopss' }]
                  })}
                  onApprove={(data, actions) => actions.order!.capture().then(() => {
                    fetch('/api/ordine', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ cart, shipping, total:grandTotal.toFixed(2), customerEmail:shipping.email }) })
                    if (user) supabase.from('orders').insert({ user_id:user.id, items:cart, shipping, total:grandTotal })
                    localStorage.removeItem('gabryshopss_cart')
                    setPaid(true)
                  })}
                />

                <button onClick={() => setStep(2)} style={{ width:'100%', background:'none', color:'#888880', border:'1px solid rgba(201,168,76,0.2)', padding:12, borderRadius:24, fontSize:14, cursor:'pointer', marginTop:12 }}>← Torna alla spedizione</button>
              </div>
            )}
          </div>

          {/* COLONNA DESTRA - SOMMARIO */}
          <div>
            <div style={{ background:'#141414', borderRadius:16, border:'1px solid rgba(201,168,76,0.1)', padding:'1.5rem', position:'sticky', top:100 }}>
              <h3 style={{ fontSize:16, fontWeight:700, fontFamily:'Playfair Display, serif', marginBottom:'1rem' }}>Sommario</h3>
              
              {cart.map((c: any, i: number) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#888880', padding:'4px 0' }}>
                  <span>{c.name}{c.taglia ? ` (${c.taglia})` : ''} x{c.qty}</span>
                  <span style={{ color:'#F5F5F0' }}>€{(c.price * c.qty).toFixed(2)}</span>
                </div>
              ))}

              <div style={{ borderTop:'1px solid rgba(201,168,76,0.1)', marginTop:12, paddingTop:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#888880', marginBottom:6 }}>
                  <span>Subtotale</span><span>€{totalPrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#4ade80', marginBottom:6 }}>
                    <span>Sconto {discount*100}%</span><span>-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#888880', marginBottom:12 }}>
                  <span>Spedizione</span>
                  <span style={{ color: shippingCost === 0 ? '#4ade80' : '#F5F5F0' }}>{shippingCost === 0 ? 'Gratuita ✅' : `€${shippingCost.toFixed(2)}`}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:20, fontWeight:700, fontFamily:'Playfair Display, serif' }}>
                  <span>Totale</span>
                  <span style={{ color:'#C9A84C' }}>€{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {step === 2 && shipping.name && (
                <div style={{ marginTop:'1rem', padding:'12px', background:'rgba(201,168,76,0.05)', borderRadius:10, border:'1px solid rgba(201,168,76,0.1)', fontSize:12, color:'#888880' }}>
                  <div style={{ fontWeight:600, color:'#C9A84C', marginBottom:4 }}>📍 Spedire a:</div>
                  <div>{shipping.name}</div>
                  <div>{shipping.address}, {shipping.cap} {shipping.city}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </PayPalScriptProvider>
  )
}
