'use client'

import { useEffect, useId, useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reporting } from '@/lib/site-data'
import { Disclosure } from '@/components/disclosure'
import { SignalRail } from '@/components/signal-rail'
import { InventoryLeadModule, LocalityModule, TrafficMixModule } from '@/components/intelligence-charts'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Metric = (typeof reporting.metrics)[number]

export function IntelligencePreview() {
  const [openId, setOpenId] = useState<string | null>(null)
  const rootRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const mosaicRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const popoutRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const frame = frameRef.current
      const rule = ruleRef.current
      if (!root || !frame || !rule) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(rule, { scaleX: 1 })
        return
      }

      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })
      ScrollTrigger.create({
        trigger: frame,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(rule, { scaleX: 1, duration: 0.55, ease: 'power2.out', overwrite: 'auto' })
        },
      })
    },
    { scope: rootRef },
  )

  useEffect(() => {
    if (!openId) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const popout = popoutRef.current
    if (popout && !reduced) {
      gsap.fromTo(popout, { y: 4, opacity: 0.72 }, { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out', overwrite: 'auto' })
    }
    popout?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        const id = openId
        setOpenId(null)
        triggerRefs.current[id]?.focus()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (mosaicRef.current?.contains(target)) return
      setOpenId(null)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [openId])

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <section
      ref={rootRef}
      id="reporting"
      aria-labelledby="reporting-heading"
      className="ri-band scroll-mt-24 overflow-x-clip border-b border-border"
    >
      <SignalRail step={4} />
      <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-proof-deep">
              {reporting.eyebrow}
            </p>
            <h2
              id="reporting-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
            >
              {reporting.headline}
            </h2>
          </div>
          <p className="lede text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty lg:col-span-5 lg:pb-1">
            {reporting.supporting}
          </p>
        </div>

        <div
          ref={frameRef}
          className="ri-frame mt-10 overflow-visible rounded-[8px] border-2 border-ink bg-paper shadow-[6px_6px_0_0_var(--proof)] md:mt-12"
        >
          <span ref={ruleRef} className="ri-frame-rule" aria-hidden="true" />
          <div className="ri-chrome flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-stage-elevated px-5 py-3.5 md:px-6">
            <div className="min-w-0">
              <p className="text-base font-semibold text-porcelain md:text-lg">{reporting.product}</p>
              <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-wider text-stage-muted md:text-xs">
                {reporting.reportKind} · {reporting.period}
              </p>
              <p className="ri-sample font-mono">{reporting.sampleEyebrow}</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 p-5 md:p-7">
            <div ref={mosaicRef} className="ri-mosaic flex flex-col gap-5">
              {reporting.groups.map((group) => {
                const metrics = reporting.metrics.filter((metric) => metric.group === group.id)
                return (
                  <div key={group.id}>
                    <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink">
                      {group.label}
                    </p>
                    <ul
                      className={`mt-2 grid gap-2 ${
                        group.id === 'traffic' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'
                      }`}
                    >
                      {metrics.map((metric, index) => (
                        <li
                          key={metric.id}
                          className={`ri-kpi relative min-w-0 ${openId === metric.id ? 'max-md:col-span-2' : ''}`}
                        >
                          <MetricTile
                            metric={metric}
                            open={openId === metric.id}
                            onToggle={() => toggle(metric.id)}
                            buttonRef={(el) => {
                              triggerRefs.current[metric.id] = el
                            }}
                          />
                          {openId === metric.id ? (
                            <MetricPopout
                              metric={metric}
                              alignMdEnd={index % 2 === 1}
                              alignLgEnd={group.id === 'traffic' ? index >= 2 : index % 2 === 1}
                              panelRef={popoutRef}
                              onClose={() => {
                                setOpenId(null)
                                triggerRefs.current[metric.id]?.focus()
                              }}
                            />
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            <div className="ri-modules grid gap-3 md:grid-cols-2">
              <TrafficMixModule />
              <InventoryLeadModule />
              <LocalityModule />
            </div>
          </div>
        </div>

        <blockquote className="mt-6 border-l-4 border-proof pl-4 text-xl font-semibold leading-snug text-ink md:text-3xl text-pretty">
          {reporting.quote}
        </blockquote>
        <div className="mt-5 max-w-2xl">
          <Disclosure title="Where the underlying data comes from">
            <p className="text-base leading-relaxed text-muted-foreground">
              {reporting.sourcesLine} The reporting framework can draw from Google Search Console,
              GA4, Semrush or DataForSEO, identifiable AI referral traffic, observed AI and AI
              Overview visibility, geographic and locality performance, page and query movement,
              engagement behavior, GTM and custom-event data, inventory-pathway actions, and
              advertising measurement signals. Not every AI answer or anonymous AI-assisted journey
              can be observed. We report the identifiable referrals and observed visibility
              footprint, not complete AI attribution.
            </p>
          </Disclosure>
        </div>
      </div>
    </section>
  )
}

function MetricTile({
  metric,
  open,
  onToggle,
  buttonRef,
}: {
  metric: Metric
  open: boolean
  onToggle: () => void
  buttonRef: (el: HTMLButtonElement | null) => void
}) {
  const popoutId = `ri-popout-${metric.id}`

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={open}
      aria-controls={popoutId}
      onClick={onToggle}
      className={`ri-kpi-tile relative w-full border-2 border-ink bg-paper px-3 py-3 pr-16 text-left md:px-4 md:pr-[4.5rem] ${
        open ? 'is-on' : ''
      }`}
    >
      <span className="ri-kpi-cue pointer-events-none absolute top-2 right-2 flex items-center gap-1">
        <span
          className="ri-kpi-cue-mark flex size-4 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold leading-none text-white"
          aria-hidden="true"
        >
          i
        </span>
        <span className="font-mono text-[0.5625rem] font-semibold uppercase tracking-[0.1em]">Click</span>
      </span>
      <span className="sr-only">Opens a detail for this metric. </span>
      <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.1em] text-ink">{metric.label}</p>
      <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-ink">{metric.value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{metric.note}</p>
    </button>
  )
}

function MetricPopout({
  metric,
  alignMdEnd,
  alignLgEnd,
  panelRef,
  onClose,
}: {
  metric: Metric
  alignMdEnd: boolean
  alignLgEnd: boolean
  panelRef: RefObject<HTMLDivElement | null>
  onClose: () => void
}) {
  const titleId = useId()
  const popoutId = `ri-popout-${metric.id}`
  const observed = metric.id === 'organic' ? reporting.evidence.observed : null

  return (
    <div
      ref={panelRef}
      id={popoutId}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={`ri-popout mt-2 w-full outline-none md:absolute md:z-20 md:mt-2 md:w-[min(22rem,calc(100vw-3rem))] ${
        alignMdEnd ? 'md:right-0 md:left-auto' : 'md:left-0'
      } ${alignLgEnd ? 'lg:right-0 lg:left-auto' : 'lg:left-0 lg:right-auto'}`}
    >
      <div className="border-2 border-ink bg-paper p-4 shadow-[4px_4px_0_0_var(--proof)] md:p-5">
        <div className="flex items-start justify-between gap-3">
          <p id={titleId} className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-ink">
            {metric.label}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground hover:text-ink"
          >
            Close
          </button>
        </div>
        <ol className="mt-3 flex flex-col gap-2.5">
          {[
            { n: '01', label: 'Changed', body: metric.popout.changed },
            { n: '02', label: 'Why', body: metric.popout.why },
            { n: '03', label: 'Next', body: metric.popout.next },
          ].map((beat) => (
            <li key={beat.n}>
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-ink">
                {beat.n} · {beat.label}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink">{beat.body}</p>
            </li>
          ))}
        </ol>
        {observed ? (
          <div className="mt-4 border-t border-ink/15 pt-3">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-ink">
              {observed.kicker}
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">{observed.title}</p>
            <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {observed.metrics.map((item) => (
                <div key={item.id}>
                  <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-ink">
                    {item.label}
                  </dt>
                  <dd className="font-mono text-sm font-semibold text-ink">
                    {item.before}
                    <span className="mx-1 text-muted-foreground" aria-hidden="true">
                      →
                    </span>
                    {item.after}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{observed.source}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
