import { founder } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'

/**
 * Compact, type-led founder-credibility band. Editorial and restrained:
 * no portrait, no timeline, no invented numbers.
 */
export function FounderCredibility() {
  return (
    <section aria-labelledby="founder-heading" className="border-b border-border">
      <div className="mx-auto max-w-[1320px] px-5 py-11 md:px-8 md:py-14">
        {/* Restrained Orange rule distinguishing this Clean Paper section from the Porcelain process above */}
        <div className="h-[3px] w-16 bg-action" aria-hidden="true" />
        <Reveal className="mt-8 grid gap-8 lg:grid-cols-[minmax(280px,0.8fr)_1.2fr] lg:gap-16 md:mt-9">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
              {founder.eyebrow}
            </p>
            <h2
              id="founder-heading"
              className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl text-balance"
            >
              {founder.headline}
            </h2>
          </div>
          <div className="lg:pt-1">
            <p className="text-lg leading-relaxed text-ink text-pretty">{founder.copy}</p>
            <p className="mt-5 border-l-2 border-lime pl-4 text-base font-semibold leading-relaxed text-muted-foreground md:text-lg">
              {founder.supporting}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
