'use client'

/**
 * HeroStage — treasure-map journey (hard-tuned cubic Béziers from blue sketch).
 * Main sweep: Search → Guide → deep dip → VSRP → leftward lower sweep → VDP
 * → car junction disc → Phone / Form / Lead fan-out (matched lime discs).
 * Five website-visitor glyphs (Search / AI / Local) with pace variance + thinking pauses.
 */

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, ClipboardList, Phone } from 'lucide-react'

const VB_W = 640
const VB_H = 420
const PAGE_W = 252
const PAGE_H = 196
const CTA_X = 126
const CTA_Y = 166
const INNER = PAGE_W - 24

const PAGES = [
  { id: 'guide' as const, x: 58, y: 6, label: 'AUTHORITY GUIDE' },
  { id: 'vsrp' as const, x: 322, y: 48, label: 'VSRP' },
  { id: 'vdp' as const, x: 58, y: 214, label: 'VDP' },
]

function tipPct(cx: number, cy: number) {
  return {
    x: `${((cx / VB_W) * 100).toFixed(1)}%`,
    y: `${((cy / VB_H) * 100).toFixed(1)}%`,
  }
}

/** Trail origin — lime disc, fully on-canvas and left of Authority Guide */
const SEARCH = { cx: 34, cy: 168 }
/** Trail split / fan origin — enlarged lime disc with car icon (shifted into map pocket). */
const JUNCTION = { cx: 375, cy: 335 }

const STAGE_WAYPOINTS = [
  {
    id: 'guide',
    cx: PAGES[0].x + CTA_X,
    cy: PAGES[0].y + CTA_Y,
    tip: 'Authority Guide',
    ...tipPct(PAGES[0].x + CTA_X, PAGES[0].y + CTA_Y),
  },
  {
    id: 'vsrp',
    cx: PAGES[1].x + CTA_X,
    cy: PAGES[1].y + CTA_Y,
    tip: 'VSRP Results',
    ...tipPct(PAGES[1].x + CTA_X, PAGES[1].y + CTA_Y),
  },
  {
    id: 'vdp',
    cx: PAGES[2].x + CTA_X,
    cy: PAGES[2].y + CTA_Y,
    tip: 'VDP View',
    ...tipPct(PAGES[2].x + CTA_X, PAGES[2].y + CTA_Y),
  },
] as const

/**
 * Conversion endpoints — cluster shifted ~90 units left; internal spacing preserved.
 * Tips stay on-stage via percentage positioning from viewBox coords.
 */
const CONVERSIONS = [
  {
    id: 'phone' as const,
    cx: 460,
    cy: 272,
    tip: 'Call started',
    label: 'PHONE',
    Icon: Phone,
  },
  {
    id: 'form' as const,
    cx: 478,
    cy: 324,
    tip: 'Form submitted',
    label: 'FORM',
    Icon: ClipboardList,
  },
  {
    id: 'lead' as const,
    cx: 462,
    cy: 378,
    tip: 'Lead won',
    label: 'LEAD',
    Icon: CheckCircle2,
  },
] as const

type BranchId = (typeof CONVERSIONS)[number]['id']

/**
 * Hard-tuned to blue markup:
 * soar → Guide → deep Guide→VSRP dip → VSRP → leftward lower sweep into VDP
 * → clean junction (no bottom perimeter loop, no self-cross).
 */
const TRAIL_MAIN =
  'M34 168' +
  ' C28 95 80 12 165 18' +
  ' C210 24 230 100 184 172' +
  ' C150 260 230 295 305 245' +
  ' C370 185 410 125 465 138' +
  ' C505 152 495 192 448 214' +
  ' C390 255 300 285 240 305' +
  ' C190 325 155 355 184 380' +
  ' C220 402 290 360 335 345' +
  ' C355 338 368 335 375 335'

/** Short fan from car junction disc into Phone / Form / Lead (spacing preserved). */
const BRANCH_PATHS: Record<BranchId, string> = {
  phone: ' C410 310 438 282 460 272',
  form: ' C415 335 448 330 478 324',
  lead: ' C408 355 438 368 462 378',
}

const JOURNEY_PATHS: Record<BranchId, string> = {
  phone: TRAIL_MAIN + BRANCH_PATHS.phone,
  form: TRAIL_MAIN + BRANCH_PATHS.form,
  lead: TRAIL_MAIN + BRANCH_PATHS.lead,
}

/** Visual segments — varied dashes; geometry matches TRAIL_MAIN + branches */
const TRAIL_SEGMENTS = [
  {
    id: 'soar',
    tone: 'a',
    d: 'M34 168 C28 95 80 12 165 18 C210 24 230 100 184 172',
  },
  {
    id: 'vsrp',
    tone: 'b',
    d: 'M184 172 C150 260 230 295 305 245 C370 185 410 125 465 138 C505 152 495 192 448 214',
  },
  {
    id: 'sweep',
    tone: 'c',
    d: 'M448 214 C390 255 300 285 240 305 C190 325 155 355 184 380',
  },
  {
    id: 'junc',
    tone: 'd',
    d: 'M184 380 C220 402 290 360 335 345 C355 338 368 335 375 335',
  },
  { id: 'phone', tone: 'e', d: `M375 335${BRANCH_PATHS.phone}` },
  { id: 'form', tone: 'f', d: `M375 335${BRANCH_PATHS.form}` },
  { id: 'lead', tone: 'e', d: `M375 335${BRANCH_PATHS.lead}` },
] as const

