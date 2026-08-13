'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { measurement } from '@/lib/site-data'
import { Disclosure } from '@/components/disclosure'

/**
 * Interactive signal map: shopper actions on the left, the measurement
 * layer in the center, reporting and decisions on the destination side.
 * Selecting a shopper action lights its full path in Lime; the resulting
 * business decision carries the Orange action color.
 */

type Pt = { x: number; y: number }

function cubicH(from: Pt, to: Pt) {
  const dx = Math.max(28, Math.abs(to.x - from.x) * 0.55)
  return `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} C ${(from.x + dx).toFixed(1)} ${from.y.toFixed(1)}, ${(to.x - dx).toFixed(1)} ${to.y.toFixed(1)}, ${to.x.toFixed(1)} ${to.y.toFixed(1)}`
}

function edgePoint(box: DOMRect, map: DOMRect, side: 'left' | 'right', t: number): Pt {
  return {
    x: (side === 'left' ? box.left : box.right) - map.left,
    y: box.top - map.top + box.height * t,
  }
}

type Routes = {
  left: string[]
  right: string[]
  w: number
  h: number
}

export function SignalArchitecture() {
  const [selected, setSelected] = useState(0)
  const mapRef = useRef<HTMLDivElement>(null)
  const actionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const layerRef = useRef<HTMLDivElement>(null)
  const destRefs = useRef<(HTMLDivElement | null)[]>([])
  const [routes, setRoutes] = useState<Routes | null>(null)

  const measurementLayer = measurement.destinations.slice(0, 2)
  const reportingDest = measurement.destinations.slice(2, 4)
  const decisionDest = measurement.destinations[4]
  const destCount = 3
  const actionCount = measurement.buyerActions.length

  const layout = useCallback(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return
    if (!window.matchMedia('(min-width: 1024px)').matches) {
      setRoutes(null)
      return
    }

    const mapBox = map.getBoundingClientRect()
    const layerBox = layer.getBoundingClientRect()

    const left = measurement.buyerActions.map((_, i) => {
      const el = actionRefs.current[i]
      if (!el) return ''
      const from = edgePoint(el.getBoundingClientRect(), mapBox, 'right', 0.5)
      const t = actionCount === 1 ? 0.5 : 0.22 + (i / (actionCount - 1)) * 0.56
      const to = edgePoint(layerBox, mapBox, 'left', t)
      return cubicH(from, to)
    })

    const right = Array.from({ length: destCount }, (_, i) => {
      const el = destRefs.current[i]
      if (!el) return ''
      const t = destCount === 1 ? 0.5 : 0.22 + (i / (destCount - 1)) * 0.56
      const from = edgePoint(layerBox, mapBox, 'right', t)
      const to = edgePoint(el.getBoundingClientRect(), mapBox, 'left', 0.5)
      return cubicH(from, to)
    })

    setRoutes({ left, right, w: mapBox.width, h: mapBox.height })
  }, [actionCount])

  useLayoutEffect(() => {
    layout()
    const ro = new ResizeObserver(layout)
    if (mapRef.current) ro.observe(mapRef.current)
    window.addEventListener('resize', layout)
    void document.fonts?.ready.then(layout)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', layout)
    }
  }, [layout, selected])

  return (
    <section id="measurement" aria-labelledby="measurement-heading" className="scroll-mt-24 border-b border-border bg-paper">
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

        <div
          ref={mapRef}
          className="relative mt-9 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-x-14 md:mt-11"
        >
          {routes ? (
            <svg
              className="pointer-events-none absolute inset-0 z-[1] hidden overflow-visible lg:block"
              width={routes.w}
              height={routes.h}
              viewBox={`0 0 ${routes.w} ${routes.h}`}
              fill="none"
              aria-hidden="true"
            >
              {routes.left.map((d, i) => {
                if (!d) return null
                const isSelected = selected === i
                return (
                  <path
                    key={`in-${i}`}
                    d={d}
                    stroke={isSelected ? 'var(--signal-deep)' : 'var(--border)'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    strokeLinecap="round"
                    className={isSelected ? 'signal-dash' : ''}
                  />
                )
              })}
              {routes.right.map((d, i) => {
                if (!d) return null
                const isDecision = i === destCount - 1
                return (
                  <path
                    key={`out-${i}`}
                    d={d}
                    stroke={isDecision ? 'var(--action)' : 'var(--signal-deep)'}
                    strokeWidth={2}
                    strokeLinecap="round"
                    className="signal-dash"
                  />
                )
              })}
            </svg>
          ) : null}

          <div className="relative z-[2]">
            <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
              What shoppers do
            </p>
            <div className="mt-3 flex flex-col gap-1.5" role="tablist" aria-label="Shopper actions" aria-orientation="vertical">
              {measurement.buyerActions.map((action, i) => {
                const isSelected = selected === i
                return (
                  <button
                    key={action}
                    ref={(el) => {
                      actionRefs.current[i] = el
                    }}
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

          <div className="flex justify-center py-2 lg:hidden" aria-hidden="true">
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <path d="M8 1v18m0 0l-5-5m5 5l5-5" stroke="var(--signal-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div id="signal-map-path" role="tabpanel" aria-label="Measurement layer" className="relative z-[2]">
            <div ref={layerRef} className="rounded-xl border-2 border-signal-deep bg-porcelain p-4 md:p-5">
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

          <div className="flex justify-center py-2 lg:hidden" aria-hidden="true">
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <path d="M8 1v18m0 0l-5-5m5 5l5-5" stroke="var(--signal-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="relative z-[2] flex flex-col gap-2.5">
            <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
              Where those actions become useful
            </p>
            {reportingDest.map((dest, i) => (
              <div
                key={dest}
                ref={(el) => {
                  destRefs.current[i] = el
                }}
                className="flex items-center gap-3 rounded-lg border border-border bg-porcelain px-4 py-3 text-base font-semibold text-ink"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime ring-2 ring-signal-deep/60" aria-hidden="true" />
                {dest}
              </div>
            ))}
            <div
              ref={(el) => {
                destRefs.current[2] = el
              }}
              className="flex items-center gap-3 rounded-lg border-2 border-action bg-paper px-4 py-3 text-base font-bold text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0" aria-hidden="true">
                <path d="M2 9h12m0 0l-4-4m4 4l-4 4" stroke="var(--action)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {decisionDest}
            </div>
          </div>
        </div>

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
