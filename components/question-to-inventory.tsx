import { QtiJourney } from '@/components/qti-journey'
import { SignalRail } from '@/components/signal-rail'

const stages = [
  {
    id: 'question',
    label: 'BUYER QUESTION',
    lead: '“Which three-row SUV fits my family?”',
    support: 'Capture a specific, high-intent question the dealership should be able to answer.',
  },
  {
    id: 'answer',
    label: 'USEFUL DEALERSHIP ANSWER',
    lead: 'Compare fit, ownership considerations and the models that best match the shopper’s priorities.',
    support: 'Create dealership-owned guidance that helps the buyer narrow the decision.',
  },
  {
    id: 'inventory',
    label: 'INVENTORY HANDOFF',
    lead: 'Move the shopper into matching inventory, SRPs or VDPs without creating a separate shopping environment.',
    support: 'Connect useful research directly to vehicles the dealership can sell.',
  },
  {
    id: 'evidence',
    label: 'MEASURABLE EVIDENCE',
    lead: 'Track research engagement, inventory handoffs and meaningful lead actions.',
    support: 'Use the evidence to improve the work and guide the next monthly decision.',
  },
] as const

const stageTiles = [
  'bg-ink text-paper',
  'bg-accent text-ink',
  'bg-ink text-paper',
  'bg-accent-soft text-ink',
] as const

const stackItems = [
  { mark: 'bg-ink', label: 'Website + inventory platforms' },
  { mark: 'bg-accent', label: 'Search + AI discovery' },
  { mark: 'bg-accent-deep', label: 'Analytics + monthly intelligence' },
] as const

/**
 * Opening chapter on `/` and `/seo-services/`: buyer question → answer →
 * inventory → evidence, inside the dealership’s existing stack. Motion is
 * scoped to the route artifact and is safe on both pages.
 */
export function QuestionToInventory() {
  return (
    <section
      aria-labelledby="question-to-inventory-heading"
      className="relative border-b border-border bg-paper"
    >
      <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <SignalRail step={1} />

        <div className="max-w-[46.5rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            FROM DISCOVERY TO INVENTORY
          </p>
          <h2
            id="question-to-inventory-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            Turn buyer questions into inventory pathways.
          </h2>
          <p className="lede mt-4 max-w-[40rem] text-lg leading-relaxed text-muted-foreground text-pretty">
            Shoppers research a need long before they submit a lead. Authomotive turns those
            questions into dealership-owned guidance, connects that guidance to relevant inventory,
            and measures what happens next—inside the website and vendor stack the dealership
            already uses.
          </p>
          <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-ink text-pretty">
            Most dealerships already have the tools. The gap is that content, inventory activity,
            analytics and emerging AI visibility are usually managed separately.
          </p>
        </div>

        <QtiJourney>
          <ol
            className="qti-route px-5 py-7 md:px-7 md:py-8 lg:px-8"
            aria-label="From buyer question to measurable evidence"
          >
            {stages.map((stage, i) => {
              const n = String(i + 1).padStart(2, '0')
              return (
                <li key={stage.id} className="qti-stage relative flex items-start gap-4 lg:block">
                  <span
                    className={`qti-node relative z-10 flex h-12 w-12 shrink-0 items-center justify-center font-mono text-sm font-bold ${stageTiles[i]}`}
                  >
                    <span className="sr-only">
                      Stage {n}, {stage.label}.{' '}
                    </span>
                    <span aria-hidden="true">{n}</span>
                  </span>
                  <div className="qti-copy min-w-0 lg:mt-5">
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
        </QtiJourney>

        <div
          id="platforms"
          className="mt-8 scroll-mt-24 border-t border-ink/15 pt-6 md:mt-9"
        >
          <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-signal-deep md:text-xs">
            KEEP THE PLATFORM. ADD THE STRATEGY.
          </p>
          <ul
            className="mt-3 grid gap-3 md:grid-cols-3 md:gap-6"
            aria-label="Existing dealer stack Authomotive works with"
          >
            {stackItems.map((item) => (
              <li key={item.label} className="flex items-start gap-2.5">
                <span className={`mt-[0.45rem] h-1.5 w-1.5 shrink-0 ${item.mark}`} aria-hidden="true" />
                <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-ink md:text-[0.6875rem]">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-[42rem] text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
            No platform replacement. No new dashboard for the dealership to manage. Authomotive
            adds the authority and measurement layer that connects the existing work.
          </p>
        </div>
      </div>
    </section>
  )
}
