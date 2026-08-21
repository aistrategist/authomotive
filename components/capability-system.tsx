'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { capabilitySystem } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const jobs = capabilitySystem.capabilities

const jobLooks = [
  {
    selected: {
      card: 'border-ink bg-ink text-paper',
      shadow: 'shadow-[4px_4px_0_0_var(--accent)]',
      eyebrow: 'text-accent',
      eyebrowQuiet: 'text-accent/80',
      number: 'text-paper/20',
      arrow: 'text-accent',
      focus: 'focus-visible:outline-accent',
      rail: 'bg-accent',
      panelTop: 'border-t-accent',
      quote: 'border-accent',
      dot: 'bg-signal-deep',
      tone: 'accent' as const,
    },
    rest: {
      card: 'border-ink bg-accent-soft text-ink',
      shadow: 'shadow-[4px_4px_0_0_var(--ink)]',
      eyebrow: 'text-ink',
      eyebrowQuiet: 'text-ink/70',
      number: 'text-ink/15',
      arrow: 'text-accent-deep',
      focus: 'focus-visible:outline-accent-deep',
      rail: 'bg-accent-deep',
      panelTop: 'border-t-accent',
      quote: 'border-accent',
      dot: 'bg-signal-deep',
      tone: 'accent' as const,
    },
  },
  {
    selected: {
      card: 'border-ink bg-ink text-paper',
      shadow: 'shadow-[4px_4px_0_0_var(--proof)]',
      eyebrow: 'text-proof',
      eyebrowQuiet: 'text-proof/80',
      number: 'text-paper/20',
      arrow: 'text-proof',
      focus: 'focus-visible:outline-proof',
      rail: 'bg-proof',
      panelTop: 'border-t-proof',
      quote: 'border-proof',
      dot: 'bg-proof-deep',
      tone: 'proof' as const,
    },
    rest: {
      card: 'border-ink bg-proof-soft text-ink',
      shadow: 'shadow-[4px_4px_0_0_var(--ink)]',
      eyebrow: 'text-ink',
      eyebrowQuiet: 'text-ink/70',
      number: 'text-ink/15',
      arrow: 'text-proof-deep',
      focus: 'focus-visible:outline-proof-deep',
      rail: 'bg-proof-deep',
      panelTop: 'border-t-proof',
      quote: 'border-proof',
      dot: 'bg-proof-deep',
      tone: 'proof' as const,
    },
  },
  {
    selected: {
      card: 'border-ink bg-ink text-paper',
      shadow: 'shadow-[4px_4px_0_0_var(--paper)]',
      eyebrow: 'text-paper',
      eyebrowQuiet: 'text-paper/80',
      number: 'text-paper/20',
      arrow: 'text-paper',
      focus: 'focus-visible:outline-paper',
      rail: 'bg-paper',
      panelTop: 'border-t-ink',
      quote: 'border-ink',
      dot: 'bg-ink',
      tone: 'paper' as const,
    },
    rest: {
      card: 'border-ink bg-porcelain text-ink',
      shadow: 'shadow-[4px_4px_0_0_var(--ink)]',
      eyebrow: 'text-ink',
      eyebrowQuiet: 'text-ink/70',
      number: 'text-ink/15',
      arrow: 'text-ink',
      focus: 'focus-visible:outline-ink',
      rail: 'bg-ink',
      panelTop: 'border-t-ink',
      quote: 'border-ink',
      dot: 'bg-ink',
      tone: 'ink' as const,
    },
  },
] as const

const busColors = ['var(--accent)', 'var(--proof)', 'var(--ink)'] as const

function jobLook(index: number, selected: boolean) {
  const look = jobLooks[index] ?? jobLooks[0]
  return selected ? look.selected : look.rest
}

