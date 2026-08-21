'use client'

import { useState } from 'react'
import { aiDiscovery, authorityTheater, cta } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

type ViewId = 'shopper' | 'discovery' | 'measurable'

const outcomes = [
  { mark: 'bg-accent', label: 'Discovery earned' },
  { mark: 'bg-paper', label: 'Buyers guided' },
  { mark: 'bg-proof', label: 'Actions measured' },
] as const

const discoveryPoints = [
  {
    label: 'A direct answer',
    detail: 'The buyer question is answered plainly near the top, in crawlable HTML.',
  },
  {
    label: 'Clear structure',
    detail: 'Headings, comparisons, and FAQs are organized so search and AI systems can trust the page.',
  },
  {
    label: 'A path to inventory',
    detail: 'Useful research connects to matching vehicles the dealership can sell.',
  },
] as const

const measuredActions = [
  { action: 'Priority selected', signal: 'Which needs get chosen' },
  { action: 'Comparison opened', signal: 'Which decisions get weighed' },
  { action: 'Inventory pathway clicked', signal: 'Research moving to vehicles' },
  { action: 'Form or call started', signal: 'High-intent contact' },
] as const

const foundationItems = [
  { n: '01', label: 'Identity' },
  { n: '02', label: 'Brands & services' },
  { n: '03', label: 'Inventory pathways' },
  { n: '04', label: 'Structured FAQs' },
] as const

