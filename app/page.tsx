'use client'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

type Categoria = { id: number; nome: string; slug: string; descrizione: string; emoji: string; active: boolean }

export default function HomePage() {
  const [categorie, setCategorie] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null))
    supabase.from('categorie').select('*').eq('active', true).order('id').then(({ data }) => {
      if (data) setCategorie(data)
      setLoading(false)
    })
  }, [])

  const covers: Record<string, string> = {
    auto: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    vestiti: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    gioielli: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    elettronica: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0A0A0A', color:'#F5F5F0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        ::selection { background: #C9A84C; color: #000; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0A0A0A; }
        ::-webkit-scrollbar-thumb { background: #8B6914; border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

        @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
        .cat-card { transition: transform 0.3s, border-color 0.3s; cursor: pointer; }
        .cat-card:hover { transform: translateY(-8px); border-color: rgba(201,168,76,0.5) !important; }
        .cat-card:hover .cat-arrow { transform: translateX(4px); }
        .cat-arrow { transition: transform 0.3s; }
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #C9A84C !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding: isMobile ? '1rem 1.25rem' : '1.25rem 2.5rem', borderBottom:'1px solid rgba(201,168,76,0.1)', position:'sticky', top:0, background:'rgba(10,10,10,0.95)', backdropFilter:'blur(20px)', zIndex:50 }}>
        <div style={{ fontSize:22, fontWeight:700, fontFamily:'Playfair Display, serif', color:'#C9A84C' }}>GabryShopss</div>
        <div style={{ display: isMobile ? 'none' : 'flex', gap:'2rem', alignItems:'center' }}>
          <a href="/" className="nav-link" style={{ fontSize:14, color:'#C9A84C', textDecoration:'none', fontWeight:500 }}>Home</a>
          <a href="/chi-siamo" className="nav-link" style={{ fontSize:14, color:'#888880', textDecoration:'none' }}>Chi siamo</a>
          <a href="/contatti" className="nav-link" style={{ fontSize:14, color:'#888880', textDecoration:'none' }}>Contattaci</a>
        </div>
        <a href={user ? '/ordini' : '/auth'} style={{ display: isMobile ? 'none' : 'block', fontSize:13, color:'#888880', textDecoration:'none', transition:'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color='#C9A84C')}
          onMouseLeave={e => (e.currentTarget.style.color='#888880')}>{user ? '👤 Account' : 'Accedi'}</a>
      </nav>

      {/* HERO */}
      <div style={{ textAlign:'center', padding: isMobile ? '5rem 1.5rem 3rem' : '8rem 2rem 5rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ fontSize:12, color:'#C9A84C', letterSpacing:'4px', textTransform:'uppercase', marginBottom:'1.5rem', fontWeight:500, animation:'fadeUp 0.6s ease' }}>Il tuo negozio premium</div>
        <h1 style={{ fontSize: isMobile ? 38 : 72, fontWeight:700, letterSpacing: isMobile ? '-1px' : '-3px', marginBottom:'1.5rem', lineHeight:1.05, fontFamily:'Playfair Display, serif', animation:'fadeUp 0.6s ease 0.1s both' }}>
          Tutto quello<br />che <span style={{ color:'#C9A84C' }}>desideri.</span>
        </h1>
        <p style={{ fontSize:18, color:'#888880', maxWidth:520, margin:'0 auto 3rem', lineHeight:1.7, animation:'fadeUp 0.6s ease 0.2s both' }}>
          Prodotti selezionati in ogni categoria. Qualità premium, prezzi onesti.
        </p>
        <button onClick={() => document.getElementById('categorie')?.scrollIntoView({behavior:'smooth'})} style={{ background:'linear-gradient(135deg, #C9A84C, #E8C97A)', color:'#000', border:'none', padding:'15px 40px', borderRadius:30, fontSize:15, cursor:'pointer', fontWeight:600, animation:'fadeUp 0.6s ease 0.3s both', transition:'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform='scale(1.03)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(201,168,76,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}>
          Esplora le categorie
        </button>
      </div>

      {/* CATEGORIE */}
      <div id="categorie" style={{ maxWidth:1200, margin:'0 auto', padding: isMobile ? '1rem 1rem 4rem' : '2rem 2rem 6rem' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <h2 style={{ fontSize:38, fontWeight:700, fontFamily:'Playfair Display, serif', marginBottom:'0.5rem' }}>Le nostre <span style={{ color:'#C9A84C' }}>categorie</span></h2>
          <p style={{ fontSize:15, color:'#888880' }}>Scegli la categoria che ti interessa</p>
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: isMobile ? '12px' : '1.5rem' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height:280, borderRadius:20, background:'linear-gradient(90deg, #141414 25%, #1C1C1C 50%, #141414 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: isMobile ? '12px' : '1.5rem' }}>
            {categorie.map((cat, idx) => (
              <a key={cat.id} href={`/categoria/${cat.slug}`} style={{ textDecoration:'none' }}>
                <div className="cat-card" style={{ background:'#141414', border:'1px solid rgba(201,168,76,0.15)', borderRadius:20, overflow:'hidden', animation:`fadeUp 0.5s ease ${idx*0.1}s both` }}>
                  {/* Cover categoria */}
                  <div style={{ height:180, background: covers[cat.slug] || covers.auto, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                    <div style={{ fontSize:72, filter:'drop-shadow(0 4px 20px rgba(0,0,0,0.5))' }}>{cat.emoji}</div>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
                  </div>
                  <div style={{ padding: isMobile ? '0.75rem' : '1.5rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                      <h3 style={{ fontSize: isMobile ? 14 : 18, fontWeight:700, color:'#F5F5F0', fontFamily:'Playfair Display, serif' }}>{cat.nome}</h3>
                      <span className="cat-arrow" style={{ color:'#C9A84C', fontSize:20 }}>→</span>
                    </div>
                    <p style={{ fontSize: isMobile ? 11 : 13, color:'#888880', lineHeight:1.6, margin:0, display: isMobile ? 'none' : 'block' }}>{cat.descrizione}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid rgba(201,168,76,0.1)', padding:'2.5rem', textAlign:'center' }}>
        <div style={{ fontSize:20, fontWeight:700, fontFamily:'Playfair Display, serif', color:'#C9A84C', marginBottom:'1rem' }}>GabryShopss</div>
        <p style={{ fontSize:13, color:'#444440', marginBottom:'1rem' }}>© 2025 GabryShopss — Tutti i diritti riservati</p>
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap' }}>
          {[['Privacy Policy','/privacy'],['Termini','/termini'],['FAQ','/faq'],['Contattaci','/contatti']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize:13, color:'#444440', textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color='#C9A84C')}
              onMouseLeave={e => (e.currentTarget.style.color='#444440')}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
