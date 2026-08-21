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
        {[
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
        ].map((item) => (
          <article key={item.eyebrow} className="border-2 border-ink bg-paper p-4 md:p-5">
            <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-proof-deep">
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

type ReportMode = 'story' | 'matrix'

export function IntelligencePreview() {
  const [mode, setMode] = useState<ReportMode>('story')
  const [view, setView] = useState<ReportView>('Executive Summary')

  return (
    <section id="reporting" aria-labelledby="reporting-heading" className="scroll-mt-24 overflow-x-clip border-b border-border bg-alloy">
      <div className="bg-stage">
        <div className="mx-auto max-w-[1280px] px-5 pt-14 pb-16 md:px-8 md:pt-16 md:pb-20 lg:pt-[4.5rem]">
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

      <div className="relative z-[1] mx-auto max-w-[1280px] -mt-10 px-5 pb-14 md:-mt-12 md:px-8 md:pb-16">
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
              className="flex-1 p-5 md:p-7"
            >
              <div key={view} className="panel-swap">
                {view === 'Executive Summary' ? <ExecutiveSummary /> : <GenericView view={view} />}
              </div>
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
        <SectionHandoff
          eyebrow="SEE THE MEASUREMENT FOUNDATION"
          label="See What Feeds Authomotive Intelligence"
          href="#measurement"
          theme="light"
          accent="evidence"
          className="mt-6"
        />
      </div>
    </section>
  )
}
