import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AnchorScroll } from '@/components/anchor-scroll'
import { getSiteUrl, isPubliclyIndexable } from '@/lib/site-url'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
  adjustFontFallback: true,
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  adjustFontFallback: true,
})

const siteUrl = getSiteUrl()
const allowIndexing = isPubliclyIndexable()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Authomotive | Dealer Search, AI Visibility, Reporting & Measurement',
  description:
    'Authomotive helps dealerships get found, guide buyers, and prove what works. Authority Experiences, connected measurement, and a monthly read in plain English sit on the website they already have.',
  alternates: {
    canonical: '/',
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    title: 'Authomotive | Dealer Search, AI Visibility, Reporting & Measurement',
    description:
      'The managed authority and measurement framework for dealership websites. Get found. Guide buyers. Prove what works.',
    type: 'website',
    siteName: 'Authomotive',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Authomotive | Dealer Search, AI Visibility, Reporting & Measurement',
    description:
      'The managed authority and measurement framework for dealership websites. Get found. Guide buyers. Prove what works.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFFCF7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <AnchorScroll />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
