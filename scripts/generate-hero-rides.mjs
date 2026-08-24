/**
 * Precomputes Hero traveler ride samples (arc-length along the static cubics)
 * and traveler origin offsets (SVG bbox centers). Runtime motion must not call
 * getTotalLength / getPointAtLength / getBBox.
 *
 * Run: node scripts/generate-hero-rides.mjs
 * Re-run if TRAIL_MAIN, BRANCH_PATHS, traveler glyphs, or think-cloud change.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const STEPS = 80
const CUBIC_SAMPLES = 256

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

const BRANCH_PATHS = {
  phone: ' C410 310 438 282 460 272',
  form: ' C415 335 448 330 478 324',
  lead: ' C408 355 438 368 462 378',
}

const CHANNELS = [
  { id: 'seo', face: 0, lane: 0 },
  { id: 'aeo', face: 2, lane: -10 },
  { id: 'geo', face: 1, lane: 0 },
]

function glyphMetrics(variant) {
  return {
    headY: variant === 1 ? -4.15 : variant === 2 ? -4.45 : -4.3,
    headR: variant === 1 ? 3.45 : variant === 2 ? 3.55 : 3.6,
    bodyW: variant === 1 ? 7.3 : variant === 2 ? 6.45 : 6.9,
  }
}

function cubicPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t
  const a = mt * mt * mt
  const b = 3 * mt * mt * t
  const c = 3 * mt * t * t
  const d = t * t * t
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  }
}

function parseCubics(d) {
  const tokens = d.match(/[MLC]|-?\d*\.?\d+/gi) ?? []
  const cubics = []
  let i = 0
  let cmd = ''
  let x = 0
  let y = 0
  while (i < tokens.length) {
    const tok = tokens[i]
    if (/^[MLC]$/i.test(tok)) {
      cmd = tok.toUpperCase()
      i += 1
      continue
    }
    const nums = []
    while (i < tokens.length && !/^[MLC]$/i.test(tokens[i])) {
      nums.push(Number(tokens[i]))
      i += 1
    }
    if (cmd === 'M') {
      x = nums[0]
      y = nums[1]
    } else if (cmd === 'C') {
      for (let n = 0; n < nums.length; n += 6) {
        const p0 = { x, y }
        const p1 = { x: nums[n], y: nums[n + 1] }
        const p2 = { x: nums[n + 2], y: nums[n + 3] }
        const p3 = { x: nums[n + 4], y: nums[n + 5] }
        cubics.push([p0, p1, p2, p3])
        x = p3.x
        y = p3.y
      }
    }
  }
  return cubics
}

function samplePath(d) {
  const cubics = parseCubics(d)
  const pieces = []
  let total = 0
  for (const [p0, p1, p2, p3] of cubics) {
    const pts = []
    let length = 0
    let prev = p0
    for (let i = 0; i <= CUBIC_SAMPLES; i++) {
      const p = cubicPoint(p0, p1, p2, p3, i / CUBIC_SAMPLES)
      if (i > 0) length += Math.hypot(p.x - prev.x, p.y - prev.y)
      pts.push({ p, length })
      prev = p
    }
    pieces.push({ pts, length })
    total += length
  }

  const samples = []
  for (let step = 0; step <= STEPS; step++) {
    const target = (step / STEPS) * total
    let remaining = target
    let found = pieces[pieces.length - 1].pts[CUBIC_SAMPLES]
    for (const piece of pieces) {
      if (remaining > piece.length && piece !== pieces[pieces.length - 1]) {
        remaining -= piece.length
        continue
      }
      const pts = piece.pts
      for (let i = 1; i < pts.length; i++) {
        if (pts[i].length >= remaining || i === pts.length - 1) {
          const a = pts[i - 1]
          const b = pts[i]
          const span = b.length - a.length
          const t = span > 0 ? (remaining - a.length) / span : 0
          found = {
            p: {
              x: a.p.x + (b.p.x - a.p.x) * t,
              y: a.p.y + (b.p.y - a.p.y) * t,
            },
          }
          break
        }
      }
      break
    }
    samples.push([Number(found.p.x.toFixed(2)), Number(found.p.y.toFixed(2))])
  }
  return { samples, length: Number(total.toFixed(1)) }
}

function travelerOrigin(face, lane) {
  const { headY, headR, bodyW } = glyphMetrics(face)
  let minX = -headR
  let maxX = headR
  let minY = headY - headR
  let maxY = headY + headR

  const include = (x, y) => {
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

  include(-bodyW, 8.2)
  include(bodyW, 8.2)
  include(0, 0.15)
  include(-bodyW, 1.5)
  include(bodyW, 1.5)
  include(-3.1, 0.15)
  include(3.1, 0.15)

  include(7.4 - 1.05, -10.8 - 1.05)
  include(7.4 + 1.05, -10.8 + 1.05)
  include(10.6 - 1.5, -15.2 - 1.5)
  include(10.6 + 1.5, -15.2 + 1.5)
  include(17.2 - 8.2, -22 - 5.2)
  include(17.2 + 8.2, -22 + 5.2)
  include(13.6 - 1.08, -22 - 1.08)
  include(20.8 + 1.08, -22 + 1.08)

  return {
    x: Number(((minX + maxX) / 2).toFixed(2)),
    y: Number(((minY + maxY) / 2 + lane).toFixed(2)),
  }
}

const journeys = {}
const lengths = {}
for (const [id, branch] of Object.entries(BRANCH_PATHS)) {
  const { samples, length } = samplePath(TRAIL_MAIN + branch)
  journeys[id] = samples
  lengths[id] = length
}

const origins = {}
for (const ch of CHANNELS) {
  origins[ch.id] = travelerOrigin(ch.face, ch.lane)
}

const out = `/**
 * Static Hero ride geometry. Generated by scripts/generate-hero-rides.mjs.
 * Do not sample SVG paths at runtime.
 */
