'use client'

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { flushSync } from 'react-dom'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { authorityTheater } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ViewId = 'shopper' | 'discovery' | 'measurable'

const views = authorityTheater.views

const oemTopic = 'Which Northline three-row SUV fits your family?'

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

/** Lens → active dealer result (opening terminal of the analysis rail) */
const activeResults: Record<ViewId, { title: string; index: string }> = {
  shopper: { title: 'Buyers guided', index: '01' },
  discovery: { title: 'Discovery earned', index: '02' },
  measurable: { title: 'Actions measured', index: '03' },
}

const observerFrames = [
  { lens: 'shopper' as const, spot: 'answer', station: '01', label: 'DECISION SUPPORT', token: null },
  { lens: 'shopper' as const, spot: 'priorities', station: '02', label: 'DECISION SUPPORT', token: null },
  { lens: 'shopper' as const, spot: 'inventory', station: '03', label: 'DECISION SUPPORT', token: null },
  {
    lens: 'discovery' as const,
    spot: 'answer',
    station: '01',
    label: 'CRAWLER READ',
    token: 'ANSWER',
  },
  {
    lens: 'discovery' as const,
    spot: 'structure',
    station: '02',
    label: 'CRAWLER READ',
    token: 'SECTION',
  },
  {
    lens: 'discovery' as const,
    spot: 'inventory',
    station: '03',
    label: 'CRAWLER READ',
    token: 'LINK',
  },
  {
    lens: 'measurable' as const,
    spot: 'priorities',
    station: '01',
    label: 'SIGNAL CAPTURE',
    token: null,
  },
  {
    lens: 'measurable' as const,
    spot: 'compare',
    station: '02',
    label: 'SIGNAL CAPTURE',
    token: null,
  },
  {
    lens: 'measurable' as const,
    spot: 'inventory',
    station: '03',
    label: 'SIGNAL CAPTURE',
    token: null,
  },
  {
    lens: 'measurable' as const,
    spot: 'contact',
    station: '04',
    label: 'SIGNAL CAPTURE',
    token: null,
  },
] as const

function spotObserved(spot: string, view: ViewId) {
  return observerFrames.some((frame) => frame.spot === spot && frame.lens === view)
}

const observerChip: Record<ViewId, string> = {
  shopper: 'SHOPPER VIEW',
  discovery: 'SEARCH + AI VIEW',
  measurable: 'SIGNAL VIEW',
}


function readInspectStation(target: EventTarget | null) {
  const el = target instanceof Element ? target : null
  if (!el) return null
  const direct = el.closest<HTMLElement | SVGElement>(
    '.ae-station[data-station], .ae-observer-frame[data-station], .ae-route-feeder[data-station]',
  )
  if (direct?.getAttribute('data-station')) return direct.getAttribute('data-station')
  const spot = el.closest<HTMLElement>('.ae-spot[data-observed="true"]')
  const frame = spot?.querySelector<HTMLElement>('.ae-observer-frame[data-active="true"]')
  return frame?.dataset.station ?? null
}

const outcomeCount: Record<ViewId, string> = {
  shopper: '3 DECISION STEPS',
  discovery: '3 INTERPRETABLE LAYERS',
  measurable: '4 CONNECTED ACTIONS',
}

const shopperRoute = [
  {
    station: 'Question answered',
    detail: 'Helps shoppers understand which version fits.',
  },
  {
    station: 'Priorities clarified',
    detail: 'Reduces aimless model-page wandering.',
  },
  {
    station: 'Matching inventory',
    detail: 'Creates a confident next step toward available vehicles.',
  },
] as const

const shopperFlow = ['Question answered', 'Priorities clarified', 'Matching inventory'] as const

const discoveryPoints = [
  {
    label: 'Crawlable answer',
    detail: 'The question and direct answer sit in server-rendered HTML.',
  },
  {
    label: 'Entities and structure',
    detail: 'Headings and structured data name the topic and source.',
  },
  {
    label: 'Link to inventory',
    detail: 'Research links through to a matching inventory query.',
  },
] as const

const discoveryHeading = '<h1>Which three-row SUV fits your family?</h1>'
const discoveryEntities = ['Article', 'Three-row SUV', 'Family needs'] as const
const discoveryJsonLd = '{ "@type": "Article", "about": "Three-row SUVs" }'
const discoveryInventoryPath = '/inventory/suv?seating=7&awd=true'

const measuredActions = [
  { action: 'Priority selected', detail: 'Which needs shoppers actively choose.', event: 'priority_select' },
  { action: 'Comparison opened', detail: 'Which decision content gets attention.', event: 'comparison_open' },
  { action: 'Inventory clicked', detail: 'Research moving into vehicle shopping.', event: 'inventory_click' },
  { action: 'Contact started', detail: 'The step from research into lead behavior.', event: 'contact_start' },
] as const

const priorities = [
  'Seating',
  'All-weather capability',
  'Cargo',
  'Efficiency',
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
  active,
}: {
  lens: ViewId
  station: string
  active: boolean
}) {
  return (
    <span
      className="ae-observer-frame"
      data-lens={lens}
      data-station={station}
      data-active={active ? 'true' : 'false'}
      aria-hidden="true"
    >
      <span className="ae-observer-tint" />
      <span className="ae-observer-ring" />
      <span className="ae-observer-corners" />
      <span className="ae-observer-station font-mono">{station}</span>
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
        active={view === frame.lens}
      />
    ))
}

