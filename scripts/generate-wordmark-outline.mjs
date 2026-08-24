/**
 * Converts the AUTHOMOTIVE wordmark into vector outlines so the production logo
 * carries no font dependency.
 *
 * Glyphs come from the same Instrument Sans variable font that next/font serves to
 * the browser, instanced at wght 700 (AUTH) and wght 400 (OMOTIVE). Each run is
 * shaped separately, matching how a browser shapes the two <tspan> elements, so the
 * outlined result is positionally identical to the text version it replaces.
 *
 * Run with: node scripts/generate-wordmark-outline.mjs [--font path/to/InstrumentSans.ttf]
 *
 * Writes public/authomotive-logo.svg and components/authomotive-wordmark-outline.ts.
 * Re-run only when the lockup metrics below change.
 */
import { existsSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import * as fontkit from 'fontkit'

/** Frozen lockup metrics. Keep in sync with components/authomotive-brand-svg.tsx. */
const LOCKUP = {
  fontSize: 72,
  textX: 90,
  baselineY: 80,
  /** Left edge of the mark's ink, mirrored as the trailing margin. */
  trimMargin: 2.6,
  runs: [
    { text: 'AUTH', weight: 700, tracking: 0.014, leadIn: 0 },
    { text: 'OMOTIVE', weight: 400, tracking: 0.024, leadIn: 1 },
  ],
}

const MARK = {
  body: 'M5.2 97 34.2 3.8H46.6L76.4 97H59.4L52.8 74H27.4L21.4 97H5.2Zm28.8-52L40.4 12.8 46.8 45H34Z',
  bands: [
    ['#8FBCF5', 'M2.6 90.2C26 84.2 51.2 71.6 77.6 60.8L78.8 54.2C52.2 65 27 77.6 3.8 83.6Z'],
    ['#C8B8FF', 'M5.4 79C28.4 73.2 53.2 61.2 77.8 51.2L79 44.6C54.2 54.6 29.4 66.6 6.6 72.4Z'],
    ['#FFC982', 'M8.2 67.8C31 62.2 55.2 50.8 78 41.4L79.2 34.8C56 44.2 32 55.6 9.4 61.2Z'],
  ],
}

const UPSTREAM_TTF = 'assets/fonts/InstrumentSans-VariableFont_wdth_wght.ttf'

function resolveFont() {
  const flag = process.argv.indexOf('--font')
  if (flag !== -1 && process.argv[flag + 1]) return process.argv[flag + 1]
  if (existsSync(UPSTREAM_TTF)) return UPSTREAM_TTF
  throw new Error(
    `Missing ${UPSTREAM_TTF}. Fetch the OFL variable font from ` +
      'github.com/google/fonts/tree/main/ofl/instrumentsans, or pass --font <path>.',
  )
}

/**
 * fontkit cannot instance a variable font inside a WOFF2 container (getVariation
 * corrupts the table directory), so outlines come from the uncompressed upstream TTF.
 * Confirm it is the same font data next/font serves by comparing default-instance
 * advances against the cached subset — glyph ids differ after subsetting, metrics
 * must not.
 */
function verifyAgainstShippedSubset(ttf, text) {
  const expected = ttf.layout(text).positions.map((p) => p.xAdvance)

  for (const dir of ['.next/static/media', '.next/dev/static/media']) {
    if (!existsSync(dir)) continue
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.woff2')) continue
      let subset
      try {
        subset = fontkit.openSync(join(dir, file))
      } catch {
        continue
      }
      if (subset.familyName !== 'Instrument Sans') continue

      let actual
      try {
        actual = subset.layout(text).positions.map((p) => p.xAdvance)
      } catch {
        continue
      }
      if (actual.length !== expected.length) continue

      const match = actual.every((v, i) => v === expected[i])
      if (!match) {
        throw new Error(
          `${file} disagrees with ${UPSTREAM_TTF}.\n` +
            `  shipped:  ${actual}\n  upstream: ${expected}\n` +
            'The committed TTF is a different version than next/font is serving.',
        )
      }
      return file
    }
  }
  return null
}

