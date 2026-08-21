'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { aiDiscovery, authorityTheater, cta } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ViewId = 'shopper' | 'discovery' | 'measurable'

const views = authorityTheater.views

const outcomes = [
  { mark: 'bg-accent', label: 'Discovery earned' },
  { mark: 'bg-paper', label: 'Buyers guided' },
  { mark: 'bg-proof', label: 'Actions measured' },
] as const

const discoveryPoints = [
  {
    spot: 'answer',
    label: 'A direct answer',
    detail: 'The buyer question is answered plainly near the top, in crawlable HTML.',
  },
  {
    spot: 'structure',
    label: 'Clear structure',
    detail: 'Headings, comparisons, and FAQs are organized so search and AI systems can trust the page.',
  },
  {
    spot: 'inventory',
    label: 'A path to inventory',
    detail: 'Useful research connects to matching vehicles the dealership can sell.',
  },
] as const

const measuredActions = [
  { spot: 'priorities', action: 'Priority selected', signal: 'Which needs get chosen' },
  { spot: 'compare', action: 'Comparison opened', signal: 'Which decisions get weighed' },
  { spot: 'inventory', action: 'Inventory pathway clicked', signal: 'Research moving to vehicles' },
  { spot: 'contact', action: 'Form or call started', signal: 'High-intent contact' },
] as const

const foundationItems = [
  { n: '01', label: 'Identity' },
  { n: '02', label: 'Brands & services' },
  { n: '03', label: 'Inventory pathways' },
  { n: '04', label: 'Structured FAQs' },
] as const

const priorities = [
  'Seating for 7+',
  'All-wheel drive',
  'Cargo space',
  'Fuel efficiency',
  'Towing',
] as const

function pinLabel(n: number) {
  return String(n).padStart(2, '0')
}

