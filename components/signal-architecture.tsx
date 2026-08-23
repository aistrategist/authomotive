'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { measurement } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type MeasureEvent = (typeof measurement.events)[number]

const stream = [...measurement.events].sort((a, b) => b.stamp.localeCompare(a.stamp))
const hitTotal = String(stream.length).padStart(2, '0')
const INSPECTOR_ID = 'ma-inspector'
const DEFAULT_HIT = measurement.events.find((row) => row.id === 'campaign')?.id ?? stream[0]!.id

function hitIndex(row: MeasureEvent) {
  const chronological = [...measurement.events].sort((a, b) => a.stamp.localeCompare(b.stamp))
  return String(chronological.findIndex((hit) => hit.id === row.id) + 1).padStart(2, '0')
}

export function SignalArchitecture() {
  const [openId, setOpenId] = useState<string>(DEFAULT_HIT)
  const rootRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<HTMLDivElement>(null)
  const scanRef = useRef<HTMLSpanElement>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const selected = stream.find((row) => row.id === openId) ?? stream.find((row) => row.id === DEFAULT_HIT) ?? stream[0]!

  useGSAP(
    () => {
      const root = rootRef.current
      const frame = frameRef.current
      const streamEl = streamRef.current
      const scan = scanRef.current
      if (!root || !frame || !streamEl || !scan) return

      const hits = streamEl.querySelectorAll<HTMLElement>('.ma-hit')
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(hits, { opacity: 1, y: 0 })
        gsap.set(scan, { opacity: 0.35, y: 0 })
        return
      }

      gsap.set(hits, { opacity: 0, y: 10 })
      gsap.set(scan, { opacity: 0, y: 0 })

      ScrollTrigger.create({
        trigger: frame,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(hits, {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.07,
            ease: 'power2.out',
            overwrite: 'auto',
            onComplete: () => {
              const travel = Math.max(streamEl.offsetHeight - 28, 80)
              gsap.to(scan, {
                opacity: 0.85,
                y: travel,
                duration: 1.7,
                ease: 'power2.inOut',
                overwrite: 'auto',
                onComplete: () => {
                  gsap.to(scan, { opacity: 0.22, duration: 0.35, overwrite: 'auto' })
                },
              })
            },
          })
        },
      })
    },
    { scope: rootRef },
  )

  useEffect(() => {
    const move = (delta: number) => {
      const ids = stream.map((row) => row.id)
      const current = openId ? ids.indexOf(openId) : delta > 0 ? -1 : ids.length
      const next = Math.max(0, Math.min(ids.length - 1, current + delta))
      const id = ids[next]
      if (!id) return
      setOpenId(id)
      triggerRefs.current[id]?.focus()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const inConsole = frameRef.current?.contains(document.activeElement)
      if (!inConsole) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        move(1)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        move(-1)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openId])

  const selectHit = (id: string) => {
    setOpenId(id)
  }

  return (
    <section
      ref={rootRef}
      id="measurement"
      aria-labelledby="measurement-heading"
      className="ma-band scroll-mt-24 overflow-x-clip border-b border-stage-line"
    >
      <SignalRail step={5} />
      <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-action">
              {measurement.eyebrow}
            </p>
            <h2
              id="measurement-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-porcelain md:text-5xl text-balance"
            >
              {measurement.headline}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-1">
            <p className="lede text-lg leading-relaxed text-stage-muted md:text-xl text-pretty">
              {measurement.supporting}
            </p>
            <p className="mt-2.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-stage-muted md:text-xs">
              {measurement.stack}
            </p>
          </div>
        </div>

        <div ref={frameRef} className="ma-console mt-10 md:mt-12">
          <span className="ma-scope" aria-hidden="true" />
          <span className="ma-scope is-opp" aria-hidden="true" />
          <div className="ma-chrome flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5">
            <div className="flex items-center gap-2.5">
              <span className="ma-live" aria-hidden="true" />
              <p className="font-mono text-sm font-semibold tracking-wide text-porcelain md:text-base">
                {measurement.product}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="ma-chip font-mono">HITS {hitTotal}</span>
              <span className="ma-chip font-mono">{measurement.path}</span>
              <span className="ma-chip font-mono">{measurement.planKind}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-12">
            <div ref={streamRef} className="ma-stream-well relative lg:col-span-7">
              <span ref={scanRef} className="ma-scan" aria-hidden="true" />
              <div
                className="ma-cols hidden border-b border-stage-line px-4 py-2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-stage-muted md:grid md:px-5"
                aria-hidden="true"
              >
                <span>#</span>
                <span>Time</span>
                <span>Event</span>
                <span>Kind</span>
                <span>Pillar</span>
              </div>
              <ul className="ma-stream" aria-label="Captured shopper events">
                {stream.map((row) => (
                  <li key={row.id} className="ma-hit">
                    <StreamRow
                      row={row}
                      index={hitIndex(row)}
                      selected={openId === row.id}
                      onSelect={() => selectHit(row.id)}
                      buttonRef={(el) => {
                        triggerRefs.current[row.id] = el
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <aside className="ma-dock lg:col-span-5">
              <Inspector row={selected} />
            </aside>
          </div>
        </div>

        <ol
          id="how-it-works"
          className="ma-cycle mt-8 grid scroll-mt-24 gap-px sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Observe, connect, understand, decide"
        >
          {measurement.cycle.map((stage) => (
            <li key={stage.id} className="ma-cell px-4 py-3">
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-action">
                {stage.n} · {stage.label}
              </p>
              <p className="mt-1.5 text-sm font-semibold leading-snug text-porcelain md:text-base">
                {stage.lead}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-6 max-w-3xl text-lg font-semibold leading-snug text-porcelain text-pretty md:text-xl">
          {measurement.payoff}
        </p>

        <div className="mt-6 flex flex-col items-start gap-2">
          <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-action md:text-xs">
            {measurement.handoffLabel}
          </p>
          <a href={measurement.handoffHref} className="measure-handoff is-dark">
            {measurement.handoffCta}
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <p className="max-w-[36rem] text-sm leading-relaxed text-stage-muted text-pretty">
            {measurement.handoffNote}
          </p>
        </div>
      </div>
    </section>
  )
}

function StreamRow({
  row,
  index,
  selected,
  onSelect,
  buttonRef,
}: {
  row: MeasureEvent
  index: string
  selected: boolean
  onSelect: () => void
  buttonRef: (el: HTMLButtonElement | null) => void
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-pressed={selected}
      aria-controls={INSPECTOR_ID}
      aria-label={`View signal details for ${row.action}`}
      onClick={onSelect}
      className={`ma-line ma-cols w-full px-4 py-2.5 text-left md:items-baseline md:px-5 ${
        selected ? 'is-on' : ''
      }`}
    >
      <span className="font-mono text-[0.6875rem] tabular-nums text-stage-muted">{index}</span>
      <span className="font-mono text-[0.6875rem] tabular-nums text-stage-muted">{row.stamp}</span>
      <span className="min-w-0">
        <span className="ma-moment block text-sm font-semibold text-porcelain">{row.action}</span>
        <code className="mt-0.5 block font-mono text-xs">{row.event}</code>
      </span>
      <span className={`ma-kind is-${row.kind.toLowerCase()}`}>{row.kind}</span>
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-stage-muted md:text-right">
        {row.pillar}
      </span>
    </button>
  )
}

function Inspector({ row }: { row: MeasureEvent }) {
  return (
    <div id={INSPECTOR_ID} className="ma-inspector px-4 py-4 md:px-5 md:py-5">
      <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-action">
        Why this signal matters
      </p>
      <p className="mt-1 text-base font-semibold text-porcelain">{row.action}</p>
      <dl className="ma-read mt-4">
        <div>
          <dt className="font-mono">What happened</dt>
          <dd>{row.popout.happened}</dd>
        </div>
        <div>
          <dt className="font-mono">Why it matters</dt>
          <dd>{row.popout.why}</dd>
        </div>
        <div>
          <dt className="font-mono">What we connect</dt>
          <dd>{row.popout.connect}</dd>
        </div>
        <div>
          <dt className="font-mono">What it helps answer</dt>
          <dd>{row.popout.answers}</dd>
        </div>
      </dl>
      <p className="ma-tech mt-4 font-mono">
        EVENT {row.event} · SOURCE {row.kind} · DESTINATION GA4
      </p>
    </div>
  )
}
