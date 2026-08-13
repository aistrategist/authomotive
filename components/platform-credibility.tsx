'use client'

import { useState } from 'react'
import Image from 'next/image'
import { platformCredibility, type BrandMark, type PlatformCategory } from '@/lib/platform-data'

type Tone = 'ink' | 'lime' | 'action'

const tones: Record<string, Tone> = {
  website: 'ink',
  search: 'lime',
  measurement: 'action',
}

const kickers: Record<string, string> = {
  website: 'Authority work inside the CMS already running.',
  search: 'Discovery signals the dealership can actually use.',
  measurement: 'Buyer actions connected to a standard you can trust.',
}

function MarkChip({ mark }: { mark: BrandMark }) {
  return (
    <div className="flex min-h-[44px] items-center gap-2.5 rounded-lg border border-ink/10 bg-paper px-3 py-2">
      {mark.kind === 'image' && mark.src ? (
        <Image
          src={mark.src}
          alt={`${mark.name} logo`}
          width={22}
          height={22}
          className="h-[22px] w-[22px] shrink-0"
        />
      ) : (
        <span
          className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-sm border border-ink/20 font-mono text-[10px] font-bold uppercase text-ink"
          aria-hidden="true"
        >
          {mark.name.slice(0, 2)}
        </span>
      )}
      <span className="flex flex-col">
        <span className="text-sm font-semibold leading-tight text-ink">{mark.name}</span>
        {mark.note ? <span className="text-xs leading-tight text-muted-foreground">{mark.note}</span> : null}
      </span>
    </div>
  )
}

function WebsiteViz({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <svg viewBox="0 0 120 40" className="h-9 w-[7.5rem]" aria-hidden="true">
        <rect x="8" y="10" width="42" height="22" rx="3" className="stack-float fill-lime/25 stroke-lime" strokeWidth="1.25" />
        <rect x="38" y="6" width="42" height="22" rx="3" className="stack-float-b fill-porcelain/20 stroke-porcelain/70" strokeWidth="1.25" />
        <rect x="68" y="12" width="42" height="22" rx="3" className="stack-float-c fill-lime/15 stroke-lime/80" strokeWidth="1.25" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 640 168" className="h-auto w-full" role="img" aria-label="Illustrative website layers inside an existing platform">
      <rect x="24" y="28" width="280" height="120" rx="10" className="stack-float fill-carbon stroke-lime/50" strokeWidth="1.5" />
      <rect x="40" y="44" width="248" height="14" rx="3" className="fill-lime/35" />
      <rect x="40" y="68" width="160" height="8" rx="2" className="fill-porcelain/25" />
      <rect x="40" y="84" width="248" height="48" rx="4" className="fill-porcelain/10 stroke-porcelain/20" />
      <rect x="196" y="20" width="240" height="120" rx="10" className="stack-float-b fill-graphite stroke-porcelain/40" strokeWidth="1.5" />
      <rect x="212" y="36" width="208" height="14" rx="3" className="fill-porcelain/30" />
      <rect x="212" y="60" width="96" height="64" rx="4" className="fill-lime/20" />
      <rect x="320" y="60" width="96" height="64" rx="4" className="fill-porcelain/15" />
      <rect x="372" y="36" width="240" height="120" rx="10" className="stack-float-c fill-ink stroke-lime/40" strokeWidth="1.5" />
      <path
        d="M 80 148 C 220 148, 280 88, 420 88"
        pathLength={1}
        className="stack-draw fill-none stroke-lime"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <circle cx="80" cy="148" r="4" className="fill-lime" />
      <circle cx="420" cy="88" r="4" className="fill-lime" />
    </svg>
  )
}

function SearchViz({ compact = false }: { compact?: boolean }) {
  const values = [28, 36, 32, 48, 54, 70]
  const w = compact ? 120 : 640
  const h = compact ? 40 : 168
  const pad = compact ? 6 : 18
  const max = Math.max(...values)
  const points = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2)
      const y = h - pad - (v / max) * (h - pad * 2.4)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={compact ? 'h-9 w-[7.5rem]' : 'h-auto w-full'}
      role={compact ? undefined : 'img'}
      aria-hidden={compact}
      aria-label={compact ? undefined : 'Illustrative non-branded discovery trend'}
    >
      {values.map((v, i) => {
        const bw = (w - pad * 2) / values.length - (compact ? 4 : 10)
        const x = pad + i * ((w - pad * 2) / values.length)
        const bh = (v / max) * (h - pad * 2.2)
        return (
          <rect
            key={i}
            x={x}
            y={h - pad - bh}
            width={bw}
            height={bh}
            rx="2"
            className={i === values.length - 1 ? 'stack-bar fill-action' : 'stack-bar fill-ink/25'}
            style={{ animationDelay: `${i * 70}ms` }}
          />
        )
      })}
      <polyline
        points={points}
        pathLength={1}
        className="stack-draw fill-none stroke-action"
        strokeWidth={compact ? 2 : 2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MeasureViz({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <svg viewBox="0 0 120 40" className="h-9 w-[7.5rem]" aria-hidden="true">
        <path d="M8 20 H112" className="stroke-ink/30" strokeWidth="2" />
        <circle cx="20" cy="20" r="5" className="fill-ink" />
        <circle cx="60" cy="20" r="5" className="iq-pulse-lime fill-ink/80" />
        <circle cx="100" cy="20" r="5" className="fill-ink" />
        <circle cx="20" cy="20" r="3.5" className="stack-compact-packet fill-paper" />
      </svg>
    )
  }

  return (
    <div className="relative" role="img" aria-label="Illustrative measurement event path">
      <div className="flex items-center gap-2 md:gap-4">
        {['Page', 'Event', 'Handoff', 'Convert'].map((label, i) => (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-2 md:gap-4">
            <div className="flex min-w-0 flex-1 flex-col items-center">
              <div
                className={`flex h-14 w-full items-center justify-center rounded-lg border-2 border-ink/15 bg-paper text-sm font-semibold text-ink ${
                  i === 3 ? 'ring-2 ring-ink/20' : ''
                }`}
              >
                {label}
              </div>
            </div>
            {i < 3 ? <div className="hidden h-0.5 w-4 shrink-0 bg-ink/30 sm:block md:w-8" /> : null}
          </div>
        ))}
      </div>
      <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-ink/15">
        <span className="stack-packet-bar absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-ink" />
        <span className="stack-packet-bar stack-packet-bar-b absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-paper" />
      </div>
    </div>
  )
}

