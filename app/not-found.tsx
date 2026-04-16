export default function NotFound() {
  return (
    <div style={{minHeight:'100vh',background:'#111',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif',textAlign:'center',padding:'2rem'}}>
      <div style={{fontSize:80,marginBottom:24}}>🔍</div>
      <h1 style={{fontSize:32,fontWeight:700,color:'#fff',marginBottom:8}}>Pagina non trovata</h1>
      <p style={{color:'#888',fontSize:16,marginBottom:32}}>La pagina che cerchi non esiste o è stata spostata.</p>
      <a href="/" style={{background:'linear-gradient(135deg,#C9A84C,#E8C97A)',color:'#000',padding:'14px 32px',borderRadius:28,textDecoration:'none',fontWeight:700,fontSize:15}}>← Torna allo shop</a>
    </div>
  )
}
