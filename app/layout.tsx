import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AnchorScroll } from '@/components/anchor-scroll'
import { getSiteUrl, isProductionDeployment } from '@/lib/site-url'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Authomotive | Dealer Search, AI Visibility, Reporting & Measurement',
  description:
    'Authomotive builds search- and AI-ready dealership content, unified performance reporting, managed AI Discovery pages, and custom measurement that shows what buyers found, what they did, and what to improve next.',
  alternates: {
    canonical: '/',
  },
  robots: isProductionDeployment()
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    title: 'Authomotive | Dealer Search, AI Visibility, Reporting & Measurement',
    description:
      'The managed authority and measurement framework for dealership websites. Build authority. Move buyers.',
    type: 'website',
    siteName: 'Authomotive',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Authomotive | Dealer Search, AI Visibility, Reporting & Measurement',
    description:
      'The managed authority and measurement framework for dealership websites. Build authority. Move buyers.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
