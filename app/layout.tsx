import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WAXE Dealer Portal | Power Your Record Store',
  description: 'The professional dashboard for vinyl dealers. Manage inventory, track sales, and grow your business on the WAXE marketplace.',
  keywords: ['vinyl', 'record store', 'inventory management', 'discogs', 'marketplace', 'pos', 'record shop', 'dealer portal'],
  authors: [{ name: 'WAXE' }],
  openGraph: {
    title: 'WAXE Dealer Portal | Power Your Record Store',
    description: 'The professional dashboard for vinyl dealers. Manage inventory, track sales, and grow your business on the WAXE marketplace.',
    type: 'website',
    locale: 'en_US',
    siteName: 'WAXE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WAXE Dealer Portal | Power Your Record Store',
    description: 'The professional dashboard for vinyl dealers. Manage inventory, track sales, and grow your business.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){var t=localStorage.getItem('waxe-theme');
          if(t==='light'||t==='retro'){document.documentElement.classList.remove('dark');document.documentElement.classList.add(t)}})()
        `}} />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
