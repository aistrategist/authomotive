/** Raw head-and-shoulders glyph — no plate, halo, ring, or carrier. Shared by Hero and Chapter 2. */

const INK = 'var(--ink)'

export function VisitorGlyph({
  color,
  variant = 0,
}: {
  color: string
  variant?: number
}) {
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
