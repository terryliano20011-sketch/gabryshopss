'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

type Order = {
  id: number
  items: any[]
  shipping: any
  total: number
  status: string
  created_at: string
}

export default function Ordini() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth'); return }
      setUser(data.user)
      supabase.from('orders').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }).then(({ data: orders }) => {
        if (orders) setOrders(orders)
        setLoading(false)
      })
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 2rem', borderBottom:'1px solid #eee', position:'sticky', top:0, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)', zIndex:50 }}>
        <a href="/" style={{ fontSize:20, fontWeight:600, letterSpacing:'-0.5px', textDecoration:'none', color:'#1a1a1a' }}>GabryShopss</a>
        <button onClick={handleLogout} style={{ background:'none', border:'1px solid #ddd', padding:'8px 16px', borderRadius:20, fontSize:13, cursor:'pointer', color:'#666' }}>Esci</button>
      </nav>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'3rem 2rem' }}>
        <h1 style={{ fontSize:32, fontWeight:700, letterSpacing:'-1px', marginBottom:'0.5rem' }}>I miei ordini</h1>
        <p style={{ fontSize:14, color:'#888', marginBottom:'2rem' }}>{user?.email}</p>

        {loading ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'#aaa' }}>Caricamento...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem', border:'1px solid #eee', borderRadius:16 }}>
            <div style={{ fontSize:48, marginBottom:'1rem' }}>📦</div>
            <div style={{ fontSize:16, fontWeight:500, marginBottom:8 }}>Nessun ordine ancora</div>
            <a href="/" style={{ fontSize:14, color:'#888' }}>Vai ai prodotti →</a>
          </div>
        ) : orders.map(o => (
          <div key={o.id} style={{ border:'1px solid #eee', borderRadius:16, padding:'1.5rem', marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <div>
                <div style={{ fontSize:13, color:'#aaa' }}>Ordine #{o.id}</div>
                <div style={{ fontSize:13, color:'#888' }}>{new Date(o.created_at).toLocaleDateString('it-IT')}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:16, fontWeight:700 }}>€{Number(o.total).toFixed(2)}</div>
                <div style={{ fontSize:12, background:'#e8f5e9', color:'#2a7a4a', padding:'2px 8px', borderRadius:10, display:'inline-block' }}>{o.status}</div>
              </div>
            </div>
            <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:12 }}>
              {o.items.map((item: any, i: number) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#666', padding:'3px 0' }}>
                  <span>{item.name} x{item.qty}</span>
                  <span>€{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:12, marginTop:8, fontSize:13, color:'#888' }}>
              🚚 {o.shipping.name} — {o.shipping.address}, {o.shipping.cap} {o.shipping.city}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