function JobMotif({ id, tone }: { id: string; tone: 'accent' | 'proof' | 'ink' | 'paper' }) {
  const stroke =
    tone === 'proof'
      ? 'var(--proof-deep)'
      : tone === 'paper'
        ? 'var(--paper)'
        : tone === 'ink'
          ? 'var(--ink)'
          : 'var(--accent)'
  const mark =
    tone === 'proof' ? 'var(--proof)' : tone === 'paper' ? 'var(--paper)' : tone === 'ink' ? 'var(--ink)' : 'var(--accent-deep)'

  if (id === 'get-found') {
    return (
      <svg width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden="true">
        <path
          className="cap-ill-path"
          pathLength={1}
          d="M4 32 C16 32, 18 8, 32 8 S48 28, 52 12"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="4" cy="32" r="3" fill={mark} />
        <circle className="cap-ill-end" cx="52" cy="12" r="3" fill={stroke} />
      </svg>
    )
  }
  if (id === 'know-working') {
    return (
      <svg width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden="true">
        {[10, 16, 14, 22, 28].map((h, i) => (
          <rect
            key={i}
            className="cap-ill-bar"
            x={6 + i * 10}
            y={36 - h}
            width="6"
            height={h}
            fill={i === 4 ? mark : stroke}
            opacity={i === 4 ? 1 : 0.45}
          />
        ))}
      </svg>
    )
  }
  return (
    <svg width="56" height="40" viewBox="0 0 56 40" fill="none" aria-hidden="true">
      <path className="cap-ill-path" pathLength={1} d="M8 20 H48" stroke={stroke} strokeWidth="1.5" />
      <circle className="cap-ill-node" cx="8" cy="20" r="4" fill={stroke} />
      <circle className="cap-ill-node" cx="28" cy="20" r="4" fill={mark} />
      <circle className="cap-ill-node" cx="48" cy="20" r="4" fill={stroke} />
    </svg>
  )
}