export function AuthorityExperience() {
  const [view, setView] = useState<ViewId>('shopper')
  const rootRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeIndex = views.findIndex((v) => v.id === view)

  useGSAP(
    () => {
      const frame = frameRef.current
      const rule = ruleRef.current
      if (!frame || !rule) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(frame, { y: 0 })
        gsap.set(rule, { scaleX: 1 })
        return
      }

      gsap.set(frame, { y: 7 })
      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })

      ScrollTrigger.create({
        trigger: frame,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(frame, { y: 0, duration: 0.55, ease: 'power2.out' })
          gsap.to(rule, { scaleX: 1, duration: 0.6, ease: 'power2.out' })
        },
      })
    },
    { scope: rootRef },
  )

  const activate = (id: ViewId, focus = false) => {
    setView(id)
    if (focus) {
      const i = views.findIndex((v) => v.id === id)
      tabRefs.current[i]?.focus()
    }
  }

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = views.length - 1
    let next = index
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    activate(views[next]!.id as ViewId, true)
  }

  return (
    <section
      ref={rootRef}
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
          {views.map((v, i) => {
            const selected = view === v.id
            return (
              <button
                key={v.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`view-tab-${v.id}`}
                aria-selected={selected}
                aria-controls="authority-view-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => activate(v.id as ViewId)}
                onKeyDown={(event) => onTabKeyDown(event, i)}
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
          {views.map((v, i) => (
            <div key={v.id} className="flex flex-1 items-center">
              <span
                className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                  i === activeIndex ? 'bg-lime' : 'bg-stage-line'
                }`}
              />
              {i < views.length - 1 && <span className="h-px flex-1 bg-stage-line" />}
            </div>
          ))}
        </div>

        <div
          role="tabpanel"
          id="authority-view-panel"
          aria-labelledby={`view-tab-${view}`}
          className="mt-4"
        >
          <div ref={frameRef} className="ae-frame">
            <span ref={ruleRef} className="ae-frame-rule" aria-hidden="true" />
            <p className="mb-5 inline-block rounded-full border border-border bg-porcelain px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Illustrative example — not a live dealership page
            </p>

            <div className="ae-stage">
              <article className="ae-page" data-lens={view}>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
                    Dealership research guide
                  </p>
                  <h4 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
                    {authorityTheater.exampleTopic}
                  </h4>
                </div>

                <div className="ae-spot mt-5 rounded-lg border-l-4 border-accent bg-porcelain p-5" data-spot="answer">
                  <span className="ae-pin ae-pin-d" aria-hidden="true">
                    {pinLabel(1)}
                  </span>
                  <p className="text-base font-semibold uppercase tracking-wide text-signal-deep">
                    The short answer
                  </p>
                  <p className="mt-2 text-lg leading-relaxed text-ink">
                    The right three-row SUV depends on how many passengers you carry regularly, your
                    budget range, and how much winter capability you actually need. Start with your
                    priorities below and we&apos;ll narrow the field.
                  </p>
                  <p className="ae-inline ae-inline-d" hidden={view !== 'discovery'}>
                    <span className="font-semibold">{discoveryPoints[0].label}. </span>
                    {discoveryPoints[0].detail}
                  </p>
                </div>

                <div className="ae-spot mt-5" data-spot="priorities">
                  <span className="ae-pin ae-pin-m" aria-hidden="true">
                    {pinLabel(1)}
                  </span>
                  <p className="text-lg font-semibold text-ink">What matters most to your family?</p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {priorities.map((priority, i) => (
                      <span key={priority} className={`ae-chip ${i === 1 ? 'ae-chip-on' : ''}`}>
                        {priority}
                      </span>
                    ))}
                  </div>
                  <p className="ae-inline ae-inline-m" hidden={view !== 'measurable'}>
                    <span className="font-semibold">{measuredActions[0].action}. </span>
                    {measuredActions[0].signal}
                  </p>
                </div>

                <div className="ae-spot mt-5 grid gap-4 sm:grid-cols-2" data-spot="structure">
                  <span className="ae-pin ae-pin-d" aria-hidden="true">
                    {pinLabel(2)}
                  </span>
                  <div className="ae-spot rounded-lg border border-border bg-paper p-5" data-spot="compare">
                    <span className="ae-pin ae-pin-m" aria-hidden="true">
                      {pinLabel(2)}
                    </span>
                    <p className="text-base font-semibold text-ink">Winter driving comparison</p>
                    <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
                      How AWD systems, ground clearance, and heated features compare across the
                      three-row models we carry.
                    </p>
                    <p className="ae-inline ae-inline-m" hidden={view !== 'measurable'}>
                      <span className="font-semibold">{measuredActions[1].action}. </span>
                      {measuredActions[1].signal}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-paper p-5">
                    <p className="text-base font-semibold text-ink">Budget and ownership guidance</p>
                    <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
                      What each trim level adds, and which features families tell us matter after the
                      first winter.
                    </p>
                  </div>
                  <p className="ae-inline ae-inline-d sm:col-span-2" hidden={view !== 'discovery'}>
                    <span className="font-semibold">{discoveryPoints[1].label}. </span>
                    {discoveryPoints[1].detail}
                  </p>
                </div>

                <div
                  className="ae-spot mt-5 rounded-lg border-2 border-ink bg-porcelain p-5"
                  data-spot="inventory"
                >
                  <span className="ae-pin ae-pin-d" aria-hidden="true">
                    {pinLabel(3)}
                  </span>
                  <span className="ae-pin ae-pin-m" aria-hidden="true">
                    {pinLabel(3)}
                  </span>
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <p className="text-lg font-semibold text-ink text-pretty">
                      See the three-row SUVs that match your priorities
                    </p>
                    <span className="ae-fake-action inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-[6px] border-2 border-ink bg-paper px-4 py-2 text-[15px] font-semibold text-ink">
                      View Matching Inventory
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                  <p className="ae-inline ae-inline-d" hidden={view !== 'discovery'}>
                    <span className="font-semibold">{discoveryPoints[2].label}. </span>
                    {discoveryPoints[2].detail}
                  </p>
                  <p className="ae-inline ae-inline-m" hidden={view !== 'measurable'}>
                    <span className="font-semibold">{measuredActions[2].action}. </span>
                    {measuredActions[2].signal}
                  </p>
                </div>

                <div className="ae-spot mt-4" data-spot="contact">
                  <span className="ae-pin ae-pin-m" aria-hidden="true">
                    {pinLabel(4)}
                  </span>
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Questions remain? Speak with the dealership.
                  </p>
                  <p className="ae-inline ae-inline-m" hidden={view !== 'measurable'}>
                    <span className="font-semibold">{measuredActions[3].action}. </span>
                    {measuredActions[3].signal}
                  </p>
                </div>
              </article>

              <aside className="ae-rail" data-lens={view} aria-hidden={view === 'shopper'}>
                <p
                  className="ae-rail-idle font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-fog"
                  hidden={view !== 'shopper'}
                >
                  Shopper lens — the page as published.
                </p>
                <ol
                  className="ae-rail-panel ae-rail-d"
                  aria-label="How discovery systems read this page"
                  hidden={view !== 'discovery'}
                >
                  {discoveryPoints.map((item, i) => (
                    <li key={item.label} className="ae-rail-item">
                      <span className="font-mono text-[0.6875rem] font-bold text-signal-deep" aria-hidden="true">
                        {pinLabel(i + 1)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">{item.label}</p>
                        <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <ol
                  className="ae-rail-panel ae-rail-m"
                  aria-label="Measured actions on this page"
                  hidden={view !== 'measurable'}
                >
                  {measuredActions.map((row, i) => (
                    <li key={row.action} className="ae-rail-item">
                      <span className="font-mono text-[0.6875rem] font-bold text-proof-deep" aria-hidden="true">
                        {pinLabel(i + 1)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink">{row.action}</p>
                        <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                          {row.signal}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </aside>
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
