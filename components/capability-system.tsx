'use client'

import { useState } from 'react'
import { capabilitySystem } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'
import { SectionHandoff } from '@/components/section-handoff'

function JobMotif({ id, tone }: { id: string; tone: 'ink' | 'accent' | 'proof' | 'soft' }) {
  const stroke =
    tone === 'ink' ? 'var(--accent)' : tone === 'proof' ? 'var(--proof-deep)' : 'var(--ink)'
  const mark =
    tone === 'ink'
      ? 'var(--accent)'
      : tone === 'accent'
        ? 'var(--accent-deep)'
        : tone === 'proof'
          ? 'var(--proof-deep)'
          : 'var(--stage-muted)'

  if (id === 'get-found') {
    return (
      <svg width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden="true">
        <path d="M4 32 C16 32, 18 8, 32 8 S48 28, 52 12" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <circle cx="4" cy="32" r="3" fill={mark} />
        <circle cx="52" cy="12" r="3" fill={stroke} />
      </svg>
    )
  }
  if (id === 'know-working') {
    return (
      <svg width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden="true">
        {[10, 16, 14, 22, 28].map((h, i) => (
          <rect key={i} x={6 + i * 10} y={36 - h} width="6" height={h} fill={i === 4 ? mark : stroke} opacity={i === 4 ? 1 : 0.45} />
        ))}
      </svg>
    )
  }
  return (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden="true">
      <path d="M8 20 H48" stroke={stroke} strokeWidth="1.5" />
      <circle cx="8" cy="20" r="4" fill={stroke} />
      <circle cx="28" cy="20" r="4" fill={mark} />
      <circle cx="48" cy="20" r="4" fill={stroke} />
    </svg>
  )
}

const jobLooks = [
  {
    selected: {
      card: 'border-ink bg-ink text-paper',
      shadow: 'shadow-[4px_4px_0_0_var(--accent)]',
      shadowOn: 'shadow-[8px_8px_0_0_var(--accent)]',
      eyebrow: 'text-accent',
      eyebrowQuiet: 'text-accent/80',
      number: 'text-paper/20',
      arrow: 'text-accent',
      focus: 'focus-visible:outline-accent',
      rail: 'bg-accent',
      panelTop: 'border-t-accent',
      tone: 'ink' as const,
    },
    rest: {
      card: 'border-ink bg-accent-soft text-ink',
      shadow: 'shadow-[4px_4px_0_0_var(--ink)]',
      shadowOn: 'shadow-[8px_8px_0_0_var(--ink)]',
      eyebrow: 'text-ink',
      eyebrowQuiet: 'text-ink/70',
      number: 'text-ink/15',
      arrow: 'text-accent-deep',
      focus: 'focus-visible:outline-accent-deep',
      rail: 'bg-accent-deep',
      panelTop: 'border-t-accent',
      tone: 'accent' as const,
    },
  },
  {
    selected: {
      card: 'border-ink bg-ink text-paper',
      shadow: 'shadow-[4px_4px_0_0_var(--proof)]',
      shadowOn: 'shadow-[8px_8px_0_0_var(--proof)]',
      eyebrow: 'text-proof',
      eyebrowQuiet: 'text-proof/80',
      number: 'text-paper/20',
      arrow: 'text-proof',
      focus: 'focus-visible:outline-proof',
      rail: 'bg-proof',
      panelTop: 'border-t-proof',
      tone: 'ink' as const,
    },
    rest: {
      card: 'border-ink bg-proof-soft text-ink',
      shadow: 'shadow-[4px_4px_0_0_var(--ink)]',
      shadowOn: 'shadow-[8px_8px_0_0_var(--ink)]',
      eyebrow: 'text-ink',
      eyebrowQuiet: 'text-ink/70',
      number: 'text-ink/15',
      arrow: 'text-proof-deep',
      focus: 'focus-visible:outline-proof-deep',
      rail: 'bg-proof-deep',
      panelTop: 'border-t-proof',
      tone: 'proof' as const,
    },
  },
  {
    selected: {
      card: 'border-ink bg-ink text-paper',
      shadow: 'shadow-[4px_4px_0_0_var(--stage-muted)]',
      shadowOn: 'shadow-[8px_8px_0_0_var(--stage-muted)]',
      eyebrow: 'text-stage-muted',
      eyebrowQuiet: 'text-stage-muted/80',
      number: 'text-paper/20',
      arrow: 'text-stage-muted',
      focus: 'focus-visible:outline-accent',
      rail: 'bg-stage-muted',
      panelTop: 'border-t-stage-muted',
      tone: 'ink' as const,
    },
    rest: {
      card: 'border-ink bg-porcelain text-ink',
      shadow: 'shadow-[4px_4px_0_0_var(--ink)]',
      shadowOn: 'shadow-[8px_8px_0_0_var(--ink)]',
      eyebrow: 'text-ink',
      eyebrowQuiet: 'text-ink/70',
      number: 'text-ink/15',
      arrow: 'text-ink',
      focus: 'focus-visible:outline-accent-deep',
      rail: 'bg-ink',
      panelTop: 'border-t-ink',
      tone: 'soft' as const,
    },
  },
] as const

