import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend('re_GciUTmUa_LgDG6ofVfzc8b9JDgGjKgeHC')

export async function POST(req: NextRequest) {
  const { cart, shipping, total, customerEmail } = await req.json()

  const prodotti = cart.map((c: any) =>
    `• ${c.name} x${c.qty} — €${(c.price * c.qty).toFixed(2)}`
  ).join('\n')

  // Email a te (admin)
  await resend.emails.send({
    from: 'GabryShopss <onboarding@resend.dev>',
    to: 'terryliano20011@gmail.com',
    subject: `🛒 Nuovo ordine — €${total}`,
    text: `
NUOVO ORDINE RICEVUTO!

📦 PRODOTTI:
${prodotti}

💰 TOTALE: €${total}

🚚 SPEDIRE A:
Nome: ${shipping.name}
Indirizzo: ${shipping.address}
Città: ${shipping.city}
CAP: ${shipping.cap}
Email cliente: ${customerEmail || 'non fornita'}

Accedi a PayPal per vedere il pagamento.
    `
  })

  // Email al cliente
  if (customerEmail) {
    await resend.emails.send({
      from: 'GabryShopss <onboarding@resend.dev>',
      to: customerEmail,
      subject: `✅ Ordine confermato — GabryShopss`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; color: #1a1a1a;">
  <div style="text-align: center; margin-bottom: 2rem;">
    <h1 style="font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">GabryShopss</h1>
  </div>

  <div style="background: #f8f8f8; border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 1rem;">✅</div>
    <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 0.5rem;">Ordine confermato!</h2>
    <p style="color: #666; font-size: 15px;">Grazie ${shipping.name}, abbiamo ricevuto il tuo ordine.</p>
  </div>

  <div style="border: 1px solid #eee; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem;">
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 1rem;">📦 Riepilogo ordine</h3>
    ${cart.map((c: any) => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px;">
      <span>${c.name} x${c.qty}</span>
      <span style="font-weight: 500;">€${(c.price * c.qty).toFixed(2)}</span>
    </div>`).join('')}
    <div style="display: flex; justify-content: space-between; padding: 12px 0 0; font-size: 16px; font-weight: 700;">
      <span>Totale pagato</span>
      <span>€${total}</span>
    </div>
  </div>

  <div style="border: 1px solid #eee; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem;">
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 1rem;">🚚 Indirizzo di spedizione</h3>
    <p style="font-size: 14px; color: #444; line-height: 1.8; margin: 0;">
      ${shipping.name}<br/>
      ${shipping.address}<br/>
      ${shipping.cap} ${shipping.city}
    </p>
  </div>

  <div style="background: #f8f8f8; border-radius: 12px; padding: 1rem; text-align: center; font-size: 13px; color: #888;">
    <p style="margin: 0 0 4px;">Consegna stimata: <strong>3-7 giorni lavorativi</strong></p>
    <p style="margin: 0;">Per assistenza: <a href="mailto:terryliano20011@gmail.com" style="color: #1a1a1a;">terryliano20011@gmail.com</a></p>
  </div>

  <div style="text-align: center; margin-top: 2rem; font-size: 12px; color: #aaa;">
    <p>© 2025 GabryShopss — <a href="https://gabryshopss.vercel.app" style="color: #aaa;">gabryshopss.vercel.app</a></p>
  </div>
</body>
</html>
      `
    })
  }

  return NextResponse.json({ ok: true })
}
