'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reporting } from '@/lib/site-data'
import { reportingMatrix } from '@/lib/platform-data'
import { Disclosure } from '@/components/disclosure'
import { ReportingMatrix } from '@/components/reporting-matrix'
import { SignalRail } from '@/components/signal-rail'
import {
  AiVisibilityCharts,
  BuyerActionCharts,
  ExecutiveCharts,
  LocalityCharts,
  SearchContentCharts,
} from '@/components/intelligence-charts'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ReportView = (typeof reporting.views)[number]
type ReportMode = 'story' | 'matrix'

const modes = ['story', 'matrix'] as const
const views = reporting.views
const storyBeats = [
  {
    eyebrow: 'What changed',
    body: 'Non-branded research visibility improved, and inventory-pathway clicks rose.',
  },
  {
    eyebrow: 'Why it changed',
    body: 'Two Authority Experiences launched last period, with cleaner pathway tracking.',
  },
  {
    eyebrow: 'What comes next',
    body: 'Expand the winter-driving cluster and close the mobile form-start gap.',
  },
] as const
const decisionSteps = ['Changed.', 'Why.', 'Next.'] as const

function viewSlug(view: ReportView) {
  return view.replace(/\s+/g, '-')
}

function ExecutiveSummary() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border-l-4 border-proof bg-porcelain p-5 md:p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-proof-deep">
          Plain-English conclusion
        </p>
        <p className="mt-2 text-xl font-semibold leading-snug text-ink md:text-2xl text-pretty">
          Non-branded research visibility improved this period, driven primarily by two Authority
          Experiences. Local engagement in the north-side market strengthened, and inventory-pathway
          clicks from research pages increased.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {storyBeats.map((item, i) => (
          <article key={item.eyebrow} className="ri-beat border-2 border-ink bg-paper p-4 md:p-5">
            <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-proof-deep">
              <span className="ri-beat-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              {item.eyebrow}
            </p>
            <p className="mt-2 text-base font-semibold leading-snug text-ink md:text-lg text-pretty">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <ExecutiveCharts />
    </div>
  )
}

function GenericView({ view }: { view: ReportView }) {
  const content: Record<string, string> = {
    'Search and Content':
      'Which pages and buyer questions earned discovery, and which topics deserve investment next.',
    Locality: 'Where local visibility is strengthening, and which markets present opportunity.',
    'Buyer Actions':
      'How shoppers actually used the work — selections, comparisons, pathways, and contact actions.',
    'AI Visibility':
      'Identifiable AI referrals and observed visibility footprint — reported with honest limits.',
  }

  const conclusion = content[view]
  if (!conclusion) return null

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border-l-4 border-proof bg-porcelain p-5 md:p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-proof-deep">
          What this view answers
        </p>
        <p className="mt-2 text-xl font-semibold leading-snug text-ink md:text-2xl text-pretty">
          {conclusion}
        </p>
      </div>
      {view === 'Search and Content' ? <SearchContentCharts /> : null}
      {view === 'Locality' ? <LocalityCharts /> : null}
      {view === 'Buyer Actions' ? <BuyerActionCharts /> : null}
      {view === 'AI Visibility' ? <AiVisibilityCharts /> : null}
    </div>
  )
}

