import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Instrument_Sans } from 'next/font/google'
import { AnchorScroll } from '@/components/anchor-scroll'
import { siteConfig } from '@/lib/site-data'
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
const defaultTitle = `${siteConfig.name} | ${siteConfig.tagline}`
const defaultDescription = `${siteConfig.tagline} ${siteConfig.category}.`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteConfig.name,
  title: defaultTitle,
  description: defaultDescription,
  alternates: {
    canonical: '/',
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    type: 'website',
    siteName: siteConfig.name,
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
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
