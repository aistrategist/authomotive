'use client'

import { useState } from 'react'
import { reporting } from '@/lib/site-data'
import { reportingMatrix } from '@/lib/platform-data'
import { Disclosure } from '@/components/disclosure'
import { ReportingMatrix } from '@/components/reporting-matrix'
import { SignalRail } from '@/components/signal-rail'
import { SectionHandoff } from '@/components/section-handoff'
import {
  AiVisibilityCharts,
  BuyerActionCharts,
  ExecutiveCharts,
  LocalityCharts,
  SearchContentCharts,
} from '@/components/intelligence-charts'

type ReportView = (typeof reporting.views)[number]

function ExecutiveSummary() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border-l-4 border-lime bg-porcelain p-5 md:p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
          Plain-English conclusion
        </p>
        <p className="mt-2 text-xl font-semibold leading-snug text-ink md:text-2xl text-pretty">
          Non-branded research visibility improved this period, driven primarily by two Authority
          Experiences. Local engagement in the north-side market strengthened, and inventory-pathway
          clicks from research pages increased.
        </p>
      </div>

      <ExecutiveCharts />

      {/* Supporting groups as one connected grid — a single structural rail instead of four separate cards */}
      <div className="grid gap-x-8 gap-y-5 rounded-lg border border-border p-5 md:grid-cols-2 md:p-6">
        <div className="border-t border-border pt-4 first:border-t-0 md:border-t-0 md:pt-0">
          <p className="text-base font-semibold text-ink">What improved</p>
          <ul className="mt-2.5 flex flex-col gap-1.5 text-base leading-relaxed text-muted-foreground">
            <li>Non-branded discovery on three-row SUV research topics</li>
            <li>Locality visibility in two priority markets</li>
            <li>Research-to-inventory movement from guide pages</li>
          </ul>
        </div>
        <div className="border-t border-border pt-4 md:border-t-0 md:pt-0">
          <p className="text-base font-semibold text-ink">What contributed</p>
          <ul className="mt-2.5 flex flex-col gap-1.5 text-base leading-relaxed text-muted-foreground">
            <li>Two new Authority Experiences launched last period</li>
            <li>Refreshed AI Discovery page structure</li>
            <li>Cleaner inventory-pathway event tracking</li>
          </ul>
        </div>
        <div className="border-t border-border pt-4">
          <p className="text-base font-semibold text-ink">What to watch</p>
          <ul className="mt-2.5 flex flex-col gap-1.5 text-base leading-relaxed text-muted-foreground">
            <li>A competing dealer group publishing similar comparison content</li>
            <li>Form-start completion behavior on mobile</li>
          </ul>
        </div>
        <div className="border-t border-border pt-4">
          <p className="text-base font-semibold text-accent-deep">
            Next opportunities the evidence supports
          </p>
          <ul className="mt-2.5 flex flex-col gap-1.5 text-base leading-relaxed text-ink">
            <li>Expand the winter-driving research cluster</li>
            <li>Add comparison guidance for the mid-size segment</li>
            <li>Close the mobile form-start measurement gap</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function GenericView({ view }: { view: ReportView }) {
  const content: Record<string, { conclusion: string; evidence: string[] }> = {
    'Search and Content': {
      conclusion:
        'Which pages and buyer questions earned discovery, and which topics deserve investment next.',
      evidence: [
        'Non-branded query growth and page-level contribution',
        'New buyer questions the dealership is beginning to earn',
        'Content that should be protected, refreshed, or expanded',
      ],
    },
    Locality: {
      conclusion: 'Where local visibility is strengthening, and which markets present opportunity.',
      evidence: [
        'Geographic visibility movement across priority markets',
        'Local queries where the dealership gained or lost ground',
        'Market-level engagement differences that inform local content',
      ],
    },
    'Buyer Actions': {
      conclusion:
        'How shoppers actually used the work — selections, comparisons, pathways, and contact actions.',
      evidence: [
        'Research selections and comparison engagement',
        'Inventory-pathway clicks and digital retailing starts',
        'Calls, form starts, and successful submissions',
      ],
    },
    'AI Visibility': {
      conclusion:
        'Identifiable AI referrals and observed visibility footprint — reported with honest limits.',
      evidence: [
        'Identifiable AI referral traffic reaching the website',
        'Observed AI and AI Overview visibility where it can be seen',
        'Movement in the dealership\u2019s first-party discovery foundation',
      ],
    },
  }

  const data = content[view]
  if (!data) return null

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border-l-4 border-lime bg-porcelain p-5 md:p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
          What this view answers
        </p>
        <p className="mt-2 text-xl font-semibold leading-snug text-ink md:text-2xl text-pretty">
          {data.conclusion}
        </p>
      </div>
      {view === 'Search and Content' ? <SearchContentCharts /> : null}
      {view === 'Locality' ? <LocalityCharts /> : null}
      {view === 'Buyer Actions' ? <BuyerActionCharts /> : null}
      {view === 'AI Visibility' ? <AiVisibilityCharts /> : null}
      <ul className="flex flex-col gap-2">
        {data.evidence.map((item) => (
          <li key={item} className="flex items-start gap-3 rounded-lg border border-border p-4 text-base leading-relaxed text-ink">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-deep" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

type ReportMode = 'story' | 'matrix'

export function IntelligencePreview() {
  const [mode, setMode] = useState<ReportMode>('story')
  const [view, setView] = useState<ReportView>('Executive Summary')

  return (
    <section id="reporting" aria-labelledby="reporting-heading" className="scroll-mt-24 overflow-x-clip border-b border-border bg-alloy">
      <div className="bg-stage">
        <div className="mx-auto max-w-[1280px] px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28 lg:pt-[7rem]">
          <SignalRail tone="lime" />
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-lime">
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

      <div className="relative z-[1] mx-auto max-w-[1280px] -mt-12 px-5 pb-14 md:-mt-16 md:px-8 md:pb-16 lg:pb-20">
        {/* The reporting interface — mode navigation and identification in one compact top bar */}
        <div className="overflow-hidden rounded-[8px] border-2 border-ink bg-paper shadow-[6px_6px_0_0_var(--color-ink)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink bg-ink px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-lg font-semibold text-porcelain">Authomotive Intelligence</p>
              {/* Separator distinguishing the title from mode navigation */}
              <span className="hidden h-6 w-px bg-stage-line md:block" aria-hidden="true" />
              {/* Primary mode selection — manual only, no rotation */}
              <div role="tablist" aria-label="Reporting modes" className="flex gap-1.5">
                {(['story', 'matrix'] as const).map((m) => {
                  const selected = mode === m
                  return (
                    <button
                      key={m}
                      role="tab"
                      id={`mode-tab-${m}`}
                      aria-selected={selected}
                      aria-controls="mode-panel"
                      onClick={() => setMode(m)}
                      className={`flex min-h-[44px] items-center gap-2 rounded-md border px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        selected
                          ? 'border-proof bg-stage-elevated text-stage-foreground'
                          : 'border-stage-line text-stage-muted hover:text-stage-foreground'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${selected ? 'bg-proof' : 'bg-stage-line'}`}
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

          <div id="mode-panel" role="tabpanel" aria-labelledby={`mode-tab-${mode}`} className={mode === 'matrix' ? 'p-5 md:p-7' : 'hidden'}>
            {mode === 'matrix' && <ReportingMatrix />}
          </div>

          <div className={mode === 'story' ? 'flex flex-col lg:flex-row' : 'hidden'}>
            {/* View navigation */}
            <div
              role="tablist"
              aria-label="Report views"
              aria-orientation="vertical"
              className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-border bg-porcelain/50 p-3 lg:w-72 lg:flex-col lg:border-b-0 lg:border-r lg:p-4"
            >
              {reporting.views.map((v) => {
                const selected = view === v
                return (
                  <button
                    key={v}
                    role="tab"
                    id={`report-tab-${v.replace(/\s+/g, '-')}`}
                    aria-selected={selected}
                    aria-controls="report-panel"
                    onClick={() => setView(v)}
                    className={`flex min-h-[48px] shrink-0 items-center gap-3 whitespace-nowrap rounded-md px-4 py-3 text-left text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-deep ${
                      selected
                        ? 'bg-stage-elevated font-semibold text-stage-foreground'
                        : 'text-muted-foreground hover:bg-porcelain hover:text-ink'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full transition-colors ${
                        selected ? 'bg-proof' : 'bg-border'
                      }`}
                      aria-hidden="true"
                    />
                    {v}
                  </button>
                )
              })}
            </div>

            {/* Report content */}
            <div
              role="tabpanel"
              id="report-panel"
              aria-labelledby={`report-tab-${view.replace(/\s+/g, '-')}`}
              className="min-h-[460px] flex-1 p-5 md:p-7"
            >
              <div key={view} className="panel-swap">
                {view === 'Executive Summary' ? <ExecutiveSummary /> : <GenericView view={view} />}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="w-full max-w-2xl">
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
          <blockquote className="border-l-4 border-lime pl-4 text-xl font-semibold leading-snug text-ink md:text-2xl text-pretty">
            The goal is not another dashboard. It is a clearer decision.
          </blockquote>
        </div>
        <SectionHandoff
          eyebrow="SEE THE MEASUREMENT FOUNDATION"
          label="See What Feeds Authomotive Intelligence"
          href="#measurement"
          theme="light"
          accent="evidence"
          className="mt-8"
        />
      </div>
    </section>
  )
}
