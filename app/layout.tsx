import type { Metadata, Viewport } from 'next'
import './globals.css'
import Script from 'next/script'

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'GabryShopss — Prodotti Auto di Qualità',
  description: 'Acquista online prodotti per auto di qualità: panni microfibra, pellicole oscuranti, kit wrapping professionale. Spedizione rapida in tutta Italia.',
  keywords: 'prodotti auto, panno microfibra, pellicola oscurante, kit wrapping, accessori auto italia',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GabryShopss',
  },
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
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" href="/icons/icon-192.png" />
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
