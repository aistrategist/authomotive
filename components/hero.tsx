'use client'

import { useState } from 'react'
import { hero, siteConfig } from '@/lib/site-data'
import { HeroStage } from '@/components/hero-stage'

/**
 * First viewport: brand + headline + support + CTAs + dominant HeroStage.
 * Band two (porcelain): buyer question + outcome tabs — kept below the fold.
 */
export function Hero() {
  const [active, setActive] = useState(0)
  const activeOutcome = hero.outcomes[active]

  return (
    <>
      <section id="top" className="hero-atmosphere relative overflow-visible scroll-mt-24">
        <div className="mx-auto grid w-full max-w-[1320px] items-center gap-8 px-5 md:gap-10 md:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-6">
          <div className="hero-copy relative z-20 max-w-xl overflow-visible lg:max-w-[34rem]">
            <p className="hero-enter hero-enter-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-lime/90 md:text-xs">
              {hero.eyebrow}
            </p>
            <h1 className="hero-enter hero-enter-2 mt-3 text-[2.15rem] font-semibold uppercase leading-[0.92] tracking-[-0.035em] md:text-[2.75rem] lg:text-[3.15rem] xl:text-[3.45rem]">
              <span className="block text-lime">Get found.</span>
              <span className="block text-paper">Guide buyers.</span>
              <span className="block text-action">Prove what works.</span>
            </h1>
            <p className="hero-enter hero-enter-3 mt-4 max-w-[30rem] text-[0.95rem] leading-snug text-paper/80 md:text-base">
              AI-ready authority content and conversion tracking that moves shoppers from search to
              inventory—and shows what drives the lead.
            </p>
            <div className="hero-enter hero-enter-4 mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a href="#opportunity-review" className="btn btn-action">
                Review My Dealership Website
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a
                href="#capabilities"
                className="text-[0.9375rem] font-semibold text-paper/70 transition-colors hover:text-paper"
              >
                See What We Build
                <span aria-hidden="true"> →</span>
              </a>
            </div>
            <p className="hero-enter hero-enter-5 mt-3 max-w-md text-[0.8125rem] leading-snug text-paper/55">
              Built around your existing dealer website and vendor stack.
            </p>
            <p className="sr-only">{siteConfig.tagline}</p>
          </div>

          <div className="hero-enter hero-enter-stage relative z-[1] min-w-0 overflow-visible lg:-ml-4 lg:-mr-2 xl:-ml-8 xl:-mr-6">
            <HeroStage />
          </div>
        </div>
      </section>

      <div className="relative h-px w-full bg-alloy" aria-hidden="true">
        <span className="absolute left-0 top-0 h-[3px] w-20 -translate-y-1/2 bg-action md:w-28" />
      </div>

      <section aria-labelledby="buyer-question-heading" className="border-b border-border bg-porcelain">
        <div className="mx-auto max-w-[1320px] px-5 py-12 md:px-8 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.68fr_1fr] lg:items-start lg:gap-14">
            <blockquote className="lg:sticky lg:top-24">
              <p
                id="buyer-question-heading"
                className="text-2xl font-semibold leading-snug tracking-tight text-ink text-pretty md:text-3xl"
              >
                &ldquo;{hero.question}&rdquo;
              </p>
              <cite className="mt-3 block text-base not-italic text-muted-foreground">
                A real buyer question your website should own
              </cite>
              <div className="mt-6 hidden items-center gap-0 lg:flex" aria-hidden="true">
                <div className="h-0.5 w-16 bg-action" />
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
            </blockquote>

            <div>
              <div className="mb-5 flex items-center gap-0 lg:hidden" aria-hidden="true">
                <div className="h-0.5 w-16 bg-action" />
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

              <div
                role="tablist"
                aria-label="What Authomotive makes happen"
                className="flex flex-col gap-1"
              >
                {hero.outcomes.map((outcome, i) => {
                  const selected = active === i
                  return (
                    <button
                      key={outcome.id}
                      type="button"
                      role="tab"
                      id={`outcome-tab-${outcome.id}`}
                      aria-selected={selected}
                      aria-controls="outcome-panel"
                      onClick={() => setActive(i)}
                      className="group flex min-h-[44px] items-baseline gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal-deep"
                    >
                      <span
                        className={`hidden h-1 shrink-0 rounded-full transition-all duration-300 motion-reduce:transition-none sm:block ${
                          selected ? 'w-12 bg-lime ring-1 ring-signal-deep/40' : 'w-4 bg-border'
                        }`}
                        aria-hidden="true"
                      />
                      <span
                        className={`text-[2rem] font-bold leading-[1.08] tracking-tight transition-colors duration-200 sm:text-[2.75rem] lg:text-[3.25rem] ${
                          selected
                            ? 'text-ink'
                            : 'text-ink/25 group-hover:text-ink/50'
                        }`}
                      >
                        {outcome.statement}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div
                role="tabpanel"
                id="outcome-panel"
                aria-labelledby={`outcome-tab-${activeOutcome.id}`}
                className="mt-5 min-h-[76px] max-w-2xl border-l-2 border-lime pl-5"
              >
                <p key={activeOutcome.id} className="panel-swap text-lg leading-relaxed text-ink text-pretty">
                  {activeOutcome.explanation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
