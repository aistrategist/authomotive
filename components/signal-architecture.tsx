import { measurement } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

const stages = [
  {
    id: 'observe',
    label: 'OBSERVE',
    lead: 'See what shoppers actually do.',
    support: 'Research, inventory handoffs, calls, forms, and supported vendor experiences.',
    tile: 'bg-ink text-paper',
  },
  {
    id: 'connect',
    label: 'CONNECT',
    lead: 'Capture the actions that matter.',
    support: 'Those actions become one measurement plan instead of disappearing between platforms.',
    tile: 'bg-accent text-ink',
  },
  {
    id: 'improve',
    label: 'IMPROVE',
    lead: 'Use the evidence to guide the work.',
    support: 'Expand what works, correct what does not, and attach measurement before the next page launches.',
    tile: 'bg-ink text-paper',
  },
  {
    id: 'report',
    label: 'REPORT',
    lead: 'Explain what changed, and decide next.',
    support: 'Monthly intelligence turns named actions into a clearer dealership decision.',
    tile: 'bg-proof-soft text-ink',
  },
] as const

/**
 * One operational chapter: shopper behavior, inventory activity, and monthly
 * decisions share a single Observe → Connect → Improve → Report loop.
 */
export function SignalArchitecture() {
  return (
    <section
      id="measurement"
      aria-labelledby="measurement-heading"
      className="scroll-mt-24 border-b border-border bg-paper"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <SignalRail tone="ink" />
        <div className="max-w-[42rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            THE MANAGED MEASUREMENT LOOP
          </p>
          <h2
            id="measurement-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            Observe. Connect. Improve. Report.
          </h2>
          <p className="mt-4 max-w-[38rem] text-lg leading-relaxed text-muted-foreground text-pretty">
            If an action matters to the dealership, it deserves a clear measurement plan — from
            shopper behavior and inventory activity through the next monthly decision.
          </p>
        </div>

        <div className="mt-8 border border-ink/15 bg-porcelain px-5 py-5 md:px-6">
          <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-signal-deep md:text-xs">
            What shoppers do
          </p>
          <ul
            className="mt-3 flex flex-wrap gap-2"
            aria-label="Shopper actions the measurement loop observes"
          >
            {measurement.buyerActions.map((action) => (
              <li
                key={action}
                className="border-2 border-ink bg-paper px-3.5 py-2 text-sm font-semibold text-ink"
              >
                {action}
              </li>
            ))}
          </ul>
        </div>

        <ol
          id="how-it-works"
          className="loop-route mt-8 scroll-mt-24 bg-porcelain px-5 py-7 md:mt-9 md:px-7 md:py-8 lg:px-8"
          aria-label="Observe, connect, improve, report"
        >
          {stages.map((stage, i) => {
            const n = String(i + 1).padStart(2, '0')
            return (
              <li key={stage.id} className="relative flex items-start gap-4 lg:block">
                <span
                  className={`qti-node relative z-10 flex h-12 w-12 shrink-0 items-center justify-center font-mono text-sm font-bold ${stage.tile}`}
                >
                  <span className="sr-only">
                    Stage {n}, {stage.label}.{' '}
                  </span>
                  <span aria-hidden="true">{n}</span>
                </span>
                <div className="min-w-0 lg:mt-5">
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-signal-deep">
                    {stage.label}
                  </p>
                  <p className="mt-1.5 text-base font-semibold leading-snug tracking-tight text-ink md:text-lg text-pretty">
                    {stage.lead}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty md:text-[0.9375rem]">
                    {stage.support}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground text-pretty">
          Implementation uses named events, GA4, GTM, and vendor-supported signals where they are
          available. Technical depth lives in the engagement, not in another dashboard to operate.
        </p>

        <p className="mt-6 max-w-[40rem] text-xl font-semibold leading-snug tracking-tight text-ink md:text-2xl text-pretty">
          {measurement.headline}
        </p>
      </div>
    </section>
  )
}