function CompactViz({ tone }: { tone: Tone }) {
  if (tone === 'ink') return <WebsiteViz compact />
  if (tone === 'lime') return <SearchViz compact />
  return <MeasureViz compact />
}

function ExpandedViz({ tone }: { tone: Tone }) {
  if (tone === 'ink') return <WebsiteViz />
  if (tone === 'lime') return <SearchViz />
  return <MeasureViz />
}

function StackSlab({
  category,
  index,
  open,
  onToggle,
}: {
  category: PlatformCategory
  index: number
  open: boolean
  onToggle: () => void
}) {
  const tone = tones[category.id] ?? 'ink'
  const panelId = `stack-panel-${category.id}`
  const buttonId = `stack-btn-${category.id}`

  const surface =
    tone === 'ink'
      ? 'border-2 border-lime bg-ink text-porcelain shadow-[8px_8px_0_0_var(--lime)]'
      : tone === 'lime'
        ? 'border-2 border-action bg-lime text-ink shadow-[8px_8px_0_0_var(--action)]'
        : 'border-2 border-ink bg-action text-ink shadow-[8px_8px_0_0_var(--ink)]'

  const focus =
    tone === 'ink' ? 'focus-visible:outline-lime' : 'focus-visible:outline-ink'

  const indexClass = tone === 'ink' ? 'text-lime' : tone === 'lime' ? 'text-action' : 'text-ink/80'
  const plusClass =
    tone === 'ink'
      ? 'border-2 border-lime bg-lime text-ink'
      : tone === 'lime'
        ? 'border-2 border-action bg-action text-paper'
        : 'border-2 border-ink bg-ink text-lime'

  return (
    <div className={`stack-slab overflow-hidden rounded-xl ${surface}`}>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={`flex w-full min-h-[88px] items-center gap-4 px-5 py-5 text-left md:min-h-[104px] md:px-8 md:py-6 ${focus} focus-visible:outline-2 focus-visible:outline-offset-[-6px]`}
      >
        <span className={`font-mono text-sm font-medium tracking-[0.18em] md:text-base ${indexClass}`}>
          0{index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {category.label}
          </span>
          <span className={`mt-1 hidden text-sm md:block ${tone === 'ink' ? 'text-porcelain/70' : 'text-ink/70'}`}>
            {kickers[category.id]}
          </span>
        </span>
        <span className="hidden shrink-0 sm:block">
          <CompactViz tone={tone} />
        </span>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-2xl leading-none transition-transform duration-300 ${plusClass} ${open ? 'rotate-45' : ''}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div id={panelId} role="region" aria-labelledby={buttonId} className={`stack-body ${open ? 'is-open' : ''}`}>
        <div>
          <div className="px-5 pb-6 md:px-8 md:pb-8">
            <p className={`max-w-3xl text-base leading-relaxed md:text-lg ${tone === 'ink' ? 'text-porcelain/85' : 'text-ink/80'}`}>
              {category.explanation}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {category.marks.map((mark) => (
                <MarkChip key={mark.id} mark={mark} />
              ))}
            </div>
            <div className={`mt-6 rounded-xl p-4 md:p-5 ${tone === 'ink' ? 'bg-carbon/80' : 'bg-paper/55'}`}>
              <ExpandedViz tone={tone} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PlatformCredibility() {
  const [openId, setOpenId] = useState<string | null>(platformCredibility.categories[0].id)

  return (
    <section
      id="platforms"
      aria-labelledby="platforms-heading"
      className="paper-grid paper-grid-wash scroll-mt-20 overflow-hidden border-b border-border"
    >
      <div className="paper-grid-bloom" aria-hidden="true" />
      <div className="paper-grid-bloom paper-grid-bloom-soft" aria-hidden="true" />
      <div className="relative z-[1] mx-auto max-w-[1320px] px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
              {platformCredibility.eyebrow}
            </p>
            <h2
              id="platforms-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl text-balance"
            >
              {platformCredibility.headline}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg text-pretty lg:pb-1">
            {platformCredibility.supporting}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-5 md:mt-10 md:gap-6">
          {platformCredibility.categories.map((category, index) => (
            <StackSlab
              key={category.id}
              category={category}
              index={index}
              open={openId === category.id}
              onToggle={() => setOpenId((current) => (current === category.id ? null : category.id))}
            />
          ))}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{platformCredibility.clarification}</p>
        <p className="mt-5 text-lg font-semibold tracking-tight text-ink md:text-xl text-pretty">
          {platformCredibility.closing}
        </p>
      </div>
    </section>
  )
}
