import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Instrument_Sans } from 'next/font/google'
import { AnchorScroll } from '@/components/anchor-scroll'
import { getSiteUrl, isPubliclyIndexable } from '@/lib/site-url'
import './globals.css'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  display: 'swap',
  adjustFontFallback: true,
  axes: ['wdth'],
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
  title: 'Authomotive | Dealership Authority, AI Discovery & Measurement',
  description:
    'Authomotive helps dealerships get found, guide buyers to inventory, and prove what works with Authority Experiences, measurement, and monthly intelligence.',
  alternates: {
    canonical: '/',
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    title: 'Authomotive | Dealership Authority, AI Discovery & Measurement',
    description:
      'Authomotive helps dealerships get found, guide buyers to inventory, and prove what works with Authority Experiences, measurement, and monthly intelligence.',
    type: 'website',
    siteName: 'Authomotive',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Authomotive | Dealership Authority, AI Discovery & Measurement',
    description:
      'Authomotive helps dealerships get found, guide buyers to inventory, and prove what works with Authority Experiences, measurement, and monthly intelligence.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: '#FFFCF7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${instrumentSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <AnchorScroll />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
