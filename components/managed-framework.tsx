import { managedFramework, idealFit, founder, capabilitySystem, cta } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

const scopeGroups = [
  {
    capability: capabilitySystem.capabilities[0],
    items: [
      'Authority Experiences and managed AI Discovery',
      'Inventory and conversion pathways',
      'Prioritized opportunity roadmap',
    ],
  },
  {
    capability: capabilitySystem.capabilities[1],
    items: [
      'Unified monthly intelligence',
      'What changed, why it changed, what next',
      'Evidence-backed next actions',
    ],
  },
  {
    capability: capabilitySystem.capabilities[2],
    items: [
      'Named events across shopper actions',
      'Vendor and advertising measurement support',
      'Validation and governance',
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
    surface: 'border-2 border-ink bg-paper',
    swatch: 'bg-ink',
    rule: 'border-ink',
  },
] as const

export function ManagedFramework() {
  return (
    <section
      id="engagement"
      data-spy="clear"
      aria-labelledby="framework-heading"
      className="scroll-mt-24 border-b border-border bg-alloy"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <SignalRail tone="ink" />
        <div className="max-w-[42rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {managedFramework.eyebrow}
          </p>
          <h2
            id="framework-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {managedFramework.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {managedFramework.callout}
          </p>
        </div>

        <div className="mt-9 grid items-stretch gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
          {scopeGroups.map((group, gi) => {
            const look = cardLooks[gi]
            return (
              <article
                key={group.capability.id}
                className={`flex h-full flex-col rounded-[8px] p-5 md:p-6 ${look.surface}`}
              >
                <span className={`h-3 w-3 ${look.swatch}`} aria-hidden="true" />
                <p className="mt-4 font-mono text-xs uppercase tracking-wider text-signal-deep">
                  Job {gi + 1}
                </p>
                <h3 className={`mt-2 border-t ${look.rule} pt-3 text-xl font-semibold tracking-tight text-ink md:text-2xl`}>
                  {group.capability.plainName}
                </h3>
                <ul className="mt-3 flex flex-1 flex-col">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-t border-ink/10 py-2.5 text-base leading-relaxed text-ink first:border-t-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>

        <div className="relative mt-8 overflow-hidden border-2 border-ink bg-paper">
          <span className="absolute inset-y-0 left-0 w-1.5 bg-ink md:w-2" aria-hidden="true" />
          <div className="px-5 py-6 pl-7 md:px-8 md:py-7 md:pl-10">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
              {founder.eyebrow}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
              {founder.headline}
            </p>
            <p className="mt-3 max-w-[42rem] text-base leading-relaxed text-ink text-pretty md:text-lg">
              {founder.copy}
            </p>
            <p className="mt-3 max-w-[42rem] text-base font-semibold leading-relaxed text-muted-foreground">
              {founder.supporting}
            </p>
          </div>
        </div>

        <div className="mt-6 bg-paper px-5 py-6 md:px-8 md:py-7">
          <p className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
            {idealFit.headline}
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {idealFit.signals.map((signal, i) => (
              <li
                key={signal}
                className="flex min-h-[72px] items-start gap-3 border border-ink/15 bg-porcelain px-4 py-3.5"
              >
                <span className="font-mono text-sm font-bold text-ink" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-base font-semibold leading-snug tracking-tight text-ink md:text-lg text-pretty">
                  {signal}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base text-pretty">
            {idealFit.contrast}
          </p>
        </div>

        <div className="mt-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
          <p className="max-w-xl text-lg font-semibold leading-snug text-ink text-pretty">
            Start with one focused review of the dealership website, its discovery pathways and its
            measurement gaps.
          </p>
          <a href="#opportunity-review" className="btn btn-action shrink-0">
            {cta.primary}
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
