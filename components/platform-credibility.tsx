'use client'

import { useState } from 'react'
import Image from 'next/image'
import { platformCredibility, type BrandMark } from '@/lib/platform-data'

function Mark({ mark, active }: { mark: BrandMark; active: boolean }) {
  return (
    <div
      className={`flex min-h-[44px] items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors duration-200 motion-reduce:transition-none ${
        active ? 'bg-paper' : 'bg-transparent'
      }`}
    >
      {mark.kind === 'image' && mark.src ? (
        <Image
          src={mark.src || '/placeholder.svg'}
          alt={`${mark.name} logo`}
          width={22}
          height={22}
          className={`h-[22px] w-[22px] shrink-0 transition-[filter,opacity] duration-200 motion-reduce:transition-none ${
            active ? 'opacity-100 grayscale-0' : 'opacity-60 grayscale'
          }`}
        />
      ) : (
        <span
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-sm border font-mono text-[10px] font-bold uppercase transition-colors duration-200 ${
            active ? 'border-ink text-ink' : 'border-fog/50 text-fog'
          }`}
          aria-hidden="true"
        >
          {mark.name.slice(0, 2)}
        </span>
      )}
      <span className="flex flex-col">
        <span
          className={`text-sm font-semibold leading-tight transition-colors duration-200 ${
            active ? 'text-ink' : 'text-fog'
          }`}
        >
          {mark.name}
        </span>
        {mark.note && (
          <span className={`text-xs leading-tight ${active ? 'text-muted-foreground' : 'text-fog/70'}`}>
            {mark.note}
          </span>
        )}
      </span>
    </div>
  )
}

/**
 * One interactive platform field. All platform and tool names stay visible;
 * selecting a mode highlights its marks and updates one shared explanation
 * region. Marks are restrained monochrome until their mode is active.
 */
export function PlatformCredibility() {
  const [activeId, setActiveId] = useState(platformCredibility.categories[0].id)
  const activeCategory =
    platformCredibility.categories.find((c) => c.id === activeId) ??
    platformCredibility.categories[0]

  return (
    <section
      id="platforms"
      aria-labelledby="platforms-heading"
      className="scroll-mt-20 border-b border-border bg-porcelain"
    >
      <div className="mx-auto max-w-[1320px] px-5 py-12 md:px-8 md:py-16">
        {/* Compact editorial introduction */}
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

        {/* One Clean Paper inset deck — mode selector, three category columns with structural
            rails, one interpretation region, and the disclaimer/closing statement all inside */}
        <div className="mt-7 rounded-lg border border-border border-t-[3px] border-t-ink bg-paper p-5 md:mt-9 md:p-7">
          {/* Mode selection */}
          <div role="tablist" aria-label="Platform categories" className="flex flex-wrap gap-2">
            {platformCredibility.categories.map((category) => {
              const selected = category.id === activeId
              return (
                <button
                  key={category.id}
                  role="tab"
                  id={`platform-tab-${category.id}`}
                  aria-selected={selected}
                  aria-controls="platform-panel"
                  onClick={() => setActiveId(category.id)}
                  className={`flex min-h-[44px] items-center gap-2.5 rounded-md border-2 px-4 py-2.5 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-deep ${
                    selected
                      ? 'border-ink bg-ink text-porcelain'
                      : 'border-border bg-transparent text-muted-foreground hover:border-fog hover:text-ink'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-colors ${selected ? 'bg-lime' : 'bg-border'}`}
                    aria-hidden="true"
                  />
                  {category.label}
                </button>
              )
            })}
          </div>

          {/* Three category columns, separated by precise vertical rails on desktop */}
          <div className="mt-5 grid gap-x-8 gap-y-5 border-t border-border pt-5 md:mt-6 md:grid-cols-3 md:pt-6 md:[&>div:not(:first-child)]:border-l md:[&>div:not(:first-child)]:border-border md:[&>div:not(:first-child)]:pl-8">
            {platformCredibility.categories.map((category) => {
              const catActive = category.id === activeId
              return (
                <div key={category.id}>
                  <p
                    className={`font-mono text-[11px] uppercase tracking-wider transition-colors ${
                      catActive ? 'text-signal-deep' : 'text-fog'
                    }`}
                  >
                    {category.label}
                  </p>
                  <div className="mt-1.5 flex flex-col">
                    {category.marks.map((mark) => (
                      <Mark key={mark.id} mark={mark} active={catActive} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* One shared explanation region — stable height */}
          <div
            role="tabpanel"
            id="platform-panel"
            aria-labelledby={`platform-tab-${activeCategory.id}`}
            className="mt-5 min-h-[92px] rounded-lg border-l-4 border-lime bg-porcelain p-4 md:min-h-[72px] md:p-5"
          >
            <p key={activeCategory.id} className="panel-swap text-base leading-relaxed text-ink text-pretty">
              {activeCategory.explanation}
            </p>
          </div>

          {/* Restrained disclaimer footer, contained within the same deck */}
          <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            {platformCredibility.clarification}
          </p>
        </div>

        {/* Closing platform-strategy statement, integrated directly beneath the deck */}
        <p className="mt-5 text-lg font-semibold tracking-tight text-ink md:text-xl text-pretty">
          {platformCredibility.closing}
        </p>
      </div>
    </section>
  )
}