/** Five website visitors — Search, AI, and Local channels */
const CHANNELS = [
  { id: 'seo' as const, tipLabel: 'SEO', hudLabel: 'Search', color: '#b7ff3c', r: 7, startDelayMs: 0, speedBias: 1.85, face: 0, lane: 0 },
  { id: 'geo' as const, tipLabel: 'GEO', hudLabel: 'Local', color: '#ff6a3d', r: 6, startDelayMs: 900, speedBias: 1.32, face: 1, lane: 7 },
  { id: 'aeo' as const, tipLabel: 'AEO', hudLabel: 'AI', color: '#fffcf7', r: 6, startDelayMs: 2200, speedBias: 0.88, face: 2, lane: -7 },
  { id: 'seo2' as const, tipLabel: 'SEO', hudLabel: 'Search', color: '#c8ff66', r: 5.5, startDelayMs: 3600, speedBias: 0.64, face: 1, lane: 4 },
  { id: 'geo2' as const, tipLabel: 'GEO', hudLabel: 'Local', color: '#ff8a5c', r: 5.5, startDelayMs: 5100, speedBias: 0.5, face: 2, lane: -4 },
] as const

type ChannelId = (typeof CHANNELS)[number]['id']
type TipId = 'guide' | 'vsrp' | 'vdp' | 'convert'

const BRANCH_IDS: BranchId[] = ['phone', 'form', 'lead']
const CHANNEL_IDS = CHANNELS.map((c) => c.id)

/** Path lengths for tip sync — tips follow progress, not wall-clock (keeps refinement). */
const MAIN_LEN = 1462
const WAYPOINT_MAIN_CUM: Record<Exclude<TipId, 'convert'>, number> = {
  guide: 405.9,
  vsrp: 920.2,
  vdp: 1261.4,
}
const BRANCH_LEN: Record<BranchId, number> = {
  phone: 106,
  form: 103.8,
  lead: 97.1,
}

const BASE_JOURNEY_MS = 12800
const SPEED_MIN = 0.9
const SPEED_MAX = 1.02
const TIP_HOLD_MS = 1100
/** Crisp convert celebration window; tip holds slightly longer for readability */
const WIN_CELEBRATE_MS = 800
const CONVERT_TIP_HOLD_MS = 1400
const LEAD_TIP_HOLD_MS = 1600
const FLASH_HOLD_MS = 650
const CONVERT_FLASH_HOLD_MS = WIN_CELEBRATE_MS
const LEAD_FLASH_HOLD_MS = WIN_CELEBRATE_MS
const TIP_FADE_MS = 280
const THINK_MIN_MS = 700
const THINK_MAX_MS = 1400
const THINK_COOLDOWN_MS = 1600
/** Target share of active travelers paused in a “thinking” state */
const THINK_TARGET_RATIO = 0.2

