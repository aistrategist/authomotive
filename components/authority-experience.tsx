'use client'

import { useState } from 'react'
import { authorityTheater, cta } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

type ViewId = 'shopper' | 'discovery' | 'measurable'

function ShopperView() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
          Dealership research guide
        </p>
        <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
          {authorityTheater.exampleTopic}
        </h4>
      </div>

      <div className="rounded-lg border-l-4 border-lime bg-porcelain p-5">
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
                    ? 'border-signal-deep bg-lime text-ink'
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
        <div className="lift rounded-lg border border-border bg-paper p-5">
          <p className="text-base font-semibold text-ink">Winter driving comparison</p>
          <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
            How AWD systems, ground clearance, and heated features compare across the three-row
            models we carry.
          </p>
        </div>
        <div className="lift rounded-lg border border-border bg-paper p-5">
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
    <div className="flex flex-col gap-5">
      <p className="text-lg leading-relaxed text-ink">
        The same page, seen by search and AI-assisted systems. Clear structure gives discovery
        systems more to understand and trust.
      </p>
      <ul className="flex flex-col gap-3">
        {[
          {
            label: 'A direct, quotable answer',
            detail: 'The buyer question is answered plainly near the top, in crawlable HTML.',
          },
          {
            label: 'Semantic heading hierarchy',
            detail: 'Topics, comparisons, and FAQs are organized so systems understand the structure.',
          },
          {
            label: 'Structured FAQ data',
            detail: 'Question-and-answer content matches what is visible on the page.',
          },
          {
            label: 'Local relevance signals',
            detail: 'Winter driving context connects the topic to the dealership\u2019s real market.',
          },
          {
            label: 'Internal research pathways',
            detail: 'Links between related guides help systems map the dealership\u2019s expertise.',
          },
        ].map((item, i) => (
          <li key={item.label} className="flex items-start gap-4 rounded-lg border border-border bg-paper p-5">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-signal-deep bg-lime font-mono text-xs font-bold text-ink"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div>
              <p className="text-base font-semibold text-ink">{item.label}</p>
              <p className="mt-0.5 text-base leading-relaxed text-muted-foreground">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="rounded-lg border-l-4 border-lime bg-porcelain p-5 text-base leading-relaxed text-muted-foreground">
        <span className="font-semibold text-signal-deep">Why this helps discovery: </span>
        distinctive, well-structured answers give search and AI-assisted systems concrete reasons to
        surface the dealership instead of a generic result.
      </p>
    </div>
  )
}

function MeasurableView() {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-lg leading-relaxed text-ink">
        The same page, instrumented. Every meaningful shopper action is planned as measurement
        before the page launches.
      </p>
      <ul className="flex flex-col gap-2.5">
        {[
          { action: 'Priority selected', signal: 'Which buyer needs are chosen most often' },
          { action: 'Comparison opened', signal: 'Which vehicle decisions shoppers weigh' },
          { action: 'FAQ expanded', signal: 'Which questions still need answering' },
          { action: 'Inventory pathway clicked', signal: 'Research moving toward real vehicles' },
          { action: 'Form or call started', signal: 'High-intent contact from the research page' },
        ].map((row) => (
          <li
            key={row.action}
            className="flex flex-col gap-1.5 rounded-lg border border-border bg-paper p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <span className="flex items-center gap-3 text-base font-semibold text-ink">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime ring-2 ring-signal-deep/50" aria-hidden="true" />
              {row.action}
            </span>
            <span className="text-base text-muted-foreground sm:text-right">{row.signal}</span>
          </li>
        ))}
      </ul>
      <p className="rounded-lg border-l-4 border-lime bg-porcelain p-5 text-base leading-relaxed text-muted-foreground">
        <span className="font-semibold text-signal-deep">What becomes measurable: </span>
        the dealership can see whether the page earned discovery, helped shoppers decide, and moved
        research toward inventory — evidence that informs the next investment.
      </p>
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
      <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-8 md:py-24 lg:py-[7rem]">
        <SignalRail tone="lime" />
        <div className="max-w-[46.5rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-lime">
            {authorityTheater.eyebrow}
          </p>
          <h2
            id="authority-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-stage-foreground md:text-5xl text-balance"
          >
            {authorityTheater.headline}
          </h2>
          <p className="lede mt-4 text-lg leading-relaxed text-[color:var(--on-ink-muted)] md:text-xl text-pretty">
            {authorityTheater.supporting}
          </p>
        </div>

        {/* Large view controls */}
        <div
          role="tablist"
          aria-label="Authority Experience views"
          className="mt-10 flex flex-wrap gap-3 md:mt-12"
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
                className={`lift flex min-h-[56px] items-center gap-3 rounded-lg border-2 px-5 py-3 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime md:px-6 ${
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

        {/* Signal path connecting controls to the theater */}
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

        {/* The product theater — near full width, spotlight border */}
        <div
          role="tabpanel"
          id="authority-view-panel"
          aria-labelledby={`view-tab-${view}`}
          className="mt-4"
        >
          <div className="rounded-[8px] border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_0_var(--lime)] md:p-8">
            <p className="mb-5 inline-block rounded-full border border-border bg-porcelain px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Illustrative example — not a live dealership page
            </p>
            <div key={view} className="panel-swap min-h-[560px]">
              {view === 'shopper' && <ShopperView />}
              {view === 'discovery' && <DiscoveryView />}
              {view === 'measurable' && <MeasurableView />}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--on-ink-muted)] text-pretty">
            One page. Three outcomes: discovery earned, buyers guided, and meaningful actions
            measured.
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
