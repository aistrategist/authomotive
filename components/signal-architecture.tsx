import { measurement } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

const stages = [
  {
    id: 'observe',
    n: '01',
    label: 'OBSERVE',
    lead: 'See what shoppers actually do.',
    support:
      'Research interactions, inventory handoffs, calls, forms and supported vendor experiences.',
    tile: 'bg-ink text-paper',
  },
  {
    id: 'connect',
    n: '02',
    label: 'CONNECT',
    lead: 'Capture the actions that matter.',
    support: 'Bring those actions into one measurement plan instead of losing them between platforms.',
    tile: 'bg-ink text-paper',
  },
  {
    id: 'improve',
    n: '03',
    label: 'IMPROVE',
    lead: 'Use the evidence to guide the work.',
    support:
      'Expand what works, correct what does not and attach measurement before the next page or experience launches.',
    tile: 'bg-ink text-paper',
  },
  {
    id: 'report',
    n: '04',
    label: 'REPORT',
    lead: 'Explain what changed and decide what comes next.',
    support: 'Turn the month’s evidence into a clear dealership decision.',
    tile: 'bg-proof-soft text-ink',
  },
] as const

/**
 * Closed Observe → Connect → Improve → Report operating cycle.
 * Discovery-to-inventory remains the only horizontal buyer pathway.
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
            If an action matters to the dealership, it deserves a clear measurement plan—from shopper
            behavior and inventory activity through the next monthly decision.
          </p>
        </div>

        <div className="measure-cycle mt-8 md:mt-9">
          <div className="measure-feed">
            <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-signal-deep md:text-xs">
              WHAT SHOPPERS DO
            </p>
            <ul className="mt-3 flex flex-col gap-2" aria-label="Shopper actions the measurement loop observes">
              {measurement.buyerActions.map((action) => (
                <li key={action} className="flex items-center gap-2.5">
                  <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden="true" />
                  <span className="text-sm font-semibold leading-snug text-ink md:text-base">{action}</span>
                </li>
              ))}
            </ul>
            <span className="measure-feed-arrow" aria-hidden="true" />
          </div>

          <div className="measure-loop">
            <span className="measure-feed-in" aria-hidden="true" />
            <svg
              className="measure-loop-ring"
              viewBox="0 0 336 192"
              fill="none"
              aria-hidden="true"
            >
              <path
                className="measure-loop-path"
                pathLength="1"
                d="M16 96 V28 Q16 16 28 16 H308 Q320 16 320 28 V164 Q320 176 308 176 H28 Q16 176 16 164 V96"
              />
              <path className="measure-loop-arrow" d="M16 62 l-7 16 h14 z" />
            </svg>

            <ol
              id="how-it-works"
              className="measure-loop-stages scroll-mt-24"
              aria-label="Observe, connect, improve, report, then the cycle repeats"
            >
              {stages.map((stage) => (
                <li key={stage.id} className={`measure-stage is-${stage.id}`}>
                  <span
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center font-mono text-sm font-bold ${stage.tile}`}
                  >
                    <span className="sr-only">
                      Stage {stage.n}, {stage.label}.{' '}
                    </span>
                    <span aria-hidden="true">{stage.n}</span>
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-signal-deep">
                      {stage.n} · {stage.label}
                    </h3>
                    <p className="mt-1.5 text-base font-semibold leading-snug tracking-tight text-ink md:text-lg text-pretty">
                      {stage.lead}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty md:text-[0.9375rem]">
                      {stage.support}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="measure-return" aria-hidden="true">
              Returns to Observe
            </p>

            <div className="measure-hub">
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-proof-deep">
                MONTHLY DECISION
              </p>
              <p className="mt-2 text-base font-semibold leading-snug tracking-tight text-ink md:text-lg text-pretty">
                What should we build, correct or expand next?
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 max-w-[40rem] text-sm font-semibold leading-relaxed text-ink text-pretty md:text-base">
          The next decision becomes the next thing Authomotive builds and measures.
        </p>

        <p className="mt-4 max-w-[42rem] text-sm leading-relaxed text-muted-foreground text-pretty">
          Implementation uses named events, GA4, GTM and supported vendor signals where available. The
          technical depth lives beneath the engagement—not in another dashboard the dealership must
          operate.
        </p>

        <div className="mt-8 flex flex-col items-start gap-2">
          <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-signal-deep md:text-xs">
            NEXT · THE WORKING RELATIONSHIP
          </p>
          <a href="#engagement" className="measure-handoff">
            See how the evidence becomes a monthly decision
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <p className="max-w-[36rem] text-sm leading-relaxed text-muted-foreground text-pretty">
            {measurement.headline}
          </p>
        </div>
      </div>
    </section>
  )
}
