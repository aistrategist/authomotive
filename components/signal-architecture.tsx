'use client'

import { useState } from 'react'
import { measurement } from '@/lib/site-data'
import { Disclosure } from '@/components/disclosure'

/**
 * Interactive signal map: shopper actions on the left, the measurement
 * layer in the center, reporting and decisions on the destination side.
 * Selecting a shopper action lights its full path in Lime; the resulting
 * business decision carries the Orange action color.
 */
export function SignalArchitecture() {
  const [selected, setSelected] = useState(0)
  const actionCount = measurement.buyerActions.length

  // Center layer and destination split from approved copy
  const measurementLayer = measurement.destinations.slice(0, 2) // event definitions, GA4/GTM
  const reportingDest = measurement.destinations.slice(2, 4) // advertising, Intelligence
  const decisionDest = measurement.destinations[4] // future content and workflow decisions

  return (
    <section id="measurement" aria-labelledby="measurement-heading" className="scroll-mt-20 border-b border-border">
      <div className="mx-auto max-w-[1320px] px-5 py-12 md:px-8 md:py-16">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {measurement.eyebrow}
          </p>
          <h2
            id="measurement-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {measurement.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {measurement.supporting}
          </p>
        </div>

        {/* The signal map — one connected three-stage horizontal system on desktop */}
        <div className="mt-9 lg:grid lg:grid-cols-[1.1fr_56px_1fr_56px_1.1fr] lg:items-center md:mt-11">
          {/* Shopper actions */}
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
              What shoppers do
            </p>
            <div className="mt-3 flex flex-col gap-1.5" role="tablist" aria-label="Shopper actions" aria-orientation="vertical">
              {measurement.buyerActions.map((action, i) => {
                const isSelected = selected === i
                return (
                  <button
                    key={action}
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls="signal-map-path"
                    onClick={() => setSelected(i)}
                    className={`lift flex min-h-[44px] items-center gap-3 rounded-lg border-2 px-4 py-2.5 text-left text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-deep ${
                      isSelected
                        ? 'border-signal-deep bg-lime/25 font-semibold text-ink'
                        : 'border-border bg-paper text-ink hover:border-fog'
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors ${
                        isSelected ? 'bg-lime ring-2 ring-signal-deep' : 'bg-border'
                      }`}
                      aria-hidden="true"
                    />
                    {action}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Curved connectors: actions → measurement layer (desktop only) */}
          <div className="hidden h-full min-h-[300px] lg:block" aria-hidden="true">
            <svg
              className="h-full w-full"
              viewBox="0 0 56 500"
              preserveAspectRatio="none"
              fill="none"
            >
              {measurement.buyerActions.map((_, i) => {
                const y = ((i + 0.5) / actionCount) * 500
                const isSelected = selected === i
                return (
                  <path
                    key={i}
                    d={`M0 ${y} C 28 ${y}, 28 250, 56 250`}
                    stroke={isSelected ? 'var(--signal-deep)' : 'var(--border)'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className={isSelected ? 'signal-dash' : ''}
                    vectorEffect="non-scaling-stroke"
                  />
                )
              })}
            </svg>
          </div>

          {/* Mobile connector */}
          <div className="flex justify-center py-2 lg:hidden" aria-hidden="true">
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <path d="M8 1v18m0 0l-5-5m5 5l5-5" stroke="var(--signal-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Measurement layer — the center */}
          <div id="signal-map-path" role="tabpanel" aria-label="Measurement layer">
            <div className="rounded-xl border-2 border-signal-deep bg-porcelain p-4 md:p-5">
              <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
                The measurement layer
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {measurementLayer.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-signal-deep/30 bg-paper px-4 py-3 text-base font-semibold text-ink"
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime ring-2 ring-signal-deep/60" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
              <p key={selected} className="panel-swap mt-3 min-h-[44px] rounded-md bg-paper px-4 py-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-signal-deep">Captured: </span>
                &ldquo;{measurement.buyerActions[selected]}&rdquo; become named, documented events.
              </p>
            </div>
          </div>

          {/* Connector: measurement → destinations (desktop only) */}
          <div className="hidden h-full min-h-[300px] lg:block" aria-hidden="true">
            <svg className="h-full w-full" viewBox="0 0 56 500" preserveAspectRatio="none" fill="none">
              {[0, 1, 2].map((i) => {
                const y = ((i + 0.5) / 3) * 500
                return (
                  <path
                    key={i}
                    d={`M0 250 C 28 250, 28 ${y}, 56 ${y}`}
                    stroke="var(--signal-deep)"
                    strokeWidth={2}
                    className="signal-dash"
                    vectorEffect="non-scaling-stroke"
                  />
                )
              })}
            </svg>
          </div>

          {/* Mobile connector */}
          <div className="flex justify-center py-2 lg:hidden" aria-hidden="true">
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <path d="M8 1v18m0 0l-5-5m5 5l5-5" stroke="var(--signal-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Reporting and decisions */}
          <div className="flex flex-col gap-2.5">
            <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
              Where those actions become useful
            </p>
            {reportingDest.map((dest) => (
              <div
                key={dest}
                className="flex items-center gap-3 rounded-lg border border-border bg-porcelain px-4 py-3 text-base font-semibold text-ink"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime ring-2 ring-signal-deep/60" aria-hidden="true" />
                {dest}
              </div>
            ))}
            {/* The resulting business action — Orange, entering the system as the endpoint */}
            <div className="flex items-center gap-3 rounded-lg border-2 border-action bg-paper px-4 py-3 text-base font-bold text-ink">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0" aria-hidden="true">
                <path d="M2 9h12m0 0l-4-4m4 4l-4 4" stroke="var(--action)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {decisionDest}
            </div>
          </div>
        </div>

        {/* Implementation rail — a compact two/three-column disclosure layout, not stacked full width */}
        <div className="mt-9 md:mt-11">
          <p className="text-base font-semibold uppercase tracking-wide text-ink">
            How it is implemented
          </p>
          <div className="mt-3 grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
            {measurement.implementationRows.map((row) => (
              <Disclosure key={row.title} title={row.title}>
                <p className="text-base leading-relaxed text-muted-foreground">{row.body}</p>
              </Disclosure>
            ))}
          </div>
        </div>

        <blockquote className="mt-8 border-l-4 border-lime pl-4 text-xl font-semibold leading-snug text-ink md:text-2xl text-pretty">
          If an action matters to the dealership, it deserves a clear measurement plan.
        </blockquote>
      </div>
    </section>
  )
}
