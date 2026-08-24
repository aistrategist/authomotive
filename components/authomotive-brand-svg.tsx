'use client'

import { useId } from 'react'

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

export function AuthomotiveLogo({ className }: { className?: string }) {
  const maskId = `${useId().replace(/:/g, '')}-cut`

  return (
    <svg
      className={className}
      viewBox="0 0 920 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <MarkGeometry maskId={maskId} />
      <text
        x="98"
        y="78"
        fill="currentColor"
        fontFamily="var(--font-instrument-sans), 'Instrument Sans', ui-sans-serif, sans-serif"
        fontSize="72"
      >
        <tspan fontWeight={700} letterSpacing="0.03em">
          AUTH
        </tspan>
        <tspan fontWeight={400} letterSpacing="0.055em" dx="6">
          OMOTIVE
        </tspan>
      </text>
    </svg>
  )
}
