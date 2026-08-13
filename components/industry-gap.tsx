import { industryGap } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'

/**
 * One connected problem field. Three equal columns share a single
 * structural rail across the top, ending in one Orange unresolved
 * endpoint — a single system with three failures, not three cards.
 */
export function IndustryGap() {
  return (
    <section aria-labelledby="industry-gap-heading" className="border-b border-border bg-alloy">
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

        {/* One shared structural rail across the top of the three problem columns */}
        <div className="relative mt-10 md:mt-14">
          <div className="absolute inset-x-0 top-0 hidden h-px bg-border md:block" aria-hidden="true" />
          <Reveal as="div">
            <div className="grid gap-8 md:grid-cols-3 md:gap-10">
              {industryGap.problems.map((problem, i) => (
                <div
                  key={problem.title}
                  className="border-t border-border pt-6 md:border-t-0 md:pt-8 first:border-t-0"
                >
                  <span
                    className="font-mono text-5xl font-bold leading-none text-porcelain md:text-6xl"
                    style={{ WebkitTextStroke: '1.5px var(--color-signal-deep)' }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-ink md:text-2xl text-pretty">
                    {problem.title}
                  </h3>
                  <p className="mt-2.5 text-base leading-relaxed text-muted-foreground">
                    {problem.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* One Orange unresolved endpoint, then the closing statement as the resolved bridge */}
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
