import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend('re_GciUTmUa_LgDG6ofVfzc8b9JDgGjKgeHC')

export async function POST(req: NextRequest) {
  const { cart, shipping, total } = await req.json()

  const prodotti = cart.map((c: any) =>
    `• ${c.name} x${c.qty} — €${(c.price * c.qty).toFixed(2)}`
  ).join('\n')

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

Accedi a PayPal per vedere il pagamento.
    `
  })

  return NextResponse.json({ ok: true })
}
