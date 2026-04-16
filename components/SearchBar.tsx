'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)
  const router = useRouter()
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setOpen(false); return }
    const t = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase.from('products').select('id,name,short_desc,price,image,categoria').eq('active',true).or('name.ilike.%'+query+'%,short_desc.ilike.%'+query+'%').limit(6)
      setResults(data||[]); setOpen(true); setLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [query])
  const go = (cat) => { setOpen(false); setQuery(''); router.push('/categoria/'+cat) }
  return (
    <div ref={ref} style={{position:'relative',width:'100%',maxWidth:400}}>
      <div style={{display:'flex',alignItems:'center',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(201,168,76,0.25)',borderRadius:24,padding:'8px 16px',gap:8}}>
        <span style={{fontSize:14,opacity:0.5}}>🔍</span>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cerca prodotti..." style={{background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:14,width:'100%'}} />
        {loading && <span style={{fontSize:11,opacity:0.4}}>...</span>}
      </div>
      {open && results.length > 0 && (
        <div style={{position:'absolute',top:'calc(100% + 8px)',left:0,right:0,background:'#1a1a1a',border:'1px solid rgba(201,168,76,0.2)',borderRadius:16,overflow:'hidden',zIndex:999,boxShadow:'0 8px 32px rgba(0,0,0,0.5)'}}>
          {results.map(p => (
            <div key={p.id} onClick={()=>go(p.categoria)} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.05)'}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(201,168,76,0.1)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              {p.image && <img src={p.image} style={{width:40,height:40,objectFit:'cover',borderRadius:8}} alt={p.name}/>}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div>
                <div style={{fontSize:11,color:'#888'}}>{p.short_desc}</div>
              </div>
              <div style={{fontSize:13,color:'#C9A84C',fontWeight:700}}>€{p.price}</div>
            </div>
          ))}
        </div>
      )}
      {open && results.length===0 && !loading && query.length>=2 && (
        <div style={{position:'absolute',top:'calc(100% + 8px)',left:0,right:0,background:'#1a1a1a',border:'1px solid rgba(201,168,76,0.2)',borderRadius:16,padding:'14px',textAlign:'center',fontSize:13,color:'#888',zIndex:999}}>
          Nessun prodotto trovato
        </div>
      )}
    </div>
  )
}
