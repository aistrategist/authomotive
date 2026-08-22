'use client'

import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { aiDiscovery, authorityTheater, cta } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ViewId = 'shopper' | 'discovery' | 'measurable'

const views = authorityTheater.views

const lensUi = [
  {
    id: 'shopper' as const,
    micro: '01 · SHOPPER',
    main: 'What buyers see',
    short: 'Shopper',
    mark: '01',
  },
  {
    id: 'discovery' as const,
    micro: '02 · DISCOVERY',
    main: 'What systems read',
    short: 'Discovery',
    mark: '02',
  },
  {
    id: 'measurable' as const,
    micro: '03 · MEASUREMENT',
    main: 'What dealers know',
    short: 'Measurement',
    mark: '03',
  },
] as const

/** Lens → commercial outcome card beneath the browser (order matches tabs) */
const outcomes = [
  { id: 'shopper' as const, mark: 'bg-paper', label: 'Buyers guided' },
  { id: 'discovery' as const, mark: 'bg-accent', label: 'Discovery earned' },
  { id: 'measurable' as const, mark: 'bg-proof', label: 'Actions measured' },
] as const

const observerFrames = [
  { lens: 'shopper' as const, spot: 'answer', station: '01', label: 'ANSWER FOUND' },
  { lens: 'shopper' as const, spot: 'priorities', station: '02', label: 'NEEDS CLARIFIED' },
  { lens: 'shopper' as const, spot: 'inventory', station: '03', label: 'INVENTORY NEXT' },
  { lens: 'discovery' as const, spot: 'answer', station: '01', label: 'DIRECT ANSWER' },
  { lens: 'discovery' as const, spot: 'structure', station: '02', label: 'CLEAR STRUCTURE' },
  { lens: 'discovery' as const, spot: 'inventory', station: '03', label: 'INVENTORY PATH' },
  { lens: 'measurable' as const, spot: 'priorities', station: '01', label: 'PRIORITY SELECT' },
  { lens: 'measurable' as const, spot: 'compare', station: '02', label: 'COMPARISON OPEN' },
  { lens: 'measurable' as const, spot: 'inventory', station: '03', label: 'INVENTORY CLICK' },
  { lens: 'measurable' as const, spot: 'contact', station: '04', label: 'CONTACT START' },
] as const

const observerChip: Record<ViewId, string> = {
  shopper: 'SHOPPER VIEW',
  discovery: 'SEARCH + AI VIEW',
  measurable: 'SIGNAL VIEW',
}

const outcomeCount: Record<ViewId, string> = {
  shopper: '3 DECISION STEPS',
  discovery: '3 READABLE ELEMENTS',
  measurable: '4 CAPTURED ACTIONS',
}

const shopperRoute = [
  { station: 'Question answered', support: 'Family-fit guidance' },
  { station: 'Needs clarified', support: 'Priorities made clear' },
  { station: 'Inventory reached', support: 'Matching vehicles next' },
] as const

const discoveryPoints = [
  {
    spot: 'answer',
    label: 'Direct answer',
    detail: 'The buyer question is answered plainly near the top, in crawlable HTML.',
  },
  {
    spot: 'structure',
    label: 'Clear structure',
    detail: 'Headings, comparisons, and FAQs are organized so search and AI systems can trust the page.',
  },
  {
    spot: 'inventory',
    label: 'Inventory pathway',
    detail: 'Useful research connects to matching vehicles the dealership can sell.',
  },
] as const

const measuredActions = [
  { spot: 'priorities', action: 'Priority selected', signal: 'Which needs get chosen' },
  { spot: 'compare', action: 'Comparison opened', signal: 'Which decisions get weighed' },
  { spot: 'inventory', action: 'Inventory clicked', signal: 'Research moving to vehicles' },
  { spot: 'contact', action: 'Contact started', signal: 'High-intent contact' },
] as const

const foundationItems = [
  { n: '01', label: 'Identity' },
  { n: '02', label: 'Brands & services' },
  { n: '03', label: 'Inventory pathways' },
  { n: '04', label: 'Structured FAQs' },
] as const

const priorities = [
  'Seating for 7+',
  'All-wheel drive',
  'Cargo space',
  'Fuel efficiency',
  'Towing',
] as const

function pinLabel(n: number) {
  return String(n).padStart(2, '0')
}