export function IntelligencePreview() {
  const [mode, setMode] = useState<ReportMode>('story')
  const [view, setView] = useState<ReportView>('Executive Summary')
  const rootRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const evidenceRef = useRef<HTMLDivElement>(null)
  const packetRef = useRef<HTMLSpanElement>(null)
  const modeTabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const viewTabRefs = useRef<Array<HTMLButtonElement | null>>([])

  useGSAP(
    () => {
      const root = rootRef.current
      const frame = frameRef.current
      const rule = ruleRef.current
      const evidence = evidenceRef.current
      const packet = packetRef.current
      if (!root || !frame || !rule || !evidence || !packet) return

      const beats = () => gsap.utils.toArray<HTMLElement>('.ri-beat', root)
      const steps = gsap.utils.toArray<HTMLElement>('.ri-step', root)
      const nodes = gsap.utils.toArray<HTMLElement>('.ri-step-node', root)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const complete = () => {
        gsap.set(rule, { scaleX: 1 })
        beats().forEach((el) => el.classList.add('is-on'))
        steps.forEach((el) => el.classList.add('is-on'))
        nodes.forEach((el) => el.classList.add('is-on'))
        packet.classList.add('is-settled')
        gsap.set(packet, { x: 0, y: 0, autoAlpha: 0 })
      }

      if (reduced) {
        complete()
        return
      }

      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(packet, { autoAlpha: 1, x: 0, y: 0 })
      steps.forEach((el) => el.classList.remove('is-on'))
      nodes.forEach((el) => el.classList.remove('is-on'))

      ScrollTrigger.create({
        trigger: frame,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(rule, { scaleX: 1, duration: 0.55, ease: 'power2.out', overwrite: 'auto' })
          beats().forEach((el, i) => {
            gsap.delayedCall(0.12 + i * 0.3, () => el.classList.add('is-on'))
          })
        },
      })

      ScrollTrigger.create({
        trigger: evidence,
        start: 'top 86%',
        once: true,
        onEnter: () => {
          const desktop = window.matchMedia('(min-width: 768px)').matches
          const travel = desktop
            ? { x: 8, y: 0, duration: 0.7 }
            : { x: 0, y: 10, duration: 0.7 }
          gsap.fromTo(
            packet,
            { autoAlpha: 1, x: desktop ? -8 : 0, y: desktop ? 0 : 0 },
            {
              ...travel,
              ease: 'power2.inOut',
              overwrite: 'auto',
              onComplete: () => {
                packet.classList.add('is-settled')
                gsap.to(packet, { autoAlpha: 0, duration: 0.2, overwrite: 'auto' })
                steps.forEach((el, i) => {
                  gsap.delayedCall(0.04 + i * 0.3, () => {
                    el.classList.add('is-on')
                    nodes[i]?.classList.add('is-on')
                  })
                })
              },
            },
          )
        },
      })

      ScrollTrigger.refresh()
    },
    { scope: rootRef },
  )

  const activateMode = (next: ReportMode, focus = false) => {
    flushSync(() => {
      setMode(next)
    })
    if (focus) {
      modeTabRefs.current[modes.indexOf(next)]?.focus()
    }
  }

  const activateView = (next: ReportView, focus = false) => {
    flushSync(() => {
      setView(next)
    })
    if (focus) {
      viewTabRefs.current[views.indexOf(next)]?.focus()
    }
  }

  const onModeKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = modes.length - 1
    let next = index
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    activateMode(modes[next]!, true)
  }

  const onViewKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = views.length - 1
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    activateView(views[next]!, true)
  }

  return (
    <section
      ref={rootRef}
      id="reporting"
      aria-labelledby="reporting-heading"
      className="scroll-mt-24 overflow-x-clip border-b border-border bg-alloy"
    >
      <div className="bg-stage">
        <div className="mx-auto max-w-[1280px] px-5 pt-14 pb-16 md:px-8 md:pt-16 md:pb-20 lg:pt-[4.5rem]">
          <SignalRail step={4} />
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-proof">
                {reporting.eyebrow}
              </p>
              <h2
                id="reporting-heading"
                className="mt-3 text-3xl font-semibold tracking-tight text-porcelain md:text-5xl text-balance"
              >
                {reporting.headline}
              </h2>
            </div>
            <p className="lede text-lg leading-relaxed text-[color:var(--on-ink-muted)] md:text-xl text-pretty lg:col-span-5 lg:pb-1">
              {reporting.supporting}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-[1] mx-auto max-w-[1280px] -mt-10 px-5 pb-14 md:-mt-12 md:px-8 md:pb-16">
        <div ref={frameRef} className="ri-frame overflow-hidden rounded-[8px] border-2 border-ink bg-paper shadow-[6px_6px_0_0_var(--color-ink)]">
          <span ref={ruleRef} className="ri-frame-rule" aria-hidden="true" />
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink bg-ink px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-lg font-semibold text-porcelain">Authomotive Intelligence</p>
              <span className="hidden h-6 w-px bg-stage-line md:block" aria-hidden="true" />
              <div role="tablist" aria-label="Reporting modes" aria-orientation="horizontal" className="flex gap-1.5">
                {modes.map((m, i) => {
                  const selected = mode === m
                  return (
                    <button
                      key={m}
                      ref={(el) => {
                        modeTabRefs.current[i] = el
                      }}
                      type="button"
                      role="tab"
                      id={`mode-tab-${m}`}
                      aria-selected={selected}
                      aria-controls={`mode-panel-${m}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => activateMode(m)}
                      onKeyDown={(event) => onModeKeyDown(event, i)}
                      className={`ri-tab flex min-h-[44px] items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-proof ${
                        selected
                          ? 'border-proof bg-stage-elevated text-stage-foreground'
                          : 'border-stage-line text-stage-muted'
                      }`}
                    >
                      <span
                        className={`ri-dot h-1.5 w-1.5 rounded-full ${selected ? 'bg-proof' : 'bg-stage-line'}`}
                        aria-hidden="true"
                      />
                      {reportingMatrix.modeLabels[m]}
                    </button>
                  )
                })}
              </div>
            </div>
            <span className="rounded-full border border-stage-line bg-stage-deep px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-stage-muted">
              {reporting.disclaimer}
            </span>
          </div>

          <div className="ri-stage">
            <div
              id="mode-panel-matrix"
              role="tabpanel"
              aria-labelledby="mode-tab-matrix"
              inert={mode !== 'matrix' ? true : undefined}
              aria-hidden={mode !== 'matrix'}
              className="p-5 md:p-7"
            >
              <ReportingMatrix />
            </div>

            <div
              id="mode-panel-story"
              role="tabpanel"
              aria-labelledby="mode-tab-story"
              inert={mode !== 'story' ? true : undefined}
              aria-hidden={mode !== 'story'}
              className="flex flex-col lg:flex-row"
            >
              <div
                role="tablist"
                aria-label="Report views"
                aria-orientation="vertical"
                className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-border bg-porcelain/50 p-3 lg:w-72 lg:flex-col lg:border-b-0 lg:border-r lg:p-4"
              >
                {views.map((v, i) => {
                  const selected = view === v
                  return (
                    <button
                      key={v}
                      ref={(el) => {
                        viewTabRefs.current[i] = el
                      }}
                      type="button"
                      role="tab"
                      id={`report-tab-${viewSlug(v)}`}
                      aria-selected={selected}
                      aria-controls="report-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => activateView(v)}
                      onKeyDown={(event) => onViewKeyDown(event, i)}
                      className={`ri-tab flex min-h-[48px] shrink-0 items-center gap-3 whitespace-nowrap rounded-md px-4 py-3 text-left text-base font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-proof-deep ${
                        selected
                          ? 'bg-stage-elevated font-semibold text-stage-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <span
                        className={`ri-dot h-2 w-2 shrink-0 rounded-full ${
                          selected ? 'bg-proof' : 'bg-border'
                        }`}
                        aria-hidden="true"
                      />
                      {v}
                    </button>
                  )
                })}
              </div>

              <div
                role="tabpanel"
                id="report-panel"
                aria-labelledby={`report-tab-${viewSlug(view)}`}
                className="flex-1 p-5 md:p-7"
              >
                {view === 'Executive Summary' ? <ExecutiveSummary /> : <GenericView view={view} />}
              </div>
            </div>
          </div>

          <div ref={evidenceRef} className="ri-proof border-t-2 border-ink">
            <p className="px-5 pt-5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-proof-deep md:px-6">
              {reporting.evidence.eyebrow}
            </p>
            <div
              className="ri-proof-split relative p-5 md:p-6"
              role="group"
              aria-label="Observed evidence and how Intelligence interprets it"
            >
              <article className="ri-observed flex h-full flex-col bg-paper">
                <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-proof-deep">
                  {reporting.evidence.observed.kicker}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
                  {reporting.evidence.observed.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty md:text-[0.9375rem]">
                  {reporting.evidence.observed.context}
                </p>
                <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                  {reporting.evidence.observed.metrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="border border-ink/15 border-l-[3px] border-l-proof bg-proof-soft px-3 py-3"
                    >
                      <dt className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-proof-deep">
                        {metric.label}
                      </dt>
                      <dd className="mt-1.5 text-lg font-semibold tracking-tight text-ink">
                        <span>{metric.before}</span>
                        <span className="sr-only"> to </span>
                        <span className="mx-1.5 text-proof-deep" aria-hidden="true">
                          →
                        </span>
                        <span>{metric.after}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-sm leading-relaxed text-ink text-pretty md:text-base">
                  {reporting.evidence.observed.interpretation}
                </p>
                <div className="mt-auto border-t border-ink/15 pt-3">
                  <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
                    {reporting.evidence.observed.source}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground text-pretty">
                    {reporting.evidence.observed.qualification}
                  </p>
                </div>
              </article>
              <div className="ri-bridge" aria-hidden="true">
                <span className="ri-bridge-line" />
                <span ref={packetRef} className="ri-packet" />
              </div>
              <article className="ri-decision flex h-full flex-col bg-paper">
                <span className="h-3 w-3 bg-ink" aria-hidden="true" />
                <p className="mt-4 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-proof-deep">
                  {reporting.evidence.decision.kicker}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
                  {decisionSteps.map((label) => (
                    <span key={label} className="ri-step">
                      {label}{' '}
                    </span>
                  ))}
                </h3>
                <div className="ri-step-route" aria-hidden="true">
                  {decisionSteps.map((label) => (
                    <span key={label} className="ri-step-node" />
                  ))}
                </div>
                <p className="mt-3 text-lg font-semibold leading-snug text-ink text-pretty">
                  {reporting.evidence.decision.lead}
                </p>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
                  {reporting.evidence.decision.body}
                </p>
              </article>
            </div>
          </div>
        </div>

        <blockquote className="mt-6 border-l-4 border-proof pl-4 text-xl font-semibold leading-snug text-ink md:text-3xl text-pretty">
          The goal is not another dashboard. It is a clearer decision.
        </blockquote>
        <div className="mt-5 max-w-2xl">
          <Disclosure title="Where the underlying data comes from">
            <p className="text-base leading-relaxed text-muted-foreground">
              The reporting framework can draw from Google Search Console, GA4, Semrush or
              DataForSEO, identifiable AI referral traffic, observed AI and AI Overview visibility,
              geographic and locality performance, page and query movement, engagement behavior, GTM
              and custom-event data, inventory-pathway actions, and advertising measurement signals.
              Not every AI answer or anonymous AI-assisted journey can be observed — we report the
              identifiable referrals and observed visibility footprint, not complete AI attribution.
            </p>
          </Disclosure>
        </div>
      </div>
    </section>
  )
}
