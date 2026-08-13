import { howItWorks } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'

/**
 * Compact working-process loop: all four stages visible side by side on
 * desktop, connected by one signal line that loops back to the next
 * opportunity. Evidence methodology stays embedded in each stage.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20 border-b border-border bg-porcelain">
      <div className="mx-auto max-w-[1320px] px-5 py-11 md:px-8 md:py-14">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
              {howItWorks.eyebrow}
            </p>
            <h2
              id="how-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl text-balance"
            >
              {howItWorks.headline}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg text-pretty lg:pb-1">
            {howItWorks.supporting}
          </p>
        </div>

        {/* Connected sequence — all stages visible on desktop */}
        <div className="relative mt-9 md:mt-10">
          {/* Horizontal signal line behind the stage nodes (md+) */}
          <div className="absolute left-[3%] right-[3%] top-[24px] hidden h-1 bg-border md:block" aria-hidden="true">
            <div className="draw-line h-full w-full bg-signal-deep/40" />
          </div>

          <Reveal as="div">
            <ol className="grid gap-6 md:grid-cols-4 md:gap-5">
              {howItWorks.stages.map((stage) => (
                <li key={stage.number} className="relative flex gap-4 md:block">
                  <span
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-signal-deep bg-lime font-mono text-xl font-bold text-ink"
                    aria-hidden="true"
                  >
                    {stage.number}
                  </span>
                  <div className="md:mt-5">
                    <h3 className="text-xl font-semibold tracking-tight text-ink md:text-[1.35rem]">
                      {stage.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                      {stage.body}
                    </p>
                    <p className="mt-3 border-l-2 border-lime pl-3 text-[15px] leading-relaxed text-ink">
                      <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-signal-deep">
                        Evidence:{' '}
                      </span>
                      {stage.evidence}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* Loop back — the evidence feeds the next opportunity */}
          <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
              <path
                d="M20 12a8 8 0 1 1-3-6.2M20 4v4h-4"
                stroke="var(--action)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-lg font-semibold tracking-tight text-ink md:text-xl text-balance">
              {howItWorks.closing}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