function LensGlyph({ id, className = 'ae-glyph' }: { id: ViewId; className?: string }) {
  if (id === 'shopper') {
    return (
      <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="5" cy="10" r="2.25" fill="currentColor" />
        <path d="M7.5 10h5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" fill="none" />
        <path d="M13 7.5 16 10l-3 2.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" fill="none" />
        <circle cx="5" cy="10" r="5.5" stroke="currentColor" strokeWidth="1.25" fill="none" opacity="0.45" />
      </svg>
    )
  }
  if (id === 'discovery') {
    return (
      <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="4.5" cy="4.5" r="2" fill="currentColor" />
        <circle cx="15.5" cy="4.5" r="2" fill="currentColor" />
        <circle cx="10" cy="15.5" r="2" fill="currentColor" />
        <path
          d="M5.8 5.8 8.8 13.2M14.2 5.8 11.2 13.2M6.5 4.5h7"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    )
  }
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 14.5 7.5 8l3 3.5L17 4.5" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="square" />
      <circle cx="17" cy="4.5" r="1.75" fill="currentColor" />
      <path d="M3 16.5h14" stroke="currentColor" strokeWidth="1.25" opacity="0.45" />
    </svg>
  )
}

function apertureGeometry(tab: HTMLElement, workspace: HTMLElement) {
  const tabBox = tab.getBoundingClientRect()
  const box = workspace.getBoundingClientRect()
  const originX = Math.min(Math.max(tabBox.left + tabBox.width / 2 - box.left, 0), box.width)
  const originY = 0
  const radius = Math.ceil(
    Math.max(
      Math.hypot(originX, originY),
      Math.hypot(box.width - originX, originY),
      Math.hypot(originX, box.height - originY),
      Math.hypot(box.width - originX, box.height - originY),
    ) + 16,
  )
  return { originX, originY, radius }
}

function ObserverFrame({
  lens,
  station,
  label,
  active,
}: {
  lens: ViewId
  station: string
  label: string
  active: boolean
}) {
  return (
    <span
      className="ae-observer-frame"
      data-lens={lens}
      data-active={active ? 'true' : 'false'}
      aria-hidden="true"
    >
      <span className="ae-observer-tint" />
      <span className="ae-observer-ring" />
      <span className="ae-observer-corners" />
      {lens === 'shopper' ? <span className="ae-observer-notch" /> : null}
      {lens === 'discovery' ? <span className="ae-observer-reg" /> : null}
      {lens === 'measurable' ? (
        <>
          <span className="ae-observer-node ae-observer-node-tl" />
          <span className="ae-observer-node ae-observer-node-tr" />
          <span className="ae-observer-node ae-observer-node-bl" />
          <span className="ae-observer-node ae-observer-node-br" />
        </>
      ) : null}
      <span className="ae-observer-label font-mono">
        <span className="ae-observer-label-text">{label}</span>
        <span className="ae-observer-station">{station}</span>
      </span>
    </span>
  )
}

function framesForSpot(spot: string, view: ViewId) {
  return observerFrames
    .filter((frame) => frame.spot === spot)
    .map((frame) => (
      <ObserverFrame
        key={`${frame.lens}-${frame.spot}-${frame.station}`}
        lens={frame.lens}
        station={frame.station}
        label={frame.label}
        active={view === frame.lens}
      />
    ))
}

function InspectorShell({
  active,
  lens,
  mark,
  eyebrow,
  count,
  outcomeLabel,
  outcomeValue,
  children,
  label,
}: {
  active: boolean
  lens: ViewId
  mark: string
  eyebrow: string
  count: string
  outcomeLabel: string
  outcomeValue: string
  children: ReactNode
  label: string
}) {
  return (
    <div
      className="ae-inspector-panel"
      data-lens={lens}
      data-active={active ? 'true' : 'false'}
      aria-hidden={!active}
      inert={!active ? true : undefined}
      aria-label={label}
    >
      <p className="ae-inspector-eyebrow font-mono">{eyebrow}</p>
      <div className="ae-inspector-body">
        <span className="ae-inspector-spine" aria-hidden="true" />
        <span className="ae-inspector-mark" aria-hidden="true">
          <span className="ae-inspector-mark-n font-mono">{mark}</span>
          <LensGlyph id={lens} className="ae-inspector-mark-glyph" />
        </span>
        {children}
      </div>
      <div className="ae-outcome">
        <div className="ae-outcome-meta">
          <p className="ae-outcome-eyebrow font-mono font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {outcomeLabel}
          </p>
          <p className="ae-outcome-count font-mono" aria-hidden="true">
            {count}
          </p>
        </div>
        <p className="ae-outcome-value mt-1 font-semibold tracking-tight text-ink">{outcomeValue}</p>
      </div>
    </div>
  )
}