function pickBranch(exclude?: BranchId): BranchId {
  const pool = exclude ? BRANCH_IDS.filter((b) => b !== exclude) : BRANCH_IDS
  return pool[Math.floor(Math.random() * pool.length)]!
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function tipThresholds(branch: BranchId): Record<TipId, number> {
  const full = MAIN_LEN + BRANCH_LEN[branch]
  return {
    guide: WAYPOINT_MAIN_CUM.guide / full,
    vsrp: WAYPOINT_MAIN_CUM.vsrp / full,
    vdp: WAYPOINT_MAIN_CUM.vdp / full,
    convert: 0.985,
  }
}

const TIP_THRESHOLDS: Record<BranchId, Record<TipId, number>> = {
  phone: tipThresholds('phone'),
  form: tipThresholds('form'),
  lead: tipThresholds('lead'),
}

const OFFSET_PATH: Record<BranchId, string> = {
  phone: `path('${JOURNEY_PATHS.phone}')`,
  form: `path('${JOURNEY_PATHS.form}')`,
  lead: `path('${JOURNEY_PATHS.lead}')`,
}

const TIP_IDS: TipId[] = ['guide', 'vsrp', 'vdp', 'convert']

function makeTravelerSeed(branch: BranchId, waitUntil: number) {
  return {
    progress: 0,
    speed: 1 / BASE_JOURNEY_MS,
    thinking: false,
    thinkUntil: 0,
    cooldownUntil: 0,
    waitUntil,
    fired: { guide: false, vsrp: false, vdp: false, convert: false },
    tipUntil: {} as Partial<Record<TipId, number>>,
    flashUntil: 0,
    flashTip: null as TipId | null,
    branch,
    /** Locked while convert tip fades — prevents climax tip jump/blink on respawn */
    tipBranch: branch,
    tipAnchorUntil: 0,
    started: false,
    heading: 0,
  }
}

function emptyChannelMap<T>(value: T): Record<ChannelId, T> {
  return Object.fromEntries(CHANNEL_IDS.map((id) => [id, value])) as Record<ChannelId, T>
}

function buildPathMetrics() {
  if (typeof document === 'undefined') return null
  const ns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(ns, 'svg')
  const metrics = {} as Record<BranchId, { el: SVGPathElement; len: number }>
  for (const id of BRANCH_IDS) {
    const el = document.createElementNS(ns, 'path')
    el.setAttribute('d', JOURNEY_PATHS[id])
    svg.appendChild(el)
    metrics[id] = { el, len: el.getTotalLength() }
  }
  return metrics
}

type TipLive = Record<ChannelId, Partial<Record<TipId, boolean>>>
type FlashLive = Record<ChannelId, TipId | null>

function slightHeading(
  metrics: NonNullable<ReturnType<typeof buildPathMetrics>>,
  branch: BranchId,
  progress: number,
) {
  const { el, len } = metrics[branch]
  const at = Math.max(0, Math.min(len, progress * len))
  const a = el.getPointAtLength(Math.max(0, at - 3))
  const b = el.getPointAtLength(Math.min(len, at + 3))
  const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
  return ang * 0.22
}

function rollSpeed(ch: (typeof CHANNELS)[number]) {
  if (ch.id === 'seo' || ch.id === 'geo') return (1 / BASE_JOURNEY_MS) * ch.speedBias
  return (1 / BASE_JOURNEY_MS) * rand(SPEED_MIN, SPEED_MAX) * ch.speedBias
}

type UiSnap = {
  tips: TipLive
  flashes: FlashLive
  tipBranch: Record<ChannelId, BranchId>
  branch: Record<ChannelId, BranchId>
}

function uiChanged(a: UiSnap, b: UiSnap) {
  for (const id of CHANNEL_IDS) {
    if (a.flashes[id] !== b.flashes[id]) return true
    if (a.tipBranch[id] !== b.tipBranch[id]) return true
    if (a.branch[id] !== b.branch[id]) return true
    const x = a.tips[id]
    const y = b.tips[id]
    if (x.guide !== y.guide || x.vsrp !== y.vsrp || x.vdp !== y.vdp || x.convert !== y.convert) return true
  }
  return false
}

function applyTravelerDom(
  g: SVGGElement | null,
  steer: SVGGElement | null,
  live: { progress: number; opacity: number; thinking: boolean; branch: BranchId; heading: number },
) {
  if (!g) return
  g.style.offsetPath = OFFSET_PATH[live.branch]
  g.style.offsetDistance = `${(live.progress * 100).toFixed(3)}%`
  g.style.opacity = String(live.opacity)
  g.classList.toggle('is-thinking', live.thinking)
  if (steer) steer.style.transform = 'rotate(0deg)'
}

const INK = '#061b20'

/** Compact source-colored traffic token — not an avatar or glowing badge */
function VisitorFace({
  color,
  variant = 0,
  clipId,
}: {
  color: string
  variant?: number
  clipId: string
}) {
  const s = 12
  const headY = variant === 1 ? -2.6 : variant === 2 ? -3.2 : -2.8
  const headR = variant === 1 ? 3.2 : 3.6
  const bodyW = variant === 1 ? 9.4 : 8.6

  return (
    <g className="hs-packet hs-visitor">
      <rect x={-s + 1} y={-s + 2} width={s * 2} height={s * 2} rx="3.5" fill={color} opacity="0.22" />
      <rect x={-s} y={-s} width={s * 2} height={s * 2} rx="3.5" fill={INK} stroke={color} strokeWidth="1.75" />
      <g clipPath={`url(#${clipId})`}>
        <circle cx={variant === 2 ? 0.4 : 0} cy={headY} r={headR} fill={color} />
        {variant === 2 ? <ellipse cx="1.8" cy={headY - 0.8} rx="2.4" ry="2.9" fill={color} /> : null}
        <path
          d={`M ${-bodyW} ${s + 1} C ${-bodyW} 1.6 ${-3.4} 0.3 0 0.3 C 3.4 0.3 ${bodyW} 1.6 ${bodyW} ${s + 1} Z`}
          fill={color}
        />
      </g>
    </g>
  )
}

function VisitorChipIcon({ color, variant = 0 }: { color: string; variant?: number }) {
  return (
    <svg className="hs-chip-face" viewBox="-12 -12 24 24" width="14" height="14" aria-hidden="true">
      <rect x="-10" y="-10" width="20" height="20" rx="3" fill={INK} stroke={color} strokeWidth="1.75" />
      <circle cx={variant === 2 ? 0.3 : 0} cy={variant === 2 ? -2.2 : -1.9} r={variant === 1 ? 2.6 : 2.9} fill={color} />
      {variant === 2 ? <ellipse cx="1.3" cy="-2.8" rx="1.8" ry="2.2" fill={color} /> : null}
      <path
        d={
          variant === 1
            ? 'M -7.2 10 C -7.2 1.8 -3 0.5 0 0.5 C 3 0.5 7.2 1.8 7.2 10 Z'
            : 'M -6.6 10 C -6.6 2 -2.6 0.6 0 0.6 C 2.6 0.6 6.6 2 6.6 10 Z'
        }
        fill={color}
      />
    </svg>
  )
}

function SearchGlyph() {
  return (
    <g fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="-1.6" cy="-1.8" r="5.2" />
      <path d="M2.2 2 6.4 6.2" />
    </g>
  )
}

/** Lime disc + dark glyph — shared style for junction car + convert ends */
function ConvertGlyph({ id }: { id: BranchId }) {
  if (id === 'phone') {
    return (
      <g fill="none" stroke={INK} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-3.2 -4.2h2.1c.35 0 .65.28.65.65l.35 1.85c.05.3-.08.55-.3.7l-.95.95a7.2 7.2 0 0 0 3.1 3.1l.95-.95c.22-.22.5-.35.7-.3l1.85.35c.37.07.65.35.65.7v2.1c0 .37-.28.65-.65.65A8 8 0 0 1 -3.85 -3.55c0-.37.28-.65.65-.65Z" />
      </g>
    )
  }
  if (id === 'form') {
    return (
      <g fill="none" stroke={INK} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-3.6" y="-4.4" width="7.2" height="8.8" rx="1.1" />
        <path d="M-1.8 -1.6h3.6M-1.8 .4h3.6M-1.8 2.4h2.2" />
      </g>
    )
  }
  return (
    <g fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-2.6 .1  -.6 2.1  3.2 -1.8" />
    </g>
  )
}

function CarGlyph() {
  return (
    <g fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-8.2 1.35h16.4" />
      <path d="M-6.4 1.35  -4.2 -2.7h8.4l2.2 4.05" />
      <circle cx="-3.8" cy="2.95" r="1.6" fill={INK} stroke="none" />
      <circle cx="3.8" cy="2.95" r="1.6" fill={INK} stroke="none" />
      <path d="M-2.5 -2.45h5" />
    </g>
  )
}

function PageWireframe({
  id,
  x,
  y,
  label,
  variant,
  lit,
}: {
  id: string
  x: number
  y: number
  label: string
  variant: 'guide' | 'vsrp' | 'vdp'
  lit?: boolean
}) {
  const cardW = Math.round(INNER / 3 - 4)
  const cardGap = 12
  const card1 = 12
  const card2 = card1 + cardW + cardGap
  const card3 = card2 + cardW + cardGap

  return (
    <g className={`hs-skel hs-skel-${id}${lit ? ' is-lit' : ''}`} transform={`translate(${x} ${y})`}>
      <rect
        width={PAGE_W}
        height={PAGE_H}
        rx="11"
        fill="rgba(6,27,32,0.74)"
        stroke="rgba(216,227,224,0.24)"
        strokeWidth="1.25"
      />
      <rect width={PAGE_W} height="26" rx="11" fill="rgba(23,76,84,0.55)" />
      <rect y="13" width={PAGE_W} height="13" fill="rgba(23,76,84,0.55)" />
      <circle cx="16" cy="13" r="3" fill="rgba(255,252,247,0.35)" />
      <circle cx="27" cy="13" r="3" fill="rgba(255,252,247,0.22)" />
      <circle cx="38" cy="13" r="3" fill="rgba(255,252,247,0.14)" />
      <rect x="52" y="8" width="120" height="9" rx="4" fill="rgba(255,252,247,0.08)" />

      <text
        x="12"
        y="44"
        fill="rgba(255,252,247,0.62)"
        style={{ fontSize: '8px', letterSpacing: '0.14em', fontFamily: 'ui-monospace, monospace' }}
      >
        {label}
      </text>

      {variant === 'guide' && (
        <>
          <rect className="hs-skel-block" x="12" y="54" width="92" height="9" rx="2" />
          <rect className="hs-skel-block" x="12" y="72" width={INNER} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="84" width={INNER - 20} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="96" width={INNER - 10} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="108" width={INNER - 56} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="122" width={INNER} height="16" rx="3" />
        </>
      )}
      {variant === 'vsrp' && (
        <>
          <rect className="hs-skel-block" x={card1} y="54" width={cardW} height="52" rx="4" />
          <rect className="hs-skel-block" x={card2} y="54" width={cardW} height="52" rx="4" />
          <rect className="hs-skel-block" x={card3} y="54" width={cardW} height="52" rx="4" />
          <rect className="hs-skel-block" x="12" y="118" width={INNER - 40} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="130" width={INNER - 70} height="6" rx="2" />
        </>
      )}
      {variant === 'vdp' && (
        <>
          <rect className="hs-skel-block" x="12" y="54" width={INNER} height="64" rx="5" />
          <rect className="hs-skel-block" x="12" y="128" width="132" height="7" rx="2" />
          <rect className="hs-skel-block" x="12" y="140" width="184" height="6" rx="2" />
        </>
      )}

      <rect
        className="hs-skel-cta"
        x={CTA_X - 52}
        y={CTA_Y - 14}
        width="104"
        height="28"
        rx="6"
        fill="rgba(183,255,60,0.2)"
        stroke="rgba(183,255,60,0.55)"
        strokeWidth="1.25"
      />
      <rect className="hs-skel-block" x={CTA_X - 28} y={CTA_Y - 3} width="56" height="6" rx="2" opacity="0.7" />
    </g>
  )
}

export function HeroStage() {
  const [ui, setUi] = useState<UiSnap>(() => ({
    tips: emptyChannelMap({}),
    flashes: emptyChannelMap(null),
    tipBranch: emptyChannelMap('phone' as BranchId),
    branch: emptyChannelMap('phone' as BranchId),
  }))

  const travelerEls = useRef(emptyChannelMap<SVGGElement | null>(null))
  const steerEls = useRef(emptyChannelMap<SVGGElement | null>(null))
  const uiRef = useRef(ui)
  uiRef.current = ui

  const simRef = useRef({
    reduced: false,
    pathMetrics: null as ReturnType<typeof buildPathMetrics>,
    travelers: Object.fromEntries(
      CHANNELS.map((ch, i) => [
        ch.id,
        makeTravelerSeed(BRANCH_IDS[i % BRANCH_IDS.length]!, ch.startDelayMs),
      ]),
    ) as Record<ChannelId, ReturnType<typeof makeTravelerSeed>>,
  })

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    simRef.current.reduced = reduced
    simRef.current.pathMetrics = buildPathMetrics()
    const nodes = { g: travelerEls.current, steer: steerEls.current }

    for (const ch of CHANNELS) {
      const t = simRef.current.travelers[ch.id]
      t.branch = pickBranch()
      t.tipBranch = t.branch
      t.speed = rollSpeed(ch)
      t.waitUntil = performance.now() + ch.startDelayMs
      if (reduced) {
        t.progress = 1
        t.started = true
      }
    }

    if (reduced) {
      const branch = emptyChannelMap('phone' as BranchId)
      for (const ch of CHANNELS) branch[ch.id] = simRef.current.travelers[ch.id].branch
      setUi({
        tips: { ...emptyChannelMap({}), seo: { convert: true } },
        flashes: emptyChannelMap(null),
        tipBranch: { ...branch },
        branch,
      })
      const lead = simRef.current.travelers.seo
      applyTravelerDom(nodes.g.seo, nodes.steer.seo, {
        progress: 1,
        opacity: 0.9,
        thinking: false,
        branch: lead.branch,
        heading: 0,
      })
      return
    }

    let raf = 0
    let last = performance.now()
    let running = false

    const tick = (now: number) => {
      if (!running) return
      const dt = Math.min(48, now - last)
      last = now
      const sim = simRef.current.travelers
      const metrics = simRef.current.pathMetrics

      let thinkingCount = 0
      for (const ch of CHANNELS) {
        if (sim[ch.id].thinking) thinkingCount++
      }

      const nextTips = {} as TipLive
      const nextFlashes = {} as FlashLive
      const nextTipBranch = {} as Record<ChannelId, BranchId>
      const nextBranch = {} as Record<ChannelId, BranchId>

      for (const ch of CHANNELS) {
        const t = sim[ch.id]

        if (now < t.waitUntil) {
          applyTravelerDom(nodes.g[ch.id], nodes.steer[ch.id], {
            progress: t.progress,
            opacity: 0,
            thinking: false,
            branch: t.branch,
            heading: 0,
          })
          nextTips[ch.id] = {}
          nextFlashes[ch.id] = null
          nextTipBranch[ch.id] = t.tipBranch
          nextBranch[ch.id] = t.branch
          continue
        }

        if (!t.started) {
          t.started = true
          t.progress = 0
          t.fired = { guide: false, vsrp: false, vdp: false, convert: false }
          t.tipUntil = {}
          t.thinking = false
        }

        if (t.thinking) {
          if (now >= t.thinkUntil) {
            t.thinking = false
            t.cooldownUntil = now + THINK_COOLDOWN_MS
            thinkingCount = Math.max(0, thinkingCount - 1)
          }
        } else if (
          ch.id !== 'seo' &&
          t.progress > 0.08 &&
          t.progress < 0.9 &&
          now >= t.cooldownUntil &&
          thinkingCount / CHANNELS.length < THINK_TARGET_RATIO + 0.05
        ) {
          const startChance = (dt / 1000) * 0.35
          if (Math.random() < startChance) {
            t.thinking = true
            t.thinkUntil = now + rand(THINK_MIN_MS, THINK_MAX_MS)
            thinkingCount++
          }
        }

        if (!t.thinking) {
          t.progress = Math.min(1, t.progress + t.speed * dt)
        }

        const thresholds = TIP_THRESHOLDS[t.branch]
        for (const tip of TIP_IDS) {
          if (!t.fired[tip] && t.progress >= thresholds[tip]) {
            t.fired[tip] = true
            const convert = tip === 'convert'
            const leadWin = convert && t.branch === 'lead'
            const hold = leadWin ? LEAD_TIP_HOLD_MS : convert ? CONVERT_TIP_HOLD_MS : TIP_HOLD_MS
            t.tipUntil[tip] = now + hold
            if (convert) {
              t.tipBranch = t.branch
              t.tipAnchorUntil = now + hold + TIP_FADE_MS
            }
            t.flashTip = tip
            t.flashUntil =
              now + (leadWin ? LEAD_FLASH_HOLD_MS : convert ? CONVERT_FLASH_HOLD_MS : FLASH_HOLD_MS)
          }
        }

        const tipState: Partial<Record<TipId, boolean>> = {}
        for (const tip of TIP_IDS) {
          const until = t.tipUntil[tip]
          if (until && now < until) tipState[tip] = true
        }

        nextTips[ch.id] = tipState
        nextFlashes[ch.id] = now < t.flashUntil ? t.flashTip : null
        nextTipBranch[ch.id] = t.tipBranch
        nextBranch[ch.id] = t.branch

        const convertHoldUntil = t.tipUntil.convert ?? 0
        const holdingConvert = t.progress >= 0.985 && now < convertHoldUntil
        const opacity =
          t.progress <= 0.02
            ? t.progress / 0.02
            : holdingConvert
              ? 0.55
              : t.progress >= 0.995
                ? 0
                : 1

        const heading =
          t.thinking || opacity === 0 || !metrics
            ? t.heading
            : (t.heading = slightHeading(metrics, t.branch, t.progress))

        let live = {
          progress: t.progress,
          opacity: Math.max(0, Math.min(1, opacity)),
          thinking: t.thinking,
          branch: t.branch,
          heading,
        }

        if (t.progress >= 1) {
          const holdUntil = Math.max(convertHoldUntil, t.flashUntil, t.tipAnchorUntil)
          if (now < holdUntil) {
            live = {
              progress: 1,
              opacity: 0.55,
              thinking: false,
              branch: t.branch,
              heading,
            }
          } else {
            t.branch = pickBranch(t.branch)
            t.speed = rollSpeed(ch)
            t.progress = 0
            t.started = false
            t.thinking = false
            t.waitUntil = now + rand(450, 1100)
            t.fired = { guide: false, vsrp: false, vdp: false, convert: false }
            t.tipUntil = {}
            t.flashTip = null
            t.flashUntil = 0
            t.tipAnchorUntil = 0
            nextBranch[ch.id] = t.branch
            live = {
              progress: 0,
              opacity: 0,
              thinking: false,
              branch: t.branch,
              heading: 0,
            }
          }
        }

        applyTravelerDom(nodes.g[ch.id], nodes.steer[ch.id], live)
      }

      const nextUi: UiSnap = {
        tips: nextTips,
        flashes: nextFlashes,
        tipBranch: nextTipBranch,
        branch: nextBranch,
      }
      if (uiChanged(uiRef.current, nextUi)) {
        uiRef.current = nextUi
        setUi(nextUi)
      }

      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const onVis = () => {
      if (document.hidden) stop()
      else start()
    }

    const root = travelerEls.current.seo?.ownerSVGElement?.closest('.hero-stage') ?? null
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !document.hidden) start()
        else stop()
      },
      { rootMargin: '80px' },
    )
    if (root) io.observe(root)
    else start()

    document.addEventListener('visibilitychange', onVis)
    if (!document.hidden) start()

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const winningBranches = new Set(
    CHANNELS.filter((ch) => ui.flashes[ch.id] === 'convert').map((ch) => ui.branch[ch.id]),
  )
  const anyConvertWin = winningBranches.size > 0

  return (
    <div className="hero-stage relative mx-auto w-full max-w-[580px] overflow-visible lg:max-w-none">
      <p className="sr-only">
        Animated conversion map: website visitors from Search, AI, and Local follow a trail
        through an authority guide, VSRP, and VDP, then convert via phone, form, or lead.
        Visitors vary in pace and occasionally pause as if thinking.
      </p>

      <div className="hs-map" aria-hidden="true">
        <div className="hs-intel">
          <p className="hs-intel-kicker">Website visitors</p>
          <div className="hs-intel-channels">
            <span className="hs-chip hs-chip-seo">
              <VisitorChipIcon color="#b7ff3c" variant={0} />
              Search
            </span>
            <span className="hs-chip hs-chip-aeo">
              <VisitorChipIcon color="#fffcf7" variant={2} />
              AI
            </span>
            <span className="hs-chip hs-chip-geo">
              <VisitorChipIcon color="#ff6a3d" variant={1} />
              Local
            </span>
          </div>
          <div className="hs-intel-metrics">
            <span className="hs-intel-metrics-label">VDP → Engage</span>
            <div className="hs-legend-bars" role="img" aria-label="Engagement bars">
              <span className="hs-bar hs-bar-1" />
              <span className="hs-bar hs-bar-2" />
              <span className="hs-bar hs-bar-3" />
              <span className="hs-bar hs-bar-4" />
              <span className="hs-bar hs-bar-5" />
              <span className="hs-bar hs-bar-6" />
            </div>
          </div>
        </div>

        <div className="hs-map-stage">
          <svg
            className="hs-map-svg"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            preserveAspectRatio="xMidYMid meet"
            overflow="visible"
          >
            <defs>
              <pattern id="hs-map-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0V28" fill="none" stroke="rgba(120,168,170,0.16)" strokeWidth="1" />
              </pattern>
              <radialGradient id="hs-grid-fade" cx="48%" cy="46%" r="62%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
                <stop offset="70%" stopColor="#fff" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <mask id="hs-grid-mask">
                <rect width={VB_W} height={VB_H} fill="url(#hs-grid-fade)" />
              </mask>
              <filter id="hs-packet-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="1.8" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {CHANNELS.map((ch) => (
                <clipPath key={`clip-${ch.id}`} id={`hs-vis-${ch.id}`}>
                  <rect x="-12" y="-12" width="24" height="24" rx="3.5" />
                </clipPath>
              ))}
            </defs>

            <g className="hs-grid-fragments" mask="url(#hs-grid-mask)" opacity="0.45">
              <rect x="40" y="20" width="220" height="180" fill="url(#hs-map-grid)" />
              <rect x="300" y="40" width="240" height="200" fill="url(#hs-map-grid)" />
              <rect x="80" y="220" width="260" height="170" fill="url(#hs-map-grid)" />
              <rect x="360" y="250" width="200" height="140" fill="url(#hs-map-grid)" />
            </g>

            {PAGES.map((page) => (
              <PageWireframe
                key={page.id}
                id={page.id}
                x={page.x}
                y={page.y}
                label={page.label}
                variant={page.id}
                lit={Object.values(ui.flashes).includes(page.id)}
              />
            ))}

            <g className="hs-trail-layer">
              <path className="hs-trail-glow" d={TRAIL_MAIN} />
              {BRANCH_IDS.map((id) => (
                <path
                  key={`glow-${id}`}
                  className="hs-trail-glow hs-trail-glow-branch"
                  d={`M${JUNCTION.cx} ${JUNCTION.cy}${BRANCH_PATHS[id]}`}
                />
              ))}
              <path className="hs-trail-base" d={TRAIL_MAIN} />
              {BRANCH_IDS.map((id) => (
                <path
                  key={`base-${id}`}
                  className={`hs-trail-base hs-trail-base-branch${
                    winningBranches.has(id) ? ' is-hot' : ''
                  }${anyConvertWin && !winningBranches.has(id) ? ' is-muted' : ''}`}
                  d={`M${JUNCTION.cx} ${JUNCTION.cy}${BRANCH_PATHS[id]}`}
                />
              ))}
              {TRAIL_SEGMENTS.map((seg) => {
                const isBranch =
                  seg.id === 'phone' || seg.id === 'form' || seg.id === 'lead'
                const hot = isBranch && winningBranches.has(seg.id)
                const muted = isBranch && anyConvertWin && !winningBranches.has(seg.id)
                return (
                  <path
                    key={seg.id}
                    className={`hs-trail-seg hs-trail-seg-${seg.tone}${isBranch ? ' hs-trail-branch' : ''}${
                      hot ? ' is-hot' : ''
                    }${muted ? ' is-muted' : ''}`}
                    d={seg.d}
                  />
                )
              })}
              <path className="hs-trail-center" d={TRAIL_MAIN} />
              {BRANCH_IDS.map((id) => (
                <path
                  key={`center-${id}`}
                  className={`hs-trail-center hs-trail-center-branch${
                    winningBranches.has(id) ? ' is-hot' : ''
                  }${anyConvertWin && !winningBranches.has(id) ? ' is-muted' : ''}`}
                  d={`M${JUNCTION.cx} ${JUNCTION.cy}${BRANCH_PATHS[id]}`}
                />
              ))}
              {STAGE_WAYPOINTS.map((wp) => (
                <circle key={`node-${wp.id}`} className="hs-trail-node" cx={wp.cx} cy={wp.cy} r="16" />
              ))}
            </g>

            <g
              className={`hs-junction${anyConvertWin ? ' is-bloom' : ''}`}
              transform={`translate(${JUNCTION.cx} ${JUNCTION.cy})`}
            >
              <circle className="hs-hub-bloom" r="36" fill="#b7ff3c" />
              <circle r="22" fill="#b7ff3c" />
              <circle r="22" fill="none" stroke="rgba(6,27,32,0.2)" strokeWidth="1.35" />
              <CarGlyph />
            </g>

            <g className="hs-start" transform={`translate(${SEARCH.cx} ${SEARCH.cy})`}>
              <circle className="hs-convert-disc" r="16" fill="#b7ff3c" />
              <circle r="16" fill="none" stroke="rgba(6,27,32,0.2)" strokeWidth="1.25" />
              <SearchGlyph />
            </g>

              {STAGE_WAYPOINTS.map((wp) => (
                <g key={wp.id}>
                  {CHANNELS.map((ch) => (
                    <circle
                      key={ch.id}
                      className={`hs-ring hs-ring-${ch.id}${ui.flashes[ch.id] === wp.id ? ' is-flash' : ''}`}
                      cx={wp.cx}
                      cy={wp.cy}
                      r="18"
                      fill="none"
                      stroke={ch.color}
                      strokeWidth="2"
                    />
                  ))}
                </g>
              ))}

            {CONVERSIONS.map((cv) => {
              const isWin = winningBranches.has(cv.id)
              const isDim = anyConvertWin && !isWin
              return (
                <g
                  key={cv.id}
                  className={`hs-convert hs-convert-${cv.id}${isWin ? ' is-win' : ''}${
                    isDim ? ' is-dim' : ''
                  }`}
                >
                  <circle
                    className={`hs-win-glow${isWin ? ' is-flash' : ''}`}
                    cx={cv.cx}
                    cy={cv.cy}
                    r="30"
                    fill="#b7ff3c"
                    opacity="0"
                  />
                  <circle
                    className={`hs-win-ring hs-win-ring-a${isWin ? ' is-flash' : ''}`}
                    cx={cv.cx}
                    cy={cv.cy}
                    r="16"
                    fill="none"
                    stroke="#b7ff3c"
                    strokeWidth="2"
                    opacity="0"
                  />
                  <circle
                    className={`hs-win-ring hs-win-ring-b${isWin ? ' is-flash' : ''}`}
                    cx={cv.cx}
                    cy={cv.cy}
                    r="16"
                    fill="none"
                    stroke="#fffcf7"
                    strokeWidth="1.4"
                    opacity="0"
                  />
                  <circle
                    className="hs-convert-disc"
                    cx={cv.cx}
                    cy={cv.cy}
                    r="13"
                    fill="#b7ff3c"
                  />
                  <g transform={`translate(${cv.cx} ${cv.cy})`}>
                    <g className="hs-convert-glyph">
                      <ConvertGlyph id={cv.id} />
                    </g>
                  </g>
                  <text
                    className="hs-convert-label"
                    x={cv.cx}
                    y={cv.cy + 26}
                    textAnchor="middle"
                    fill="rgba(255,252,247,0.58)"
                    style={{
                      fontSize: '8px',
                      letterSpacing: '0.12em',
                      fontFamily: 'ui-monospace, monospace',
                    }}
                  >
                    {cv.label}
                  </text>
                </g>
              )
            })}

            {CHANNELS.map((ch) => (
              <g
                key={ch.id}
                ref={(el) => {
                  travelerEls.current[ch.id] = el
                }}
                className={`hs-traveler hs-traveler-${ch.id}`}
                style={{ offsetRotate: '0deg' }}
              >
                <g
                  ref={(el) => {
                    steerEls.current[ch.id] = el
                  }}
                  className="hs-packet-steer"
                  transform={`translate(0 ${ch.lane})`}
                >
                  <VisitorFace color={ch.color} variant={ch.face} clipId={`hs-vis-${ch.id}`} />
                </g>
                <g className="hs-think" transform={`translate(0 ${ch.lane})`}>
                  <circle className="hs-think-dot" cx="-6" cy="-19" r="1.35" fill={ch.color} />
                  <circle className="hs-think-dot" cx="0" cy="-19" r="1.35" fill={ch.color} />
                  <circle className="hs-think-dot" cx="6" cy="-19" r="1.35" fill={ch.color} />
                </g>
              </g>
            ))}
          </svg>

          {STAGE_WAYPOINTS.flatMap((wp) =>
            CHANNELS.map((ch) => (
              <div
                key={`${wp.id}-${ch.id}`}
                className={`hs-tip hs-tip-${ch.tipLabel.toLowerCase()}${ui.tips[ch.id][wp.id] ? ' is-on' : ''}`}
                style={{ left: wp.x, top: wp.y }}
              >
                <span className="hs-tip-dot" />
                <span className="hs-tip-label">{wp.tip}</span>
              </div>
            )),
          )}

          {CHANNELS.map((ch) => {
            const branch = CONVERSIONS.find((c) => c.id === ui.tipBranch[ch.id])!
            const pos = tipPct(branch.cx, branch.cy)
            const Icon = branch.Icon
            const celebrating = ui.tips[ch.id].convert
            const isLead = branch.id === 'lead'
            return (
              <div
                key={`convert-${ch.id}`}
                className={`hs-tip hs-tip-convert hs-tip-climax hs-tip-submit hs-tip-${ch.tipLabel.toLowerCase()}${
                  isLead ? ' hs-tip-win' : ''
                }${celebrating ? ' is-on' : ''}`}
                style={{ left: pos.x, top: pos.y }}
              >
                <span className="hs-tip-dot" />
                <span className="hs-tip-icon" aria-hidden="true">
                  <Icon size={13} strokeWidth={2.5} />
                </span>
                <span className="hs-tip-label">{branch.tip}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
