import { managedFramework, idealFit, capabilitySystem } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'
import { SignalRail } from '@/components/signal-rail'

/** Editorial scope map: inclusions grouped under the three primary capabilities. */
const scopeGroups = [
  {
    capability: capabilitySystem.capabilities[0], // Get Found. Guide Buyers.
    items: [
      'Opportunity and visibility review',
      'Prioritized Authority Experience roadmap',
      'Authority Experiences and managed AI Discovery',
      'Inventory and conversion pathways',
    ],
  },
  {
    capability: capabilitySystem.capabilities[1], // Prove What Works.
    items: [
      'Unified monthly intelligence',
      'MoM, YoY, locality, and content analysis',
      'Search and AI visibility observations',
      'Evidence-backed next actions',
    ],
  },
  {
    capability: capabilitySystem.capabilities[2], // Track What Matters
    items: [
      'GA4, GTM, and custom-event definitions',
      'ASC-aligned measurement planning',
      'Vendor and advertising measurement support',
      'Validation, optimization, and governance',
    ],
  },
]

const cardLooks = [
  {
    surface: 'border-2 border-ink bg-accent-soft',
    swatch: 'bg-accent-deep',
    rule: 'border-accent',
  },
  {
    surface: 'border-2 border-ink bg-proof-soft',
    swatch: 'bg-proof-deep',
    rule: 'border-proof',
  },
  {
    surface: 'border-2 border-ink bg-porcelain',
    swatch: 'bg-ink',
    rule: 'border-ink',
  },
] as const

export function ManagedFramework() {
  return (
    <section data-spy="clear" aria-labelledby="framework-heading" className="border-b border-border bg-alloy">
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-20">
        <SignalRail tone="ink" />
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
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
          <p className="lede text-base leading-relaxed text-muted-foreground md:text-lg text-pretty lg:col-span-5 lg:pb-1">
            {managedFramework.callout}
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-5 md:mt-12 md:grid-cols-3">
          {scopeGroups.map((group, gi) => {
            const look = cardLooks[gi]
            return (
              <Reveal
                key={group.capability.id}
                delay={gi * 60}
                className={`flex h-full flex-col rounded-[8px] p-6 ${look.surface}`}
              >
                <span className={`h-3 w-3 ${look.swatch}`} aria-hidden="true" />
                <p className="mt-4 font-mono text-xs uppercase tracking-wider text-signal-deep">
                  Job {gi + 1} · {group.capability.brandedName}
                </p>
                <h3 className={`mt-2 border-t ${look.rule} pt-3 text-xl font-semibold tracking-tight text-ink md:text-2xl`}>
                  {group.capability.plainName}
                </h3>
                <ul className="mt-4 flex flex-1 flex-col">
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
            )
          })}
        </div>

        <div className="mt-8 border-t-2 border-ink bg-porcelain px-5 py-6 md:mt-10 md:px-8 md:py-8">
          <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
            {idealFit.headline}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {idealFit.signals.map((signal, i) => (
              <Reveal key={signal}>
                <a
                  href="#opportunity-review"
                  className="lift group flex min-h-[44px] items-start gap-3 border border-ink/15 bg-paper px-4 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal-deep"
                >
                  <span
                    className="font-mono text-sm font-bold text-fog transition-colors group-hover:text-accent-deep"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-base font-semibold leading-snug tracking-tight text-ink md:text-lg text-pretty">
                    {signal}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
          <p className="mt-5 max-w-3xl border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground md:text-base text-pretty">
            {idealFit.contrast}
          </p>
        </div>
      </div>
    </section>
  )
}
