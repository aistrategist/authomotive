import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { DiscoveryToInventory } from '@/components/discovery-to-inventory'
import { PlatformCredibility } from '@/components/platform-credibility'
import { IndustryGap } from '@/components/industry-gap'
import { CapabilitySystem } from '@/components/capability-system'
import { AuthorityExperience } from '@/components/authority-experience'
import { IntelligencePreview } from '@/components/intelligence-preview'
import { SignalArchitecture } from '@/components/signal-architecture'
import { HowItWorks } from '@/components/how-it-works'
import { FounderCredibility } from '@/components/founder-credibility'
import { ManagedFramework } from '@/components/managed-framework'
import { FinalCta } from '@/components/final-cta'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'SEO Services',
  description:
    'Authomotive SEO services for dealership websites — search-ready authority content, measurement, and conversion.',
  alternates: {
    canonical: '/seo-services',
  },
  robots: { index: false, follow: false },
}

export default function SeoServicesPage() {
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
        <DiscoveryToInventory />
        <PlatformCredibility />
        <IndustryGap />
        <CapabilitySystem />
        <AuthorityExperience />
        <IntelligencePreview />
        <SignalArchitecture />
        <HowItWorks />
        <FounderCredibility />
        <ManagedFramework />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  )
}
