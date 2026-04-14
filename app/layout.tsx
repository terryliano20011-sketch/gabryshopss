import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GabryShopss',
  description: 'Prodotti fisici e digitali di qualità',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}
