'use client'

import { hero, siteConfig } from '@/lib/site-data'
import { HeroStage } from '@/components/hero-stage'
import { SignalRail } from '@/components/signal-rail'

/**
 * First viewport: brand + headline + support + CTAs + dominant HeroStage.
 * Band two: Warm Paper behind the buyer question, Porcelain behind outcomes.
 */
export function Hero() {
  return (
    <>
      <section id="top" className="hero-atmosphere relative overflow-visible scroll-mt-24">
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-8 px-5 md:gap-10 md:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-6">
          <div className="hero-copy relative z-20 max-w-xl overflow-visible lg:max-w-[34rem]">
            <p className="hero-enter hero-enter-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-lime/90 md:text-xs">
              {hero.eyebrow}
            </p>
            <h1 className="hero-enter hero-enter-2 mt-3 text-[2.15rem] font-semibold uppercase leading-[0.92] tracking-[-0.035em] md:text-[2.75rem] lg:text-[3.15rem] xl:text-[3.45rem]">
              <span className="block text-lime">Get found.</span>
              <span className="block text-paper">Guide buyers.</span>
              <span className="block text-action">Prove what works.</span>
            </h1>
            <p className="hero-enter hero-enter-3 mt-4 max-w-[30rem] text-[0.95rem] leading-snug text-[color:var(--on-ink-muted)] md:text-base">
              {hero.supporting}
            </p>
            <div className="hero-enter hero-enter-4 mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a href="#opportunity-review" className="btn btn-action">
                {hero.primaryCta}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a href="#capabilities" className="btn btn-outline-paper !min-h-[48px] !px-5">
                {hero.secondaryCta}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
            <p className="hero-enter hero-enter-5 mt-3 max-w-md text-[0.8125rem] leading-snug text-[color:var(--on-ink-muted)]">
              {hero.confidence}
            </p>
            <p className="sr-only">{siteConfig.tagline}</p>
          </div>

          <div className="hero-enter hero-enter-stage relative z-[1] min-w-0 overflow-visible lg:-ml-4 lg:-mr-2 xl:-ml-8 xl:-mr-6">
            <HeroStage />
          </div>
        </div>
      </section>

      <section aria-labelledby="buyer-question-heading" className="relative border-b border-border bg-paper">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] bg-porcelain lg:block" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-20">
          <SignalRail tone="ink" />
          <div className="grid gap-8 lg:grid-cols-[0.68fr_1fr] lg:items-start lg:gap-14">
            <blockquote className="bg-paper lg:sticky lg:top-24">
              <p
                id="buyer-question-heading"
                className="text-2xl font-semibold leading-snug tracking-tight text-ink text-pretty md:text-3xl"
              >
                &ldquo;{hero.question}&rdquo;
              </p>
              <cite className="mt-3 block text-base not-italic text-muted-foreground">
                A real buyer question your website should own
              </cite>
            </blockquote>

            <div className="-mx-5 bg-porcelain px-5 py-8 md:-mx-8 md:px-8 lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0">
              <ul className="flex flex-col gap-5" aria-label="How the authority system supports the promise">
                {hero.outcomes.map((outcome, i) => (
                  <li key={outcome.id} className="flex items-start gap-4">
                    <span
                      className={`mt-2.5 h-1 w-8 shrink-0 ${
                        i === 0 ? 'bg-lime' : i === 1 ? 'bg-action' : 'bg-ink'
                      }`}
                      aria-hidden="true"
                    />
                    <p className="text-lg leading-snug text-pretty md:text-xl">
                      <span className="font-semibold tracking-tight text-ink">{outcome.statement}</span>
                      <span className="text-muted-foreground"> — {outcome.explanation}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
