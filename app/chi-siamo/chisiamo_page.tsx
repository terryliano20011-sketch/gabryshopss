export default function ChiSiamo() {
  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 2rem', borderBottom:'1px solid #eee', position:'sticky', top:0, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)', zIndex:50 }}>
        <a href="/" style={{ fontSize:20, fontWeight:600, letterSpacing:'-0.5px', textDecoration:'none', color:'#1a1a1a' }}>GabryShopss</a>
        <div style={{ display:'flex', gap:'2rem' }}>
          <a href="/" style={{ fontSize:14, color:'#666', textDecoration:'none' }}>Prodotti</a>
          <a href="/chi-siamo" style={{ fontSize:14, color:'#1a1a1a', fontWeight:500, textDecoration:'none' }}>Chi siamo</a>
          <a href="/contatti" style={{ fontSize:14, color:'#666', textDecoration:'none' }}>Contatti</a>
        </div>
      </nav>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'5rem 2rem' }}>
        <h1 style={{ fontSize:42, fontWeight:700, letterSpacing:'-1.5px', marginBottom:'1.5rem', color:'#000' }}>Chi siamo</h1>
        <p style={{ fontSize:17, color:'#444', lineHeight:1.8, marginBottom:'1.5rem' }}>
          GabryShopss nasce dalla passione per le auto e dalla voglia di offrire prodotti di qualità professionale a prezzi accessibili.
        </p>
        <p style={{ fontSize:17, color:'#444', lineHeight:1.8, marginBottom:'1.5rem' }}>
          Ogni prodotto che vendiamo è selezionato personalmente — lo testiamo, lo usiamo e solo se ci soddisfa lo mettiamo in vendita. Niente compromessi sulla qualità.
        </p>
        <p style={{ fontSize:17, color:'#444', lineHeight:1.8, marginBottom:'3rem' }}>
          Siamo un piccolo negozio italiano con grandi ambizioni. Il nostro obiettivo è diventare il punto di riferimento per chi vuole prendersi cura della propria auto senza spendere una fortuna.
        </p>
        <div style={{ display:'flex', gap:12 }}>
          <a href="/" style={{ background:'#1a1a1a', color:'#fff', padding:'12px 28px', borderRadius:24, fontSize:15, fontWeight:500, textDecoration:'none' }}>Vedi i prodotti</a>
          <a href="/contatti" style={{ background:'none', color:'#1a1a1a', border:'1px solid #ddd', padding:'12px 28px', borderRadius:24, fontSize:15, textDecoration:'none' }}>Contattaci</a>
        </div>
      </div>

      <footer style={{ borderTop:'1px solid #eee', padding:'2rem', textAlign:'center' }}>
        <p style={{ fontSize:13, color:'#aaa', marginBottom:8 }}>© 2025 GabryShopss — Tutti i diritti riservati</p>
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center' }}>
          <a href="/privacy" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Privacy Policy</a>
          <a href="/termini" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Termini e Condizioni</a>
          <a href="/contatti" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Contatti</a>
        </div>
      </footer>
    </div>
  )
}