export function CapabilitySystem() {
  const [activeId, setActiveId] = useState(jobs[0].id)
  const [stacked, setStacked] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const spineRef = useRef<HTMLSpanElement>(null)
  const branchRef = useRef<HTMLSpanElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const playedRef = useRef(new Set<string>())
  const primedRef = useRef(false)
  const apiRef = useRef<{
    layoutBus: (index?: number) => void
    playIllustration: (id: string, instant?: boolean) => void
  }>({ layoutBus: () => {}, playIllustration: () => {} })
  const activeIndex = jobs.findIndex((c) => c.id === activeId)
  const active = jobs[activeIndex] ?? jobs[0]
  const look = jobLook(activeIndex, true)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const apply = () => setStacked(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useGSAP(
    () => {
      const root = rootRef.current
      const stage = stageRef.current
      const panel = panelRef.current
      const rule = ruleRef.current
      const spine = spineRef.current
      const branch = branchRef.current
      if (!root || !stage || !panel || !rule || !spine || !branch) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const played = playedRef.current

      const layoutBus = (index?: number) => {
        const i = index ?? Number(stage.dataset.capJob ?? 0)
        const sr = stage.getBoundingClientRect()
        const pts = [...stage.querySelectorAll<HTMLElement>('.cap-station')].map((el) => {
          const r = el.getBoundingClientRect()
          return { x: r.left + r.width / 2 - sr.left, y: r.top + r.height / 2 - sr.top }
        })
        if (pts.length < 3) return
        const panelTop = panel.getBoundingClientRect().top - sr.top
        const isStacked = window.matchMedia('(max-width: 1023px)').matches
        if (isStacked) {
          spine.style.left = `${pts[0]!.x - 1}px`
          spine.style.top = `${pts[0]!.y}px`
          spine.style.width = '2px'
          spine.style.height = `${pts[2]!.y - pts[0]!.y}px`
        } else {
          spine.style.left = `${pts[0]!.x}px`
          spine.style.top = `${pts[0]!.y - 1}px`
          spine.style.height = '2px'
          spine.style.width = `${pts[2]!.x - pts[0]!.x}px`
        }
        branch.style.left = `${pts[i]!.x - 1}px`
        branch.style.top = `${pts[i]!.y}px`
        branch.style.width = '2px'
        branch.style.height = `${Math.max(8, panelTop - pts[i]!.y)}px`
        branch.style.background = busColors[i] ?? busColors[0]
        stage.querySelectorAll<HTMLElement>('.cap-station').forEach((el, n) => {
          el.classList.toggle('is-on', n === i)
        })
      }

      const playIllustration = (id: string, instant = false) => {
        const wrap = stage.querySelector<HTMLElement>(`[data-cap-ill="${id}"]`)
        if (!wrap) return
        const paths = wrap.querySelectorAll<SVGElement>('.cap-ill-path')
        const bars = wrap.querySelectorAll<SVGElement>('.cap-ill-bar')
        const nodes = wrap.querySelectorAll<SVGElement>('.cap-ill-node')
        const ends = wrap.querySelectorAll<SVGElement>('.cap-ill-end')
        const skip = instant || reduced || played.has(id)
        if (skip) {
          gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 0 })
          gsap.set(bars, { scaleY: 1, transformOrigin: '50% 100%' })
          gsap.set(nodes, { scale: 1, transformOrigin: '50% 50%' })
          gsap.set(ends, { scale: 1, transformOrigin: '50% 50%' })
          played.add(id)
          return
        }
        played.add(id)
        if (paths.length) {
          gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
          gsap.to(paths, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
        }
        if (ends.length) {
          gsap.fromTo(
            ends,
            { scale: 0 },
            { scale: 1, duration: 0.2, delay: 0.32, ease: 'power2.out', transformOrigin: '50% 50%', overwrite: 'auto' },
          )
        }
        if (bars.length) {
          gsap.fromTo(
            bars,
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 0.38,
              stagger: 0.05,
              ease: 'power2.out',
              transformOrigin: '50% 100%',
              overwrite: 'auto',
            },
          )
        }
        if (nodes.length) {
          gsap.fromTo(
            nodes,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.2,
              stagger: 0.06,
              delay: 0.2,
              ease: 'power2.out',
              transformOrigin: '50% 50%',
              overwrite: 'auto',
            },
          )
        }
      }

      const complete = () => {
        gsap.set(rule, { scaleX: 1 })
        gsap.set(spine, { scaleX: 1, scaleY: 1 })
        gsap.set(branch, { scaleY: 1 })
        layoutBus(0)
        jobs.forEach((job) => playIllustration(job.id, true))
      }

      const onResize = () => layoutBus()
      window.addEventListener('resize', onResize)
      apiRef.current = { layoutBus, playIllustration }

      if (reduced) {
        complete()
        return () => window.removeEventListener('resize', onResize)
      }

      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })
      const stackedNow = window.matchMedia('(max-width: 1023px)').matches
      if (stackedNow) gsap.set(spine, { scaleX: 1, scaleY: 0, transformOrigin: 'top center' })
      else gsap.set(spine, { scaleX: 0, scaleY: 1, transformOrigin: 'left center' })
      gsap.set(branch, { scaleY: 0, transformOrigin: 'top center' })
      layoutBus(0)

      ScrollTrigger.create({
        trigger: stage,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          const vertical = window.matchMedia('(max-width: 1023px)').matches
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
          tl.to(rule, { scaleX: 1, duration: 0.4 }, 0)
          tl.to(spine, vertical ? { scaleY: 1, duration: 0.45 } : { scaleX: 1, duration: 0.45 }, 0.08)
          tl.add(() => {
            layoutBus(0)
            playIllustration(jobs[0]!.id)
          }, 0.5)
          tl.to(branch, { scaleY: 1, duration: 0.28 }, 0.52)
        },
      })

      ScrollTrigger.refresh()

      return () => window.removeEventListener('resize', onResize)
    },
    { scope: rootRef },
  )

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    stage.dataset.capJob = String(activeIndex)
    apiRef.current.layoutBus(activeIndex)
  }, [activeIndex, stacked])

  useEffect(() => {
    if (!primedRef.current) {
      primedRef.current = true
      return
    }
    apiRef.current.playIllustration(activeId)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const body = stageRef.current?.querySelector<HTMLElement>('.cap-panel-body:not([inert])')
    if (!body || reduced) return
    gsap.fromTo(body, { y: 3 }, { y: 0, duration: 0.26, ease: 'power2.out', overwrite: 'auto' })
  }, [activeId])

  const activate = (id: string, focus = false) => {
    flushSync(() => {
      setActiveId(id)
    })
    if (focus) {
      const i = jobs.findIndex((c) => c.id === id)
      tabRefs.current[i]?.focus()
    }
  }

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = jobs.length - 1
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    activate(jobs[next]!.id, true)
  }

  return (
    <section
      ref={rootRef}
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative scroll-mt-24 border-b border-border bg-paper"
    >
      <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <span ref={ruleRef} className="cap-chapter-rule" aria-hidden="true" />
        <SignalRail tone="ink" />
        <div className="max-w-[46.5rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {capabilitySystem.eyebrow}
          </p>
          <h2
            id="capabilities-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {capabilitySystem.headline}
          </h2>
          <p className="lede mt-4 max-w-[33.75rem] text-lg leading-relaxed text-muted-foreground text-pretty">
            {capabilitySystem.supporting}
          </p>
        </div>

        <div ref={stageRef} className="cap-stage relative mt-10 md:mt-12">
          <div
            role="tablist"
            aria-label="Capabilities"
            aria-orientation={stacked ? 'vertical' : 'horizontal'}
            className="flex flex-col items-stretch gap-5 lg:flex-row lg:justify-start lg:gap-5"
          >
            {jobs.map((cap, i) => {
              const selected = cap.id === activeId
              const job = jobLook(i, selected)
              return (
                <button
                  key={cap.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`cap-tab-${cap.id}`}
                  aria-selected={selected}
                  aria-controls="cap-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => activate(cap.id)}
                  onKeyDown={(event) => onTabKeyDown(event, i)}
                  className={`job-card relative flex min-h-[11rem] w-full min-w-0 flex-col rounded-[8px] border-2 px-5 py-5 text-left lg:min-h-[12.5rem] lg:flex-1 lg:px-6 ${job.card} ${job.shadow} ${job.focus} focus-visible:outline-2 focus-visible:outline-offset-2`}
                >
                  <span className={`cap-station ${selected ? 'is-on' : ''}`} aria-hidden="true" />
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[6px]" aria-hidden="true">
                    <span className={`absolute right-3 top-2 font-mono text-[4.5rem] font-bold leading-none ${job.number}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                  <span className={`relative z-[1] font-mono text-[11px] font-medium uppercase tracking-[0.16em] ${selected ? job.eyebrow : job.eyebrowQuiet}`}>
                    Job {i + 1} · {cap.brandedName}
                  </span>
                  <span className="relative z-[1] mt-auto text-xl font-semibold leading-snug tracking-tight md:text-2xl">
                    {cap.plainName}
                  </span>
                  <span className="relative z-[1] mt-4 flex w-full items-end justify-between gap-3">
                    <span className={job.arrow} aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                          d="M3 10h12m0 0l-4.5-4.5M15 10l-4.5 4.5"
                          stroke="currentColor"
                          strokeWidth={selected ? 2.5 : 2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span data-cap-ill={cap.id} className="pointer-events-none" aria-hidden="true">
                      <JobMotif id={cap.id} tone={job.tone} />
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="cap-bus" aria-hidden="true">
            <span ref={spineRef} className="cap-bus-spine" />
            <span ref={branchRef} className="cap-bus-branch" />
          </div>

          <div
            ref={panelRef}
            role="tabpanel"
            id="cap-panel"
            aria-labelledby={`cap-tab-${active.id}`}
            className={`cap-panel mt-2 rounded-[8px] border-2 border-ink border-t-[6px] bg-porcelain shadow-[6px_6px_0_0_var(--color-ink)] ${look.panelTop}`}
          >
            <div className="cap-panel-head">
              {jobs.map((cap) => {
                const selected = cap.id === activeId
                return (
                  <div
                    key={cap.id}
                    className="cap-head-row"
                    inert={selected ? undefined : true}
                    aria-hidden={!selected}
                  >
                    <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">{cap.brandedName}</p>
                    <a href={cap.nextHref} className="cap-dock">
                      {cap.nextLabel}{' '}
                      <span className="cap-dock-arrow" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </div>
                )
              })}
            </div>

            <div className="cap-panel-stack">
              {jobs.map((cap, i) => {
                const selected = cap.id === activeId
                const panelLook = jobLook(i, true)
                return (
                  <div
                    key={cap.id}
                    className="cap-panel-body"
                    inert={selected ? undefined : true}
                    aria-hidden={!selected}
                  >
                    <div className="grid gap-6 p-6 md:grid-cols-12 md:gap-10 md:p-7">
                      <div className="flex flex-col gap-4 md:col-span-7">
                        <div>
                          <h3 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
                            {cap.primaryMessage}
                          </h3>
                          <p className="mt-2.5 text-base leading-relaxed text-muted-foreground md:text-lg text-pretty">
                            {cap.supporting}
                          </p>
                        </div>
                        <blockquote className={`border-l-4 pl-4 text-lg font-semibold leading-snug text-ink text-pretty ${panelLook.quote}`}>
                          {cap.keyLine}
                        </blockquote>
                      </div>
                      <div className="flex flex-col gap-5 md:col-span-5">
                        <div>
                          <p className="text-base font-semibold uppercase tracking-wide text-ink">
                            {cap.outcomesTitle}
                          </p>
                          <ul className="mt-3 flex flex-col gap-2">
                            {cap.outcomes.slice(0, 4).map((outcome) => (
                              <li key={outcome} className="flex items-start gap-2.5 text-base leading-relaxed text-ink">
                                <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${panelLook.dot}`} aria-hidden="true" />
                                {outcome}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
