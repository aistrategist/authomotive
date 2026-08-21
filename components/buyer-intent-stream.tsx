'use client'

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { discoveryToInventory } from '@/lib/site-data'

const CYCLE_MS = 7200
const WORD_MS = 95
const HOLD_POLL_MS = 120

type SourceId = (typeof discoveryToInventory.intentStream.sources)[number]['id']

const SOURCE_ACCENT: Record<SourceId, string> = {
  search: 'bg-lime text-ink border-ink',
  ai: 'bg-porcelain text-ink border-ink',
  local: 'bg-action text-ink border-ink',
}

function splitWords(question: string) {
  return question.trim().split(/\s+/)
}

/**
 * Contained Search / AI / Local intent panel. Isolated from the hero graphic.
 */
export function BuyerIntentStream() {
  const data = discoveryToInventory.intentStream
  const sources = data.sources
  const reactId = useId()
  const panelId = `${reactId}-panel`

  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(() => splitWords(sources[0].question).length)
  const [reduced, setReduced] = useState(false)

  const activeRef = useRef(0)
  const pausedRef = useRef(false)
  const hoverRef = useRef(false)
  const focusRef = useRef(false)
  const skipFirstReveal = useRef(true)
  const tabRefs = useRef(Array.from({ length: sources.length }, () => null as HTMLButtonElement | null))
  const timers = useRef<{ word?: ReturnType<typeof setTimeout>; hold?: ReturnType<typeof setTimeout> }>({})

  const clearTimers = useCallback(() => {
    if (timers.current.word) clearTimeout(timers.current.word)
    if (timers.current.hold) clearTimeout(timers.current.hold)
    timers.current.word = undefined
    timers.current.hold = undefined
  }, [])

  const syncPaused = useCallback(() => {
    pausedRef.current = hoverRef.current || focusRef.current
  }, [])

  const goTo = useCallback(
    (index: number, animate: boolean) => {
      const next = (index + sources.length) % sources.length
      activeRef.current = next
      setActive(next)
      const total = splitWords(sources[next].question).length
      const motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setShown(animate && !motionOff ? 0 : total)
    },
    [sources],
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      setReduced(mq.matches)
      if (mq.matches) {
        clearTimers()
        setShown(splitWords(sources[activeRef.current].question).length)
      }
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [clearTimers, sources])

  useEffect(() => {
    activeRef.current = active
    const motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const words = splitWords(sources[active].question)
    const total = words.length

    if (motionOff) {
      clearTimers()
      setShown(total)
      return
    }

    const beginHold = () => {
      const used = Math.min(total * WORD_MS, 1800)
      let remaining = Math.max(CYCLE_MS - used, 5000)
      let last = performance.now()

      const poll = () => {
        const now = performance.now()
        if (!pausedRef.current) remaining -= now - last
        last = now
        if (remaining <= 0) {
          goTo(activeRef.current + 1, true)
          return
        }
        timers.current.hold = setTimeout(poll, HOLD_POLL_MS)
      }
      timers.current.hold = setTimeout(poll, HOLD_POLL_MS)
    }

    if (skipFirstReveal.current) {
      skipFirstReveal.current = false
      setShown(total)
      beginHold()
      return () => clearTimers()
    }

    clearTimers()
    let count = 0
    setShown(0)

    const reveal = () => {
      if (pausedRef.current) {
        timers.current.word = setTimeout(reveal, HOLD_POLL_MS)
        return
      }
      count += 1
      setShown(count)
      if (count < total) {
        timers.current.word = setTimeout(reveal, WORD_MS)
      } else {
        beginHold()
      }
    }
    timers.current.word = setTimeout(reveal, WORD_MS)

    return () => clearTimers()
  }, [active, clearTimers, goTo, reduced, sources])

  const source = sources[active]
  const words = splitWords(source.question)

  function select(index: number) {
    if (index === activeRef.current) return
    skipFirstReveal.current = false
    goTo(index, !reduced)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const key = event.key
    if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End') return
    event.preventDefault()
    let next = active
    if (key === 'ArrowRight') next = active + 1
    if (key === 'ArrowLeft') next = active - 1
    if (key === 'Home') next = 0
    if (key === 'End') next = sources.length - 1
    next = (next + sources.length) % sources.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div
      className="flex h-full flex-col justify-between gap-6 rounded-[8px] border-2 border-ink bg-paper p-5 shadow-[6px_6px_0_0_var(--ink)] md:p-6"
      onMouseEnter={() => {
        hoverRef.current = true
        syncPaused()
      }}
      onMouseLeave={() => {
        hoverRef.current = false
        syncPaused()
      }}
      onFocusCapture={() => {
        focusRef.current = true
        syncPaused()
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          focusRef.current = false
          syncPaused()
        }
      }}
    >
      <div className="min-w-0">
      <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-signal-deep md:text-xs">
        {data.label}
      </p>

      <div
        role="tablist"
        aria-label="Discovery source"
        className="mt-4 flex flex-wrap gap-2"
        onKeyDown={onKeyDown}
      >
        {sources.map((item, i) => {
          const selected = i === active
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${reactId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={`min-h-11 min-w-[4.5rem] border-2 px-3 py-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] md:text-xs ${
                selected ? SOURCE_ACCENT[item.id] : 'border-ink bg-paper text-ink'
              }`}
              onClick={() => select(i)}
            >
              {item.name}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${reactId}-tab-${source.id}`}
        className="mt-5 min-w-0"
      >
        <p className="sr-only">{source.question}</p>
        <div className="grid">
          {sources.map((item) => (
            <p
              key={`size-${item.id}`}
              className="col-start-1 row-start-1 invisible text-xl font-semibold leading-snug tracking-tight text-ink md:text-[1.35rem]"
              aria-hidden="true"
            >
              {item.question}
            </p>
          ))}
          <p
            className="col-start-1 row-start-1 text-xl font-semibold leading-snug tracking-tight text-ink md:text-[1.35rem]"
            aria-hidden="true"
          >
            {words.map((word, i) => (
              <span
                key={`${source.id}-${i}`}
                className={`inline ${reduced ? '' : 'transition-opacity duration-200'} ${
                  i < shown ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {word}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>
      </div>

      <div>
        <div>
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-signal-deep">
            {data.signalsLabel}
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {data.signals.map((signal) => (
              <li key={signal} className="flex items-center gap-2.5 text-sm leading-snug text-ink">
                <span className="h-2 w-2 shrink-0 bg-ink" aria-hidden="true" />
                {signal}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div>
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-signal-deep">
            {data.opportunityLabel}
          </p>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-stretch">
            <div className="min-w-0 flex-1 border-2 border-ink px-3 py-3">
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-signal-deep">
                {data.researchLabel}
              </p>
            </div>
            <div className="flex h-4 shrink-0 items-center justify-center sm:h-auto sm:w-4" aria-hidden="true">
              <span className="h-2 w-2 bg-lime" />
            </div>
            <div className="min-w-0 flex-1 border-2 border-ink px-3 py-3">
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-signal-deep">
                {data.inventoryLabel}
              </p>
            </div>
          </div>
          <p className="mt-3 text-base font-semibold leading-snug tracking-tight text-ink">
            {data.opportunity}
          </p>
        </div>
      </div>
    </div>
  )
}
