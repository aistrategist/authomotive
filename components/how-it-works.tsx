import { howItWorks } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'

const stepLooks = [
  'border-2 border-ink bg-ink text-porcelain',
  'border-2 border-ink bg-lime text-ink',
  'border-2 border-ink bg-action text-ink',
  'border-2 border-ink bg-ink text-lime',
] as const

/**
 * Compact working-process loop: square production markers on a Lime Mist canvas.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-24 border-b border-border bg-lime-mist">
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
          <p className="lede text-base leading-relaxed text-muted-foreground md:text-lg text-pretty lg:pb-1">
            {howItWorks.supporting}
          </p>
        </div>

        <div className="relative mt-9 md:mt-10">
          <div className="absolute left-[3%] right-[3%] top-[24px] hidden h-px bg-ink/25 md:block" aria-hidden="true" />

          <Reveal as="div">
            <ol className="grid gap-6 md:grid-cols-4 md:gap-5">
              {howItWorks.stages.map((stage, i) => (
                <li key={stage.number} className="relative flex gap-4 md:block">
                  <span
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center font-mono text-xl font-bold ${stepLooks[i]}`}
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
