'use client'

import { useId } from 'react'
import {
  WORDMARK_PALETTES,
  WORDMARK_PATH,
  WORDMARK_PRODUCTION_TREATMENT,
  WORDMARK_SETS,
  WORDMARK_VIEWBOX_WIDTH,
  type WordmarkPalette,
  type WordmarkTreatment,
} from '@/components/authomotive-wordmark-outline'

const A_BODY =
  'M5.2 97 34.2 3.8H46.6L76.4 97H59.4L52.8 74H27.4L21.4 97H5.2Zm28.8-52L40.4 12.8 46.8 45H34Z'

const JOURNEY = [
  {
    d: 'M2.6 90.2C26 84.2 51.2 71.6 77.6 60.8L78.8 54.2C52.2 65 27 77.6 3.8 83.6Z',
    fill: '#8FBCF5',
  },
  {
    d: 'M5.4 79C28.4 73.2 53.2 61.2 77.8 51.2L79 44.6C54.2 54.6 29.4 66.6 6.6 72.4Z',
    fill: '#C8B8FF',
  },
  {
    d: 'M8.2 67.8C31 62.2 55.2 50.8 78 41.4L79.2 34.8C56 44.2 32 55.6 9.4 61.2Z',
    fill: '#FFC982',
  },
] as const

const COMPACT = [
  { d: 'M16 86.4 69 75.2 70.2 68.6 17.2 79.8Z', fill: '#8FBCF5' },
  { d: 'M18 70.2 71 59 72.2 52.4 19.2 63.6Z', fill: '#C8B8FF' },
  { d: 'M20 54 73 42.8 74.2 36.2 21.2 47.4Z', fill: '#FFC982' },
] as const

function MarkGeometry({
  maskId,
  compact = false,
}: {
  maskId: string
  compact?: boolean
}) {
  const bands = compact ? COMPACT : JOURNEY

  return (
    <>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="80" height="100" fill="#fff" />
          {bands.map((band) => (
            <path key={band.fill} d={band.d} fill="#000" />
          ))}
        </mask>
      </defs>
      <path fill="currentColor" fillRule="evenodd" mask={`url(#${maskId})`} d={A_BODY} />
      {bands.map((band) => (
        <path key={band.fill} d={band.d} fill={band.fill} />
      ))}
    </>
  )
}

export function AuthomotiveMark({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const maskId = `${useId().replace(/:/g, '')}-cut`

  return (
    <svg
      className={className}
      viewBox="0 0 80 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <MarkGeometry maskId={maskId} compact={compact} />
    </svg>
  )
}

// The mark occupies x 2.6–79.2 of an 80x100 box. The wordmark sits against the mark's
// optical centre (y 54.6) rather than its geometric mid (y 50.4), because the splayed
// legs and the three bands load the lower half. Mirrored in the generator script — edit
// both together, then re-run `npm run logo:outline`.
const LOCKUP = {
  textX: 90,
  wordmarkY: 80,
  fontSize: 72,
  authTracking: '0.014em',
  motoTracking: '0.024em',
  hoDx: 1,
} as const

/**
 * Production lockup. Carries no font dependency — the wordmark is outlined from
 * Instrument Sans, so it cannot reflow or shift while the webfont loads.
 *
 * Nonzero fill is required: most letters are built from overlapping same-wound
 * strokes, and only the two O counters are reverse-wound.
 */
export function AuthomotiveLogo({ className }: { className?: string }) {
  const maskId = `${useId().replace(/:/g, '')}-cut`

  return (
    <svg
      className={className}
      viewBox={`0 0 ${WORDMARK_VIEWBOX_WIDTH} 100`}
      fill="none"
      preserveAspectRatio="xMinYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <MarkGeometry maskId={maskId} />
      <path fill="currentColor" d={WORDMARK_PATH} />
    </svg>
  )
}

/**
 * Live-text rendering of the same lockup, kept only so /logo-test can verify the
 * outlined path against the font it was generated from. Not for production use.
 */
export function AuthomotiveLogoText({ className }: { className?: string }) {
  const maskId = `${useId().replace(/:/g, '')}-cut`

  return (
    <svg
      className={className}
      viewBox={`0 0 ${WORDMARK_VIEWBOX_WIDTH} 100`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <MarkGeometry maskId={maskId} />
      <text
        x={LOCKUP.textX}
        y={LOCKUP.wordmarkY}
        fill="currentColor"
        fontFamily="var(--font-instrument-sans), 'Instrument Sans', ui-sans-serif, sans-serif"
        fontSize={LOCKUP.fontSize}
      >
        <tspan fontWeight={700} letterSpacing={LOCKUP.authTracking}>
          AUTH
        </tspan>
        <tspan fontWeight={400} letterSpacing={LOCKUP.motoTracking} dx={LOCKUP.hoDx}>
          OMOTIVE
        </tspan>
      </text>
    </svg>
  )
}

/**
 * Wordmark-first logo. No icon: AUTH carries the brand-colour sequence letter by
 * letter (blue, lavender, apricot, action orange) at wght 700, OMOTIVE follows in a
 * single fill at wght 400. Trimmed to its own ink, so padding is the caller's choice.
 *
 * `palette` must match the background — see WORDMARK_PALETTES. The tint-level brand
 * colours only hold up on Ink; on light backgrounds use the deep stops.
 */
export function AuthomotiveWordmark({
  className,
  palette = 'onLight',
  treatment = WORDMARK_PRODUCTION_TREATMENT,
}: {
  className?: string
  palette?: WordmarkPalette
  treatment?: WordmarkTreatment
}) {
  const set = WORDMARK_SETS[treatment]
  const colors = WORDMARK_PALETTES[palette]

  return (
    <svg
      className={className}
      viewBox={`0 0 ${set.width} ${set.height}`}
      fill="none"
      preserveAspectRatio="xMinYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {set.letters.map((letter) => (
        <path key={letter.char} fill={colors[letter.char]} d={letter.d} />
      ))}
      <path fill={colors.rest} d={set.rest.d} />
    </svg>
  )
}
