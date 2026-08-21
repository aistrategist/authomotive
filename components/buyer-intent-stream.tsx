'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { discoveryToInventory } from '@/lib/site-data'

const CYCLE_MS = 6000
const HOLD_MIN_MS = 3000
const ACTIVATE_MS = 200
const SIGNAL_STAGGER_MS = 140
const TRAVEL_MS = 600
const POLL_MS = 50
const INK = '#061b20'

type SourceId = (typeof discoveryToInventory.intentStream.sources)[number]['id']
type Handoff = 'rest' | 'travel' | 'arrived'

const SOURCE_DOT: Record<SourceId, string> = {
  search: 'bg-lime',
  ai: 'bg-ink',
  local: 'bg-action',
}

function typeDuration(length: number) {
  return Math.min(1600, Math.max(1000, length * 22))
}

function SearchGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6.75" cy="6.75" r="4.35" stroke={INK} strokeWidth="1.6" />
      <path d="M10.1 10.1 13.4 13.4" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function AiGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2.2 8.95 6.05 12.8 7 8.95 7.95 8 11.8 7.05 7.95 3.2 7 7.05 6.05Z"
        stroke={INK}
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M12.4 3.1v1.8M13.3 4H11.5M4 11.4v1.6M4.8 12.2H3.2" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function LocalGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 13.4s4.2-3.35 4.2-6.35A4.2 4.2 0 0 0 8 2.85 4.2 4.2 0 0 0 3.8 7.05C3.8 10.05 8 13.4 8 13.4Z"
        stroke={INK}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="7.05" r="1.35" stroke={INK} strokeWidth="1.4" />
    </svg>
  )
}

function ResearchGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="4.2" y="3.2" width="13.6" height="15.6" rx="1.4" stroke={INK} strokeWidth="1.45" />
      <path d="M7.2 8h7.6M7.2 11h7.6M7.2 14h4.8" stroke={INK} strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  )
}

function VehiclesGlyph({ live = false }: { live?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect
        x="2.8"
        y="3.4"
        width="7.2"
        height="6.4"
        rx="1"
        fill={live ? INK : 'none'}
        fillOpacity={live ? 0.18 : 0}
        stroke={INK}
        strokeWidth={live ? '1.7' : '1.35'}
      />
      <rect
        x="12"
        y="3.4"
        width="7.2"
        height="6.4"
        rx="1"
        fill={live ? INK : 'none'}
        fillOpacity={live ? 0.18 : 0}
        stroke={INK}
        strokeWidth={live ? '1.7' : '1.35'}
      />
      <rect
        x="2.8"
        y="12.2"
        width="7.2"
        height="6.4"
        rx="1"
        fill={live ? INK : 'none'}
        fillOpacity={live ? 0.18 : 0}
        stroke={INK}
        strokeWidth={live ? '1.7' : '1.35'}
      />
      <rect
        x="12"
        y="12.2"
        width="7.2"
        height="6.4"
        rx="1"
        fill={live ? INK : 'none'}
        fillOpacity={live ? 0.18 : 0}
        stroke={INK}
        strokeWidth={live ? '1.7' : '1.35'}
      />
    </svg>
  )
}

function SourceGlyph({ id }: { id: SourceId }) {
  if (id === 'ai') return <AiGlyph />
  if (id === 'local') return <LocalGlyph />
  return <SearchGlyph />
}

/**
 * Self-running discovery console. Search / AI / Local are status, not controls.
 */
