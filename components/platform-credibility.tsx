'use client'

import { useState } from 'react'
import Image from 'next/image'
import { platformCredibility, type BrandMark, type PlatformCategory } from '@/lib/platform-data'
import {
  CompactLayerGlyph,
  CompactMeasureGlyph,
  CompactSearchGlyph,
  MeasurementFlowViz,
  SearchOpportunityViz,
  WebsiteLayersViz,
} from '@/components/semantic-wireframes'

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
  if (compact) return <CompactLayerGlyph />
  return <WebsiteLayersViz />
}

function SearchViz({ compact = false }: { compact?: boolean }) {
  if (compact) return <CompactSearchGlyph />
  return <SearchOpportunityViz />
}

function MeasureViz({ compact = false }: { compact?: boolean }) {
  if (compact) return <CompactMeasureGlyph />
  return <MeasurementFlowViz />
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

const swatchClass: Record<Tone, string> = {
  ink: 'bg-ink',
  lime: 'bg-lime',
  action: 'bg-action',
}

const plusMark: Record<Tone, string> = {
  ink: 'text-porcelain',
  lime: 'text-lime',
  action: 'text-action',
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

  return (
    <div className={`stack-slab stack-slab-${tone} rounded-[8px] ${open ? 'is-engaged' : ''}`}>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full min-h-[88px] items-center gap-4 px-5 py-5 text-left text-ink focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-ink md:min-h-[104px] md:px-8 md:py-6"
      >
        <span className={`h-3 w-3 shrink-0 ${swatchClass[tone]}`} aria-hidden="true" />
        <span className="font-mono text-sm font-medium tracking-[0.18em] text-ink md:text-base">
          0{index + 1}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            {category.label}
          </span>
          <span className="mt-1 hidden text-sm text-ink md:block">
            {kickers[category.id]}
          </span>
        </span>
        {open ? (
          <span className="hidden shrink-0 sm:block">
            <CompactViz tone={tone} />
          </span>
        ) : null}
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border-2 border-ink bg-ink text-2xl leading-none transition-transform duration-200 motion-reduce:transition-none ${plusMark[tone]} ${open ? 'rotate-45' : ''}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div id={panelId} role="region" aria-labelledby={buttonId} className={`stack-body ${open ? 'is-open' : ''}`}>
        <div>
          <div className="border-t border-ink px-5 pb-6 pt-5 md:px-8 md:pb-8">
            <p className="lede text-base leading-relaxed text-ink md:text-lg">
              {category.explanation}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {category.marks.map((mark) => (
                <MarkChip key={mark.id} mark={mark} />
              ))}
            </div>
            <div className="mt-6">
              <ExpandedViz tone={tone} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PlatformCredibility() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section
      id="platforms"
      aria-labelledby="platforms-heading"
      className="paper-grid paper-grid-wash scroll-mt-24 overflow-x-clip border-b border-border"
    >
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
          <p className="lede text-base leading-relaxed text-muted-foreground md:text-lg text-pretty lg:pb-1">
            {platformCredibility.supporting}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-5 md:mt-10">
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
