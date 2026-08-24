/**
 * Outlines the AUTHOMOTIVE wordmark so the logos carry no font dependency.
 *
 * Glyphs come from the same Instrument Sans variable font that next/font serves to the
 * browser, instanced at wght 700 (AUTH) and wght 400 (OMOTIVE). Each weight run is
 * shaped separately, matching how a browser shapes two <tspan> elements.
 *
 * Emits the production wordmark-first logo as one path per letter, plus static
 * SVG masters for on-light and on-ink.
 *
 * Run with: npm run logo:outline  [-- --font path/to/InstrumentSans.ttf]
 * Re-run whenever the metrics below change.
 */
import { existsSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import * as fontkit from 'fontkit'

const WORD = [
  { text: 'AUTH', weight: 700 },
  { text: 'OMOTIVE', weight: 400 },
]

/** Icon + wordmark lockup. Mirrors LOCKUP in components/authomotive-brand-svg.tsx. */
const LOCKUP = {
  fontSize: 72,
  textX: 90,
  baselineY: 80,
  authTracking: 0.014,
  motoTracking: 0.024,
  jointDx: 1,
  /** Left edge of the mark's ink, mirrored as the trailing margin. */
  trimMargin: 2.6,
}

/**
 * Wordmark-first logo. Trimmed to its own ink, so the consumer controls padding.
 * Production `uniform` keeps OMOTIVE at 0.024em and pulls AUTH to -0.030em so the
 * colour sequence reads as one unit. The H→O join is restored with jointDx.
 */
const WORDMARK_TREATMENTS = {
  graded: { authTracking: 0.014, motoTracking: 0.024, jointDx: 1 },
  uniform: { authTracking: -0.03, motoTracking: 0.024, jointDx: 3.888 },
  open: { authTracking: 0.034, motoTracking: 0.034, jointDx: 0 },
}

const MARK = {
  body: 'M5.2 97 34.2 3.8H46.6L76.4 97H59.4L52.8 74H27.4L21.4 97H5.2Zm28.8-52L40.4 12.8 46.8 45H34Z',
  bands: [
    ['#8FBCF5', 'M2.6 90.2C26 84.2 51.2 71.6 77.6 60.8L78.8 54.2C52.2 65 27 77.6 3.8 83.6Z'],
    ['#C8B8FF', 'M5.4 79C28.4 73.2 53.2 61.2 77.8 51.2L79 44.6C54.2 54.6 29.4 66.6 6.6 72.4Z'],
    ['#FFC982', 'M8.2 67.8C31 62.2 55.2 50.8 78 41.4L79.2 34.8C56 44.2 32 55.6 9.4 61.2Z'],
  ],
}

/** Wordmark-first palettes. Names are the CSS tokens in app/globals.css. */
const PALETTES = {
  // On light backgrounds. Deep stops of the same four hues: the tint-level brand
  // colours sit at 1.5-2.0:1 against white, which would make AUTH read lighter than
  // OMOTIVE and invert the intended hierarchy.
  onLight: {
    A: '#285f9e', // accent-deep
    U: '#6c54b5', // proof-deep
    T: '#e9893f', // action-strong
    H: '#a45118', // action-deep
    rest: '#061b20', // ink
  },
  // Reversed on Ink. The tint-level brand colours as specified — this is the
  // environment they were designed for, at 9.0-11.8:1.
  onInk: {
    A: '#8fbcf5', // accent
    U: '#c8b8ff', // proof
    T: '#ffc982', // action
    H: '#f8a85f', // action-hover
    rest: '#fffcf7', // paper
  },
  // Exactly as briefed, on light. Kept for comparison only.
  asBriefed: {
    A: '#8fbcf5', // accent
    U: '#c8b8ff', // proof
    T: '#ffc982', // action
    H: '#f8a85f', // action-hover
    rest: '#061b20', // ink
  },
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

      if (!actual.every((v, i) => v === expected[i])) {
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

/**
 * Place every glyph of the word. Returns absolute placements plus the ink bounding box,
 * both in SVG user units, so callers can emit trimmed or absolute coordinates.
 */
function layoutWord(base, { fontSize, startX, baselineY, authTracking, motoTracking, jointDx }) {
  const scale = fontSize / base.unitsPerEm
  const tracking = [authTracking, motoTracking]
  const placements = []
  const box = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  let pen = startX

  WORD.forEach((run, runIndex) => {
    const instance = base.getVariation({ wght: run.weight, wdth: 100 })
    const layout = instance.layout(run.text)
    const trackingPx = tracking[runIndex] * fontSize
    if (runIndex > 0) pen += jointDx

    layout.glyphs.forEach((glyph, i) => {
      const pos = layout.positions[i]
      const originX = pen + pos.xOffset * scale
      const originBaseline = baselineY - pos.yOffset * scale
      const g = glyph.bbox

      placements.push({
        char: run.text[i],
        weight: run.weight,
        glyph,
        originX,
        originBaseline,
        inkLeft: originX + g.minX * scale,
        inkRight: originX + g.maxX * scale,
      })

      box.minX = Math.min(box.minX, originX + g.minX * scale)
      box.maxX = Math.max(box.maxX, originX + g.maxX * scale)
      box.minY = Math.min(box.minY, originBaseline - g.maxY * scale)
      box.maxY = Math.max(box.maxY, originBaseline - g.minY * scale)

      pen += pos.xAdvance * scale + trackingPx
    })
  })

  return { placements, box, advanceEnd: pen, scale }
}

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

/**
 * Re-read an emitted path and confirm it agrees with the metrics it was built from.
 * Guards against transform mistakes and against counters losing their reverse winding,
 * which would fill the bowls of O solid under the default nonzero fill rule.
 */
function validate(d, expected, { requireCounter = true } = {}) {
  const contours = d.split('Z').filter((s) => s.trim())
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  let negative = 0

  for (const contour of contours) {
    const vals = (contour.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
    const pts = []
    for (let i = 0; i + 1 < vals.length; i += 2) pts.push([vals[i], vals[i + 1]])
    for (const [x, y] of pts) {
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
    let area = 0
    for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i]
      const [x1, y1] = pts[(i + 1) % pts.length]
      area += x0 * y1 - x1 * y0
    }
    if (area < 0) negative++
  }

  const problems = []
  const near = (a, b) => Math.abs(a - b) < 0.6
  if (!near(minX, expected.minX)) problems.push(`minX ${minX} != ${round(expected.minX)}`)
  if (!near(maxX, expected.maxX)) problems.push(`maxX ${maxX} != ${round(expected.maxX)}`)
  if (!near(minY, expected.minY)) problems.push(`minY ${minY} != ${round(expected.minY)}`)
  if (!near(maxY, expected.maxY)) problems.push(`maxY ${maxY} != ${round(expected.maxY)}`)
  if (requireCounter && negative === 0) {
    problems.push('no reverse-wound contours: counters would fill solid')
  }
  if (problems.length) throw new Error(`Outline validation failed:\n  ${problems.join('\n  ')}`)

  return { contours: contours.length, counters: negative }
}

const fontPath = resolveFont()
const base = fontkit.openSync(fontPath)
const capHeight = base.capHeight * (LOCKUP.fontSize / base.unitsPerEm)

console.log(`font:  ${fontPath}`)
console.log(`       upem ${base.unitsPerEm}  capHeight ${base.capHeight} (${round(capHeight)}u)`)
const verified = verifyAgainstShippedSubset(base, WORD.map((r) => r.text).join(''))
console.log(
  verified
    ? `       metrics match next/font subset ${verified}`
    : '       no next/font cache to cross-check (run `npm run build` first)',
)

// ---------------------------------------------------------------- icon + wordmark

const lockup = layoutWord(base, { ...LOCKUP, startX: LOCKUP.textX })
const lockupPath = lockup.placements
  .map((p) => glyphToSvg(p.glyph, p.originX, lockup.scale, p.originBaseline))
  .join('')
const lockupWidth = Math.round(lockup.box.maxX + LOCKUP.trimMargin)
const lockupStats = validate(lockupPath, lockup.box)

console.log('\n== icon + wordmark lockup')
console.log(`ink x             ${round(lockup.box.minX)} -> ${round(lockup.box.maxX)}`)
console.log(`mark gap          ${round(lockup.box.minX - 79.2)} (${round((lockup.box.minX - 79.2) / capHeight)} cap)`)
console.log(`viewBox           0 0 ${lockupWidth} 100`)
console.log(`contours          ${lockupStats.contours} (${lockupStats.counters} counters)`)

// ------------------------------------------------------------------ wordmark only

const wordmarkSets = {}

for (const [name, treatment] of Object.entries(WORDMARK_TREATMENTS)) {
  const run = layoutWord(base, {
    fontSize: LOCKUP.fontSize,
    startX: 0,
    baselineY: 0,
    ...treatment,
  })

  // Trim to the ink box: shift so the leftmost ink is x=0 and the cap line is y=0.
  const dx = -run.box.minX
  const dy = run.box.minY
  const width = round(run.box.maxX - run.box.minX)
  const height = round(run.box.maxY - run.box.minY)

  const glyphs = run.placements.map((p) => {
    const g = p.glyph.bbox
    const originX = p.originX + dx
    const baseline = p.originBaseline - dy
    return {
      char: p.char,
      weight: p.weight,
      d: glyphToSvg(p.glyph, originX, run.scale, baseline),
      box: {
        minX: originX + g.minX * run.scale,
        maxX: originX + g.maxX * run.scale,
        minY: baseline - g.maxY * run.scale,
        maxY: baseline - g.minY * run.scale,
      },
    }
  })

  // Each letter is validated on its own bounds. A/U/T/H have no closed counters in this
  // typeface, so only the combined path is checked for reverse winding.
  for (const glyph of glyphs) {
    validate(glyph.d, glyph.box, { requireCounter: false })
  }

  // One path per letter for AUTH so it can be coloured letter by letter. OMOTIVE
  // collapses into a single path since every character shares one fill.
  const letters = glyphs.slice(0, 4).map(({ char, weight, d }) => ({ char, weight, d }))
  const rest = {
    char: 'OMOTIVE',
    weight: 400,
    d: glyphs.slice(4).map((g) => g.d).join(''),
  }

  const combined = letters.map((l) => l.d).join('') + rest.d
  const stats = validate(combined, { minX: 0, maxX: width, minY: 0, maxY: height })

  wordmarkSets[name] = { width, height, letters, rest }

  const gaps = run.placements
    .slice(0, -1)
    .map((p, i) => round(run.placements[i + 1].inkLeft - p.inkRight))
  console.log(`\n== wordmark "${name}"  auth ${treatment.authTracking}em / omotive ${treatment.motoTracking}em / joint +${treatment.jointDx}`)
  console.log(`viewBox           0 0 ${width} ${height}`)
  console.log(`width / cap       ${round(width / capHeight)}`)
  console.log(`gaps              ${gaps.join(' ')}`)
  console.log(`contours          ${stats.contours} (${stats.counters} counters)`)
}

// ------------------------------------------------------------------------- outputs

/** Wordmark-first asset: one <path> per coloured letter, plus OMOTIVE. */
function wordmarkSvg(set, palette) {
  const paths = set.letters
    .map((l) => `  <path fill="${palette[l.char]}" d="${l.d}"/>`)
    .join('\n')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${set.width} ${set.height}" fill="none" aria-hidden="true" focusable="false">
${paths}
  <path fill="${palette.rest}" d="${set.rest.d}"/>
</svg>
`
}

const PRODUCTION_TREATMENT = 'uniform'
const production = wordmarkSets[PRODUCTION_TREATMENT]

writeFileSync('public/authomotive-wordmark.svg', wordmarkSvg(production, PALETTES.onLight))
writeFileSync(
  'public/authomotive-wordmark-reversed.svg',
  wordmarkSvg(production, PALETTES.onInk),
)

writeFileSync(
  'components/authomotive-wordmark-outline.ts',
  `// Generated by scripts/generate-wordmark-outline.mjs - do not edit by hand.
// AUTHOMOTIVE outlined from Instrument Sans (wght 700 / 400) at ${LOCKUP.fontSize}px.

/** Icon + wordmark lockup: single path, origin x=${LOCKUP.textX}, baseline y=${LOCKUP.baselineY}. */
export const WORDMARK_VIEWBOX_WIDTH = ${lockupWidth}

export const WORDMARK_PATH =
  '${lockupPath}'

export type WordmarkTreatment = ${Object.keys(WORDMARK_TREATMENTS)
    .map((k) => `'${k}'`)
    .join(' | ')}

export type WordmarkPalette = ${Object.keys(PALETTES)
    .map((k) => `'${k}'`)
    .join(' | ')}

/** Keyed by letter for A/U/T/H, plus \`rest\` for OMOTIVE. */
export const WORDMARK_PALETTES: Record<WordmarkPalette, Record<string, string>> =
  ${JSON.stringify(PALETTES, null, 2).replace(/\n/g, '\n  ')}

export type WordmarkLetter = { char: string; weight: number; d: string }

export type WordmarkSet = {
  width: number
  height: number
  /** A, U, T, H — one path each so they can be coloured individually. */
  letters: WordmarkLetter[]
  /** OMOTIVE as a single path; every character shares one fill. */
  rest: WordmarkLetter
}

/** Wordmark-first logo, trimmed to its own ink box. */
export const WORDMARK_SETS: Record<WordmarkTreatment, WordmarkSet> = ${JSON.stringify(
    wordmarkSets,
    null,
    2,
  )}

export const WORDMARK_PRODUCTION_TREATMENT: WordmarkTreatment = '${PRODUCTION_TREATMENT}'
`,
)

console.log('\nwrote public/authomotive-wordmark.svg')
console.log('wrote public/authomotive-wordmark-reversed.svg')
console.log('wrote components/authomotive-wordmark-outline.ts')
