import type { Ref } from 'react'
import { reporting } from '@/lib/site-data'
import { InventoryLeadModule, LocalityModule, TrafficMixModule } from '@/components/intelligence-charts'

type Metric = (typeof reporting.metrics)[number]

const INSIGHT_ID = 'ri-insight'

export function IntelligenceCopy() {
  return (
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
      <p className="lede text-muted-foreground text-pretty lg:col-span-5 lg:pb-1">
        {reporting.supporting}
      </p>
    </div>
  )
}

export function IntelligenceQuote() {
  return (
    <blockquote className="mt-4 border-l-4 border-proof pl-4 text-xl font-semibold leading-snug text-ink md:text-3xl text-pretty">
      {reporting.quote}
    </blockquote>
  )
}

const insightSteps = [
  { key: 'changed', n: '01', label: 'WHAT CHANGED', tone: 'accent' },
  { key: 'why', n: '02', label: 'WHY IT MATTERS', tone: 'proof' },
  { key: 'next', n: '03', label: 'WHAT WE DO NEXT', tone: 'action' },
] as const

function InsightPanel({ metric }: { metric: Metric }) {
  const copy = {
    changed: metric.popout.changed,
    why: metric.popout.why,
    next: metric.popout.next,
  }

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
      <div key={metric.id} className="ri-insight-grid">
        {insightSteps.map((step) => (
          <article key={step.key} className="ri-insight-card" data-tone={step.tone}>
            <p className="ri-insight-step font-mono">
              <span>{step.n}</span>
              <span aria-hidden="true"> · </span>
              {step.label}
            </p>
            <p className="ri-insight-body">{copy[step.key]}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export function IntelligenceFrame({
  activeId = reporting.metrics[0]!.id,
  onSelect,
  frameRef,
  ruleRef,
}: {
  activeId?: string
  onSelect?: (id: string) => void
  frameRef?: Ref<HTMLDivElement>
  ruleRef?: Ref<HTMLSpanElement>
}) {
  const active = reporting.metrics.find((metric) => metric.id === activeId) ?? reporting.metrics[0]!

  return (
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
        <div className="ri-exec">
          <p className="ri-exec-label font-mono">{reporting.executive.label}</p>
          <p className="ri-exec-copy">{reporting.executive.body}</p>
        </div>
        <ul className="ri-kpis" aria-label="Monthly results">
          {reporting.metrics.map((metric) => {
            const selected = activeId === metric.id
            return (
              <li key={metric.id} className="min-w-0">
                <button
                  type="button"
                  aria-pressed={selected}
                  aria-controls={INSIGHT_ID}
                  aria-label={`View insight for ${metric.label}`}
                  onClick={onSelect ? () => onSelect(metric.id) : undefined}
                  data-tone={metric.tone}
                  className={`ri-kpi-tile${selected ? ' is-on' : ''}`}
                >
                  <span className="ri-kpi-cat font-mono">{metric.category}</span>
                  <span className="ri-kpi-name">{metric.label}</span>
                  <span
                    className={`ri-kpi-value font-mono${metric.value.startsWith('+') ? ' is-up' : ''}`}
                  >
                    {metric.value}
                  </span>
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
  )
}
