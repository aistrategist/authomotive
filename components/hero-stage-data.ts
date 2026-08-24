export const VB_W = 640
export const VB_H = 420
export const PAGE_W = 252
export const PAGE_H = 196
export const CTA_X = 126
export const CTA_Y = 166
export const INNER = PAGE_W - 24

export const PAGES = [
  { id: 'guide' as const, x: 58, y: 6, label: 'RESEARCH GUIDE' },
  { id: 'vsrp' as const, x: 322, y: 48, label: 'VSRP' },
  { id: 'vdp' as const, x: 58, y: 214, label: 'VDP' },
]

export function tipPct(cx: number, cy: number) {
  return {
    x: `${((cx / VB_W) * 100).toFixed(1)}%`,
    y: `${((cy / VB_H) * 100).toFixed(1)}%`,
  }
}

/** Trail origin — lime disc, fully on-canvas and left of Authority Guide */
export const SEARCH = { cx: 34, cy: 168 }
/** Trail split / fan origin — enlarged lime disc with car icon (shifted into map pocket). */
export const JUNCTION = { cx: 375, cy: 335 }

export const STAGE_WAYPOINTS = [
  {
    id: 'guide',
    cx: PAGES[0].x + CTA_X,
    cy: PAGES[0].y + CTA_Y,
    tip: 'Research Guide',
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
export const CONVERSIONS = [
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

export type BranchId = (typeof CONVERSIONS)[number]['id']

/**
 * Hard-tuned to blue markup:
 * soar → Guide → deep Guide→VSRP dip → VSRP → leftward lower sweep into VDP
 * → clean junction (no bottom perimeter loop, no self-cross).
 */
export const TRAIL_MAIN =
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
export const BRANCH_PATHS: Record<BranchId, string> = {
  phone: ' C410 310 438 282 460 272',
  form: ' C415 335 448 330 478 324',
  lead: ' C408 355 438 368 462 378',
}

export const JOURNEY_PATHS: Record<BranchId, string> = {
  phone: TRAIL_MAIN + BRANCH_PATHS.phone,
  form: TRAIL_MAIN + BRANCH_PATHS.form,
  lead: TRAIL_MAIN + BRANCH_PATHS.lead,
}

/** Visual segments — varied dashes; geometry matches TRAIL_MAIN + branches */
export const TRAIL_SEGMENTS = [
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
export const CHANNELS = [
  { id: 'seo' as const, tipLabel: 'SEO', hudLabel: 'Search', color: 'var(--accent)', r: 7, startDelayMs: 0, speedBias: 1.85, face: 0, lane: 0 },
  { id: 'aeo' as const, tipLabel: 'AEO', hudLabel: 'AI', color: 'var(--porcelain)', r: 6, startDelayMs: 900, speedBias: 0.88, face: 2, lane: -10 },
  { id: 'geo' as const, tipLabel: 'GEO', hudLabel: 'Local', color: 'var(--proof)', r: 6, startDelayMs: 1800, speedBias: 1.32, face: 1, lane: 0 },
] as const

export type ChannelId = (typeof CHANNELS)[number]['id']
export type TipId = 'guide' | 'vsrp' | 'vdp' | 'convert'

export const BRANCH_IDS: BranchId[] = ['phone', 'form', 'lead']
export const CHANNEL_IDS = CHANNELS.map((c) => c.id)

/** Path lengths for tip sync — tips follow progress, not wall-clock (keeps refinement). */
export const MAIN_LEN = 1462
export const WAYPOINT_MAIN_CUM: Record<Exclude<TipId, 'convert'>, number> = {
  guide: 405.9,
  vsrp: 920.2,
  vdp: 1261.4,
}
export const BRANCH_LEN: Record<BranchId, number> = {
  phone: 106,
  form: 103.8,
  lead: 97.1,
}

export const BASE_JOURNEY_MS = 12800
export const SPEED_MIN = 0.9
export const SPEED_MAX = 1.02
export const TIP_HOLD_MS = 1100
/** Crisp convert celebration window; tip holds slightly longer for readability */
export const WIN_CELEBRATE_MS = 800
export const CONVERT_TIP_HOLD_MS = 1400
export const LEAD_TIP_HOLD_MS = 1600
export const FLASH_HOLD_MS = 650
export const CONVERT_FLASH_HOLD_MS = WIN_CELEBRATE_MS
export const LEAD_FLASH_HOLD_MS = WIN_CELEBRATE_MS
export const TIP_FADE_MS = 280
export const THINK_MIN_MS = 480
export const THINK_MAX_MS = 860
export const THINK_COOLDOWN_MS = 2200
export const THINK_FADE_MS = 140
/** At most one traveler may think at a time — three glyphs already read as busy. */
export const MAX_THINKING = 1
/** On respawn, keep the origin from stacking travelers that finish together. */
export const SPAWN_GAP_MS = 1750

export const TIP_IDS: TipId[] = ['guide', 'vsrp', 'vdp', 'convert']

function tipThresholds(branch: BranchId): Record<TipId, number> {
  const full = MAIN_LEN + BRANCH_LEN[branch]
  return {
    guide: WAYPOINT_MAIN_CUM.guide / full,
    vsrp: WAYPOINT_MAIN_CUM.vsrp / full,
    vdp: WAYPOINT_MAIN_CUM.vdp / full,
    convert: 0.985,
  }
}

export const TIP_THRESHOLDS: Record<BranchId, Record<TipId, number>> = {
  phone: tipThresholds('phone'),
  form: tipThresholds('form'),
  lead: tipThresholds('lead'),
}
