import { Disclosure } from '@/components/disclosure'
import { SignalRail } from '@/components/signal-rail'
import { reporting } from '@/lib/site-data'
import { CapabilityView } from '@/components/capability-view'
import { CapabilityNear } from '@/components/capability-near'
import { AuthorityNear } from '@/components/authority-near'
import { IntelligenceCopy, IntelligenceQuote } from '@/components/intelligence-view'
import { IntelligenceNear } from '@/components/intelligence-near'
import { SignalArchitectureCopy, SignalArchitectureCycle } from '@/components/signal-architecture-view'
import { SignalArchitectureNear } from '@/components/signal-architecture-near'
import { ManagedFrameworkCopy } from '@/components/managed-framework-view'
import { ManagedNear } from '@/components/managed-near'
import { FinalCtaNear } from '@/components/final-cta-near'
import { FieldProof } from '@/components/field-proof'

export { FieldProof }

export function CapabilitySystem() {
  return (
    <>
      <CapabilityView />
      <CapabilityNear />
    </>
  )
}

export function AuthorityExperience() {
  return <AuthorityNear />
}

export function IntelligencePreview() {
  return (
    <section
      id="reporting"
      aria-labelledby="reporting-heading"
      className="ri-band scroll-mt-24 overflow-x-clip border-b border-border"
    >
      <SignalRail step={4} />
      <div className="relative mx-auto max-w-[1280px] px-5 pb-8 pt-14 md:px-8 md:pb-9 md:pt-16 lg:pb-10 lg:pt-[4.5rem]">
        <IntelligenceCopy />
        <IntelligenceNear />
        <IntelligenceQuote />
        <div className="ri-sources mt-4">
          <Disclosure title="Where the underlying data comes from">
            <p className="text-base leading-relaxed text-muted-foreground">
              {reporting.sourcesLine} The monthly report can draw from Google Search Console,
              GA4, Semrush or DataForSEO, identifiable AI referral traffic, observed AI and AI
              Overview visibility, geographic and locality performance, page and query movement,
              engagement behavior, GTM and custom-event data, inventory actions, and
              advertising measurement events. Not every AI answer or anonymous AI-assisted journey
              can be observed. We report the identifiable referrals and observed visibility
              footprint, not complete AI attribution.
            </p>
          </Disclosure>
        </div>
      </div>
    </section>
  )
}

export function SignalArchitecture() {
  return (
    <section
      id="measurement"
      aria-labelledby="measurement-heading"
      className="ma-band scroll-mt-24 overflow-x-clip border-b border-stage-line"
    >
      <SignalRail step={5} />
      <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <SignalArchitectureCopy />
        <SignalArchitectureNear />
        <SignalArchitectureCycle />
      </div>
    </section>
  )
}

export function ManagedFramework() {
  return (
    <section
      id="engagement"
      data-spy="clear"
      aria-labelledby="framework-heading"
      className="scroll-mt-24 border-b border-border bg-alloy"
    >
      <SignalRail step={6} />
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <ManagedFrameworkCopy />
        <ManagedNear />
      </div>
    </section>
  )
}

export function FinalCta() {
  return <FinalCtaNear />
}