import type { BranchId, ChannelId } from '@/components/hero-stage-data'

export const RIDE_STEPS = ${STEPS}

export const JOURNEY_XY: Record<BranchId, readonly (readonly [number, number])[]> = {
  phone: ${JSON.stringify(journeys.phone)},
  form: ${JSON.stringify(journeys.form)},
  lead: ${JSON.stringify(journeys.lead)},
}

export const TRAVELER_ORIGIN: Record<ChannelId, { x: number; y: number }> = {
  seo: ${JSON.stringify(origins.seo)},
  aeo: ${JSON.stringify(origins.aeo)},
  geo: ${JSON.stringify(origins.geo)},
}

function pointAt(branch: BranchId, progress: number) {
  const samples = JOURNEY_XY[branch]
  const n = samples.length - 1
  const x = Math.max(0, Math.min(1, progress)) * n
  const i = Math.min(n - 1, Math.floor(x))
  const t = x - i
  const a = samples[i]!
  const b = samples[i + 1] ?? a
  return {
    x: a[0] + (b[0] - a[0]) * t,
    y: a[1] + (b[1] - a[1]) * t,
  }
}

function translate(channel: ChannelId, x: number, y: number) {
  const origin = TRAVELER_ORIGIN[channel]
  return \`translate(\${(x - origin.x).toFixed(2)}px, \${(y - origin.y).toFixed(2)}px)\`
}

/** Ready-to-use compositor keyframes. Arithmetic only — no layout. */
export function rideKeyframes(channel: ChannelId, branch: BranchId): Keyframe[] {
  const origin = TRAVELER_ORIGIN[channel]
  const samples = JOURNEY_XY[branch]
  const last = samples.length - 1
  return samples.map(([x, y], i) => ({
    offset: i / last,
    transform: \`translate(\${(x - origin.x).toFixed(2)}px, \${(y - origin.y).toFixed(2)}px)\`,
  }))
}

export function rideTransform(channel: ChannelId, branch: BranchId, progress: number) {
  const p = pointAt(branch, progress)
  return translate(channel, p.x, p.y)
}
`

const dest = join(dirname(fileURLToPath(import.meta.url)), '..', 'components', 'hero-stage-rides.ts')
writeFileSync(dest, out)
console.log('wrote', dest)
console.log('path lengths', lengths)
console.log('origins', origins)
