import { managedFramework, idealFit, capabilitySystem } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'

/** Editorial scope map: inclusions grouped under the three primary capabilities. */
const scopeGroups = [
  {
    capability: capabilitySystem.capabilities[0], // Get Found and Chosen
    items: [
      'Dealership visibility and opportunity review',
      'Prioritized authority-content roadmap',
      'Search- and AI-ready Authority Experiences',
      'Managed AI Discovery page',
      'Interactive research elements where valuable',
      'Inventory and conversion pathways',
    ],
  },
  {
    capability: capabilitySystem.capabilities[1], // Know What Is Working
    items: [
      'Unified monthly intelligence',
      'MoM, YoY, locality, engagement, and content analysis',
      'Identifiable AI referral and visibility observations',
      'Evidence-backed next-step recommendations',
    ],
  },
  {
    capability: capabilitySystem.capabilities[2], // Track What Matters
    items: [
      'GTM, GA4, and custom-event improvements',
      'ASC-aligned event planning',
      'Advertising and campaign measurement support',
      'Ongoing optimization and governance',
    ],
  },
]

export function ManagedFramework() {
  return (
    <section aria-labelledby="framework-heading" className="border-b border-border bg-alloy">
      <div className="mx-auto max-w-[1320px] px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
              {managedFramework.eyebrow}
            </p>
            <h2
              id="framework-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
            >
              {managedFramework.headline}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg text-pretty lg:pb-1">
            {managedFramework.callout}
          </p>
        </div>

        {/* Scope map — a structured three-column ledger with vertical separators on desktop */}
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-3 md:gap-8 md:[&>div:not(:first-child)]:border-l md:[&>div:not(:first-child)]:border-border md:[&>div:not(:first-child)]:pl-8">
          {scopeGroups.map((group, gi) => (
            <Reveal key={group.capability.id} delay={gi * 90} className="border-t-2 border-ink pt-5">
              <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
                {group.capability.brandedName}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                {group.capability.plainName}
              </h3>
              <ul className="mt-4 flex flex-col">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-border py-3 text-base leading-relaxed text-ink first:border-t-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* Ideal fit — a wide Warm Alloy inset field presenting bold qualification rows */}
        <div className="-mx-5 mt-10 border-t-2 border-ink bg-porcelain px-5 py-8 md:-mx-8 md:mt-12 md:px-8 md:py-10">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-ink md:text-4xl text-balance">
            {idealFit.headline}
          </h2>
          <div className="mt-6 flex flex-col">
            {idealFit.signals.map((signal, i) => (
              <Reveal key={signal}>
                <a
                  href="#opportunity-review"
                  className="lift group flex items-center justify-between gap-6 border-t border-ink/15 py-3.5 last:border-b md:py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal-deep"
                >
                  <div className="flex items-start gap-5 md:items-center md:gap-8">
                    <span
                      className="font-mono text-lg font-bold text-fog transition-colors group-hover:text-action-deep md:text-xl"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-xl font-semibold leading-snug tracking-tight text-ink md:text-2xl lg:text-3xl text-pretty">
                      {signal}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-action transition-transform duration-200 motion-safe:group-hover:translate-x-1.5"
                    aria-hidden="true"
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path
                        d="M5 14h17m0 0l-6.5-6.5M22 14l-6.5 6.5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
          {/* A structural rule separates the closing qualification, not a new panel */}
          <p className="mt-8 max-w-3xl border-t border-ink/15 pt-6 text-base leading-relaxed text-muted-foreground md:text-lg text-pretty">
            {idealFit.contrast}
          </p>
        </div>
      </div>
    </section>
  )
}
