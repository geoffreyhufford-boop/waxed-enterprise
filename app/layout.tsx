import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Waxed Enterprise | Vinyl Record Store Operating System',
  description: 'Turn your inventory into a storefront. Import Discogs, scan new arrivals, sell online, and run ops in one place. The operating system for independent record stores.',
  keywords: ['vinyl', 'record store', 'inventory management', 'discogs', 'marketplace', 'pos', 'record shop'],
  authors: [{ name: 'Waxed Enterprise' }],
  openGraph: {
    title: 'Waxed Enterprise | Vinyl Record Store Operating System',
    description: 'Turn your inventory into a storefront. Import Discogs, scan new arrivals, sell online, and run ops in one place.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Waxed Enterprise',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Waxed Enterprise | Vinyl Record Store Operating System',
    description: 'Turn your inventory into a storefront. The operating system for independent record stores.',
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
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
