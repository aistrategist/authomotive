import { industryGap } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'

const numberTiles = [
  'bg-ink text-porcelain',
  'bg-lime text-ink',
  'bg-action text-ink',
] as const

/**
 * Diagnostic chapter: three equal editorial issue cards on Alloy.
 */
export function IndustryGap() {
  return (
    <section aria-labelledby="industry-gap-heading" className="relative border-b border-border bg-alloy">
      <span className="absolute left-0 top-0 h-[3px] w-28 bg-action" aria-hidden="true" />
      <div className="mx-auto max-w-[1320px] px-5 py-14 md:px-8 md:py-20">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {industryGap.eyebrow}
          </p>
          <h2
            id="industry-gap-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {industryGap.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {industryGap.supporting}
          </p>
        </div>

        <Reveal as="div">
          <div className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-3 lg:gap-5">
            {industryGap.problems.map((problem, i) => (
              <article
                key={problem.title}
                className="flex flex-col rounded-[8px] border-2 border-ink bg-porcelain p-6 shadow-[0_6px_0_0_var(--ink)] lg:aspect-square lg:p-7"
              >
                <span
                  className={`flex h-16 w-16 items-center justify-center font-mono text-xl font-bold ${numberTiles[i]}`}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight text-ink md:text-2xl text-pretty">
                  {problem.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground md:mt-auto">
                  {problem.body}
                </p>
              </article>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 flex items-center gap-0 md:mt-12" aria-hidden="true">
          <div className="h-0.5 w-16 bg-action md:w-28" />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="-ml-px shrink-0">
            <path
              d="M2 8h11m0 0L8.5 3.5M13 8l-4.5 4.5"
              stroke="var(--action)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <Reveal>
          <p className="mt-6 text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
            {industryGap.closing.split('one managed standard')[0]}
            <span className="text-action-deep">one managed standard</span>.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
