'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reporting } from '@/lib/site-data'
import { Disclosure } from '@/components/disclosure'
import { SignalRail } from '@/components/signal-rail'
import { InventoryLeadModule, LocalityModule, TrafficMixModule } from '@/components/intelligence-charts'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Metric = (typeof reporting.metrics)[number]

const INSIGHT_ID = 'ri-insight'

export function IntelligencePreview() {
  const [activeId, setActiveId] = useState<string>(reporting.metrics[0]!.id)
  const rootRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const active = reporting.metrics.find((metric) => metric.id === activeId) ?? reporting.metrics[0]!

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
          <div className="ri-chrome">
            <div className="ri-chrome-title">
              <p className="ri-chrome-product">{reporting.product}</p>
              <p className="ri-sample font-mono">{reporting.sampleEyebrow}</p>
            </div>
            <p className="ri-chrome-period font-mono">
              {reporting.reportKind} · {reporting.period}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 p-3 md:gap-3 md:p-4">
            <ul className="ri-kpis" aria-label="Monthly signals">
              {reporting.metrics.map((metric) => {
                const selected = activeId === metric.id
                return (
                  <li key={metric.id} className="min-w-0">
                    <button
                      type="button"
                      aria-pressed={selected}
                      aria-controls={INSIGHT_ID}
                      aria-label={`View insight for ${metric.label}`}
                      onClick={() => setActiveId(metric.id)}
                      className={`ri-kpi-tile${selected ? ' is-on' : ''}`}
                    >
                      <span className="ri-kpi-cat font-mono">{metric.category}</span>
                      <span className="ri-kpi-name">{metric.label}</span>
                      <span className="ri-kpi-value font-mono">{metric.value}</span>
                      <span className="ri-kpi-note">{metric.note}</span>
                      <span className="ri-kpi-cue" aria-hidden="true">
                        i
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <InsightPanel metric={active} />

            <div className="ri-modules">
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

function InsightPanel({ metric }: { metric: Metric }) {
  return (
    <div
      id={INSIGHT_ID}
      className="ri-insight"
      role="region"
      aria-labelledby="ri-insight-kicker"
      aria-live="polite"
    >
      <p id="ri-insight-kicker" className="ri-insight-kicker font-mono">
        The monthly read
      </p>
      <p className="ri-insight-head font-mono">
        {metric.label} · {metric.value}
      </p>
      <dl key={metric.id} className="ri-insight-grid">
        <div>
          <dt className="font-mono">What changed</dt>
          <dd>{metric.popout.changed}</dd>
        </div>
        <div>
          <dt className="font-mono">Why it matters</dt>
          <dd>{metric.popout.why}</dd>
        </div>
        <div>
          <dt className="font-mono">Next move</dt>
          <dd>{metric.popout.next}</dd>
        </div>
      </dl>
    </div>
  )
}
