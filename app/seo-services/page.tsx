import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'SEO Services',
  description:
    'Authomotive SEO services for dealership websites: search-ready authority content, measurement, and conversion.',
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
    </>
  )
}
