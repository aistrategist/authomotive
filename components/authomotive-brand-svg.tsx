import {
  WORDMARK_PALETTES,
  WORDMARK_PRODUCTION_TREATMENT,
  WORDMARK_SETS,
  type WordmarkPalette,
} from '@/components/authomotive-wordmark-outline'

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
}: {
  className?: string
  palette?: WordmarkPalette
}) {
  const set = WORDMARK_SETS[WORDMARK_PRODUCTION_TREATMENT]
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
