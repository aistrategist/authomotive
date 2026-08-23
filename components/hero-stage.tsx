'use client'

/**
 * HeroStage — treasure-map journey (hard-tuned cubic Béziers from blue sketch).
 * Main sweep: Search → Guide → deep dip → VSRP → leftward lower sweep → VDP
 * → car junction disc → Phone / Form / Lead fan-out (matched lime discs).
 * Three website-visitor glyphs (Search / AI / Local) with pace variance + thinking pauses.
 */

import { memo, useCallback, useEffect, useRef } from 'react'

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
  },
  {
    id: 'form' as const,
    cx: 478,
    cy: 324,
    tip: 'Form submitted',
    label: 'FORM',
  },
  {
    id: 'lead' as const,
    cx: 462,
    cy: 378,
    tip: 'Lead won',
    label: 'LEAD',
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

/** Three website visitors — Search, AI, and Local. Stagger keeps the origin from swarming. */
const CHANNELS = [
  { id: 'seo' as const, tipLabel: 'SEO', hudLabel: 'Search', color: 'var(--accent)', r: 7, startDelayMs: 0, speedBias: 1.85, face: 0, lane: 0 },
  { id: 'aeo' as const, tipLabel: 'AEO', hudLabel: 'AI', color: 'var(--porcelain)', r: 6, startDelayMs: 900, speedBias: 0.88, face: 2, lane: -10 },
  { id: 'geo' as const, tipLabel: 'GEO', hudLabel: 'Local', color: 'var(--proof)', r: 6, startDelayMs: 1800, speedBias: 1.32, face: 1, lane: 10 },
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
const THINK_MIN_MS = 480
const THINK_MAX_MS = 860
const THINK_COOLDOWN_MS = 2200
const THINK_FADE_MS = 140
/** At most one traveler may think at a time — three glyphs already read as busy. */
const MAX_THINKING = 1
/** On respawn, keep the origin from stacking travelers that finish together. */
const SPAWN_GAP_MS = 1750

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
    resumeAt: 0,
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
  }
}

function emptyChannelMap<T>(value: T): Record<ChannelId, T> {
  return Object.fromEntries(CHANNEL_IDS.map((id) => [id, value])) as Record<ChannelId, T>
}

type TipLive = Record<ChannelId, Partial<Record<TipId, boolean>>>
type FlashLive = Record<ChannelId, TipId | null>

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

type TravelerDomCache = {
  offsetPath: string
  offsetDistance: string
  opacity: string
  thinking: boolean
  atNode: boolean
}

function makeTravelerDomCache(): TravelerDomCache {
  return {
    offsetPath: '',
    offsetDistance: '',
    opacity: '',
    thinking: false,
    atNode: false,
  }
}

function animationTimeMs(value: Animation['currentTime']) {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'value' in value) return Number(value.value) || 0
  return 0
}

function progressFromRide(anim: Animation) {
  return Math.max(0, Math.min(1, animationTimeMs(anim.currentTime) / BASE_JOURNEY_MS))
}

/** Compositor-owned ride — browser interpolates offset-distance between frames. */
function attachOffsetRide(g: SVGGElement, progress: number, playbackRate: number) {
  const anim = g.animate([{ offsetDistance: '0%' }, { offsetDistance: '100%' }], {
    duration: BASE_JOURNEY_MS,
    easing: 'linear',
    fill: 'forwards',
  })
  anim.playbackRate = Math.max(0.05, playbackRate)
  anim.currentTime = Math.max(0, Math.min(BASE_JOURNEY_MS, progress * BASE_JOURNEY_MS))
  return anim
}

