import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'GabryShopss — Prodotti Auto di Qualità',
  description: 'Acquista online prodotti per auto di qualità: panni microfibra, pellicole oscuranti, kit wrapping professionale. Spedizione rapida in tutta Italia.',
  keywords: 'prodotti auto, panno microfibra, pellicola oscurante, kit wrapping, accessori auto italia',
  openGraph: {
    title: 'GabryShopss — Prodotti Auto di Qualità',
    description: 'Acquista online prodotti per auto di qualità. Spedizione rapida in tutta Italia.',
    url: 'https://gabryshopss.vercel.app',
    siteName: 'GabryShopss',
    locale: 'it_IT',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-KE97EKDGK3" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KE97EKDGK3');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
