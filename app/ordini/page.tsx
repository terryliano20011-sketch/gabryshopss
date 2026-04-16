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

export default function Account() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState<'ordini'|'profilo'>('ordini')
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
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#F5F5F0', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 2rem', borderBottom:'1px solid rgba(201,168,76,0.1)', position:'sticky', top:0, background:'rgba(10,10,10,0.95)', backdropFilter:'blur(20px)', zIndex:50 }}>
        <a href="/" style={{ fontSize:22, fontWeight:700, fontFamily:'Playfair Display, serif', color:'#C9A84C', textDecoration:'none' }}>GabryShopss</a>
        <button onClick={handleLogout} style={{ background:'none', border:'1px solid rgba(201,168,76,0.3)', padding:'8px 20px', borderRadius:20, fontSize:13, cursor:'pointer', color:'#C9A84C', transition:'all 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background='rgba(201,168,76,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background='none')}>
          Esci
        </button>
      </nav>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'3rem 2rem', animation:'fadeUp 0.5s ease' }}>
        {/* Header profilo */}
        <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:'2.5rem' }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg, #C9A84C, #E8C97A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:'#000', fontFamily:'Playfair Display, serif' }}>
            {user?.user_metadata?.nome ? user.user_metadata.nome[0].toUpperCase() : user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize:22, fontWeight:700, fontFamily:'Playfair Display, serif', marginBottom:4 }}>
              {user?.user_metadata?.nome || 'Il mio account'}
            </h1>
            <p style={{ fontSize:14, color:'#888880' }}>{user?.email}</p>
          </div>
        </div>

        {/* Tab */}
        <div style={{ display:'flex', background:'#141414', borderRadius:12, padding:4, marginBottom:'2rem', border:'1px solid rgba(201,168,76,0.1)' }}>
          {(['ordini','profilo'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background: tab===t ? 'linear-gradient(135deg, #C9A84C, #E8C97A)' : 'none', color: tab===t ? '#000' : '#888880', fontSize:14, fontWeight: tab===t ? 600 : 400, cursor:'pointer', transition:'all 0.2s', textTransform:'capitalize' }}>
              {t === 'ordini' ? '📦 I miei ordini' : '👤 Profilo'}
            </button>
          ))}
        </div>

        {tab === 'ordini' && (
          loading ? (
            <div style={{ textAlign:'center', padding:'3rem', color:'#444440' }}>Caricamento...</div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign:'center', padding:'4rem', border:'1px solid rgba(201,168,76,0.1)', borderRadius:16, background:'#141414' }}>
              <div style={{ fontSize:48, marginBottom:'1rem' }}>📦</div>
              <div style={{ fontSize:18, fontWeight:600, marginBottom:8, fontFamily:'Playfair Display, serif' }}>Nessun ordine ancora</div>
              <p style={{ fontSize:14, color:'#888880', marginBottom:'1.5rem' }}>Inizia a fare shopping!</p>
              <a href="/" style={{ background:'linear-gradient(135deg, #C9A84C, #E8C97A)', color:'#000', padding:'12px 28px', borderRadius:24, fontSize:14, fontWeight:600, textDecoration:'none' }}>Vai ai prodotti →</a>
            </div>
          ) : orders.map(o => (
            <div key={o.id} style={{ border:'1px solid rgba(201,168,76,0.1)', borderRadius:16, padding:'1.5rem', marginBottom:16, background:'#141414', animation:'fadeUp 0.4s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14, alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:12, color:'#888880', marginBottom:2 }}>Ordine #{o.id}</div>
                  <div style={{ fontSize:13, color:'#444440' }}>{new Date(o.created_at).toLocaleDateString('it-IT', { day:'2-digit', month:'long', year:'numeric' })}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:20, fontWeight:700, color:'#C9A84C', fontFamily:'Playfair Display, serif' }}>€{Number(o.total).toFixed(2)}</div>
                  <div style={{ fontSize:11, background:'rgba(42,122,74,0.2)', color:'#4ade80', padding:'3px 10px', borderRadius:10, display:'inline-block', marginTop:4, border:'1px solid rgba(74,222,128,0.2)' }}>{o.status}</div>
                </div>
              </div>
              <div style={{ borderTop:'1px solid rgba(201,168,76,0.08)', paddingTop:12 }}>
                {o.items.map((item: any, i: number) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#888880', padding:'4px 0' }}>
                    <span>{item.name}{item.taglia ? ` (${item.taglia})` : ''} x{item.qty}</span>
                    <span style={{ color:'#F5F5F0' }}>€{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop:'1px solid rgba(201,168,76,0.08)', paddingTop:12, marginTop:8, fontSize:13, color:'#444440', display:'flex', gap:6 }}>
                <span>🚚</span>
                <span>{o.shipping.name} — {o.shipping.address}, {o.shipping.cap} {o.shipping.city}</span>
              </div>
            </div>
          ))
        )}

        {tab === 'profilo' && (
          <div style={{ border:'1px solid rgba(201,168,76,0.1)', borderRadius:16, padding:'2rem', background:'#141414' }}>
            <h2 style={{ fontSize:18, fontWeight:700, fontFamily:'Playfair Display, serif', marginBottom:'1.5rem' }}>Informazioni account</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ padding:'12px 16px', background:'#1C1C1C', borderRadius:10, border:'1px solid rgba(201,168,76,0.1)' }}>
                <div style={{ fontSize:11, color:'#888880', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.5px' }}>Nome</div>
                <div style={{ fontSize:15, color:'#F5F5F0' }}>{user?.user_metadata?.nome || 'Non impostato'}</div>
              </div>
              <div style={{ padding:'12px 16px', background:'#1C1C1C', borderRadius:10, border:'1px solid rgba(201,168,76,0.1)' }}>
                <div style={{ fontSize:11, color:'#888880', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.5px' }}>Email</div>
                <div style={{ fontSize:15, color:'#F5F5F0' }}>{user?.email}</div>
              </div>
              <div style={{ padding:'12px 16px', background:'#1C1C1C', borderRadius:10, border:'1px solid rgba(201,168,76,0.1)' }}>
                <div style={{ fontSize:11, color:'#888880', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.5px' }}>Membro dal</div>
                <div style={{ fontSize:15, color:'#F5F5F0' }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString('it-IT', { day:'2-digit', month:'long', year:'numeric' }) : ''}</div>
              </div>
            </div>
            <button onClick={handleLogout} style={{ marginTop:'1.5rem', width:'100%', background:'rgba(204,0,0,0.1)', border:'1px solid rgba(204,0,0,0.3)', color:'#f87171', padding:'12px', borderRadius:24, fontSize:14, cursor:'pointer', fontWeight:500, transition:'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background='rgba(204,0,0,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background='rgba(204,0,0,0.1)')}>
              Esci dall'account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