/** Write only attributes that actually changed. Distance is skipped while a WAAPI ride is playing. */
function applyTravelerDom(
  g: SVGGElement | null,
  cache: TravelerDomCache,
  live: {
    progress: number
    opacity: number
    thinking: boolean
    branch: BranchId
    atNode: boolean
    pinDistance?: boolean
  },
) {
  if (!g) return
  const offsetPath = OFFSET_PATH[live.branch]
  if (cache.offsetPath !== offsetPath) {
    g.style.offsetPath = offsetPath
    cache.offsetPath = offsetPath
  }
  if (live.pinDistance) {
    const offsetDistance = `${live.progress * 100}%`
    if (cache.offsetDistance !== offsetDistance) {
      g.style.offsetDistance = offsetDistance
      cache.offsetDistance = offsetDistance
    }
  }
  const opacity = String(live.opacity)
  if (cache.opacity !== opacity) {
    g.style.opacity = opacity
    cache.opacity = opacity
  }
  if (cache.thinking !== live.thinking) {
    g.classList.toggle('is-thinking', live.thinking)
    cache.thinking = live.thinking
  }
  if (cache.atNode !== live.atNode) {
    g.classList.toggle('is-node', live.atNode)
    cache.atNode = live.atNode
  }
}

const INK = 'var(--ink)'

/** Raw head-and-shoulders glyph — no plate, halo, ring, or carrier. */
function VisitorGlyph({ color, variant = 0 }: { color: string; variant?: number }) {
  const headY = variant === 1 ? -4.15 : variant === 2 ? -4.45 : -4.3
  const headR = variant === 1 ? 3.45 : variant === 2 ? 3.55 : 3.6
  const bodyW = variant === 1 ? 7.3 : variant === 2 ? 6.45 : 6.9

  return (
    <g
      className="hs-visitor"
      fill={color}
      stroke={INK}
      strokeWidth="1"
      strokeLinejoin="round"
    >
      <circle cx="0" cy={headY} r={headR} />
      <path
        d={`M ${-bodyW} 8.2 C ${-bodyW} 1.5 -3.1 0.15 0 0.15 C 3.1 0.15 ${bodyW} 1.5 ${bodyW} 8.2 Z`}
      />
    </g>
  )
}

function VisitorFace({ color, variant = 0 }: { color: string; variant?: number }) {
  return (
    <g className="hs-packet hs-visitor-fit">
      <VisitorGlyph color={color} variant={variant} />
      <g className="hs-think">
        <circle className="hs-think-tail" cx="7.4" cy="-10.8" r="1.05" />
        <circle className="hs-think-tail" cx="10.6" cy="-15.2" r="1.5" />
        <ellipse className="hs-think-cloud" cx="17.2" cy="-22" rx="8.2" ry="5.2" />
        <circle className="hs-think-dot hs-think-d1" cx="13.6" cy="-22" r="1.08" />
        <circle className="hs-think-dot hs-think-d2" cx="17.2" cy="-22" r="1.08" />
        <circle className="hs-think-dot hs-think-d3" cx="20.8" cy="-22" r="1.08" />
      </g>
    </g>
  )
}

