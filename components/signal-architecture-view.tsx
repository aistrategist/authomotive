import type { Ref } from 'react'
import { measurement } from '@/lib/site-data'

type MeasureEvent = (typeof measurement.events)[number]

export const saStream = [...measurement.events].sort((a, b) => b.stamp.localeCompare(a.stamp))
export const saHitTotal = String(saStream.length).padStart(2, '0')
export const SA_INSPECTOR_ID = 'ma-inspector'
export const SA_DEFAULT_HIT = measurement.events.find((row) => row.id === 'call')?.id ?? saStream[0]!.id

export function saHitIndex(row: MeasureEvent) {
  const chronological = [...measurement.events].sort((a, b) => a.stamp.localeCompare(b.stamp))
  return String(chronological.findIndex((hit) => hit.id === row.id) + 1).padStart(2, '0')
}

export function SignalArchitectureCopy() {
  return (
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
        <p className="lede text-stage-muted text-pretty">{measurement.supporting}</p>
        <p className="mt-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-stage-muted md:text-xs">
          {measurement.stack}
        </p>
      </div>
    </div>
  )
}

export function SignalArchitectureCycle() {
  return (
    <>
      <ol
        id="how-it-works"
        className="ma-cycle mt-8 grid scroll-mt-24 gap-px sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Define, implement, verify, report"
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

      <p className="ma-payoff mt-6 text-base font-medium leading-snug text-pretty md:text-lg">
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
    </>
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
  onSelect?: () => void
  buttonRef?: (el: HTMLButtonElement | null) => void
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-pressed={selected}
      aria-controls={SA_INSPECTOR_ID}
      aria-label={`View event explanation for ${row.action}`}
      onClick={onSelect}
      className={`ma-line ma-cols w-full px-4 py-2.5 text-left md:px-5 ${
        selected ? 'is-on' : ''
      }`}
    >
      <span className="font-mono text-[0.6875rem] tabular-nums text-[color:var(--on-ink-muted)]">{index}</span>
      <span className="font-mono text-[0.6875rem] tabular-nums text-[color:var(--on-ink-muted)]">{row.stamp}</span>
      <span className="min-w-0">
        <span className="ma-moment block">{row.action}</span>
        <code className="mt-0.5 font-mono">{row.event}</code>
      </span>
      <span className={`ma-kind is-${row.kind.toLowerCase()}`}>{row.kind}</span>
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-[color:var(--on-ink-muted)] md:text-right">
        {row.pillar}
      </span>
    </button>
  )
}

function Inspector({ row }: { row: MeasureEvent }) {
  return (
    <div
      id={SA_INSPECTOR_ID}
      className="ma-inspector px-5 py-6 md:px-6 md:py-8"
      role="region"
      aria-labelledby="ma-inspector-heading"
    >
      <p id="ma-inspector-heading" className="ma-inspector-kicker font-mono">
        What this event means
      </p>
      <div className="ma-inspector-body">
        <p className="ma-inspector-label">{row.action}</p>
        <p className="ma-meaning text-pretty">{row.meaning}</p>
        <p className="ma-tech font-mono">{row.path}</p>
      </div>
    </div>
  )
}

export function SignalArchitectureConsole({
  openId = SA_DEFAULT_HIT,
  onSelect,
  frameRef,
  streamRef,
  scanRef,
  triggerRefs,
}: {
  openId?: string
  onSelect?: (id: string) => void
  frameRef?: Ref<HTMLDivElement>
  streamRef?: Ref<HTMLDivElement>
  scanRef?: Ref<HTMLSpanElement>
  triggerRefs?: { current: Record<string, HTMLButtonElement | null> }
}) {
  const selected = saStream.find((row) => row.id === openId) ?? saStream.find((row) => row.id === SA_DEFAULT_HIT) ?? saStream[0]!

  return (
    <div ref={frameRef} className="ma-console mt-10 md:mt-12">
      <span className="ma-scope" aria-hidden="true" />
      <span className="ma-scope is-opp" aria-hidden="true" />
      <div className="ma-chrome flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className="ma-live" aria-hidden="true" />
            <p className="font-mono text-sm font-semibold tracking-wide text-porcelain md:text-base">
              {measurement.product}
            </p>
          </div>
          <p className="ma-status font-mono">{measurement.principle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="ma-chip font-mono">HITS {saHitTotal}</span>
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
            {saStream.map((row) => (
              <li key={row.id} className="ma-hit">
                <StreamRow
                  row={row}
                  index={saHitIndex(row)}
                  selected={openId === row.id}
                  onSelect={onSelect ? () => onSelect(row.id) : undefined}
                  buttonRef={
                    triggerRefs
                      ? (el) => {
                          triggerRefs.current[row.id] = el
                        }
                      : undefined
                  }
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
  )
}