function InspectorShell({
  active,
  lens,
  eyebrow,
  count,
  outcomeLabel,
  outcomeValue,
  outcomeNote,
  evidence,
  children,
  label,
}: {
  active: boolean
  lens: ViewId
  eyebrow: string
  count: string
  outcomeLabel: string
  outcomeValue: string
  outcomeNote: string
  evidence?: ReactNode
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
        <span className="ae-rail-intake" aria-hidden="true" />
        {children}
      </div>
      <div className="ae-evidence">{evidence}</div>
      <div className="ae-outcome">
        <div className="ae-outcome-meta">
          <p className="ae-outcome-eyebrow font-mono font-medium uppercase tracking-[0.14em]">
            {outcomeLabel}
          </p>
          <p className="ae-outcome-count font-mono" aria-hidden="true">
            {count}
          </p>
        </div>
        <p className="ae-outcome-value mt-1 font-semibold tracking-tight">{outcomeValue}</p>
        <p className="ae-outcome-note mt-1">{outcomeNote}</p>
      </div>
    </div>
  )
}

function snapPx(n: number) {
  return Math.round(n) + 0.5
}

function resetRailSpine(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('.ae-rail-intake').forEach((el) => {
    el.style.top = ''
    el.style.height = ''
    el.style.bottom = ''
  })
}

/** Spine runs from the first [#] through the last [#], then stops. */
function pinRailSpine(panel: HTMLElement) {
  const intake = panel.querySelector<HTMLElement>('.ae-rail-intake')
  const body = panel.querySelector<HTMLElement>('.ae-inspector-body')
  const marks = Array.from(panel.querySelectorAll<HTMLElement>('.ae-station-mark'))
  if (!intake || !body || !marks.length) return null

  const bodyBox = body.getBoundingClientRect()
  const first = marks[0].getBoundingClientRect()
  const last = marks[marks.length - 1].getBoundingClientRect()
  if (first.height <= 0 || last.height <= 0) return null

  const y0 = first.top + first.height / 2 - bodyBox.top
  const y1 = last.top + last.height / 2 - bodyBox.top
  intake.style.top = `${y0}px`
  intake.style.bottom = 'auto'
  intake.style.height = `${Math.max(0, y1 - y0)}px`
  return { first, last }
}

function geomSignature(geom: ProjectionGeom) {
  if (!geom) return ''
  return [
    geom.view,
    geom.w,
    geom.h,
    geom.bus,
    geom.outlet,
    ...geom.feeders.map((feeder) => `${feeder.station}:${feeder.d}`),
    ...geom.nodes.map((node) => `${node.x},${node.y}`),
  ].join('~')
}

type ProjectionGeom = {
  view: ViewId
  feeders: { station: string; d: string }[]
  bus: string
  outlet: string
  nodes: { x: number; y: number }[]
  w: number
  h: number
} | null

const AE_MAX_FEEDERS = 4
const AE_MAX_NODES = 5

