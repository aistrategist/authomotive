import { hero } from '@/lib/site-data'
import { HeroStage } from '@/components/hero-stage'

/**
 * First viewport: brand + headline + support + CTAs + dominant HeroStage.
 */
export function Hero() {
  return (
    <>
      <section id="top" className="hero-atmosphere relative overflow-visible scroll-mt-24">
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-8 px-5 md:gap-10 md:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-6">
          <div className="hero-copy relative z-20 max-w-xl overflow-visible lg:max-w-[34rem]">
            <p className="hero-enter hero-enter-1 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-accent/90 md:text-xs">
              {hero.eyebrow}
            </p>
            <h1 className="hero-enter hero-enter-2 mt-3 text-[2.15rem] font-semibold uppercase leading-[0.92] tracking-[-0.035em] md:text-[2.75rem] lg:text-[3.15rem] xl:text-[3.45rem]">
              <span className="block text-accent">Get found. </span>
              <span className="block text-proof">Guide buyers. </span>
              <span className="block text-action">Prove what works.</span>
            </h1>
            <p className="hero-enter hero-enter-3 mt-4 max-w-[33rem] text-[0.95rem] leading-snug text-[color:var(--on-ink-muted)] md:text-base">
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
          </div>

          <div className="hero-enter hero-enter-stage relative z-[1] min-w-0 overflow-visible lg:-ml-4 lg:-mr-2 xl:-ml-8 xl:-mr-6">
            <HeroStage />
          </div>
        </div>
      </section>
    </>
  )
}