const round = (n) => Math.round(n * 100) / 100

/** Emit one glyph's contours, scaled to the lockup and flipped into SVG space. */
function glyphToSvg(glyph, penX, scale, baselineY) {
  const out = []
  const px = (v) => round(penX + v * scale)
  const py = (v) => round(baselineY - v * scale)

  for (const { command, args } of glyph.path.commands) {
    switch (command) {
      case 'moveTo':
        out.push(`M${px(args[0])} ${py(args[1])}`)
        break
      case 'lineTo':
        out.push(`L${px(args[0])} ${py(args[1])}`)
        break
      case 'quadraticCurveTo':
        out.push(`Q${px(args[0])} ${py(args[1])} ${px(args[2])} ${py(args[3])}`)
        break
      case 'bezierCurveTo':
        out.push(
          `C${px(args[0])} ${py(args[1])} ${px(args[2])} ${py(args[3])} ` +
            `${px(args[4])} ${py(args[5])}`,
        )
        break
      case 'closePath':
        out.push('Z')
        break
      default:
        throw new Error(`Unhandled path command: ${command}`)
    }
  }
  return out.join('')
}

const fontPath = resolveFont()
const base = fontkit.openSync(fontPath)
const scale = LOCKUP.fontSize / base.unitsPerEm
const capHeight = base.capHeight * scale

console.log(`font:  ${fontPath}`)
console.log(`       upem ${base.unitsPerEm}  capHeight ${base.capHeight} (${round(capHeight)}u)`)

const verified = verifyAgainstShippedSubset(base, LOCKUP.runs.map((r) => r.text).join(''))
console.log(
  verified
    ? `       metrics match next/font subset ${verified}`
    : '       no next/font cache to cross-check (run `npm run build` first)',
)

let pen = LOCKUP.textX
const pieces = []
const letters = []
let inkLeft = Infinity
let inkRight = -Infinity
let inkTop = Infinity
let inkBottom = -Infinity

for (const run of LOCKUP.runs) {
  const instance = base.getVariation({ wght: run.weight, wdth: 100 })
  const layout = instance.layout(run.text)
  const trackingPx = run.tracking * LOCKUP.fontSize
  pen += run.leadIn

  layout.glyphs.forEach((glyph, i) => {
    const pos = layout.positions[i]
    const originX = pen + pos.xOffset * scale
    pieces.push(glyphToSvg(glyph, originX, scale, LOCKUP.baselineY - pos.yOffset * scale))

    const box = glyph.bbox
    letters.push({
      char: run.text[i],
      weight: run.weight,
      x: round(originX + box.minX * scale),
      right: round(originX + box.maxX * scale),
    })
    inkLeft = Math.min(inkLeft, originX + box.minX * scale)
    inkRight = Math.max(inkRight, originX + box.maxX * scale)
    inkTop = Math.min(inkTop, LOCKUP.baselineY - box.maxY * scale)
    inkBottom = Math.max(inkBottom, LOCKUP.baselineY - box.minY * scale)

    pen += pos.xAdvance * scale + trackingPx
  })
}

const wordmarkPath = pieces.join('')
const viewBoxWidth = Math.round(inkRight + LOCKUP.trimMargin)

/**
 * Re-read the emitted path and confirm it agrees with the metrics it was built from.
 * Guards against transform mistakes and against counters losing their reverse winding,
 * which would fill the bowls of O/E solid under the default nonzero fill rule.
 */