function VisitorChipIcon({ color, variant = 0 }: { color: string; variant?: number }) {
  return (
    <svg className="hs-chip-face" viewBox="-10 -11 20 22" width="22" height="22" aria-hidden="true">
      <VisitorGlyph color={color} variant={variant} />
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
function ConvertGlyph({ id, stroke = INK }: { id: BranchId; stroke?: string }) {
  if (id === 'phone') {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-3.2 -4.2h2.1c.35 0 .65.28.65.65l.35 1.85c.05.3-.08.55-.3.7l-.95.95a7.2 7.2 0 0 0 3.1 3.1l.95-.95c.22-.22.5-.35.7-.3l1.85.35c.37.07.65.35.65.7v2.1c0 .37-.28.65-.65.65A8 8 0 0 1 -3.85 -3.55c0-.37.28-.65.65-.65Z" />
      </g>
    )
  }
  if (id === 'form') {
    return (
      <g fill="none" stroke={stroke} strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-3.6" y="-4.4" width="7.2" height="8.8" rx="1.1" />
        <path d="M-1.8 -1.6h3.6M-1.8 .4h3.6M-1.8 2.4h2.2" />
      </g>
    )
  }
  return (
    <g fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-2.6 .1  -.6 2.1  3.2 -1.8" />
    </g>
  )
}

function ConvertTipIcon({ id }: { id: BranchId }) {
  return (
    <svg className="hs-tip-mark" width="13" height="13" viewBox="-6 -6.5 12 13" fill="none" aria-hidden>
      <ConvertGlyph id={id} stroke="currentColor" />
    </svg>
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
        fill="var(--hero-panel-body)"
        stroke="var(--hero-panel-border)"
        strokeWidth="1.25"
      />
      <rect width={PAGE_W} height="26" rx="11" fill="var(--hero-panel-chrome)" />
      <rect y="13" width={PAGE_W} height="13" fill="var(--hero-panel-chrome)" />
      <circle cx="16" cy="13" r="3" fill="rgba(184,193,204,0.42)" />
      <circle cx="27" cy="13" r="3" fill="rgba(184,193,204,0.28)" />
      <circle cx="38" cy="13" r="3" fill="rgba(184,193,204,0.16)" />
      <rect x="52" y="8" width="120" height="9" rx="4" fill="var(--hero-panel-line)" />

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
          <rect className="hs-skel-line" x="12" y="54" width="92" height="9" rx="2" />
          <rect className="hs-skel-block" x="12" y="72" width={INNER} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="84" width={INNER - 20} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="96" width={INNER - 10} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="108" width={INNER - 56} height="6" rx="2" />
          <rect className="hs-skel-mass" x="12" y="122" width={INNER} height="16" rx="3" />
        </>
      )}
      {variant === 'vsrp' && (
        <>
          <rect className="hs-skel-mass" x={card1} y="54" width={cardW} height="52" rx="4" />
          <rect className="hs-skel-mass" x={card2} y="54" width={cardW} height="52" rx="4" />
          <rect className="hs-skel-mass" x={card3} y="54" width={cardW} height="52" rx="4" />
          <rect className="hs-skel-block" x="12" y="118" width={INNER - 40} height="6" rx="2" />
          <rect className="hs-skel-block" x="12" y="130" width={INNER - 70} height="6" rx="2" />
        </>
      )}
      {variant === 'vdp' && (
        <>
          <rect className="hs-skel-mass" x="12" y="54" width={INNER} height="64" rx="5" />
          <rect className="hs-skel-line" x="12" y="128" width="132" height="7" rx="2" />
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
        fill="rgba(143,188,245,0.14)"
        stroke="rgba(143,188,245,0.72)"
        strokeWidth="1.25"
      />
      <rect className="hs-skel-block" x={CTA_X - 28} y={CTA_Y - 3} width="56" height="6" rx="2" opacity="0.7" />
    </g>
  )
}

const HeroStageAtmosphere = memo(function HeroStageAtmosphere() {
  return (
    <>
      <defs>
        <pattern id="hs-map-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path className="hs-map-grid-line" d="M28 0H0V28" fill="none" />
        </pattern>
        <radialGradient id="hs-grid-fade" cx="48%" cy="46%" r="62%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="hs-grid-mask">
          <rect width={VB_W} height={VB_H} fill="url(#hs-grid-fade)" />
        </mask>
      </defs>

      <g className="hs-grid-fragments" mask="url(#hs-grid-mask)" opacity="0.45">
        <rect x="40" y="20" width="220" height="180" fill="url(#hs-map-grid)" />
        <rect x="300" y="40" width="240" height="200" fill="url(#hs-map-grid)" />
        <rect x="80" y="220" width="260" height="170" fill="url(#hs-map-grid)" />
        <rect x="360" y="250" width="200" height="140" fill="url(#hs-map-grid)" />
      </g>
    </>
  )
})

const HeroTravelers = memo(function HeroTravelers({
  assign,
}: {
  assign: (id: ChannelId, el: SVGGElement | null) => void
}) {
  return (
    <>
      {CHANNELS.map((ch) => (
        <g
          key={ch.id}
          ref={(el) => assign(ch.id, el)}
          className={`hs-traveler hs-traveler-${ch.id}`}
          style={{ offsetRotate: '0deg' }}
        >
          <g className="hs-packet-steer" transform={`translate(0 ${ch.lane})`}>
            <VisitorFace color={ch.color} variant={ch.face} />
          </g>
        </g>
      ))}
    </>
  )
})

const HeroStageSignals = memo(function HeroStageSignals() {
  return (
    <>
      {PAGES.map((page) => (
        <PageWireframe
          key={page.id}
          id={page.id}
          x={page.x}
          y={page.y}
          label={page.label}
          variant={page.id}
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
            data-hs-branch={id}
            className="hs-trail-base hs-trail-base-branch"
            d={`M${JUNCTION.cx} ${JUNCTION.cy}${BRANCH_PATHS[id]}`}
          />
        ))}
        {TRAIL_SEGMENTS.map((seg) => {
          const isBranch = seg.id === 'phone' || seg.id === 'form' || seg.id === 'lead'
          return (
            <path
              key={seg.id}
              data-hs-branch={isBranch ? seg.id : undefined}
              className={`hs-trail-seg hs-trail-seg-${seg.tone}${isBranch ? ' hs-trail-branch' : ''}`}
              d={seg.d}
            />
          )
        })}
        <path className="hs-trail-center" d={TRAIL_MAIN} />
        {BRANCH_IDS.map((id) => (
          <path
            key={`center-${id}`}
            data-hs-branch={id}
            className="hs-trail-center hs-trail-center-branch"
            d={`M${JUNCTION.cx} ${JUNCTION.cy}${BRANCH_PATHS[id]}`}
          />
        ))}
        {STAGE_WAYPOINTS.map((wp) => (
          <circle key={`node-${wp.id}`} className="hs-trail-node" cx={wp.cx} cy={wp.cy} r="16" />
        ))}
      </g>

      <g className="hs-junction" transform={`translate(${JUNCTION.cx} ${JUNCTION.cy})`}>
        <circle className="hs-hub-bloom" r="36" fill="rgba(232,238,245,0.12)" />
        <circle r="22" fill="#b8c1cc" />
        <circle r="22" fill="none" stroke="rgba(255,252,247,0.35)" strokeWidth="1.35" />
        <CarGlyph />
      </g>

      <g className="hs-start" transform={`translate(${SEARCH.cx} ${SEARCH.cy})`}>
        <circle className="hs-convert-disc" r="16" fill="#b8c1cc" />
        <circle r="16" fill="none" stroke="rgba(255,252,247,0.28)" strokeWidth="1.25" />
        <SearchGlyph />
      </g>

      {STAGE_WAYPOINTS.map((wp) => (
        <g key={wp.id}>
          {CHANNELS.map((ch) => (
            <circle
              key={ch.id}
              data-hs-ring={`${ch.id}-${wp.id}`}
              className={`hs-ring hs-ring-${ch.id}`}
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

      {CONVERSIONS.map((cv) => (
        <g key={cv.id} data-hs-convert={cv.id} className={`hs-convert hs-convert-${cv.id}`}>
          <circle
            className="hs-win-glow"
            cx={cv.cx}
            cy={cv.cy}
            r="30"
            fill="var(--action)"
            opacity="0"
          />
          <circle
            className="hs-win-ring hs-win-ring-a"
            cx={cv.cx}
            cy={cv.cy}
            r="16"
            fill="none"
            stroke="var(--action)"
            strokeWidth="2"
            opacity="0"
          />
          <circle
            className="hs-win-ring hs-win-ring-b"
            cx={cv.cx}
            cy={cv.cy}
            r="16"
            fill="none"
            stroke="#fffcf7"
            strokeWidth="1.4"
            opacity="0"
          />
          <circle className="hs-convert-disc" cx={cv.cx} cy={cv.cy} r="13" fill="#b8c1cc" />
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
      ))}
    </>
  )
})

const HeroTips = memo(function HeroTips() {
  return (
    <>
      {STAGE_WAYPOINTS.flatMap((wp) =>
        CHANNELS.map((ch) => (
          <div
            key={`${wp.id}-${ch.id}`}
            data-hs-tip={`${wp.id}-${ch.id}`}
            className={`hs-tip hs-tip-${ch.tipLabel.toLowerCase()}`}
            style={{ left: wp.x, top: wp.y }}
          >
            <span className="hs-tip-dot" />
            <span className="hs-tip-label">{wp.tip}</span>
          </div>
        )),
      )}

      {CHANNELS.flatMap((ch) =>
        CONVERSIONS.map((branch) => {
          const pos = tipPct(branch.cx, branch.cy)
          return (
            <div
              key={`convert-${ch.id}-${branch.id}`}
              data-hs-convert-tip={`${ch.id}-${branch.id}`}
              className={`hs-tip hs-tip-convert hs-tip-climax hs-tip-submit hs-tip-${ch.tipLabel.toLowerCase()}${
                branch.id === 'lead' ? ' hs-tip-win' : ''
              }`}
              style={{ left: pos.x, top: pos.y }}
            >
              <span className="hs-tip-dot" />
              <span className="hs-tip-icon" aria-hidden="true">
                <ConvertTipIcon id={branch.id} />
              </span>
              <span className="hs-tip-label">{branch.tip}</span>
            </div>
          )
        }),
      )}
    </>
  )
})

function applyStoryDom(root: HTMLElement, ui: UiSnap) {
  const winning = new Set(
    CHANNELS.filter((ch) => ui.flashes[ch.id] === 'convert').map((ch) => ui.branch[ch.id]),
  )
  const anyWin = winning.size > 0

  for (const page of PAGES) {
    const lit = Object.values(ui.flashes).includes(page.id)
    root.querySelector(`.hs-skel-${page.id}`)?.classList.toggle('is-lit', lit)
  }

  for (const id of BRANCH_IDS) {
    const hot = winning.has(id)
    const muted = anyWin && !hot
    root.querySelectorAll(`[data-hs-branch="${id}"]`).forEach((el) => {
      el.classList.toggle('is-hot', hot)
      el.classList.toggle('is-muted', muted)
    })
  }

  root.querySelector('.hs-junction')?.classList.toggle('is-bloom', anyWin)

  for (const wp of STAGE_WAYPOINTS) {
    for (const ch of CHANNELS) {
      root
        .querySelector(`[data-hs-ring="${ch.id}-${wp.id}"]`)
        ?.classList.toggle('is-flash', ui.flashes[ch.id] === wp.id)
      root
        .querySelector(`[data-hs-tip="${wp.id}-${ch.id}"]`)
        ?.classList.toggle('is-on', Boolean(ui.tips[ch.id][wp.id]))
    }
  }

  for (const cv of CONVERSIONS) {
    const win = winning.has(cv.id)
    const group = root.querySelector(`[data-hs-convert="${cv.id}"]`)
    if (!group) continue
    group.classList.toggle('is-win', win)
    group.classList.toggle('is-dim', anyWin && !win)
    group.querySelectorAll('.hs-win-glow, .hs-win-ring').forEach((el) => {
      el.classList.toggle('is-flash', win)
    })
  }

  for (const ch of CHANNELS) {
    for (const cv of CONVERSIONS) {
      root
        .querySelector(`[data-hs-convert-tip="${ch.id}-${cv.id}"]`)
        ?.classList.toggle('is-on', Boolean(ui.tips[ch.id].convert) && ui.tipBranch[ch.id] === cv.id)
    }
  }
}

export function HeroStage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const travelerEls = useRef(emptyChannelMap<SVGGElement | null>(null))
  const uiRef = useRef<UiSnap>({
    tips: emptyChannelMap({}),
    flashes: emptyChannelMap(null),
    tipBranch: emptyChannelMap('phone' as BranchId),
    branch: emptyChannelMap('phone' as BranchId),
  })
  const assignTraveler = useCallback((id: ChannelId, el: SVGGElement | null) => {
    travelerEls.current[id] = el
  }, [])

  const simRef = useRef({
    reduced: false,
    spawnLockUntil: 0,
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
    const nodes = travelerEls.current
    const travelerDom = Object.fromEntries(
      CHANNEL_IDS.map((id) => [id, makeTravelerDomCache()]),
    ) as Record<ChannelId, TravelerDomCache>

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
      const reducedUi: UiSnap = {
        tips: { ...emptyChannelMap({}), seo: { convert: true } },
        flashes: emptyChannelMap(null),
        tipBranch: { ...branch },
        branch,
      }
      uiRef.current = reducedUi
      if (rootRef.current) applyStoryDom(rootRef.current, reducedUi)
      const lead = simRef.current.travelers.seo
      applyTravelerDom(nodes.seo, travelerDom.seo, {
        progress: 1,
        opacity: 0.9,
        thinking: false,
        branch: lead.branch,
        atNode: false,
        pinDistance: true,
      })
      return
    }

    const first = simRef.current.travelers.seo
    first.started = true
    applyTravelerDom(nodes.seo, travelerDom.seo, {
      progress: 0,
      opacity: 0.92,
      thinking: false,
      branch: first.branch,
      atNode: false,
      pinDistance: true,
    })

    let raf = 0
    let idleId = 0
    let startRaf = 0
    let last = performance.now()
    let running = false
    let waveAligned = false
    const rides = Object.fromEntries(CHANNEL_IDS.map((id) => [id, null])) as Record<
      ChannelId,
      Animation | null
    >

    const cancelRide = (id: ChannelId) => {
      const ride = rides[id]
      if (!ride) return
      ride.cancel()
      rides[id] = null
    }

    const ensureRide = (id: ChannelId, t: (typeof simRef.current.travelers)[ChannelId]) => {
      const g = nodes[id]
      if (!g || typeof g.animate !== 'function') return null
      const existing = rides[id]
      if (existing && existing.playState !== 'idle') return existing
      existing?.cancel()
      const ride = attachOffsetRide(g, t.progress, t.speed * BASE_JOURNEY_MS)
      rides[id] = ride
      return ride
    }

    const pauseRides = () => {
      for (const id of CHANNEL_IDS) rides[id]?.pause()
    }

    const tick = (now: number) => {
      if (!running) return
      const dt = Math.min(32, now - last)
      last = now
      const sim = simRef.current.travelers

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
        const waitingToSpawn =
          now < t.waitUntil || (!t.started && now < simRef.current.spawnLockUntil)

        if (waitingToSpawn) {
          cancelRide(ch.id)
          applyTravelerDom(nodes[ch.id], travelerDom[ch.id], {
            progress: t.progress,
            opacity: 0,
            thinking: false,
            branch: t.branch,
            atNode: false,
            pinDistance: true,
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
            t.resumeAt = now + THINK_FADE_MS
            t.cooldownUntil = now + THINK_COOLDOWN_MS
            thinkingCount = Math.max(0, thinkingCount - 1)
          }
        } else if (
          ch.id !== 'seo' &&
          t.progress > 0.16 &&
          t.progress < 0.88 &&
          now >= t.cooldownUntil &&
          now >= t.resumeAt &&
          thinkingCount < MAX_THINKING
        ) {
          const startChance = (dt / 1000) * 0.35
          if (Math.random() < startChance) {
            t.thinking = true
            t.thinkUntil = now + rand(THINK_MIN_MS, THINK_MAX_MS)
            thinkingCount++
          }
        }

        if (t.thinking || now < t.resumeAt) {
          rides[ch.id]?.pause()
        } else if (t.progress < 1) {
          const ride = ensureRide(ch.id, t)
          if (ride) {
            if (ride.playState === 'paused') ride.play()
            t.progress = progressFromRide(ride)
          } else {
            t.progress = Math.min(1, t.progress + t.speed * dt)
          }
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

        const atNode = now < t.flashUntil && Boolean(t.flashTip)

        let live = {
          progress: t.progress,
          opacity: Math.max(0, Math.min(1, opacity)),
          thinking: t.thinking,
          branch: t.branch,
          atNode,
          pinDistance: !rides[ch.id],
        }

        if (t.progress >= 1) {
          const holdUntil = Math.max(convertHoldUntil, t.flashUntil, t.tipAnchorUntil)
          if (now < holdUntil) {
            rides[ch.id]?.pause()
            live = {
              progress: 1,
              opacity: 0.55,
              thinking: false,
              branch: t.branch,
              atNode,
              pinDistance: true,
            }
          } else {
            cancelRide(ch.id)
            t.branch = pickBranch(t.branch)
            t.speed = rollSpeed(ch)
            t.progress = 0
            t.started = false
            t.thinking = false
            t.resumeAt = 0
            t.waitUntil = now + rand(280, 640)
            simRef.current.spawnLockUntil = now + SPAWN_GAP_MS
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
              atNode: false,
              pinDistance: true,
            }
          }
        }

        applyTravelerDom(nodes[ch.id], travelerDom[ch.id], live)
      }

      const nextUi: UiSnap = {
        tips: nextTips,
        flashes: nextFlashes,
        tipBranch: nextTipBranch,
        branch: nextBranch,
      }
      if (uiChanged(uiRef.current, nextUi)) {
        uiRef.current = nextUi
        if (rootRef.current) applyStoryDom(rootRef.current, nextUi)
      }

      raf = requestAnimationFrame(tick)
    }

    const cancelDeferredStart = () => {
      if (idleId && typeof cancelIdleCallback === 'function') {
        cancelIdleCallback(idleId)
        idleId = 0
      }
      if (startRaf) {
        cancelAnimationFrame(startRaf)
        startRaf = 0
      }
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      if (!waveAligned) {
        waveAligned = true
        for (const ch of CHANNELS) {
          const t = simRef.current.travelers[ch.id]
          if (!t.started) t.waitUntil = last + ch.startDelayMs
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
      cancelDeferredStart()
      pauseRides()
    }

    const scheduleStart = () => {
      if (running || document.hidden || idleId || startRaf) return
      const begin = () => {
        idleId = 0
        startRaf = 0
        if (!document.hidden) start()
      }
      if (typeof requestIdleCallback === 'function') {
        idleId = requestIdleCallback(begin, { timeout: 400 })
      } else {
        startRaf = requestAnimationFrame(() => {
          startRaf = requestAnimationFrame(begin)
        })
      }
    }

    const onVis = () => {
      if (document.hidden) stop()
      else scheduleStart()
    }

    const root = rootRef.current
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !document.hidden) scheduleStart()
        else stop()
      },
      { rootMargin: '80px' },
    )
    if (root) io.observe(root)
    if (!document.hidden) scheduleStart()

    document.addEventListener('visibilitychange', onVis)

    return () => {
      stop()
      for (const id of CHANNEL_IDS) cancelRide(id)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div ref={rootRef} className="hero-stage relative mx-auto w-full max-w-[580px] overflow-visible lg:max-w-none">
      <p className="sr-only">
        Animated conversion map: website visitors from Search, AI, and Local follow a trail
        through an authority guide, VSRP, and VDP, then convert via phone, form, or lead.
        Visitors vary in pace and occasionally pause as if thinking.
      </p>

      <div className="hs-map" aria-hidden="true">
        <div className="hs-intel">
          <p className="hs-intel-kicker">Website visitors</p>
          <div className="hs-intel-channels">
            <span className="hs-legend-item hs-chip-seo">
              <VisitorChipIcon color="var(--accent)" variant={0} />
              Search
            </span>
            <span className="hs-legend-item hs-chip-aeo">
              <VisitorChipIcon color="var(--porcelain)" variant={2} />
              AI
            </span>
            <span className="hs-legend-item hs-chip-geo">
              <VisitorChipIcon color="var(--proof)" variant={1} />
              Local
            </span>
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
            <HeroStageAtmosphere />
            <HeroStageSignals />
          </svg>
          <svg
            className="hs-map-svg hs-map-travelers"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            preserveAspectRatio="xMidYMid meet"
            overflow="visible"
          >
            <HeroTravelers assign={assignTraveler} />
          </svg>

          <HeroTips />
        </div>
      </div>
    </div>
  )
}