export function BuyerIntentStream() {
  const data = discoveryToInventory.intentStream
  const sources = data.sources
  const firstLen = sources[0].question.length

  const [active, setActive] = useState(0)
  const [typed, setTyped] = useState(firstLen)
  const [lit, setLit] = useState(data.signals.length)
  const [handoff, setHandoff] = useState<Handoff>('arrived')
  const [hit, setHit] = useState(true)
  const [typing, setTyping] = useState(false)
  const [reduced, setReduced] = useState(false)

  const activeRef = useRef(0)
  const pausedRef = useRef(false)
  const skipFirstType = useRef(true)
  const timers = useRef<{ tick?: ReturnType<typeof setTimeout> }>({})

  const clearTimers = useCallback(() => {
    if (timers.current.tick) clearTimeout(timers.current.tick)
    timers.current.tick = undefined
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    activeRef.current = active
    const motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (motionOff) {
      clearTimers()
      setTyped(sources[active].question.length)
      setLit(data.signals.length)
      setHandoff('arrived')
      setHit(true)
      setTyping(false)
      return
    }

    let cancelled = false
    const question = sources[active].question
    const typeMs = typeDuration(question.length)
    const charMs = typeMs / Math.max(question.length, 1)

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        let left = ms
        let last = performance.now()
        const poll = () => {
          if (cancelled) {
            resolve()
            return
          }
          const now = performance.now()
          if (!pausedRef.current) left -= now - last
          last = now
          if (left <= 0) {
            resolve()
            return
          }
          timers.current.tick = setTimeout(poll, POLL_MS)
        }
        timers.current.tick = setTimeout(poll, POLL_MS)
      })

    const run = async () => {
      const skipped = skipFirstType.current
      if (skipped) {
        skipFirstType.current = false
        setTyped(question.length)
        setLit(data.signals.length)
        setHandoff('arrived')
        setHit(true)
        setTyping(false)
      } else {
        setTyped(0)
        setLit(0)
        setHandoff('rest')
        setHit(false)
        setTyping(false)
        await wait(ACTIVATE_MS)
        if (cancelled) return
        setTyping(true)
        for (let i = 1; i <= question.length; i++) {
          await wait(charMs)
          if (cancelled) return
          setTyped(i)
        }
        setTyping(false)
        for (let i = 1; i <= data.signals.length; i++) {
          await wait(SIGNAL_STAGGER_MS)
          if (cancelled) return
          setLit(i)
        }
        if (cancelled) return
        setHandoff('travel')
        await wait(TRAVEL_MS)
        if (cancelled) return
        setHandoff('arrived')
        setHit(true)
      }

      const spent = skipped
        ? 0
        : ACTIVATE_MS + typeMs + data.signals.length * SIGNAL_STAGGER_MS + TRAVEL_MS
      await wait(skipped ? HOLD_MIN_MS : Math.max(HOLD_MIN_MS, CYCLE_MS - spent))
      if (cancelled) return
      setActive((current) => (current + 1) % sources.length)
    }

    run()
    return () => {
      cancelled = true
      clearTimers()
    }
  }, [active, clearTimers, data.signals.length, reduced, sources])

  const source = sources[active]
  const visible = source.question.slice(0, typed)

  return (
    <div
      className="bis-console flex h-full flex-col rounded-[8px] border-2 border-ink shadow-[6px_6px_0_0_var(--ink)]"
      onMouseEnter={() => {
        pausedRef.current = true
      }}
      onMouseLeave={() => {
        pausedRef.current = false
      }}
    >
      <p className="sr-only">{data.srDescription}</p>

      <div aria-hidden="true" className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 bg-ink px-4 py-2.5">
          <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-paper md:text-[0.6875rem]">
            {data.label}
          </p>
          <p className="flex items-center gap-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-lime">
            <span className="bis-live-dot h-1.5 w-1.5 shrink-0" />
            {data.liveLabel}
          </p>
        </div>

        <div className="relative grid grid-cols-3 border-b-2 border-ink bg-paper">
          <span
            className="bis-rail-mark"
            style={{ transform: `translateX(${active * 100}%)` }}
          />
          {sources.map((item, i) => {
            const on = i === active
            return (
              <div
                key={item.id}
                className={`flex items-center justify-center gap-1.5 px-1 py-2.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.12em] md:text-[0.6875rem] ${
                  on ? 'text-ink' : 'text-ink/35'
                }`}
              >
                <span className={`h-1.5 w-1.5 shrink-0 ${on ? SOURCE_DOT[item.id] : 'bg-ink/20'}`} />
                {item.name}
              </div>
            )
          })}
        </div>

        <div className="bis-console-body flex min-h-0 flex-1 flex-col justify-between gap-5 px-4 py-4 md:gap-6 md:px-5 md:py-5">
          <div>
            <p className="font-mono text-[0.5625rem] font-medium uppercase tracking-[0.16em] text-ink/45">
              {data.surfacesLabel}
            </p>
            <p className="mt-1 text-[0.75rem] leading-snug text-ink/55">{source.surfaces}</p>
            <div className="mt-3 flex items-start gap-3 border-2 border-ink bg-porcelain px-3 py-3 md:px-3.5 md:py-3.5">
            <span className="mt-0.5 shrink-0">
              <SourceGlyph id={source.id} />
            </span>
            <div className="grid min-w-0 flex-1">
              {sources.map((item) => (
                <p
                  key={`size-${item.id}`}
                  className="col-start-1 row-start-1 invisible font-mono text-[0.8125rem] leading-snug text-ink md:text-[0.9375rem]"
                >
                  {item.question}
                </p>
              ))}
              <p className="col-start-1 row-start-1 font-mono text-[0.8125rem] leading-snug text-ink md:text-[0.9375rem]">
                {visible}
                {!reduced ? (
                  <span className={`bis-caret ${typing ? 'is-typing' : 'is-soft'}`} />
                ) : null}
              </p>
            </div>
          </div>
          </div>

          <div>
            <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-signal-deep">
              {data.signalsLabel}
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {data.signals.map((signal, i) => {
                const on = i < lit
                return (
                  <li
                    key={signal}
                    className={`bis-chip border px-2 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] ${
                      on ? 'border-ink bg-lime text-ink' : 'border-ink/20 bg-paper text-ink/35'
                    }`}
                  >
                    {signal}
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-signal-deep">
              {data.mappedLabel}
            </p>
            <div className="mt-2.5 flex flex-col items-stretch sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-2.5 border-2 border-ink bg-paper px-3 py-3">
                <ResearchGlyph />
                <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink">
                  {data.researchZone}
                </p>
              </div>
              <div className="flex items-center justify-center px-2 py-1.5 sm:px-2.5 sm:py-0">
                <div className="bis-track">
                  <span className={`bis-courier is-${handoff}`} />
                </div>
              </div>
              <div
                className={`bis-dest flex min-w-0 flex-1 items-center gap-2.5 px-3 py-3 ${
                  handoff === 'arrived' ? 'is-live' : ''
                } ${hit ? 'is-hit' : ''}`}
              >
                <VehiclesGlyph live={handoff === 'arrived'} />
                <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink">
                  {data.vehiclesZone}
                </p>
              </div>
            </div>
            <p
              className={`mt-2.5 flex items-center gap-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.14em] ${
                handoff === 'arrived' ? 'text-signal-deep' : 'text-ink/45'
              }`}
            >
              {handoff === 'arrived' ? (
                <span className="h-1.5 w-1.5 shrink-0 bg-lime" />
              ) : (
                <span className="h-1.5 w-1.5 shrink-0 bg-ink/25" />
              )}
              {handoff === 'arrived' ? data.statusActive : data.statusMapping}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
