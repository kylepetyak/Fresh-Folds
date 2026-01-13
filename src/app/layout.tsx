import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fresh Folds - Laundry Day, Handled',
  description: 'Subscription-based laundry service for busy households in Phoenix metro. We pick up, wash, fold, and deliver your laundry on a recurring schedule.',
  keywords: ['laundry service', 'wash and fold', 'Phoenix', 'Tempe', 'Scottsdale', 'Gilbert', 'subscription'],
  authors: [{ name: 'Fresh Folds' }],
  openGraph: {
    title: 'Fresh Folds - Laundry Day, Handled',
    description: 'Subscription-based laundry service for busy households in Phoenix metro.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d9488',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        {children}
      </body>
    </html>
  )
}
