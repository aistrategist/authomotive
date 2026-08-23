'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { managedFramework } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

const works = managedFramework.works
const COUNT = works.length
const STEP = 72
const START = -90
const RING_R = 38
const RING_C = 2 * Math.PI * RING_R
const DWELL_MS = 4200

function spokePoint(index: number, radius = RING_R) {
  const rad = ((index * STEP + START) * Math.PI) / 180
  return {
    x: 50 + radius * Math.cos(rad),
    y: 50 + radius * Math.sin(rad),
  }
}

function sliceOffset(index: number, progress: number) {
  const from = RING_C * (1 - index / COUNT)
  const to = RING_C * (1 - (index + 1) / COUNT)
  return from + (to - from) * progress
}

export function ManagedFramework() {
  const { hub } = managedFramework
  const [activeId, setActiveId] = useState(works[0]!.id)
  const stageRef = useRef<HTMLDivElement>(null)
  const arcRef = useRef<SVGCircleElement>(null)
  const railRef = useRef<HTMLSpanElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeIndexRef = useRef(0)
  const elapsedRef = useRef(0)
  const heldRef = useRef(false)
  const nearRef = useRef(false)
  const reducedRef = useRef(false)

  const activeIndex = Math.max(0, works.findIndex((work) => work.id === activeId))
  const active = works[activeIndex] ?? works[0]!
  activeIndexRef.current = activeIndex

  const paint = (progress: number, index: number) => {
    const arc = arcRef.current
    if (arc) arc.style.strokeDashoffset = String(sliceOffset(index, progress))
    const rail = railRef.current
    if (rail) rail.style.transform = `scaleX(${(index + progress) / COUNT})`
  }

  const goTo = (index: number, focus = false) => {
    const work = works[index]
    if (!work) return
    elapsedRef.current = 0
    activeIndexRef.current = index
    paint(reducedRef.current ? 1 : 0, index)
    setActiveId(work.id)
    if (focus) tabRefs.current[index]?.focus()
  }

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      reducedRef.current = motion.matches
      paint(motion.matches ? 1 : elapsedRef.current / DWELL_MS, activeIndexRef.current)
    }
    syncMotion()
    motion.addEventListener('change', syncMotion)

    const root = stageRef.current
    const io = new IntersectionObserver(
      ([entry]) => {
        nearRef.current = Boolean(entry?.isIntersecting)
      },
      { rootMargin: '120px 0px', threshold: 0 },
    )
    if (root) io.observe(root)

    let raf = 0
    let last = performance.now()
    let running = true

    const tick = (now: number) => {
      if (!running) return
      const dt = Math.min(48, now - last)
      last = now
      const index = activeIndexRef.current

      if (reducedRef.current) {
        paint(1, index)
      } else if (nearRef.current && !heldRef.current && !document.hidden) {
        elapsedRef.current += dt
        if (elapsedRef.current >= DWELL_MS) {
          const next = (index + 1) % COUNT
          elapsedRef.current = 0
          activeIndexRef.current = next
          paint(0, next)
          setActiveId(works[next]!.id)
        } else {
          paint(elapsedRef.current / DWELL_MS, index)
        }
      } else {
        paint(Math.min(1, elapsedRef.current / DWELL_MS), index)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      motion.removeEventListener('change', syncMotion)
    }
  }, [])

  const hold = () => {
    heldRef.current = true
  }
  const release = () => {
    heldRef.current = false
  }

  const activate = (id: string, focus = false) => {
    const i = works.findIndex((work) => work.id === id)
    if (i < 0) return
    goTo(i, focus)
  }

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = works.length - 1
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    activate(works[next]!.id, true)
  }

  return (
    <section
      id="engagement"
      data-spy="clear"
      aria-labelledby="framework-heading"
      className="scroll-mt-24 border-b border-border bg-alloy"
    >
      <SignalRail step={6} />
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <div className="max-w-[46rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {managedFramework.eyebrow}
          </p>
          <h2
            id="framework-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {managedFramework.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {managedFramework.lead}
          </p>
          <p className="mt-3 text-base font-semibold leading-snug text-ink text-pretty md:text-lg">
            {managedFramework.proof}
          </p>
        </div>

        <div ref={stageRef} className="mf-stage mt-10 md:mt-12">
          <div className="mf-orbit" data-tone={active.tone}>
            <svg className="mf-web" viewBox="0 0 100 100" aria-hidden="true">
              <circle className="mf-web-ring" cx="50" cy="50" r={RING_R} />
              <circle
                ref={arcRef}
                className="mf-load-arc"
                cx="50"
                cy="50"
                r={RING_R}
                style={{ strokeDasharray: RING_C, strokeDashoffset: RING_C }}
              />
              {works.map((work, i) => {
                const point = spokePoint(i)
                return (
                  <line
                    key={work.id}
                    className={`mf-spoke${work.id === activeId ? ' is-on' : ''}`}
                    data-tone={work.tone}
                    x1="50"
                    y1="50"
                    x2={point.x}
                    y2={point.y}
                  />
                )
              })}
              {works.map((work, i) => {
                const point = spokePoint(i)
                return (
                  <circle
                    key={`tick-${work.id}`}
                    className={`mf-tick${work.id === activeId ? ' is-on' : ''}`}
                    data-tone={work.tone}
                    cx={point.x}
                    cy={point.y}
                    r="1.15"
                  />
                )
              })}
            </svg>

            <div className="mf-center">
              <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-signal-deep">
                {hub.kicker}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                {hub.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/80 text-pretty md:text-base">
                {hub.line}
              </p>
            </div>

            <div
              role="tablist"
              aria-label="What works this month"
              className="mf-ring"
              onPointerEnter={hold}
              onPointerLeave={release}
            >
              {works.map((work, i) => {
                const selected = work.id === activeId
                const point = spokePoint(i)
                return (
                  <button
                    key={work.id}
                    ref={(el) => {
                      tabRefs.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={`mf-tab-${work.id}`}
                    aria-selected={selected}
                    aria-controls={`mf-panel-${work.id}`}
                    tabIndex={selected ? 0 : -1}
                    data-tone={work.tone}
                    style={
                      {
                        '--x': `${point.x}%`,
                        '--y': `${point.y}%`,
                      } as CSSProperties
                    }
                    onClick={() => activate(work.id)}
                    onKeyDown={(event) => onTabKeyDown(event, i)}
                    className={`mf-work${selected ? ' is-on' : ''}`}
                  >
                    {work.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mf-rail-load" aria-hidden="true">
            <span
              ref={railRef}
              className="mf-rail-arc"
              data-tone={active.tone}
              style={{ transform: 'scaleX(0)' }}
            />
          </div>

          <div
            className="mf-dock"
            onPointerEnter={hold}
            onPointerLeave={release}
          >
            {works.map((work) => {
              const selected = work.id === activeId
              return (
                <p
                  key={work.id}
                  role="tabpanel"
                  id={`mf-panel-${work.id}`}
                  aria-labelledby={`mf-tab-${work.id}`}
                  data-tone={work.tone}
                  className={`mf-sheet${selected ? ' is-on' : ''}`}
                  inert={selected ? undefined : true}
                  aria-hidden={!selected}
                >
                  <span className="mf-sheet-kicker font-mono">
                    This month · {work.label}
                  </span>
                  {work.move}
                </p>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