function jobLook(index: number, selected: boolean) {
  const look = jobLooks[index] ?? jobLooks[0]
  return selected ? look.selected : look.rest
}

export function CapabilitySystem() {
  const [activeId, setActiveId] = useState(capabilitySystem.capabilities[0].id)
  const active =
    capabilitySystem.capabilities.find((c) => c.id === activeId) ??
    capabilitySystem.capabilities[0]
  const activeIndex = capabilitySystem.capabilities.findIndex((c) => c.id === activeId)

  return (
    <section id="capabilities" aria-labelledby="capabilities-heading" className="relative scroll-mt-24 border-b border-border bg-paper">
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <SignalRail tone="ink" />
        <div className="max-w-[46.5rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {capabilitySystem.eyebrow}
          </p>
          <h2
            id="capabilities-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {capabilitySystem.headline}
          </h2>
          <p className="lede mt-4 max-w-[33.75rem] text-lg leading-relaxed text-muted-foreground text-pretty">
            {capabilitySystem.supporting}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Capabilities"
          className="mt-10 flex flex-col items-stretch gap-5 md:mt-12 lg:flex-row lg:justify-start lg:gap-5"
        >
          {capabilitySystem.capabilities.map((cap, i) => {
            const selected = cap.id === activeId
            const job = jobLook(i, selected)
            return (
              <button
                key={cap.id}
                type="button"
                role="tab"
                id={`cap-tab-${cap.id}`}
                aria-selected={selected}
                aria-controls="cap-panel"
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
                className={`job-card relative flex min-h-[11rem] w-full min-w-0 flex-col rounded-[8px] border-2 px-5 py-5 text-left lg:min-h-[12.5rem] lg:flex-1 lg:px-6 ${job.card} ${selected ? job.shadowOn : job.shadow} ${job.focus} focus-visible:outline-2 focus-visible:outline-offset-2`}
              >
                <span
                  className={`absolute inset-x-6 -bottom-[2px] z-[2] h-1.5 ${selected ? job.rail : 'bg-transparent'}`}
                  aria-hidden="true"
                />
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[6px]" aria-hidden="true">
                  <span className={`absolute right-3 top-2 font-mono text-[4.5rem] font-bold leading-none ${job.number}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
                <span className={`relative z-[1] font-mono text-[11px] font-medium uppercase tracking-[0.16em] ${selected ? job.eyebrow : job.eyebrowQuiet}`}>
                  Job {i + 1} · {cap.brandedName}
                </span>
                <span className="relative z-[1] mt-auto text-xl font-semibold leading-snug tracking-tight md:text-2xl">
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

        <div
          role="tabpanel"
          id="cap-panel"
          aria-labelledby={`cap-tab-${active.id}`}
          className={`mt-2 rounded-[8px] border-2 border-ink border-t-[6px] bg-porcelain shadow-[6px_6px_0_0_var(--color-ink)] ${jobLook(activeIndex, true).panelTop}`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-3 md:px-7">
            <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
              {active.brandedName}
            </p>
            <div className="flex gap-1.5" aria-hidden="true">
              {capabilitySystem.capabilities.map((c, i) => (
                <span
                  key={c.id}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === activeIndex ? `w-6 ${jobLook(i, true).rail}` : 'w-1.5 bg-border'
                  }`}
                />
              ))}
            </div>
          </div>

          <div key={active.id} className="panel-swap grid gap-6 p-6 md:grid-cols-12 md:gap-10 md:p-7">
            <div className="flex flex-col gap-4 md:col-span-7">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
                  {active.primaryMessage}
                </h3>
                <p className="mt-2.5 text-base leading-relaxed text-muted-foreground md:text-lg text-pretty">
                  {active.supporting}
                </p>
              </div>
              <blockquote className={`border-l-4 pl-4 text-lg font-semibold leading-snug text-ink text-pretty ${
                active.id === 'know-working' ? 'border-proof' : 'border-accent'
              }`}>
                {active.keyLine}
              </blockquote>
            </div>

            <div className="flex flex-col gap-5 md:col-span-5">
              <div>
                <p className="text-base font-semibold uppercase tracking-wide text-ink">
                  {active.outcomesTitle}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {active.outcomes.slice(0, 4).map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2.5 text-base leading-relaxed text-ink">
                      <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                        active.id === 'know-working' ? 'bg-proof-deep' : 'bg-signal-deep'
                      }`} aria-hidden="true" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
              <SectionHandoff
                eyebrow="NEXT · THE DELIVERABLE"
                label="See an Authority Experience"
                href="#authority-experiences"
                theme="light"
                accent="discovery"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
