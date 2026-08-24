'use client'

import { useId } from 'react'

const A_BODY =
  'M6 97 31 5h18l25 92H57.2L51.8 77H28.2L22.8 97H6Zm27.6-48L40 16l6.4 33H33.6Z'
const JOURNEY = [
  { d: 'M3 88C20 83 44 69 77 55', stroke: '#8FBCF5' },
  { d: 'M4 79.5C21 74.5 45 60.5 78 46.5', stroke: '#C8B8FF' },
  { d: 'M5 71C22 66 46 52 79 38', stroke: '#FFC982' },
] as const

function MarkGeometry({ maskId }: { maskId: string }) {
  return (
    <>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="80" height="100" fill="#fff" />
          {JOURNEY.map((path) => (
            <path
              key={path.d}
              d={path.d}
              stroke="#000"
              strokeWidth="8.2"
              strokeLinecap="round"
            />
          ))}
        </mask>
      </defs>
      <path fill="currentColor" fillRule="evenodd" mask={`url(#${maskId})`} d={A_BODY} />
      {JOURNEY.map((path) => (
        <path
          key={path.stroke}
          d={path.d}
          stroke={path.stroke}
          strokeWidth="5.6"
          strokeLinecap="round"
        />
      ))}
    </>
  )
}

export function AuthomotiveMark({ className }: { className?: string }) {
  const maskId = `${useId().replace(/:/g, '')}-cut`

  return (
    <svg
      className={className}
      viewBox="0 0 80 100"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <MarkGeometry maskId={maskId} />
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
