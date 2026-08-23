import { aiDiscovery, authorityTheater, cta } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

const lensUi = [
  {
    id: 'shopper',
    micro: '01 · SHOPPER',
    main: 'What buyers see',
    short: 'Shopper',
  },
  {
    id: 'discovery',
    micro: '02 · DISCOVERY',
    main: 'What systems read',
    short: 'Discovery',
  },
  {
    id: 'measurable',
    micro: '03 · MEASUREMENT',
    main: 'What dealers know',
    short: 'Measurement',
  },
] as const

const lensOrientation =
  'One page. Three lenses: help the shopper choose, help search and AI understand the answer, and show the dealer what happened next.'

const foundationItems = [
  { n: '01', label: 'Identity', tone: 'blue' as const },
  { n: '02', label: 'Brands & services', tone: 'blue' as const },
  { n: '03', label: 'Inventory pathways', tone: 'lavender' as const },
  { n: '04', label: 'Structured FAQs', tone: 'lavender' as const },
] as const

function LensGlyph({ id }: { id: (typeof lensUi)[number]['id'] }) {
  if (id === 'shopper') {
    return (
      <svg className="ae-glyph" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="5" cy="10" r="2.25" fill="currentColor" />
        <path d="M7.5 10h5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" fill="none" />
        <path d="M13 7.5 16 10l-3 2.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" fill="none" />
        <circle cx="5" cy="10" r="5.5" stroke="currentColor" strokeWidth="1.25" fill="none" opacity="0.45" />
      </svg>
    )
  }
  if (id === 'discovery') {
    return (
      <svg className="ae-glyph" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="4.5" cy="4.5" r="2" fill="currentColor" />
        <circle cx="15.5" cy="4.5" r="2" fill="currentColor" />
        <circle cx="10" cy="15.5" r="2" fill="currentColor" />
        <path
          d="M5.8 5.8 8.8 13.2M14.2 5.8 11.2 13.2M6.5 4.5h7"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    )
  }
  return (
    <svg className="ae-glyph" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 14.5 7.5 8l3 3.5L17 4.5" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="square" />
      <circle cx="17" cy="4.5" r="1.75" fill="currentColor" />
      <path d="M3 16.5h14" stroke="currentColor" strokeWidth="1.25" opacity="0.45" />
    </svg>
  )
}

/** SSR chrome for Authority Experience while the GSAP theater loads nearby. */
export function AuthorityExperienceFallback() {
  return (
    <section
      id="authority-experiences"
      aria-labelledby="authority-heading"
      className="ink-grid scroll-mt-24 bg-stage"
    >
      <SignalRail step={3} />
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <div className="max-w-[40rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-lime">
            {authorityTheater.eyebrow}
          </p>
          <h2
            id="authority-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-stage-foreground md:text-5xl text-balance"
          >
            {authorityTheater.headline}
          </h2>
          <p className="lede mt-4 text-[color:var(--on-ink-muted)] text-pretty">
            {authorityTheater.supporting}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Authority Experience views"
          className="ae-tablist mt-8 grid grid-cols-3 gap-3 md:mt-9 md:gap-4"
        >
          {lensUi.map((lens) => {
            const selected = lens.id === 'shopper'
            return (
              <button
                key={lens.id}
                type="button"
                role="tab"
                id={`view-tab-${lens.id}`}
                aria-label={`${lens.short}. ${lens.main}`}
                aria-selected={selected}
                aria-controls="authority-view-panel"
                tabIndex={selected ? 0 : -1}
                data-lens={lens.id}
                data-active={selected ? 'true' : 'false'}
                className="ae-tab"
              >
                <span className="ae-tab-fill" aria-hidden="true" />
                <span className="ae-tab-station" aria-hidden="true" />
                <span className="ae-tab-inner">
                  <LensGlyph id={lens.id} />
                  <span className="ae-tab-copy">
                    <span className="ae-tab-micro font-mono" aria-hidden="true">
                      {lens.micro}
                    </span>
                    <span className="ae-tab-main md:hidden" aria-hidden="true">
                      {lens.short}
                    </span>
                    <span className="ae-tab-main hidden md:inline" aria-hidden="true">
                      {lens.main}
                    </span>
                    <span
                      className={`ae-tab-active font-mono ${selected ? 'is-on' : ''}`}
                      aria-hidden="true"
                    >
                      ACTIVE LENS
                    </span>
                  </span>
                  <span className="ae-tab-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <p className="ae-lens-read font-mono">{lensOrientation}</p>

        <div
          role="tabpanel"
          id="authority-view-panel"
          aria-labelledby="view-tab-shopper"
          className="mt-4 md:mt-5"
        >
          <div className="ae-instrument-stage" data-lens="shopper">
            <div className="ae-browser min-h-[36rem] md:min-h-[44rem]">
              <span className="ae-frame-rule" aria-hidden="true" />
              <div className="ae-chrome" aria-hidden="true">
                <div className="ae-chrome-tabs">
                  <div className="ae-toolbar-lights">
                    <span className="ae-light ae-light-close" />
                    <span className="ae-light ae-light-min" />
                    <span className="ae-light ae-light-max" />
                  </div>
                  <div className="ae-chrome-tab ae-chrome-tab-active">
                    <span className="ae-chrome-favicon font-mono">N</span>
                    <span className="ae-chrome-tab-title">Three-Row SUV Guide | Northline</span>
                  </div>
                  <span className="ae-chrome-tab-spacer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ae-foundation">
          <p className="ae-foundation-eyebrow font-mono">{aiDiscovery.eyebrow}</p>
          <h3 className="ae-foundation-title font-semibold tracking-tight text-pretty">
            {aiDiscovery.headline}
          </h3>
          <span className="ae-foundation-rule" aria-hidden="true" />
          <ul className="ae-foundation-stations" aria-label="AI Discovery page contents">
            {foundationItems.map((item) => (
              <li key={item.n} className="ae-foundation-station" data-tone={item.tone}>
                <span className="ae-foundation-n font-mono" aria-hidden="true">
                  {item.n}
                </span>
                <span className="ae-foundation-label">{item.label}</span>
              </li>
            ))}
          </ul>
          <p className="ae-foundation-note">
            Included with every engagement and reviewed monthly. It organizes verified first-party
            information. It does not guarantee citations or control what any AI platform says.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-xl text-xl font-semibold leading-snug text-stage-foreground text-pretty md:text-2xl">
            One page. Three outcomes. AI Discovery sits underneath as supporting infrastructure.
          </p>
          <a href="#opportunity-review" className="btn btn-action-dark shrink-0">
            {cta.primary}
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
