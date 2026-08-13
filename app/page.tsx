import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { PlatformCredibility } from '@/components/platform-credibility'
import { IndustryGap } from '@/components/industry-gap'
import { CapabilitySystem } from '@/components/capability-system'
import { AuthorityExperience } from '@/components/authority-experience'
import { AiDiscoveryFoundation } from '@/components/ai-discovery-foundation'
import { IntelligencePreview } from '@/components/intelligence-preview'
import { SignalArchitecture } from '@/components/signal-architecture'
import { HowItWorks } from '@/components/how-it-works'
import { FounderCredibility } from '@/components/founder-credibility'
import { ManagedFramework } from '@/components/managed-framework'
import { FinalCta } from '@/components/final-cta'
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
        <PlatformCredibility />
        <IndustryGap />
        <CapabilitySystem />
        <AuthorityExperience />
        <AiDiscoveryFoundation />
        <IntelligencePreview />
        <SignalArchitecture />
        <HowItWorks />
        <FounderCredibility />
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
