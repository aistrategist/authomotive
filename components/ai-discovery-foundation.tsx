'use client'

import { useState } from 'react'
import { aiDiscovery } from '@/lib/site-data'
import { Reveal } from '@/components/reveal'

/** Illustrative grouped-category descriptions for the reference-sheet interface. */
const rowDetails: Record<string, string> = {
  'Business identity and locations':
    'Legal name, group affiliation, verified identity details, every rooftop, address, hours, and the real market areas served.',
  'Brands, services, and markets':
    'The manufacturer brands, vehicle categories, and sales, service, parts, and fleet capabilities the dealership actually offers.',
  'Research and inventory pathways':
    'The dealership\u2019s own guides and Authority Experiences, organized for discovery, with dependable routes into live inventory.',
  'FAQs, structured information, and maintenance':
    'Buyer questions answered in the dealership\u2019s own words, machine-readable structure that matches the visible content, and a monthly review cycle.',
}

function ExpandableRow({
  index,
  title,
  detail,
}: {
  index: number
  title: string
  detail: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <li className="border-t border-border first:border-t-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`discovery-row-${index}`}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[56px] w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-porcelain/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal-deep md:px-6"
      >
        <span className="font-mono text-xs text-fog" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 text-base font-semibold text-ink">{title}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] border border-border text-base leading-none text-signal-deep transition-transform duration-200 motion-reduce:transition-none ${
            open ? 'rotate-45' : ''
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        id={`discovery-row-${index}`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 pl-[3.25rem] text-base leading-relaxed text-muted-foreground md:px-6 md:pl-[3.5rem]">
            {detail}
          </p>
        </div>
      </div>
    </li>
  )
}

export function AiDiscoveryFoundation() {
  return (
    <section aria-labelledby="ai-discovery-heading" className="overflow-x-clip border-b border-border bg-porcelain">
      <div className="mx-auto grid max-w-[1320px] items-start gap-10 px-5 py-11 md:px-8 md:py-14 lg:grid-cols-[minmax(340px,0.9fr)_1.1fr] lg:gap-14">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {aiDiscovery.eyebrow}
          </p>
          <h2
            id="ai-discovery-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance"
          >
            {aiDiscovery.headline}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg text-pretty">
            {aiDiscovery.supporting}
          </p>

          <ul className="mt-5 flex flex-col gap-2.5">
            {aiDiscovery.values.map((value) => (
              <li key={value} className="flex items-start gap-3 text-base leading-relaxed text-ink">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-deep" aria-hidden="true" />
                {value}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            An AI Discovery page organizes verified first-party information. It does not guarantee
            citations or control what any AI platform says.
          </p>
        </div>

        {/* Grouped dealership-owned reference sheet — a substantial Clean Paper object set within the Porcelain field */}
        <Reveal className="relative">
          {/* Restrained index-tab, evoking a maintained reference binder */}
          <div
            aria-hidden="true"
            className="absolute -top-2.5 left-7 h-2.5 w-14 rounded-t-sm bg-ink md:left-9 md:w-16"
          />
          <div className="overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-[8px_8px_0_0_var(--color-ink)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-paper px-5 py-4 md:px-6">
              <div>
                <p className="text-lg font-semibold text-ink">Dealership AI Discovery Page</p>
                <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Illustrative structure — not a live page
                </p>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-signal-deep/40 bg-paper px-3.5 py-1.5 font-mono text-xs font-medium text-signal-deep">
                <span className="h-2 w-2 rounded-full bg-lime ring-1 ring-signal-deep" aria-hidden="true" />
                Reviewed and updated monthly
              </span>
            </div>
            <ul>
              {aiDiscovery.pageContents.map((item, i) => (
                <ExpandableRow key={item} index={i} title={item} detail={rowDetails[item] ?? ''} />
              ))}
            </ul>
            <div className="flex justify-end border-t border-border bg-porcelain/50 px-5 py-3.5 md:px-6">
              <a
                href="#reporting"
                className="inline-flex items-center gap-2 text-base font-bold text-action-deep transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal-deep"
              >
                See how it feeds the reporting
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8h11m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
