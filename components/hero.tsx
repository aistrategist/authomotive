import { hero } from '@/lib/site-data'
import { HeroStage } from '@/components/hero-stage'

/**
 * First viewport: headline + support + primary CTA + dominant HeroStage.
 * Brand stamp sits at the bottom of the section.
 */
export function Hero() {
  return (
    <>
      <section id="top" className="hero-atmosphere relative overflow-visible scroll-mt-24" data-motion-gate>
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-6 px-5 md:gap-8 md:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-6">
          <div className="hero-copy relative z-20 max-w-xl overflow-visible lg:max-w-[34rem]">
            <h1 className="hero-enter hero-enter-1 text-[2.15rem] font-semibold uppercase leading-none tracking-[-0.035em] md:text-[2.75rem] lg:text-[3.15rem] xl:text-[3.45rem]">
              <span className="block text-accent">Get found. </span>
              <span className="mt-[0.18em] block text-proof">Guide buyers. </span>
              <span className="mt-[0.18em] block text-action">Prove what works.</span>
            </h1>
            <p className="hero-enter hero-enter-2 mt-4 max-w-[33rem] text-[0.95rem] leading-snug text-[color:var(--on-ink-muted)] md:mt-5 md:text-base">
              {hero.supporting}
            </p>
            <div className="hero-enter hero-enter-3 mt-5">
              <a href="#opportunity-review" data-review-cta="hero" className="btn btn-action">
                {hero.primaryCta}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
            <p className="hero-enter hero-enter-4 hero-reassurance mt-2.5 max-w-md">
              {hero.confidence}
            </p>
          </div>

          <div className="hero-enter hero-enter-stage hero-stage-slot relative z-[1] min-w-0 overflow-visible lg:-ml-4 lg:-mr-2 xl:-ml-8 xl:-mr-6">
            <HeroStage />
          </div>
        </div>

        <p className="hero-enter hero-enter-5 hero-stamp mx-auto mt-6 max-w-[1280px] px-5 md:mt-8 md:px-8">
          {hero.eyebrow}
        </p>
      </section>
    </>
  )
}