function validate(d, expected) {
  const contours = d.split('Z').filter((s) => s.trim())
  const nums = (s) => s.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? []
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  let negative = 0

  for (const contour of contours) {
    const vals = nums(contour)
    let area = 0
    const pts = []
    for (let i = 0; i + 1 < vals.length; i += 2) pts.push([vals[i], vals[i + 1]])
    for (const [x, y] of pts) {
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
    for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i]
      const [x1, y1] = pts[(i + 1) % pts.length]
      area += x0 * y1 - x1 * y0
    }
    if (area < 0) negative++
  }

  const problems = []
  const near = (a, b) => Math.abs(a - b) < 0.6
  if (!near(minX, expected.minX)) problems.push(`minX ${minX} != ${expected.minX}`)
  if (!near(maxX, expected.maxX)) problems.push(`maxX ${maxX} != ${expected.maxX}`)
  if (!near(minY, expected.minY)) problems.push(`minY ${minY} != ${expected.minY}`)
  if (!near(maxY, expected.maxY)) problems.push(`maxY ${maxY} != ${expected.maxY}`)
  if (negative === 0) problems.push('no reverse-wound contours: counters would fill solid')
  if (problems.length) throw new Error(`Outline validation failed:\n  ${problems.join('\n  ')}`)

  return { contours: contours.length, counters: negative }
}

const stats = validate(wordmarkPath, {
  minX: inkLeft,
  maxX: inkRight,
  minY: inkTop,
  maxY: inkBottom,
})

console.log(`\nadvance ends at   ${round(pen)}`)
console.log(`ink x             ${round(inkLeft)} -> ${round(inkRight)}`)
console.log(`ink y             ${round(inkTop)} -> ${round(inkBottom)}  (height ${round(inkBottom - inkTop)})`)
console.log(`cap centre y      ${round(LOCKUP.baselineY - capHeight / 2)}`)
console.log(`mark gap          ${round(inkLeft - 79.2)}  (${round((inkLeft - 79.2) / capHeight)} cap)`)
console.log(`word width / cap  ${round((inkRight - inkLeft) / capHeight)}`)
console.log(`viewBox width     ${viewBoxWidth}`)
console.log(`path length       ${wordmarkPath.length} chars`)
console.log(`contours          ${stats.contours} (${stats.counters} reverse-wound counters)`)

console.log('\nletter ink positions and gaps:')
letters.forEach((l, i) => {
  const next = letters[i + 1]
  const gap = next ? round(next.x - l.right) : null
  console.log(
    `  ${l.char} ${l.weight}  x ${l.x} -> ${l.right}` + (gap === null ? '' : `  gap ${gap}`),
  )
})

const maskPaths = MARK.bands
  .map(([, d]) => `      <path fill="#000" d="${d}"/>`)
  .join('\n')
const bandPaths = MARK.bands
  .map(([fill, d]) => `  <path fill="${fill}" d="${d}"/>`)
  .join('\n')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxWidth} 100" fill="none" color="#061B20" aria-hidden="true" focusable="false">
  <defs>
    <mask id="a-cut" maskUnits="userSpaceOnUse">
      <rect width="80" height="100" fill="#fff"/>
${maskPaths}
    </mask>
  </defs>
  <path fill="currentColor" fill-rule="evenodd" mask="url(#a-cut)" d="${MARK.body}"/>
${bandPaths}
  <path fill="currentColor" d="${wordmarkPath}"/>
</svg>
`

writeFileSync('public/authomotive-logo.svg', svg)

const module_ = `// Generated by scripts/generate-wordmark-outline.mjs - do not edit by hand.
// AUTHOMOTIVE outlined from Instrument Sans (wght 700 / 400) at ${LOCKUP.fontSize}px,
// origin x=${LOCKUP.textX}, baseline y=${LOCKUP.baselineY}.
export const WORDMARK_VIEWBOX_WIDTH = ${viewBoxWidth}

export const WORDMARK_PATH =
  '${wordmarkPath}'
`

writeFileSync('components/authomotive-wordmark-outline.ts', module_)

console.log('\nwrote public/authomotive-logo.svg')
console.log('wrote components/authomotive-wordmark-outline.ts')