export function AuthorityExperience() {
  const [view, setView] = useState<ViewId>('shopper')
  const rootRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)
  const baseRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const sweepRef = useRef<HTMLSpanElement>(null)
  const bridgePacketRef = useRef<HTMLSpanElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const lensTlRef = useRef<gsap.core.Timeline | null>(null)
  const runLensRef = useRef<(id: ViewId, instant?: boolean) => void>(() => {})
  const lensReadyRef = useRef(false)
  const lensPrimedRef = useRef(false)
  const viewRef = useRef(view)
  viewRef.current = view
  const activeIndex = views.findIndex((v) => v.id === view)

  useGSAP(
    () => {
      const frame = frameRef.current
      const rule = ruleRef.current
      const root = rootRef.current
      const workspace = workspaceRef.current
      const base = baseRef.current
      const reveal = revealRef.current
      const sweep = sweepRef.current
      const bridgePacket = bridgePacketRef.current
      if (!frame || !rule || !root || !workspace || !base || !reveal) return

      const allFrames = () => gsap.utils.toArray<HTMLElement>('.ae-observer-frame', root)
      const framesFor = (id: ViewId) =>
        gsap.utils.toArray<HTMLElement>(`.ae-observer-frame[data-lens="${id}"]`, root)

      const asTargets = (els: (Element | null | undefined)[]) =>
        els.filter((el): el is HTMLElement => el instanceof HTMLElement)

      const setIf = (target: gsap.TweenTarget | null | undefined, vars: gsap.TweenVars) => {
        if (!target) return
        const targets = gsap.utils.toArray(target)
        if (targets.length) gsap.set(targets, vars)
      }

      const killIf = (els: (Element | null | undefined)[]) => {
        const targets = asTargets(els)
        if (targets.length) gsap.killTweensOf(targets)
      }

      const frameParts = (frames: HTMLElement[]) =>
        frames.flatMap((el) =>
          [
            el,
            el.querySelector<HTMLElement>('.ae-observer-ring'),
            el.querySelector<HTMLElement>('.ae-observer-corners'),
            el.querySelector<HTMLElement>('.ae-observer-label'),
            el.querySelector<HTMLElement>('.ae-observer-notch'),
            el.querySelector<HTMLElement>('.ae-observer-reg'),
            ...gsap.utils.toArray<HTMLElement>('.ae-observer-node', el),
          ].filter((node): node is HTMLElement => node instanceof HTMLElement),
        )

      const settleFrames = (id: ViewId) => {
        allFrames().forEach((el) => {
          const live = el.dataset.lens === id
          el.dataset.active = live ? 'true' : 'false'
          const ring = el.querySelector<HTMLElement>('.ae-observer-ring')
          const corners = el.querySelector<HTMLElement>('.ae-observer-corners')
          const label = el.querySelector<HTMLElement>('.ae-observer-label')
          const nodes = gsap.utils.toArray<HTMLElement>('.ae-observer-node', el)
          if (live) {
            setIf(el, { autoAlpha: 1 })
            if (ring) setIf(ring, { clipPath: 'inset(0 0 0 0)', opacity: 1 })
            if (corners) setIf(corners, { opacity: 1 })
            if (label) setIf(label, { autoAlpha: 1 })
            if (nodes.length) setIf(nodes, { opacity: 1, scale: 1 })
          } else {
            setIf(el, { autoAlpha: 0 })
          }
        })
      }

      const settlePanel = (id: ViewId) => {
        const panel = root.querySelector<HTMLElement>(`.ae-inspector-panel[data-lens="${id}"]`)
        if (!panel) return
        const spine = panel.querySelector<HTMLElement>('.ae-inspector-spine')
        const stations = gsap.utils.toArray<HTMLElement>('.ae-station', panel)
        const outcome = panel.querySelector<HTMLElement>('.ae-outcome')
        if (spine) setIf(spine, { scaleY: 1, transformOrigin: 'top center' })
        stations.forEach((el) => setIf(el, { autoAlpha: 1, y: 0 }))
        if (outcome) setIf(outcome, { autoAlpha: 1 })
      }

      const clearWillChange = () => {
        setIf(reveal, { clearProps: 'willChange' })
        setIf(base, { clearProps: 'willChange' })
        setIf(sweep, { clearProps: 'willChange' })
        setIf(bridgePacket, { clearProps: 'willChange,transform' })
        const parts = frameParts(allFrames())
        if (parts.length) setIf(parts, { clearProps: 'willChange' })
      }

      const runLens = (id: ViewId, instant = false) => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const mobile = window.innerWidth < 768
        const docked = window.innerWidth >= 1200
        const tab = tabRefs.current[views.findIndex((v) => v.id === id)]

        lensTlRef.current?.kill()
        lensTlRef.current = null
        killIf([reveal, base, sweep, bridgePacket, ...frameParts(allFrames())])
        setIf(bridgePacket, { autoAlpha: 0, x: 0, clearProps: 'transform' })

        // 0ms: hide outgoing frames; commit chrome/atmosphere state
        allFrames().forEach((el) => {
          el.dataset.active = 'false'
          setIf(el, { autoAlpha: 0 })
        })

        base.dataset.lens = id
        reveal.dataset.lens = id
        workspace.dataset.lens = id
        setIf(reveal, { clipPath: 'circle(150% at 50% 0%)', autoAlpha: 0 })
        if (sweep) setIf(sweep, { autoAlpha: 0, x: 0, clearProps: 'transform' })

        settlePanel(id)

        if (instant || reduced || mobile || !tab) {
          settleFrames(id)
          clearWillChange()
          return
        }

        const { originX, originY, radius } = apertureGeometry(tab, workspace)
        const origin = `${originX}px ${originY}px`
        const panel = root.querySelector<HTMLElement>(`.ae-inspector-panel[data-lens="${id}"]`)
        const spine = panel?.querySelector<HTMLElement>('.ae-inspector-spine')
        const stations = panel ? gsap.utils.toArray<HTMLElement>('.ae-station', panel) : []
        const outcome = panel?.querySelector<HTMLElement>('.ae-outcome')
        const liveFrames = framesFor(id)

        if (spine) setIf(spine, { scaleY: 0, transformOrigin: 'top center' })
        stations.forEach((el) => setIf(el, { autoAlpha: 0, y: 2 }))
        if (outcome) setIf(outcome, { autoAlpha: 0.45 })

        liveFrames.forEach((el) => {
          el.dataset.active = 'true'
          const ring = el.querySelector<HTMLElement>('.ae-observer-ring')
          const corners = el.querySelector<HTMLElement>('.ae-observer-corners')
          const label = el.querySelector<HTMLElement>('.ae-observer-label')
          const nodes = gsap.utils.toArray<HTMLElement>('.ae-observer-node', el)
          setIf(el, { autoAlpha: 1 })
          if (ring) setIf(ring, { clipPath: 'inset(0 100% 100% 0)', opacity: 1, willChange: 'clip-path' })
          if (corners) setIf(corners, { opacity: 0 })
          if (label) setIf(label, { autoAlpha: 0 })
          if (nodes.length) setIf(nodes, { opacity: 0, scale: 0.6 })
        })

        setIf(reveal, {
          autoAlpha: 1,
          clipPath: `circle(8px at ${origin})`,
          willChange: 'clip-path',
        })

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            base.dataset.lens = id
            settleFrames(id)
            setIf(reveal, { autoAlpha: 0, clipPath: 'circle(150% at 50% 0%)' })
            if (sweep) setIf(sweep, { autoAlpha: 0 })
            setIf(bridgePacket, { autoAlpha: 0, x: 0 })
            clearWillChange()
            lensTlRef.current = null
          },
        })
        lensTlRef.current = tl

        // 0–280ms local aperture (viewport only)
        tl.to(
          reveal,
          {
            clipPath: `circle(${radius}px at ${origin})`,
            duration: 0.28,
            ease: 'power3.out',
          },
          0,
        )

        // 60–340ms target frames (~45ms stagger)
        liveFrames.forEach((el, i) => {
          const at = 0.06 + i * 0.045
          const ring = el.querySelector<HTMLElement>('.ae-observer-ring')
          const corners = el.querySelector<HTMLElement>('.ae-observer-corners')
          const lens = el.dataset.lens
          if (ring) {
            tl.to(ring, { clipPath: 'inset(0 0 0 0)', duration: 0.22, ease: 'power2.out' }, at)
          }
          if (corners && lens !== 'shopper') {
            tl.to(corners, { opacity: 1, duration: 0.18 }, at + 0.04)
          }
        })

        liveFrames.forEach((el, i) => {
          const at = 0.12 + i * 0.045
          const label = el.querySelector<HTMLElement>('.ae-observer-label')
          const nodes = gsap.utils.toArray<HTMLElement>('.ae-observer-node', el)
          if (label) tl.to(label, { autoAlpha: 1, duration: 0.16 }, at)
          if (nodes.length) {
            tl.to(nodes, { opacity: 1, scale: 1, duration: 0.14, stagger: 0.02 }, at)
          }
        })

        if (spine) tl.to(spine, { scaleY: 1, duration: 0.22 }, 0.32)
        stations.forEach((el, i) => {
          tl.to(el, { autoAlpha: 1, y: 0, duration: 0.16 }, 0.34 + i * 0.05)
        })
        if (outcome) tl.to(outcome, { autoAlpha: 1, duration: 0.14 }, 0.42)

        if (docked && bridgePacket) {
          tl.set(bridgePacket, { autoAlpha: 1, x: 0, willChange: 'transform, opacity' }, 0.26)
          tl.to(bridgePacket, { x: '100%', duration: 0.2, ease: 'power2.inOut' }, 0.26)
          tl.to(bridgePacket, { autoAlpha: 0, duration: 0.08 }, 0.44)
        }

        if (sweep) {
          tl.set(
            sweep,
            { autoAlpha: 0.35, x: originX - 4, y: 0, willChange: 'transform, opacity' },
            0.36,
          )
          tl.to(
            sweep,
            {
              y: Math.max(64, workspace.offsetHeight * 0.55),
              duration: 0.12,
              ease: 'power2.inOut',
            },
            0.36,
          )
          tl.to(sweep, { autoAlpha: 0, duration: 0.08 }, 0.46)
        }

        tl.add(clearWillChange, 0.68)
      }

      runLensRef.current = runLens
      runLens('shopper', true)
      lensReadyRef.current = true
      ScrollTrigger.refresh()

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(frame, { y: 0 })
        gsap.set(rule, { scaleX: 1 })
        frame.style.boxShadow =
          '5px 5px 0 0 color-mix(in srgb, var(--ink) 88%, transparent), 0 32px 40px -14px color-mix(in srgb, var(--ink) 20%, transparent)'
        return () => {
          lensTlRef.current?.kill()
          clearWillChange()
        }
      }

      gsap.set(frame, { y: 6 })
      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })
      frame.style.boxShadow =
        '4px 4px 0 0 color-mix(in srgb, var(--ink) 70%, transparent), 0 12px 24px -8px color-mix(in srgb, var(--ink) 14%, transparent)'

      ScrollTrigger.create({
        trigger: frame,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(frame, {
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            boxShadow:
              '5px 5px 0 0 color-mix(in srgb, var(--ink) 88%, transparent), 0 32px 40px -14px color-mix(in srgb, var(--ink) 20%, transparent)',
          })
          gsap.to(rule, { scaleX: 1, duration: 0.55, ease: 'power2.out' })
        },
      })

      return () => {
        lensTlRef.current?.kill()
        clearWillChange()
      }
    },
    { scope: rootRef },
  )

  useLayoutEffect(() => {
    if (!lensReadyRef.current) return
    const instant = !lensPrimedRef.current
    lensPrimedRef.current = true
    runLensRef.current(view, instant)
  }, [view])

  const activate = (id: ViewId, focus = false) => {
    if (id === viewRef.current) return
    viewRef.current = id
    flushSync(() => {
      setView(id)
    })
    if (focus) {
      const i = views.findIndex((v) => v.id === id)
      tabRefs.current[i]?.focus()
    }
  }

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = views.length - 1
    let next = index
    if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    activate(views[next]!.id as ViewId, true)
  }

  return (
    <section
      ref={rootRef}
      id="authority-experiences"
      aria-labelledby="authority-heading"
      className="ink-grid scroll-mt-24 bg-stage"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <SignalRail step={3} />
        <div className="max-w-[40rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-lime">
            {authorityTheater.eyebrow}
          </p>
          <h2
            id="authority-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-stage-foreground md:text-5xl text-balance"
          >
            {authorityTheater.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[color:var(--on-ink-muted)] text-pretty">
            {authorityTheater.supporting}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Authority Experience views"
          className="ae-tablist mt-8 grid grid-cols-3 gap-2 md:mt-9 md:gap-3"
        >
          {lensUi.map((lens, i) => {
            const selected = view === lens.id
            return (
              <button
                key={lens.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`view-tab-${lens.id}`}
                aria-label={views[i]!.label}
                aria-selected={selected}
                aria-controls="authority-view-panel"
                tabIndex={selected ? 0 : -1}
                data-lens={lens.id}
                data-active={selected ? 'true' : 'false'}
                onClick={() => activate(lens.id)}
                onKeyDown={(event) => onTabKeyDown(event, i)}
                className="ae-tab"
              >
                <span className="ae-tab-fill" aria-hidden="true" />
                <span className="ae-tab-station" aria-hidden="true" />
                <span className="ae-tab-inner">
                  <LensGlyph id={lens.id} />
                  <span className="ae-tab-copy">
                    <span className="ae-tab-micro font-mono" aria-hidden="true">
                      {lens.micro}
                    </span>
                    <span className="ae-tab-main md:hidden" aria-hidden="true">
                      {lens.short}
                    </span>
                    <span className="ae-tab-main hidden md:inline" aria-hidden="true">
                      {lens.main}
                    </span>
                    <span
                      className={`ae-tab-active font-mono ${selected ? 'is-on' : ''}`}
                      aria-hidden="true"
                    >
                      ACTIVE LENS
                    </span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="ae-lens-route mt-3 hidden md:grid" aria-hidden="true">
          {lensUi.map((lens, i) => (
            <div key={lens.id} className="ae-lens-route-seg">
              <span className={`ae-dot ${i === activeIndex ? 'is-on' : ''}`} />
              {i < lensUi.length - 1 ? <span className="ae-lens-route-line" /> : null}
            </div>
          ))}
        </div>

        <div
          role="tabpanel"
          id="authority-view-panel"
          aria-labelledby={`view-tab-${view}`}
          className="mt-4 md:mt-5"
        >
          <p className="sr-only">Illustrative example — not a live dealership page.</p>
          <div className="ae-instrument-stage" data-lens={view}>
            <div ref={frameRef} className="ae-browser">
              <span ref={ruleRef} className="ae-frame-rule" aria-hidden="true" />

              <div className="ae-chrome" aria-hidden="true">
              <div className="ae-chrome-tabs">
                <div className="ae-toolbar-lights">
                  <span className="ae-light ae-light-close" />
                  <span className="ae-light ae-light-min" />
                  <span className="ae-light ae-light-max" />
                </div>
                <div className="ae-chrome-tab ae-chrome-tab-active">
                  <span className="ae-chrome-favicon font-mono">NM</span>
                  <span className="ae-chrome-tab-title">Three-Row SUV Guide | Northline Motors</span>
                </div>
                <span className="ae-chrome-tab-spacer" />
              </div>

              <div className="ae-chrome-nav">
                <span className="ae-nav-btn ae-nav-back">
                  <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                    <path d="M7.5 2.5 4 6l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
                  </svg>
                </span>
                <span className="ae-nav-btn ae-nav-forward">
                  <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                    <path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
                  </svg>
                </span>
                <span className="ae-nav-btn ae-nav-refresh">
                  <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                    <path d="M6 2.5v2M6 7.5v2M2.5 6H4.5M7.5 6H9.5M3.4 3.4l1.4 1.4M7.2 7.2l1.4 1.4M8.6 3.4 7.2 4.8M4.8 7.2 3.4 8.6" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="square" />
                  </svg>
                </span>
                <div className="ae-chrome-address">
                  <span className="ae-toolbar-lock">
                    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
                      <path
                        d="M3.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5M2.5 5.5h7v5h-7z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>
                  </span>
                  <span className="ae-toolbar-address">
                    northlinemotors.example/research/three-row-suv-guide
                  </span>
                </div>
                <span className="ae-nav-btn ae-nav-bookmark">
                  <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                    <path d="M3 2.5h6v7L6 8 3 9.5z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="miter" />
                  </svg>
                </span>
                <span className="ae-nav-btn ae-nav-more">
                  <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                    <circle cx="3" cy="6" r="0.9" fill="currentColor" />
                    <circle cx="6" cy="6" r="0.9" fill="currentColor" />
                    <circle cx="9" cy="6" r="0.9" fill="currentColor" />
                  </svg>
                </span>
                <span className="ae-status-chip">DEMO DEALERSHIP</span>
              </div>

              <div className="ae-chrome-mobile">
                <div className="ae-toolbar-lights">
                  <span className="ae-light ae-light-close" />
                  <span className="ae-light ae-light-min" />
                  <span className="ae-light ae-light-max" />
                </div>
                <span className="ae-chrome-favicon font-mono">NM</span>
                <span className="ae-chrome-mobile-domain">northlinemotors.example</span>
                <span className="ae-status-chip">DEMO DEALERSHIP</span>
              </div>
            </div>

            <p className="ae-chrome-note font-mono" aria-hidden="true">
              Illustrative example — not a live dealership page.
            </p>

            <div ref={workspaceRef} className="ae-workspace" data-lens={view}>
              <span className="ae-scroll-rail" aria-hidden="true">
                <span className="ae-scroll-track" />
                <span className="ae-scroll-thumb" />
              </span>
              <div ref={baseRef} className="ae-lens-base" data-lens={view} aria-hidden="true" />
              <div ref={revealRef} className="ae-lens-reveal" data-lens={view} aria-hidden="true" />
              <span ref={sweepRef} className="ae-lens-sweep" aria-hidden="true" />

              <article className="ae-page" data-lens={view}>
                <header className="ae-dealer-masthead">
                  <div className="ae-dealer-brand">
                    <span className="ae-dealer-monogram font-mono" aria-hidden="true">
                      NM
                    </span>
                    <div className="ae-dealer-brand-copy">
                      <span className="ae-dealer-wordmark font-mono">NORTHLINE MOTORS</span>
                      <span className="ae-dealer-label font-mono">RESEARCH CENTER</span>
                    </div>
                  </div>
                  <nav className="ae-dealer-nav" aria-hidden="true">
                    <span className="ae-dealer-nav-item ae-dealer-nav-wide">New Vehicles</span>
                    <span className="ae-dealer-nav-item ae-dealer-nav-wide">Used Vehicles</span>
                    <span className="ae-dealer-nav-item">Research</span>
                    <span className="ae-dealer-nav-item ae-dealer-nav-wide">Service</span>
                  </nav>
                  <span className="ae-dealer-inventory">View Inventory</span>
                </header>

                <p className="ae-breadcrumb font-mono">Research / Family SUVs</p>
                <h4 className="ae-page-title mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl text-balance">
                  {authorityTheater.exampleTopic}
                </h4>

                <div className="ae-spot mt-4 rounded-lg border-l-4 border-accent bg-porcelain p-5" data-spot="answer">
                  {framesForSpot('answer', view)}
                  <p className="text-base font-semibold uppercase tracking-wide text-signal-deep">
                    The short answer
                  </p>
                  <p className="mt-2 text-lg leading-relaxed text-ink">
                    The right three-row SUV depends on how many passengers you carry regularly, your
                    budget range, and how much winter capability you actually need. Start with your
                    priorities below and we&apos;ll narrow the field.
                  </p>
                </div>

                <div className="ae-spot mt-4" data-spot="priorities">
                  {framesForSpot('priorities', view)}
                  <p className="text-lg font-semibold text-ink">What matters most to your family?</p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {priorities.map((priority, i) => (
                      <span key={priority} className={`ae-chip ${i === 1 ? 'ae-chip-on' : ''}`}>
                        {priority}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ae-spot mt-4 grid gap-4 sm:grid-cols-2" data-spot="structure">
                  {framesForSpot('structure', view)}
                  <div className="ae-spot rounded-lg border border-border bg-paper p-5" data-spot="compare">
                    {framesForSpot('compare', view)}
                    <p className="text-base font-semibold text-ink">Winter driving comparison</p>
                    <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
                      How AWD systems, ground clearance, and heated features compare across the
                      three-row models we carry.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-paper p-5">
                    <p className="text-base font-semibold text-ink">Budget and ownership guidance</p>
                    <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
                      What each trim level adds, and which features families tell us matter after the
                      first winter.
                    </p>
                  </div>
                </div>

                <div
                  className="ae-spot ae-inventory-module mt-4 rounded-lg border-2 border-ink border-l-4 border-l-accent bg-porcelain p-5"
                  data-spot="inventory"
                >
                  {framesForSpot('inventory', view)}
                  <div className="ae-inventory-head">
                    <p className="text-lg font-semibold text-ink text-pretty">
                      See the three-row SUVs that match your priorities
                    </p>
                    <span className="ae-inventory-status font-mono">Matching units available</span>
                  </div>
                  <span className="ae-fake-action mt-3 inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-[6px] border-2 border-ink bg-paper px-4 py-2 text-[15px] font-semibold text-ink">
                    View Matching Inventory
                    <span aria-hidden="true">→</span>
                  </span>
                </div>

                <div className="ae-spot mt-4" data-spot="contact">
                  {framesForSpot('contact', view)}
                  <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Questions remain? Speak with the dealership.
                  </p>
                </div>
              </article>
            </div>
          </div>

            <div className="ae-signal-bridge" aria-hidden="true">
              <span className="ae-bridge-station ae-bridge-from" />
              <span className="ae-bridge-line" />
              <span ref={bridgePacketRef} className="ae-bridge-packet" />
              <span className="ae-bridge-station ae-bridge-to" />
            </div>

            <aside className="ae-lens-dock ae-inspector" data-lens={view} aria-label="Authomotive lens readout">
              <header className="ae-dock-header" aria-hidden="true">
                <span className="ae-dock-mark font-mono">A</span>
                <span className="ae-dock-title font-mono">AUTHOMOTIVE LENS</span>
                <span className="ae-dock-chip font-mono">{observerChip[view]}</span>
                <span className="ae-dock-num font-mono">{lensUi[activeIndex]!.mark}</span>
              </header>
              <div className="ae-inspector-stack">
                <InspectorShell
                  active={view === 'shopper'}
                  lens="shopper"
                  mark="01"
                  eyebrow="BUYER PATH"
                  count={outcomeCount.shopper}
                  outcomeLabel="DEALER OUTCOME"
                  outcomeValue="LESS WANDERING"
                  label="Buyer path inspector"
                >
                    <ol className="ae-station-list">
                      {shopperRoute.map((row, i) => (
                        <li key={row.station} className="ae-station" data-tone="shopper">
                          <span className="ae-station-mark font-mono" aria-hidden="true">
                            {pinLabel(i + 1)}
                          </span>
                          <div>
                            <p className="ae-station-title font-semibold text-ink">{row.station}</p>
                            <p className="ae-station-detail mt-0.5 text-muted-foreground">
                              {row.support}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </InspectorShell>

                  <InspectorShell
                    active={view === 'discovery'}
                    lens="discovery"
                    mark="02"
                    eyebrow="DISCOVERY READOUT"
                    count={outcomeCount.discovery}
                    outcomeLabel="SYSTEM OUTCOME"
                    outcomeValue="EASIER TO UNDERSTAND"
                    label="Discovery readout inspector"
                  >
                    <ol className="ae-station-list">
                      {discoveryPoints.map((item, i) => (
                        <li key={item.label} className="ae-station" data-tone="discovery">
                          <span className="ae-station-mark font-mono" aria-hidden="true">
                            {pinLabel(i + 1)}
                          </span>
                          <div>
                            <p className="ae-station-title font-semibold text-ink">{item.label}</p>
                            <p className="ae-station-detail mt-0.5 text-muted-foreground">
                              {item.detail}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </InspectorShell>

                  <InspectorShell
                    active={view === 'measurable'}
                    lens="measurable"
                    mark="03"
                    eyebrow="BUYER SIGNALS"
                    count={outcomeCount.measurable}
                    outcomeLabel="DEALER OUTCOME"
                    outcomeValue="INTENT YOU CAN PROVE"
                    label="Buyer signals inspector"
                  >
                    <ol className="ae-station-list ae-station-list-measure">
                      {measuredActions.map((row, i) => (
                        <li key={row.action} className="ae-station" data-tone="measurable">
                          <span className="ae-station-mark font-mono" aria-hidden="true">
                            {pinLabel(i + 1)}
                          </span>
                          <div>
                            <p className="ae-station-title font-semibold text-ink">{row.action}</p>
                            <p className="ae-station-detail mt-0.5 text-muted-foreground">
                              {row.signal}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </InspectorShell>
                </div>
              </aside>
          </div>
        </div>

        <div className="ae-outcomes mt-8 grid gap-3 md:grid-cols-3" aria-label="One page, three outcomes">
          {outcomes.map((item) => {
            const mapped = view === item.id
            return (
              <p
                key={item.label}
                data-lens={item.id}
                data-active={mapped ? 'true' : 'false'}
                className="ae-outcome-card flex min-h-[72px] items-center gap-3 border border-stage-line bg-stage-elevated px-4 py-3 text-lg font-semibold tracking-tight text-paper"
              >
                <span className={`ae-outcome-station h-3 w-3 shrink-0 ${item.mark}`} aria-hidden="true" />
                {item.label}
              </p>
            )
          })}
        </div>

        <div className="mt-6 border border-stage-line bg-paper px-5 py-5 md:px-6">
          <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-signal-deep md:text-xs">
            {aiDiscovery.eyebrow}
          </p>
          <p className="mt-2 max-w-[40rem] text-base font-semibold leading-snug text-ink md:text-lg text-pretty">
            {aiDiscovery.headline}
          </p>
          <ul
            className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="AI Discovery page contents"
          >
            {foundationItems.map((item) => (
              <li key={item.n} className="flex items-center gap-2.5 bg-porcelain px-3 py-3">
                <span className="font-mono text-[0.6875rem] font-bold text-signal-deep" aria-hidden="true">
                  {item.n}
                </span>
                <span className="text-sm font-semibold text-ink">{item.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Included with every engagement and reviewed monthly. It organizes verified first-party
            information. It does not guarantee citations or control what any AI platform says.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-xl text-lg leading-relaxed text-[color:var(--on-ink-muted)] text-pretty">
            One page. Three outcomes. AI Discovery sits underneath as supporting infrastructure.
          </p>
          <a href="#opportunity-review" className="btn btn-action-dark shrink-0">
            {cta.primary}
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
