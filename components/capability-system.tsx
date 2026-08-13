'use client'

import { useState } from 'react'
import { capabilitySystem } from '@/lib/site-data'
import { Disclosure } from '@/components/disclosure'

/** Distinct visual signature for each capability state. */
function CapabilityVisual({ id }: { id: string }) {
  if (id === 'get-found') {
    // A page taking shape: answer-first structure flowing toward inventory
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-porcelain p-4" aria-hidden="true">
        <div className="h-3 w-3/4 rounded-sm bg-ink/80" />
        <div className="h-2 w-1/2 rounded-sm bg-fog/50" />
        <div className="mt-1 rounded-md border-l-4 border-lime bg-paper p-2.5">
          <div className="h-2 w-11/12 rounded-sm bg-ink/30" />
          <div className="mt-1.5 h-2 w-2/3 rounded-sm bg-ink/30" />
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-6 flex-1 rounded-md border border-border bg-paper" />
          <div className="h-6 flex-1 rounded-md border border-signal-deep/50 bg-lime/30" />
          <div className="h-6 flex-1 rounded-md border border-border bg-paper" />
        </div>
        <div className="mt-1 flex items-center justify-end gap-1.5">
          <div className="h-2 w-24 rounded-sm bg-fog/40" />
          <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
            <path d="M1 6h20m0 0l-4-4m4 4l-4 4" stroke="var(--action)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    )
  }
  if (id === 'know-working') {
    // Signals converging into one rising story
    return (
      <div className="flex items-end gap-1.5 rounded-lg border border-border bg-porcelain p-4" aria-hidden="true">
        {[32, 40, 36, 48, 56, 64, 60, 74].map((h, i) => (
          <div
            key={i}
            className={`w-full rounded-t-sm ${i >= 6 ? 'bg-lime ring-1 ring-signal-deep/40' : 'bg-ink/15'}`}
            style={{ height: `${h}px` }}
          />
        ))}
        <div className="ml-2 shrink-0 self-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h16m0 0l-5-5m5 5l-5 5" stroke="var(--action)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    )
  }
  // track-matters: an event stream lighting up
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-porcelain p-4" aria-hidden="true">
      {['w-2/3', 'w-3/4', 'w-1/2'].map((w, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${i < 2 ? 'bg-lime ring-1 ring-signal-deep/50' : 'bg-fog/40'}`} />
          <div className={`h-2.5 rounded-sm ${w} ${i < 2 ? 'bg-ink/50' : 'bg-fog/30'}`} />
          <span className="ml-auto font-mono text-[10px] text-signal-deep">{i < 2 ? 'captured' : 'planned'}</span>
        </div>
      ))}
    </div>
  )
}

const nextSteps: Record<string, { href: string; label: string }> = {
  'get-found': { href: '#authority-experiences', label: 'See the pages in action' },
  'know-working': { href: '#reporting', label: 'See the reporting' },
  'track-matters': { href: '#measurement', label: 'See the measurement' },
}

function JobMotif({ id, tone }: { id: string; tone: 'ink' | 'lime' | 'action' }) {
  const stroke = tone === 'ink' ? 'var(--lime)' : tone === 'lime' ? 'var(--ink)' : 'var(--ink)'
  const accent = tone === 'ink' ? 'var(--lime)' : tone === 'lime' ? 'var(--action)' : 'var(--lime)'

  if (id === 'get-found') {
    return (
      <svg width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden="true">
        <path d="M4 32 C16 32, 18 8, 32 8 S48 28, 52 12" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <circle cx="4" cy="32" r="3" fill={accent} />
        <circle cx="52" cy="12" r="3" fill={stroke} />
      </svg>
    )
  }
  if (id === 'know-working') {
    return (
      <svg width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden="true">
        {[10, 16, 14, 22, 28].map((h, i) => (
          <rect key={i} x={6 + i * 10} y={36 - h} width="6" height={h} fill={i === 4 ? accent : stroke} opacity={i === 4 ? 1 : 0.45} />
        ))}
      </svg>
    )
  }
  return (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden="true">
      <path d="M8 20 H48" stroke={stroke} strokeWidth="1.5" />
      <circle cx="8" cy="20" r="4" fill={stroke} />
      <circle cx="28" cy="20" r="4" fill={accent} />
      <circle cx="48" cy="20" r="4" fill={stroke} />
    </svg>
  )
}

const jobLooks = [
  {
    card: 'border-ink bg-ink text-porcelain',
    shadow: 'shadow-[6px_6px_0_0_var(--lime)]',
    shadowOn: 'shadow-[8px_8px_0_0_var(--lime)]',
    eyebrow: 'text-lime',
    number: 'text-porcelain/20',
    arrow: 'text-lime',
    focus: 'focus-visible:outline-lime',
    pointer: 'bg-lime',
    tone: 'ink' as const,
  },
  {
    card: 'border-ink bg-lime text-ink',
    shadow: 'shadow-[6px_6px_0_0_var(--action)]',
    shadowOn: 'shadow-[8px_8px_0_0_var(--action)]',
    eyebrow: 'text-ink',
    number: 'text-ink/15',
    arrow: 'text-action',
    focus: 'focus-visible:outline-ink',
    pointer: 'bg-action',
    tone: 'lime' as const,
  },
  {
    card: 'border-ink bg-action text-ink',
    shadow: 'shadow-[6px_6px_0_0_var(--lime)]',
    shadowOn: 'shadow-[8px_8px_0_0_var(--lime)]',
    eyebrow: 'text-ink',
    number: 'text-ink/15',
    arrow: 'text-lime',
    focus: 'focus-visible:outline-ink',
    pointer: 'bg-lime',
    tone: 'action' as const,
  },
] as const

export function CapabilitySystem() {
  const [activeId, setActiveId] = useState(capabilitySystem.capabilities[0].id)
  const active =
    capabilitySystem.capabilities.find((c) => c.id === activeId) ??
    capabilitySystem.capabilities[0]
  const activeIndex = capabilitySystem.capabilities.findIndex((c) => c.id === activeId)
  const nextStep = nextSteps[active.id]

  return (
    <section id="capabilities" aria-labelledby="capabilities-heading" className="relative scroll-mt-24 border-b border-border bg-paper">
      <span className="absolute left-0 top-0 h-[3px] w-24 bg-lime" aria-hidden="true" />
      <div className="mx-auto max-w-[1320px] px-5 py-12 md:px-8 md:py-16">
        {/* Editorial introduction */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {capabilitySystem.eyebrow}
          </p>
          <h2
            id="capabilities-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {capabilitySystem.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {capabilitySystem.supporting}
          </p>
        </div>

        {/* Three-job selector — true square feature cards on desktop */}
        <div
          role="tablist"
          aria-label="Capabilities"
          className="mt-8 flex flex-col items-stretch gap-5 lg:mt-10 lg:flex-row lg:justify-center lg:gap-5"
        >
          {capabilitySystem.capabilities.map((cap, i) => {
            const selected = cap.id === activeId
            const job = jobLooks[i]
            return (
              <button
                key={cap.id}
                type="button"
                role="tab"
                id={`cap-tab-${cap.id}`}
                aria-selected={selected}
                aria-controls={`cap-panel-${active.id}`}
                onClick={() => setActiveId(cap.id)}
                onKeyDown={(e) => {
                  const last = capabilitySystem.capabilities.length - 1
                  let next = i
                  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i === last ? 0 : i + 1
                  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i === 0 ? last : i - 1
                  else if (e.key === 'Home') next = 0
                  else if (e.key === 'End') next = last
                  else return
                  e.preventDefault()
                  const id = capabilitySystem.capabilities[next].id
                  setActiveId(id)
                  document.getElementById(`cap-tab-${id}`)?.focus()
                }}
                className={`job-card relative flex min-h-[220px] w-full min-w-0 flex-col rounded-[8px] border-2 px-5 py-5 text-left lg:aspect-square lg:h-auto lg:min-h-0 lg:max-w-[360px] lg:flex-1 lg:px-6 ${job.card} ${selected ? job.shadowOn : job.shadow} ${job.focus} focus-visible:outline-2 focus-visible:outline-offset-2`}
              >
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[6px]" aria-hidden="true">
                  <span className={`absolute right-3 top-2 font-mono text-[4.5rem] font-bold leading-none ${job.number}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
                <span className={`relative z-[1] font-mono text-[11px] font-medium uppercase tracking-[0.16em] ${job.eyebrow}`}>
                  Job {i + 1} · {cap.brandedName}
                </span>
                <span className="relative z-[1] mt-auto max-w-[12.5rem] text-xl font-semibold leading-snug tracking-tight md:text-2xl">
                  {cap.plainName}
                </span>
                <span className="relative z-[1] mt-4 flex w-full items-end justify-between gap-3">
                  <span className={job.arrow} aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M3 10h12m0 0l-4.5-4.5M15 10l-4.5 4.5"
                        stroke="currentColor"
                        strokeWidth={selected ? 2.5 : 2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <JobMotif id={cap.id} tone={job.tone} />
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-1 hidden justify-center gap-5 lg:flex" aria-hidden="true">
          {capabilitySystem.capabilities.map((cap, i) => (
            <div key={cap.id} className="flex w-full max-w-[360px] flex-1 justify-center">
              <span className={`h-1.5 w-20 ${i === activeIndex ? jobLooks[i].pointer : 'bg-transparent'}`} />
            </div>
          ))}
        </div>

        {/* Selected-job workspace — one compact operating surface, stable dimensions across jobs */}
        <div
          role="tabpanel"
          id={`cap-panel-${active.id}`}
          aria-labelledby={`cap-tab-${active.id}`}
          className={`mt-3 rounded-[8px] border-2 border-ink border-t-[6px] bg-porcelain shadow-[6px_6px_0_0_var(--color-ink)] ${
            activeIndex === 1 ? 'border-t-action' : 'border-t-lime'
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-3 md:px-7">
            <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
              {active.brandedName}
            </p>
            <div className="flex gap-1.5" aria-hidden="true">
              {capabilitySystem.capabilities.map((c, i) => (
                <span
                  key={c.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-6 bg-lime ring-1 ring-signal-deep/40' : 'w-1.5 bg-border'
                  }`}
                />
              ))}
            </div>
          </div>

          <div key={active.id} className="panel-swap grid gap-7 p-6 md:min-h-[420px] md:grid-cols-2 md:gap-10 md:p-7">
            {/* Left — main explanation */}
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
                  {active.primaryMessage}
                </h3>
                <p className="mt-2.5 text-base leading-relaxed text-muted-foreground md:text-lg text-pretty">
                  {active.supporting}
                </p>
              </div>
              <CapabilityVisual id={active.id} />
              <blockquote className="mt-auto border-l-4 border-lime pl-4 text-lg font-semibold leading-snug text-ink text-pretty">
                {active.keyLine}
              </blockquote>
            </div>

            {/* Right — visible outcomes, supporting proof, disclosure, and CTA */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-base font-semibold uppercase tracking-wide text-ink">
                  {active.outcomesTitle}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {active.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2.5 text-base leading-relaxed text-ink">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-deep" aria-hidden="true" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <Disclosure title={active.disclosureTitle}>
                  <ul className="flex flex-col gap-1.5">
                    {active.disclosureItems.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-fog" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Disclosure>
                <a
                  href={nextStep.href}
                  className="inline-flex items-center gap-2 self-start text-base font-bold text-action-deep transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal-deep"
                >
                  {nextStep.label}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 8h11m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
