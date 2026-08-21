'use client'

import { useState } from 'react'
import Image from 'next/image'
import { platformCredibility, type BrandMark, type PlatformCategory } from '@/lib/platform-data'
import { SignalRail } from '@/components/signal-rail'
import { SectionHandoff } from '@/components/section-handoff'
import {
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
      ) : mark.id === 'open-cms' ? (
        <span
          className="grid h-[22px] w-[22px] shrink-0 grid-cols-2 gap-px rounded-sm border border-ink/20 p-[3px]"
          aria-hidden="true"
        >
          <span className="bg-ink/25" />
          <span className="bg-ink/45" />
          <span className="bg-ink/45" />
          <span className="bg-ink/25" />
        </span>
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

function WebsiteViz() {
  return <WebsiteLayersViz />
}

function SearchViz() {
  return <SearchOpportunityViz />
}

function MeasureViz() {
  return <MeasurementFlowViz />
}

function ExpandedViz({ tone }: { tone: Tone }) {
  if (tone === 'ink') return <WebsiteViz />
  if (tone === 'lime') return <SearchViz />
  return <MeasureViz />
}

const swatchClass: Record<Tone, string> = {
  ink: 'bg-ink',
  lime: 'bg-lime',
  action: 'bg-proof',
}

const plusMark: Record<Tone, string> = {
  ink: 'text-porcelain',
  lime: 'text-accent',
  action: 'text-proof',
}

function roleChipMark(layerId: string, item: string) {
  if (layerId === 'scope') {
    return item === 'Authomotive Intelligence' ? 'bg-proof' : 'bg-accent'
  }
  if (layerId === 'outcome') {
    return item === 'Evidence-Backed Decisions' ? 'bg-proof' : 'bg-ink'
  }
  return 'bg-stage-muted'
}

function RoleMap() {
  const layers = platformCredibility.roleMap
  return (
    <div className="border border-ink/15 bg-paper px-4 py-4 md:px-5 md:py-5">
      {layers.map((layer, i) => (
        <div key={layer.id}>
          {i > 0 ? (
            <div className="flex items-center gap-2 py-2.5" aria-hidden="true">
              <span className="h-px flex-1 bg-ink/15" />
              <span className="font-mono text-[10px] font-medium text-ink/45">
                {i === 1 ? '+' : '→'}
              </span>
              <span className="h-px flex-1 bg-ink/15" />
            </div>
          ) : null}
          <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-signal-deep">
            {layer.label}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {layer.items.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 border border-ink/10 bg-porcelain px-2 py-1"
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 ${roleChipMark(layer.id, item)}`}
                  aria-hidden="true"
                />
                <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-ink">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
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
            {category.subtitle}
          </span>
        </span>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border-2 border-ink bg-ink text-2xl leading-none ${plusMark[tone]}`}
          aria-hidden="true"
        >
          <span className={`inline-block origin-center transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-45' : ''}`}>
            +
          </span>
        </span>
      </button>

      <div id={panelId} role="region" aria-labelledby={buttonId} className={`stack-body ${open ? 'is-open' : ''}`}>
        <div>
          <div className="border-t border-ink px-5 pb-6 pt-5 md:px-8 md:pb-8">
            <p className="lede text-base leading-relaxed text-ink md:text-lg">
              {category.explanation}
            </p>
            {category.boundary ? (
              <p className="mt-3 text-sm leading-relaxed text-ink/80 md:text-base">
                {category.boundary}
              </p>
            ) : null}
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
      <div className="relative z-[1] mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-20">
        <SignalRail tone="ink" />
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
              {platformCredibility.eyebrow}
            </p>
            <h2
              id="platforms-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl text-balance"
            >
              {platformCredibility.headline}
            </h2>
            <p className="lede mt-4 max-w-[36rem] text-base leading-relaxed text-muted-foreground md:text-lg text-pretty">
              {platformCredibility.supporting}
            </p>
          </div>
          <div className="lg:col-span-5">
            <RoleMap />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 md:mt-12">
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
        <SectionHandoff
          eyebrow="SEE THE COMPLETE SYSTEM"
          label="See the Three Connected Jobs"
          href="#capabilities"
          theme="light"
          accent="discovery"
          className="mt-5"
        />
      </div>
    </section>
  )
}
