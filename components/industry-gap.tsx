import { industryGap } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'
import { SignalRail } from '@/components/signal-rail'

const numberTiles = [
  'bg-ink text-paper',
  'bg-accent text-ink',
  'bg-accent-soft text-ink',
] as const

function BrokenLink() {
  return (
    <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
      <span className="h-px flex-1 bg-ink" />
      <span className="h-px w-2.5 shrink-0 bg-transparent" />
      <span className="h-px flex-1 bg-ink/25" />
    </div>
  )
}

/**
 * Diagnostic chapter: three equal editorial issue cards on Alloy.
 */
export function IndustryGap() {
  return (
    <section
      data-spy="clear"
      aria-labelledby="industry-gap-heading"
      className="relative border-b border-border bg-alloy"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-20">
        <SignalRail tone="ink" />
        <div className="max-w-[46.5rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {industryGap.eyebrow}
          </p>
          <h2
            id="industry-gap-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {industryGap.headline}
          </h2>
          <p className="lede mt-4 max-w-[33.75rem] text-lg leading-relaxed text-muted-foreground text-pretty">
            {industryGap.supporting}
          </p>
        </div>

        <Reveal as="div">
          <div className="mt-10 grid gap-5 md:mt-12 lg:grid-cols-3 lg:items-stretch lg:gap-5">
            {industryGap.problems.map((problem, i) => (
              <article
                key={problem.title}
                className="flex h-full flex-col rounded-[8px] border-2 border-ink bg-porcelain p-5 shadow-[6px_6px_0_0_var(--ink)] md:p-6"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center font-mono text-lg font-bold ${numberTiles[i]}`}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-ink md:text-2xl text-pretty">
                  {problem.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {problem.body}
                </p>
                <BrokenLink />
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-10 max-w-[46.5rem] text-2xl font-semibold tracking-tight text-ink md:mt-12 md:text-3xl text-balance">
            {industryGap.closing.split('one measurable standard')[0]}
            <span className="text-accent-deep">one measurable standard</span>.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