function AuthorityProjectionPath({
  stageRef,
  browserRef,
  dockRef,
  view,
  reduced,
}: {
  stageRef: RefObject<HTMLDivElement | null>
  browserRef: RefObject<HTMLDivElement | null>
  dockRef: RefObject<HTMLElement | null>
  view: ViewId
  reduced: boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const geomRef = useRef<ProjectionGeom>(null)
  const geomSigRef = useRef('')
  const pathTlRef = useRef<gsap.core.Timeline | null>(null)
  const drawnViewRef = useRef<ViewId | null>(null)

  const paintGeom = useCallback(
    (next: ProjectionGeom, replay: boolean) => {
      const svg = svgRef.current
      if (!svg) return
      geomRef.current = next
      pathTlRef.current?.kill()
      pathTlRef.current = null

      if (!next) {
        svg.style.display = 'none'
        return
      }

      svg.style.display = ''
      svg.setAttribute('width', String(next.w))
      svg.setAttribute('height', String(next.h))
      svg.setAttribute('viewBox', `0 0 ${next.w} ${next.h}`)
      svg.dataset.lens = next.view

      const feeders = Array.from(svg.querySelectorAll<SVGPathElement>('.ae-route-feeder'))
      const bus = svg.querySelector<SVGPathElement>('.ae-route-bus')
      const outlet = svg.querySelector<SVGPathElement>('.ae-route-outlet')
      const nodes = Array.from(svg.querySelectorAll<SVGCircleElement>('.ae-route-node'))

      feeders.forEach((path, i) => {
        const feeder = next.feeders[i]
        if (!feeder) {
          path.style.display = 'none'
          path.removeAttribute('data-station')
          return
        }
        path.style.display = ''
        path.setAttribute('d', feeder.d)
        path.dataset.station = feeder.station
        path.dataset.routeIndex = String(i)
      })
      if (bus) bus.setAttribute('d', next.bus)
      if (outlet) outlet.setAttribute('d', next.outlet)
      nodes.forEach((node, i) => {
        const pt = next.nodes[i]
        if (!pt) {
          node.style.display = 'none'
          return
        }
        node.style.display = ''
        node.setAttribute('cx', String(pt.x))
        node.setAttribute('cy', String(pt.y))
      })

      const liveFeeders = feeders.filter((_, i) => next.feeders[i])
      const paths = [...liveFeeders, bus, outlet].filter(
        (path): path is SVGPathElement => path instanceof SVGPathElement,
      )
      const liveNodes = nodes.filter((_, i) => next.nodes[i])

      if (!replay || reduced || window.innerWidth < 1200) {
        paths.forEach((path) => {
          gsap.set(path, { strokeDasharray: 'none', strokeDashoffset: 0, autoAlpha: 1 })
        })
        if (liveNodes.length) gsap.set(liveNodes, { scale: 1, autoAlpha: 1, transformOrigin: '50% 50%' })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      const draw = (path: SVGPathElement, at: number, duration: number) => {
        const length = path.getTotalLength()
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, autoAlpha: 1 })
        tl.to(path, { strokeDashoffset: 0, duration }, at)
      }
      liveFeeders.forEach((path, i) => draw(path, i * 0.035, 0.16))
      if (bus) draw(bus, 0.12, 0.24)
      if (outlet) draw(outlet, 0.3, 0.16)
      if (liveNodes.length) {
        gsap.set(liveNodes, { scale: 0.4, autoAlpha: 0, transformOrigin: '50% 50%' })
        liveNodes.forEach((node, i) => {
          tl.to(node, { scale: 1, autoAlpha: 1, duration: 0.12 }, 0.14 + i * 0.02)
        })
      }
      pathTlRef.current = tl
    },
    [reduced],
  )

  const commitGeom = useCallback(
    (next: ProjectionGeom) => {
      const signature = geomSignature(next)
      if (signature === geomSigRef.current) return
      geomSigRef.current = signature
      const replay = Boolean(next && drawnViewRef.current !== next.view)
      drawnViewRef.current = next?.view ?? null
      paintGeom(next, replay)
    },
    [paintGeom],
  )

  const measure = useCallback(() => {
    const stage = stageRef.current
    const browser = browserRef.current
    const dock = dockRef.current
    if (!stage || !browser || !dock) {
      commitGeom(null)
      return
    }
    if (window.innerWidth < 1200) {
      resetRailSpine(dock)
      commitGeom(null)
      return
    }

    const panel = dock.querySelector<HTMLElement>(`.ae-inspector-panel[data-lens="${view}"]`)
    if (!panel) {
      commitGeom(null)
      return
    }

    const frames = Array.from(
      browser.querySelectorAll<HTMLElement>(`.ae-observer-frame[data-lens="${view}"]`),
    )
    const spine = pinRailSpine(panel)
    if (!spine || !frames.length) {
      commitGeom(null)
      return
    }

    const stageBox = stage.getBoundingClientRect()

    /** Every lit module feeds one bus; the bus docks once into the first [#]. */
    const taps = frames
      .map((frame) => {
        const station = frame.dataset.station
        if (!station) return null
        const frameBox = frame.getBoundingClientRect()
        const port = frame.querySelector<HTMLElement>('.ae-observer-station')
        const portBox = port?.getBoundingClientRect() ?? frameBox
        if (frameBox.height <= 0 || portBox.height <= 0) return null
        return {
          station,
          x: snapPx(frameBox.right - stageBox.left + 3),
          y: snapPx(portBox.top + portBox.height / 2 - stageBox.top),
        }
      })
      .filter((tap): tap is NonNullable<typeof tap> => tap !== null)

    if (!taps.length) {
      commitGeom(null)
      return
    }

    const intakeX = snapPx(spine.first.left - stageBox.left)
    const dockY = snapPx(spine.first.top + spine.first.height / 2 - stageBox.top)
    const busX = snapPx(spine.first.left - stageBox.left - 18)
    const rightmostTap = Math.max(...taps.map((tap) => tap.x))
    if (busX - rightmostTap < 14) {
      commitGeom(null)
      return
    }

    const ys = [...taps.map((tap) => tap.y), dockY]
    const busY0 = Math.min(...ys)
    const busY1 = Math.max(...ys)
    const nodes = taps.map((tap) => ({ x: busX, y: tap.y }))
    if (!nodes.some((node) => Math.abs(node.y - dockY) < 1)) {
      nodes.unshift({ x: busX, y: dockY })
    }

    commitGeom({
      view,
      feeders: taps.map((tap) => ({ station: tap.station, d: `M ${tap.x} ${tap.y} H ${busX}` })),
      bus: `M ${busX} ${busY0} V ${busY1}`,
      outlet: `M ${busX} ${dockY} H ${intakeX}`,
      nodes,
      w: Math.round(stageBox.width),
      h: Math.round(stageBox.height),
    })
  }, [stageRef, browserRef, dockRef, view, commitGeom])

  useLayoutEffect(() => {
    let raf = 0
    let late = 0
    const schedule = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        measure()
      })
    }
    measure()
    late = window.setTimeout(measure, 400)
    const stage = stageRef.current
    if (!stage || typeof ResizeObserver === 'undefined') {
      return () => {
        window.cancelAnimationFrame(raf)
        window.clearTimeout(late)
      }
    }
    const ro = new ResizeObserver(schedule)
    ro.observe(stage)
    if (browserRef.current) ro.observe(browserRef.current)
    if (dockRef.current) ro.observe(dockRef.current)
    return () => {
      ro.disconnect()
      window.cancelAnimationFrame(raf)
      window.clearTimeout(late)
    }
  }, [measure, stageRef, browserRef, dockRef])

  useLayoutEffect(() => {
    return () => {
      pathTlRef.current?.kill()
      pathTlRef.current = null
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="ae-projection"
      width="0"
      height="0"
      viewBox="0 0 0 0"
      aria-hidden="true"
      focusable="false"
      data-lens={view}
      style={{ display: 'none' }}
    >
      {Array.from({ length: AE_MAX_FEEDERS }, (_, i) => (
        <path
          key={`feeder-${i}`}
          className="ae-route-path ae-route-feeder ae-projection-path"
          data-route-index={i}
          d=""
          fill="none"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
          shapeRendering="crispEdges"
          style={{ display: 'none' }}
        />
      ))}
      <path
        className="ae-route-path ae-route-bus ae-projection-path"
        d=""
        fill="none"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
        shapeRendering="crispEdges"
      />
      <path
        className="ae-route-path ae-route-outlet ae-projection-path"
        d=""
        fill="none"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
        shapeRendering="crispEdges"
      />
      {Array.from({ length: AE_MAX_NODES }, (_, i) => (
        <circle key={`node-${i}`} className="ae-route-node" cx="0" cy="0" r="3" style={{ display: 'none' }} />
      ))}
    </svg>
  )
}

export function AuthorityExperience() {
  const [view, setView] = useState<ViewId>('shopper')
  const [focusStation, setFocusStation] = useState<string | null>(null)
  const focusClearRef = useRef(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)
  const baseRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const sweepRef = useRef<HTMLSpanElement>(null)
  const photoRef = useRef<HTMLElement>(null)
  const dockRef = useRef<HTMLElement>(null)
  const resultRuleRef = useRef<HTMLSpanElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const lensTlRef = useRef<gsap.core.Timeline | null>(null)
  const runLensRef = useRef<(id: ViewId, instant?: boolean) => void>(() => {})
  const lensReadyRef = useRef(false)
  const lensPrimedRef = useRef(false)
  const viewRef = useRef(view)
  viewRef.current = view

  useLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => {
      mq.removeEventListener('change', sync)
      window.clearTimeout(focusClearRef.current)
    }
  }, [])

  useGSAP(
    () => {
      const frame = frameRef.current
      const rule = ruleRef.current
      const root = rootRef.current
      const workspace = workspaceRef.current
      const base = baseRef.current
      const reveal = revealRef.current
      const sweep = sweepRef.current
      const resultRule = resultRuleRef.current
      const photo = photoRef.current
      if (!frame || !rule || !root || !workspace || !base || !reveal) return

      const allFrames = () => gsap.utils.toArray<HTMLElement>('.ae-observer-frame', root)
      const framesFor = (id: ViewId) =>
        gsap.utils.toArray<HTMLElement>(`.ae-observer-frame[data-lens="${id}"]`, root)

      const asTargets = (els: (Element | null | undefined)[]) =>
        els.filter((el): el is HTMLElement => el instanceof HTMLElement)

      const setIf = (target: gsap.TweenTarget | null | undefined, vars: gsap.TweenVars) => {
        if (!target) return
        const targets = asTargets(gsap.utils.toArray(target))
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
            el.querySelector<HTMLElement>('.ae-observer-tint'),
            el.querySelector<HTMLElement>('.ae-observer-ring'),
            el.querySelector<HTMLElement>('.ae-observer-corners'),
            el.querySelector<HTMLElement>('.ae-observer-station'),
          ].filter((node): node is HTMLElement => node instanceof HTMLElement),
        )

      const settleFrames = (id: ViewId) => {
        allFrames().forEach((el) => {
          const live = el.dataset.lens === id
          el.dataset.active = live ? 'true' : 'false'
          const tint = el.querySelector<HTMLElement>('.ae-observer-tint')
          const ring = el.querySelector<HTMLElement>('.ae-observer-ring')
          const corners = el.querySelector<HTMLElement>('.ae-observer-corners')
          const badge = el.querySelector<HTMLElement>('.ae-observer-station')
          if (live) {
            setIf(el, { autoAlpha: 1 })
            if (tint) setIf(tint, { autoAlpha: 1 })
            if (ring) setIf(ring, { clipPath: 'inset(0 0 0 0)', opacity: 1 })
            if (corners) setIf(corners, { opacity: 1 })
            if (badge) setIf(badge, { autoAlpha: 1, scale: 1 })
          } else {
            setIf(el, { autoAlpha: 0 })
          }
        })
      }

      const settlePanel = (id: ViewId) => {
        const panel = root.querySelector<HTMLElement>(`.ae-inspector-panel[data-lens="${id}"]`)
        if (!panel) return
        const stations = gsap.utils.toArray<HTMLElement>('.ae-station', panel)
        const evidence = panel.querySelector<HTMLElement>('.ae-evidence')
        const outcome = panel.querySelector<HTMLElement>('.ae-outcome')
        stations.forEach((el) => setIf(el, { autoAlpha: 1 }))
        if (evidence) setIf(evidence, { autoAlpha: 1 })
        if (outcome) setIf(outcome, { autoAlpha: 1 })
      }

      const clearWillChange = () => {
        setIf(reveal, { clearProps: 'willChange' })
        setIf(base, { clearProps: 'willChange' })
        setIf(sweep, { clearProps: 'willChange' })
        setIf(resultRule, { clearProps: 'willChange,transform' })
        const parts = frameParts(allFrames())
        if (parts.length) setIf(parts, { clearProps: 'willChange' })
      }

      const runLens = (id: ViewId, instant = false) => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const mobile = window.innerWidth < 768
        const tab = tabRefs.current[views.findIndex((v) => v.id === id)]

        lensTlRef.current?.kill()
        lensTlRef.current = null
        killIf([reveal, base, sweep, resultRule, ...frameParts(allFrames())])
        if (resultRule) setIf(resultRule, { scaleX: 1, transformOrigin: 'left center' })

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
        const stations = panel ? gsap.utils.toArray<HTMLElement>('.ae-station', panel) : []
        const evidence = panel?.querySelector<HTMLElement>('.ae-evidence')
        const outcome = panel?.querySelector<HTMLElement>('.ae-outcome')
        const liveFrames = framesFor(id)

        stations.forEach((el) => setIf(el, { autoAlpha: 0 }))
        if (evidence) setIf(evidence, { autoAlpha: 0 })
        if (outcome) setIf(outcome, { autoAlpha: 0.45 })
        if (resultRule) setIf(resultRule, { scaleX: 0, transformOrigin: 'left center' })

        liveFrames.forEach((el) => {
          el.dataset.active = 'true'
          const tint = el.querySelector<HTMLElement>('.ae-observer-tint')
          const ring = el.querySelector<HTMLElement>('.ae-observer-ring')
          const corners = el.querySelector<HTMLElement>('.ae-observer-corners')
          const badge = el.querySelector<HTMLElement>('.ae-observer-station')
          setIf(el, { autoAlpha: 1 })
          if (tint) setIf(tint, { autoAlpha: 0 })
          if (ring) setIf(ring, { clipPath: 'inset(0 100% 100% 0)', opacity: 1, willChange: 'clip-path' })
          if (corners) setIf(corners, { opacity: 0 })
          if (badge) setIf(badge, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' })
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
            clearWillChange()
            lensTlRef.current = null
          },
        })
        lensTlRef.current = tl

        if (resultRule) {
          tl.to(resultRule, { scaleX: 1, duration: 0.18, ease: 'power2.out' }, 0)
        }

        tl.to(
          reveal,
          {
            clipPath: `circle(${radius}px at ${origin})`,
            duration: 0.28,
            ease: 'power3.out',
          },
          0,
        )

        liveFrames.forEach((el, i) => {
          const at = 0.06 + i * 0.045
          const tint = el.querySelector<HTMLElement>('.ae-observer-tint')
          const ring = el.querySelector<HTMLElement>('.ae-observer-ring')
          const corners = el.querySelector<HTMLElement>('.ae-observer-corners')
          if (tint) {
            tl.to(tint, { autoAlpha: 1, duration: 0.18, ease: 'power1.out' }, at)
          }
          if (ring) {
            tl.to(ring, { clipPath: 'inset(0 0 0 0)', duration: 0.2, ease: 'power2.out' }, at)
          }
          if (corners) {
            tl.to(corners, { opacity: 1, duration: 0.18 }, at + 0.04)
          }
        })

        liveFrames.forEach((el, i) => {
          const at = 0.12 + i * 0.045
          const badge = el.querySelector<HTMLElement>('.ae-observer-station')
          if (badge) tl.to(badge, { autoAlpha: 1, scale: 1, duration: 0.16 }, at)
        })

        stations.forEach((el, i) => {
          tl.to(el, { autoAlpha: 1, duration: 0.16 }, 0.34 + i * 0.05)
        })
        if (evidence) tl.to(evidence, { autoAlpha: 1, duration: 0.16 }, 0.44)
        if (outcome) tl.to(outcome, { autoAlpha: 1, duration: 0.14 }, 0.42)

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
        if (photo) gsap.set(photo, { clipPath: 'inset(0% 0% 0% 0%)', y: 0 })
        frame.style.boxShadow =
          '6px 8px 0 0 color-mix(in srgb, var(--ink) 82%, transparent), 0 40px 56px -20px color-mix(in srgb, var(--ink) 32%, transparent)'
        return () => {
          lensTlRef.current?.kill()
          clearWillChange()
        }
      }

      gsap.set(frame, { y: 6 })
      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })
      if (photo) {
        gsap.set(photo, {
          clipPath: 'inset(0% 0% 100% 0%)',
          y: 6,
          willChange: 'clip-path, transform',
        })
      }
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
              '6px 8px 0 0 color-mix(in srgb, var(--ink) 82%, transparent), 0 40px 56px -20px color-mix(in srgb, var(--ink) 32%, transparent)',
          })
          gsap.to(rule, { scaleX: 1, duration: 0.55, ease: 'power2.out' })
          if (photo) {
            gsap.to(photo, {
              clipPath: 'inset(0% 0% 0% 0%)',
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => {
                gsap.set(photo, { clearProps: 'willChange' })
              },
            })
          }
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
      setFocusStation(null)
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
      <SignalRail step={3} />
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <div className="max-w-[46.5rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-lime">
            {authorityTheater.eyebrow}
          </p>
          <h2
            id="authority-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-stage-foreground md:text-5xl text-balance"
          >
            {authorityTheater.headline}
          </h2>
          <p className="lede mt-4 text-[color:var(--on-ink-muted)] text-pretty">
            {authorityTheater.supporting}
          </p>
        </div>

        <p className="ae-lens-cue font-mono">{authorityTheater.lensCue}</p>
        <div
          role="tablist"
          aria-label="Buyer research page views"
          className="ae-tablist mt-2.5 grid grid-cols-3 gap-3 md:mt-3 md:gap-4"
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
                aria-label={`${lens.short}. ${lens.main}`}
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
                  <span className="ae-tab-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <p className="ae-lens-read font-mono">{authorityTheater.lensRead}</p>

        <div
          role="tabpanel"
          id="authority-view-panel"
          aria-labelledby={`view-tab-${view}`}
          className="mt-4 md:mt-5"
        >
          <div
            ref={stageRef}
            className="ae-instrument-stage"
            data-lens={view}
            data-focus-station={focusStation || undefined}
            onMouseOver={(event) => {
              const station = readInspectStation(event.target)
              if (station) {
                window.clearTimeout(focusClearRef.current)
                focusClearRef.current = 0
                setFocusStation((current) => (current === station ? current : station))
                return
              }
              if (focusClearRef.current) return
              focusClearRef.current = window.setTimeout(() => {
                focusClearRef.current = 0
                setFocusStation(null)
              }, 90)
            }}
            onMouseLeave={() => {
              window.clearTimeout(focusClearRef.current)
              focusClearRef.current = 0
              setFocusStation(null)
            }}
          >
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
                    <span className="ae-chrome-favicon font-mono">N</span>
                    <span className="ae-chrome-tab-title">Three-Row SUV Guide | Northline</span>
                  </div>
                  <span className="ae-chrome-tab-spacer" />
                </div>

                <div className="ae-chrome-nav">
                  <span className="ae-nav-btn ae-nav-back">
                    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
                      <path
                        d="M7.5 2.5 4 6l3.5 3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                  <span className="ae-nav-btn ae-nav-forward">
                    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
                      <path
                        d="M4.5 2.5 8 6l-3.5 3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                  <span className="ae-nav-btn ae-nav-refresh">
                    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
                      <path
                        d="M6 2.5v2M6 7.5v2M2.5 6H4.5M7.5 6H9.5M3.4 3.4l1.4 1.4M7.2 7.2l1.4 1.4M8.6 3.4 7.2 4.8M4.8 7.2 3.4 8.6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.1"
                        strokeLinecap="square"
                      />
                    </svg>
                  </span>
                  <div className="ae-chrome-address">
                    <span className="ae-toolbar-lock">
                      <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                        <path
                          d="M3.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5M2.5 5.5h7v5h-7z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                      </svg>
                    </span>
                    <span className="ae-toolbar-address">
                      northline.example/vehicles/suvs/three-row-guide
                    </span>
                  </div>
                  <span className="ae-nav-btn ae-nav-bookmark">
                    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
                      <path
                        d="M3 2.5h6v7L6 8 3 9.5z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinejoin="miter"
                      />
                    </svg>
                  </span>
                  <span className="ae-nav-btn ae-nav-more">
                    <svg viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
                      <circle cx="3" cy="6" r="0.9" fill="currentColor" />
                      <circle cx="6" cy="6" r="0.9" fill="currentColor" />
                      <circle cx="9" cy="6" r="0.9" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="ae-status-chip">ILLUSTRATIVE OEM EXPERIENCE</span>
                </div>

                <div className="ae-chrome-mobile">
                  <div className="ae-toolbar-lights">
                    <span className="ae-light ae-light-close" />
                    <span className="ae-light ae-light-min" />
                    <span className="ae-light ae-light-max" />
                  </div>
                  <span className="ae-chrome-favicon font-mono">N</span>
                  <span className="ae-chrome-mobile-domain">northline.example</span>
                  <span className="ae-status-chip">OEM</span>
                </div>
              </div>

              <div ref={workspaceRef} className="ae-workspace" data-lens={view}>
                <span className="ae-scroll-rail" aria-hidden="true">
                  <span className="ae-scroll-track" />
                  <span className="ae-scroll-thumb" />
                </span>
                <div ref={baseRef} className="ae-lens-base" data-lens={view} aria-hidden="true" />
                <div ref={revealRef} className="ae-lens-reveal" data-lens={view} aria-hidden="true" />
                <span ref={sweepRef} className="ae-lens-sweep" aria-hidden="true" />

                <div className="ae-oem-viewport">
                  <article className="ae-page ae-oem-page" data-lens={view}>
                    <header className="ae-oem-masthead" aria-hidden="true">
                      <div className="ae-oem-brand">
                        <span className="ae-oem-wordmark font-mono">NORTHLINE</span>
                        <span className="ae-oem-market font-mono">NORTHLINE USA</span>
                      </div>
                      <nav className="ae-oem-nav">
                        <span className="ae-oem-nav-item">Vehicles</span>
                        <span className="ae-oem-nav-item ae-oem-nav-wide">Shopping Tools</span>
                        <span className="ae-oem-nav-item">Owners</span>
                        <span className="ae-oem-nav-item">Discover</span>
                      </nav>
                      <span className="ae-oem-find">Find Inventory</span>
                    </header>

                    <div className="ae-oem-utility font-mono" aria-hidden="true">
                      <span>2026 BUYER GUIDE</span>
                      <span className="ae-oem-utility-sep" />
                      <span>UPDATED AUGUST 2026</span>
                      <span className="ae-oem-utility-sep" />
                      <span>FAMILY SUV RESEARCH</span>
                    </div>

                    <div className="ae-oem-hero">
                      <div className="ae-oem-hero-copy">
                        <p className="ae-oem-eyebrow font-mono">THREE-ROW SUV GUIDE</p>
                        <h4 className="ae-page-title font-semibold tracking-tight text-balance">
                          {oemTopic}
                        </h4>
                        <div
                          className="ae-spot ae-answer-module"
                          data-spot="answer"
                          data-observed={spotObserved('answer', view) ? 'true' : 'false'}
                        >
                          {framesForSpot('answer', view)}
                          <p className="ae-module-label font-semibold uppercase tracking-wide">
                            The short answer
                          </p>
                          <p className="ae-module-lead mt-1.5 leading-relaxed">
                            The right Northline three-row SUV depends on how many passengers you
                            carry regularly, your budget range, and how much all-weather capability
                            you actually need. Start with your priorities below and we&apos;ll
                            narrow the field.
                          </p>
                        </div>
                      </div>
                      <figure ref={photoRef} className="ae-oem-hero-visual ae-oem-photo">
                        <Image
                          className="ae-oem-photo-img"
                          src="/images/northline-family-suv.webp"
                          alt="Three-row family SUV shown in the illustrative Northline buyer guide."
                          fill
                          priority={false}
                          sizes="(min-width: 1200px) 26vw, (min-width: 768px) 34vw, 88vw"
                        />
                        <span className="ae-oem-photo-veil" aria-hidden="true" />
                        <span className="ae-oem-photo-frame" aria-hidden="true" />
                        <figcaption className="ae-oem-photo-label font-mono" aria-hidden="true">
                          FAMILY SUV RESEARCH
                        </figcaption>
                      </figure>
                    </div>

                    <div
                      className="ae-spot ae-module ae-decision"
                      data-spot="priorities"
                      data-observed={spotObserved('priorities', view) ? 'true' : 'false'}
                    >
                      {framesForSpot('priorities', view)}
                      <p className="ae-module-heading font-semibold">What matters most to your family?</p>
                      <div className="ae-decision-row" aria-hidden="true">
                        {priorities.map((priority, i) => (
                          <span key={priority} className={`ae-chip ${i === 1 ? 'ae-chip-on' : ''}`}>
                            {priority}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className="ae-spot ae-module ae-compare-grid"
                      data-spot="structure"
                      data-observed={spotObserved('structure', view) ? 'true' : 'false'}
                    >
                      {framesForSpot('structure', view)}
                      <div
                        className="ae-card ae-spot"
                        data-spot="compare"
                        data-observed={spotObserved('compare', view) ? 'true' : 'false'}
                      >
                        {framesForSpot('compare', view)}
                        <p className="ae-module-heading font-semibold">Winter capability</p>
                        <p className="ae-module-copy mt-1 leading-relaxed">
                          How all-weather systems, ground clearance, and heated features compare
                          across the three-row lineup.
                        </p>
                        <span className="ae-card-affordance" aria-hidden="true">
                          Compare →
                        </span>
                      </div>
                      <div className="ae-card">
                        <p className="ae-module-heading font-semibold">Budget and ownership</p>
                        <p className="ae-module-copy mt-1 leading-relaxed">
                          What each trim level adds, and which features families value after the
                          first winter.
                        </p>
                        <span className="ae-card-affordance" aria-hidden="true">
                          Explore →
                        </span>
                      </div>
                    </div>

                    <div
                      className="ae-spot ae-inventory-module ae-module"
                      data-spot="inventory"
                      data-observed={spotObserved('inventory', view) ? 'true' : 'false'}
                    >
                      {framesForSpot('inventory', view)}
                      <div className="ae-inventory-head">
                        <p className="ae-module-heading font-semibold text-pretty">
                          Matching three-row SUVs
                        </p>
                        <span className="ae-inventory-status font-mono">Inventory available</span>
                      </div>
                      <span className="ae-fake-action ae-oem-inventory-cta inline-flex min-h-[40px] shrink-0 items-center gap-2 font-semibold">
                        View Matching Inventory
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>

                    <div
                      className="ae-spot ae-module ae-contact"
                      data-spot="contact"
                      data-observed={spotObserved('contact', view) ? 'true' : 'false'}
                    >
                      {framesForSpot('contact', view)}
                      <p className="ae-contact-note font-mono font-medium uppercase tracking-[0.12em]">
                        Questions remain? Speak with a Northline specialist.
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </div>

            <AuthorityProjectionPath
              stageRef={stageRef}
              browserRef={frameRef}
              dockRef={dockRef}
              view={view}
              reduced={reducedMotion}
            />

            <div className="ae-active-result" data-lens={view} aria-hidden="true">
              <span ref={resultRuleRef} className="ae-active-result-rule" aria-hidden="true" />
              <p className="ae-active-result-eyebrow font-mono">ACTIVE RESULT</p>
              <p className="ae-active-result-title">{activeResults[view].title}</p>
              <span className="ae-active-result-station font-mono">{activeResults[view].index}</span>
            </div>

            <aside
              ref={dockRef}
              className="ae-lens-dock ae-inspector ae-analysis-rail"
              data-lens={view}
              aria-label="Authomotive lens readout"
            >
              <header className="ae-dock-header">
                <span className="ae-dock-title font-mono">AUTHOMOTIVE LENS</span>
                <span className="ae-dock-chip font-mono">{observerChip[view]}</span>
              </header>
              <div className="ae-inspector-stack">
                <InspectorShell
                  active={view === 'shopper'}
                  lens="shopper"
                  eyebrow="BUYER DECISION PATH"
                  count={outcomeCount.shopper}
                  outcomeLabel="DEALER VALUE"
                  outcomeValue="Less wandering, stronger inventory intent"
                  outcomeNote="A clearer next step toward available vehicles."
                  label="Buyer decision path inspector"
                  evidence={
                    <div className="ae-artifact">
                      <p className="ae-artifact-heading font-mono">DECISION SEQUENCE</p>
                      <ol className="ae-flow" aria-label="Buyer decision path order">
                        {shopperFlow.map((step) => (
                          <li key={step} className="ae-flow-step">
                            <span className="ae-flow-label">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  }
                >
                  <ol className="ae-station-list">
                    {shopperRoute.map((row, i) => (
                      <li
                        key={row.station}
                        className="ae-station"
                        data-tone="shopper"
                        data-station={pinLabel(i + 1)}
                        tabIndex={0}
                        onFocus={() => setFocusStation(pinLabel(i + 1))}
                        onBlur={() => setFocusStation(null)}
                      >
                        <span
                          className="ae-station-mark font-mono"
                          data-station={pinLabel(i + 1)}
                          aria-hidden="true"
                        >
                          {pinLabel(i + 1)}
                        </span>
                        <div>
                          <p className="ae-station-title font-semibold">{row.station}</p>
                          <p className="ae-station-detail mt-0.5">{row.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </InspectorShell>

                <InspectorShell
                  active={view === 'discovery'}
                  lens="discovery"
                  eyebrow="SEARCH + AI INTERPRETATION"
                  count={outcomeCount.discovery}
                  outcomeLabel="SYSTEM OUTCOME"
                  outcomeValue="EASIER TO PARSE AND RETRIEVE"
                  outcomeNote="Structured information can improve clarity; it does not guarantee rankings or AI citations."
                  label="Search and AI interpretation inspector"
                  evidence={
                    <div className="ae-artifact ae-semantic">
                      <p className="ae-artifact-heading font-mono">SEMANTIC READOUT</p>
                      <pre className="ae-code">
                        <code>{discoveryHeading}</code>
                      </pre>
                      <span className="ae-path-strip font-mono">
                        {discoveryEntities.map((node, n) => (
                          <span key={node} className="ae-path-node">
                            {node}
                            {n < discoveryEntities.length - 1 ? (
                              <span className="ae-path-arrow" aria-hidden="true">
                                →
                              </span>
                            ) : null}
                          </span>
                        ))}
                      </span>
                      <pre className="ae-code ae-code-json">
                        <code>{discoveryJsonLd}</code>
                      </pre>
                      <code className="ae-event ae-path-code font-mono">{discoveryInventoryPath}</code>
                      <p className="ae-artifact-note">
                        Structured information can improve clarity for search and AI systems.
                      </p>
                    </div>
                  }
                >
                  <ol className="ae-station-list">
                    {discoveryPoints.map((item, i) => (
                      <li
                        key={item.label}
                        className="ae-station"
                        data-tone="discovery"
                        data-station={pinLabel(i + 1)}
                        tabIndex={0}
                        onFocus={() => setFocusStation(pinLabel(i + 1))}
                        onBlur={() => setFocusStation(null)}
                      >
                        <span
                          className="ae-station-mark font-mono"
                          data-station={pinLabel(i + 1)}
                          aria-hidden="true"
                        >
                          {pinLabel(i + 1)}
                        </span>
                        <div>
                          <p className="ae-station-title font-semibold">{item.label}</p>
                          <p className="ae-station-detail mt-0.5">{item.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </InspectorShell>

                <InspectorShell
                  active={view === 'measurable'}
                  lens="measurable"
                  eyebrow="CONNECTED BUYER ACTIONS"
                  count={outcomeCount.measurable}
                  outcomeLabel="DEALER VALUE"
                  outcomeValue="Intent you can explain"
                  outcomeNote="See which research actions precede inventory and contact intent."
                  label="Connected buyer actions inspector"
                  evidence={
                    <div className="ae-artifact ae-report">
                      <p className="ae-artifact-heading font-mono">
                        EVENT STREAM
                      </p>
                      <ol className="ae-stream" aria-label="Event stream">
                        {measuredActions.map((row, i) => (
                          <li key={row.event} className="ae-stream-row">
                            <span className="ae-stream-n font-mono">{pinLabel(i + 1)}</span>
                            <span className="ae-stream-title">{row.action}</span>
                            <code className="ae-stream-event font-mono">{row.event}</code>
                          </li>
                        ))}
                      </ol>
                    </div>
                  }
                >
                  <ol className="ae-station-list ae-station-list-measure">
                    {measuredActions.map((row, i) => (
                      <li
                        key={row.action}
                        className="ae-station"
                        data-tone="measurable"
                        data-station={pinLabel(i + 1)}
                        tabIndex={0}
                        onFocus={() => setFocusStation(pinLabel(i + 1))}
                        onBlur={() => setFocusStation(null)}
                      >
                        <span
                          className="ae-station-mark font-mono"
                          data-station={pinLabel(i + 1)}
                          aria-hidden="true"
                        >
                          {pinLabel(i + 1)}
                        </span>
                        <div>
                          <p className="ae-station-title font-semibold">{row.action}</p>
                          <p className="ae-station-detail mt-0.5">{row.detail}</p>
                          <code className="ae-event font-mono">{row.event}</code>
                        </div>
                      </li>
                    ))}
                  </ol>
                </InspectorShell>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