function ShopperView() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
          Dealership research guide
        </p>
        <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
          {authorityTheater.exampleTopic}
        </h4>
      </div>

      <div className="rounded-lg border-l-4 border-accent bg-porcelain p-5">
        <p className="text-base font-semibold uppercase tracking-wide text-signal-deep">
          The short answer
        </p>
        <p className="mt-2 text-lg leading-relaxed text-ink">
          The right three-row SUV depends on how many passengers you carry regularly, your budget
          range, and how much winter capability you actually need. Start with your priorities below
          and we&apos;ll narrow the field.
        </p>
      </div>

      <div>
        <p className="text-lg font-semibold text-ink">What matters most to your family?</p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {['Seating for 7+', 'All-wheel drive', 'Cargo space', 'Fuel efficiency', 'Towing'].map(
            (priority, i) => (
              <span
                key={priority}
                className={`rounded-full border-2 px-4 py-2 text-base font-medium ${
                  i === 1
                    ? 'border-signal-deep bg-accent text-ink'
                    : 'border-border bg-paper text-ink'
                }`}
              >
                {priority}
              </span>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-paper p-5">
          <p className="text-base font-semibold text-ink">Winter driving comparison</p>
          <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
            How AWD systems, ground clearance, and heated features compare across the three-row
            models we carry.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-paper p-5">
          <p className="text-base font-semibold text-ink">Budget and ownership guidance</p>
          <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
            What each trim level adds, and which features families tell us matter after the first
            winter.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 rounded-lg border-2 border-ink bg-porcelain p-5 sm:flex-row sm:items-center">
        <p className="text-lg font-semibold text-ink text-pretty">
          See the three-row SUVs that match your priorities
        </p>
        <span className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-[6px] border-2 border-ink bg-paper px-4 py-2 text-[15px] font-semibold text-ink">
          View Matching Inventory
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </div>
  )
}

function DiscoveryView() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg leading-relaxed text-ink">
        The same page, seen by search and AI-assisted systems.
      </p>
      <ul className="flex flex-col gap-3">
        {discoveryPoints.map((item, i) => (
          <li key={item.label} className="flex items-start gap-4 rounded-lg border border-border bg-paper p-5">
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center bg-ink font-mono text-xs font-bold text-accent"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="text-lg font-semibold text-ink">{item.label}</p>
              <p className="mt-0.5 text-base leading-relaxed text-muted-foreground">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MeasurableView() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg leading-relaxed text-ink">
        The same page, instrumented before it launches.
      </p>
      <ul className="flex flex-col gap-2.5">
        {measuredActions.map((row) => (
          <li
            key={row.action}
            className="flex flex-col gap-1 rounded-lg border border-border bg-paper p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <span className="flex items-center gap-3 text-base font-semibold text-ink">
              <span className="h-2.5 w-2.5 shrink-0 bg-accent" aria-hidden="true" />
              {row.action}
            </span>
            <span className="text-base text-muted-foreground sm:text-right">{row.signal}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AuthorityExperience() {
  const [view, setView] = useState<ViewId>('shopper')
  const activeIndex = authorityTheater.views.findIndex((v) => v.id === view)

  return (
    <section
      id="authority-experiences"
      aria-labelledby="authority-heading"
      className="ink-grid scroll-mt-24 bg-stage"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <SignalRail tone="lime" />
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
          <p className="mt-4 text-lg leading-relaxed text-[color:var(--on-ink-muted)] text-pretty">
            {authorityTheater.supporting}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Authority Experience views"
          className="mt-8 flex flex-wrap gap-3 md:mt-10"
        >
          {authorityTheater.views.map((v, i) => {
            const selected = view === v.id
            return (
              <button
                key={v.id}
                role="tab"
                id={`view-tab-${v.id}`}
                aria-selected={selected}
                aria-controls="authority-view-panel"
                onClick={() => setView(v.id as ViewId)}
                className={`lift flex min-h-[52px] items-center gap-3 rounded-lg border-2 px-5 py-3 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:px-6 ${
                  selected
                    ? 'border-lime bg-lime text-ink'
                    : 'border-stage-line bg-stage-elevated text-stage-foreground hover:border-stage-muted'
                }`}
              >
                <span
                  className={`font-mono text-xs font-bold ${selected ? 'text-signal-deep' : 'text-fog'}`}
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>
                {v.label}
              </button>
            )
          })}
        </div>

        <div className="mt-4 hidden items-center gap-0 md:flex" aria-hidden="true">
          {authorityTheater.views.map((v, i) => (
            <div key={v.id} className="flex flex-1 items-center">
              <span
                className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                  i === activeIndex ? 'bg-lime' : 'bg-stage-line'
                }`}
              />
              {i < authorityTheater.views.length - 1 && <span className="h-px flex-1 bg-stage-line" />}
            </div>
          ))}
        </div>

        <div
          role="tabpanel"
          id="authority-view-panel"
          aria-labelledby={`view-tab-${view}`}
          className="mt-4"
        >
          <div className="rounded-[8px] border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_0_var(--accent)] md:p-8">
            <p className="mb-5 inline-block rounded-full border border-border bg-porcelain px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Illustrative example — not a live dealership page
            </p>
            <div key={view} className="panel-swap">
              {view === 'shopper' && <ShopperView />}
              {view === 'discovery' && <DiscoveryView />}
              {view === 'measurable' && <MeasurableView />}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3" aria-label="One page, three outcomes">
          {outcomes.map((item) => (
            <p
              key={item.label}
              className="flex min-h-[72px] items-center gap-3 border border-stage-line bg-stage-elevated px-4 py-3 text-lg font-semibold tracking-tight text-paper"
            >
              <span className={`h-3 w-3 shrink-0 ${item.mark}`} aria-hidden="true" />
              {item.label}
            </p>
          ))}
        </div>

        <div className="mt-6 border border-stage-line bg-paper px-5 py-5 md:px-6">
          <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-signal-deep md:text-xs">
            {aiDiscovery.eyebrow}
          </p>
          <p className="mt-2 max-w-[40rem] text-base font-semibold leading-snug text-ink md:text-lg text-pretty">
            {aiDiscovery.headline}
          </p>
          <ul
            className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="AI Discovery page contents"
          >
            {foundationItems.map((item) => (
              <li key={item.n} className="flex items-center gap-2.5 bg-porcelain px-3 py-3">
                <span className="font-mono text-[0.6875rem] font-bold text-signal-deep" aria-hidden="true">
                  {item.n}
                </span>
                <span className="text-sm font-semibold text-ink">{item.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Included with every engagement and reviewed monthly. It organizes verified first-party
            information. It does not guarantee citations or control what any AI platform says.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-xl text-lg leading-relaxed text-[color:var(--on-ink-muted)] text-pretty">
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
