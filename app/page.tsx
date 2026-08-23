import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { QuestionToInventory } from '@/components/question-to-inventory'
import {
  AuthorityExperience,
  CapabilitySystem,
  FieldProof,
  FinalCta,
  IntelligencePreview,
  ManagedFramework,
  SignalArchitecture,
} from '@/components/home-sections'
import { SiteFooter } from '@/components/site-footer'
import { getSiteUrl } from '@/lib/site-url'

const siteUrl = getSiteUrl()

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Authomotive',
      url: siteUrl,
      slogan: 'Get found. Guide buyers. Prove what works.',
      founder: {
        '@type': 'Person',
        name: 'Chris Gabriel',
        jobTitle: 'Founder',
      },
      description:
        'The managed authority and measurement framework for dealership websites. Authomotive builds search- and AI-ready dealership content, unified performance reporting, managed AI Discovery pages, and custom measurement.',
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: 'Authomotive',
      url: siteUrl,
      publisher: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'Service',
      name: 'Managed dealership authority and measurement framework',
      url: siteUrl,
      provider: { '@id': `${siteUrl}/#organization` },
      serviceType: 'Dealership website authority content, performance reporting, and measurement',
      audience: {
        '@type': 'BusinessAudience',
        name: 'Automotive dealerships and dealer groups',
      },
    },
  ],
}

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-porcelain"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <QuestionToInventory />
        <CapabilitySystem />
        <AuthorityExperience />
        <IntelligencePreview />
        <FieldProof />
        <SignalArchitecture />
        <ManagedFramework />
        <FinalCta />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
