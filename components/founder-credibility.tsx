import { founder } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'
import { SignalRail } from '@/components/signal-rail'
import { SectionHandoff } from '@/components/section-handoff'

/**
 * Compact, type-led founder-credibility band. Editorial and restrained:
 * no portrait, no timeline, no invented numbers.
 */
export function FounderCredibility() {
  return (
    <section data-spy="clear" aria-labelledby="founder-heading" className="border-b border-border bg-paper">
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-20">
        <SignalRail tone="ink" />
        <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-16">
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
          <div className="relative lg:pt-1">
            <div
              className="absolute inset-y-0 left-0 right-0 bg-accent-soft md:-inset-y-2"
              aria-hidden="true"
            />
            <span className="absolute bottom-0 left-0 top-0 w-1.5 bg-ink md:w-2" aria-hidden="true" />
            <div className="relative pl-6 md:pl-8">
              <p className="text-lg leading-relaxed text-ink text-pretty">{founder.copy}</p>
              <p className="mt-5 border-l-2 border-accent pl-4 text-base font-semibold leading-relaxed text-muted-foreground md:text-lg">
                {founder.supporting}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Practice focus">
                {['Technical SEO', 'GA4 + GTM', 'Dealership Operations'].map((label) => (
                  <li
                    key={label}
                    className="border border-ink/20 bg-paper px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink"
                  >
                    {label}
                  </li>
                ))}
              </ul>
              <SectionHandoff
                eyebrow="WORK WITH ONE ACCOUNTABLE LEAD"
                label="Start With Your Dealership Website"
                href="#opportunity-review"
                theme="light"
                accent="neutral"
                className="mt-6"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
