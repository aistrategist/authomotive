import { discoveryToInventory } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'
import { BuyerIntentStream } from '@/components/buyer-intent-stream'

const stepMarks = [
  { tile: 'bg-ink text-paper', rule: 'bg-accent' },
  { tile: 'bg-accent text-ink', rule: 'bg-accent-deep' },
  { tile: 'bg-accent-soft text-ink', rule: 'bg-ink' },
] as const

const stackMarks = [
  { swatch: 'bg-ink' },
  { swatch: 'bg-accent' },
  { swatch: 'bg-proof' },
] as const

/**
 * Bridge below the hero: a real shopper question becomes a research-to-inventory path.
 */
export function DiscoveryToInventory() {
  const { eyebrow, headline, supporting, path, steps, stack } =
    discoveryToInventory

  return (
    <section
      aria-labelledby="discovery-to-inventory-heading"
      className="relative border-b border-border bg-paper"
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] bg-porcelain lg:block" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-20">
        <SignalRail tone="ink" />

        <div className="max-w-[46.5rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {eyebrow}
          </p>
          <h2
            id="discovery-to-inventory-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {headline}
          </h2>
          <p className="lede mt-4 max-w-[36rem] text-lg leading-relaxed text-muted-foreground text-pretty">
            {supporting}
          </p>
        </div>

        <p
          className="mt-6 flex max-w-[46.5rem] flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink md:mt-8 md:text-xs"
          aria-label={path.join(' to ')}
        >
          {path.map((item, i) => (
            <span key={item} className="inline-flex items-center gap-2">
              {i > 0 ? (
                <span className="text-ink/35" aria-hidden="true">
                  →
                </span>
              ) : null}
              <span>{item}</span>
            </span>
          ))}
        </p>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[0.68fr_1fr] lg:items-stretch lg:gap-14">
          <div className="min-w-0">
            <BuyerIntentStream />
          </div>

          <div className="-mx-5 bg-porcelain px-5 py-8 md:-mx-8 md:px-8 lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0">
            <ol className="relative flex flex-col gap-7" aria-label="From discovery to inventory">
              <span
                className="absolute bottom-4 left-[23px] top-4 w-0.5 bg-ink/15"
                aria-hidden="true"
              />
              {steps.map((step, i) => {
                const mark = stepMarks[i]
                const n = String(i + 1).padStart(2, '0')
                return (
                  <li key={step.id} className="relative flex items-start gap-4">
                    <span
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center font-mono text-sm font-bold ${mark.tile}`}
                    >
                      <span className="sr-only">Step {n}, {step.stage}. </span>
                      <span aria-hidden="true">{n}</span>
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-signal-deep">
                        {step.stage}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink md:text-2xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
                        {step.body}
                      </p>
                      {i < steps.length - 1 ? (
                        <span className={`mt-5 block h-0.5 w-8 ${mark.rule}`} aria-hidden="true" />
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        <div className="mt-10 border-t border-ink/15 pt-6 lg:mt-12">
          <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-signal-deep md:text-xs">
            {stack.eyebrow}
          </p>
          <ul
            className="mt-3 grid gap-3 md:grid-cols-3 md:gap-6"
            aria-label="Built into the existing dealer stack"
          >
            {stack.items.map((item, i) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  className={`mt-[0.45rem] h-1.5 w-1.5 shrink-0 ${stackMarks[i].swatch}`}
                  aria-hidden="true"
                />
                <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-ink md:text-[0.6875rem]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 max-w-[42rem] text-sm leading-relaxed text-muted-foreground text-pretty">
            {stack.supporting}
          </p>
        </div>
      </div>
    </section>
  )
}
