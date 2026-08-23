import { QtiBandField } from '@/components/qti-band-field'
import { QtiScaleGrid } from '@/components/qti-scale-grid'
import { QtiWeb } from '@/components/qti-web'
import { SignalRail } from '@/components/signal-rail'
import { discoveryToInventory } from '@/lib/site-data'

/**
 * Opening chapter on `/` and `/seo-services/`: named dealer platforms,
 * SEO / AEO / GEO bolted on, then the six actions a dealership can read.
 */
export function QuestionToInventory() {
  const { eyebrow, headline, supporting } = discoveryToInventory

  return (
    <section
      aria-labelledby="question-to-inventory-heading"
      className="qti-band scroll-mt-24"
    >
      <QtiBandField />
      <div className="qti-bloom-host" aria-hidden="true">
        <QtiScaleGrid />
        <div className="qti-wells">
          <div className="qti-wells-inner">
            <span data-tone="accent" />
            <span data-tone="proof" />
            <span data-tone="action" />
          </div>
        </div>
      </div>
      <SignalRail step={1} />
      <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <div className="max-w-[46.5rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {eyebrow}
          </p>
          <h2
            id="question-to-inventory-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {headline}
          </h2>
          <p className="lede mt-4 max-w-[40rem] text-lg leading-relaxed text-muted-foreground text-pretty">
            {supporting}
          </p>
        </div>

        <div id="platforms" className="scroll-mt-24">
          <QtiWeb />
        </div>
      </div>
    </section>
  )
}
