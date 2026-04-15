'use client'
import { useState } from 'react'

const faqs = [
  {
    q: 'Quanto tempo ci vuole per la consegna?',
    a: 'La consegna avviene in 3-7 giorni lavorativi dalla conferma del pagamento. Riceverai una email di conferma ordine con tutti i dettagli.'
  },
  {
    q: 'Come funziona la spedizione gratuita?',
    a: 'La spedizione è gratuita per ordini superiori a €50. Per ordini inferiori il costo di spedizione è di €4.99. I prodotti digitali hanno sempre spedizione gratuita.'
  },
  {
    q: 'Posso restituire un prodotto?',
    a: 'Sì! Hai 14 giorni dalla ricezione del prodotto per esercitare il diritto di recesso. Contattaci a terryliano20011@gmail.com e ti guideremo nel processo di reso. Le spese di restituzione sono a carico del cliente.'
  },
  {
    q: 'Come posso pagare?',
    a: 'Accettiamo pagamenti tramite PayPal e carte di credito/debito (Visa, Mastercard, American Express) tramite il sistema sicuro PayPal. I tuoi dati di pagamento non vengono mai conservati sul nostro sito.'
  },
  {
    q: 'I prodotti sono originali?',
    a: 'Sì, tutti i prodotti che vendiamo sono selezionati personalmente e testati prima di essere messi in vendita. Garantiamo la qualità di ogni articolo.'
  },
  {
    q: 'Come funzionano i coupon sconto?',
    a: 'Puoi inserire il codice sconto direttamente nel carrello prima di procedere al pagamento. Il codice GABRY10 ti dà il 10% di sconto, mentre WELCOME ti dà il 15% di sconto sul tuo primo ordine.'
  },
  {
    q: 'Posso tracciare il mio ordine?',
    a: 'Dopo la spedizione riceverai una email con il numero di tracking per seguire il tuo pacco in tempo reale.'
  },
  {
    q: 'Avete un numero di telefono o WhatsApp?',
    a: 'Sì! Puoi contattarci direttamente su WhatsApp al numero +39 351 843 5322 oppure via email a terryliano20011@gmail.com. Rispondiamo entro 24 ore.'
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number|null>(null)

  return (
    <div style={{ minHeight:'100vh', background:'#fff', fontFamily:'-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .faq-item { transition: border-color 0.2s; }
        .faq-item:hover { border-color: #ccc !important; }
      `}</style>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 2rem', borderBottom:'1px solid #eee', position:'sticky', top:0, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)', zIndex:50 }}>
        <a href="/" style={{ fontSize:20, fontWeight:600, letterSpacing:'-0.5px', textDecoration:'none', color:'#1a1a1a' }}>GabryShopss</a>
        <div style={{ display:'flex', gap:'2rem' }}>
          <a href="/" style={{ fontSize:14, color:'#666', textDecoration:'none' }}>Prodotti</a>
          <a href="/chi-siamo" style={{ fontSize:14, color:'#666', textDecoration:'none' }}>Chi siamo</a>
          <a href="/contatti" style={{ fontSize:14, color:'#666', textDecoration:'none' }}>Contattaci</a>
        </div>
      </nav>

      <div style={{ maxWidth:700, margin:'0 auto', padding:'5rem 2rem' }}>
        <h1 style={{ fontSize:42, fontWeight:700, letterSpacing:'-1.5px', marginBottom:'0.5rem', color:'#000' }}>FAQ</h1>
        <p style={{ fontSize:16, color:'#888', marginBottom:'3rem' }}>Domande frequenti — trova subito la risposta che cerchi.</p>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item" style={{ border:'1px solid #eee', borderRadius:16, overflow:'hidden', cursor:'pointer' }} onClick={() => setOpen(open === i ? null : i)}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1.25rem 1.5rem' }}>
                <span style={{ fontSize:15, fontWeight:500, color:'#1a1a1a', flex:1, paddingRight:'1rem' }}>{faq.q}</span>
                <span style={{ fontSize:20, color:'#888', transition:'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
              </div>
              {open === i && (
                <div style={{ padding:'0 1.5rem 1.25rem', fontSize:15, color:'#555', lineHeight:1.7, animation:'fadeIn 0.2s ease', borderTop:'1px solid #f0f0f0' }}>
                  <div style={{ paddingTop:'1rem' }}>{faq.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop:'3rem', padding:'1.5rem 2rem', background:'#f8f8f8', borderRadius:16, textAlign:'center' }}>
          <p style={{ fontSize:15, color:'#444', marginBottom:'1rem' }}>Non hai trovato la risposta che cercavi?</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
            <a href="/contatti" style={{ background:'#1a1a1a', color:'#fff', padding:'10px 24px', borderRadius:24, fontSize:14, fontWeight:500, textDecoration:'none' }}>Contattaci</a>
            <a href="https://wa.me/393518435322" style={{ background:'#25D366', color:'#fff', padding:'10px 24px', borderRadius:24, fontSize:14, fontWeight:500, textDecoration:'none' }}>WhatsApp</a>
          </div>
        </div>
      </div>

      <footer style={{ borderTop:'1px solid #eee', padding:'2rem', textAlign:'center' }}>
        <p style={{ fontSize:13, color:'#aaa', marginBottom:8 }}>© 2025 GabryShopss — Tutti i diritti riservati</p>
        <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center' }}>
          <a href="/privacy" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Privacy Policy</a>
          <a href="/termini" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Termini e Condizioni</a>
          <a href="/contatti" style={{ fontSize:13, color:'#888', textDecoration:'none' }}>Contattaci</a>
        </div>
      </footer>
    </div>
  )
}
