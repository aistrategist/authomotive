import { cn } from '@/lib/utils'

type HandoffTheme = 'light' | 'dark'
type HandoffAccent = 'discovery' | 'evidence' | 'neutral'

export function SectionHandoff({
  eyebrow,
  label,
  href,
  theme = 'light',
  accent = 'neutral',
  className,
}: {
  eyebrow: string
  label: string
  href: string
  theme?: HandoffTheme
  accent?: HandoffAccent
  className?: string
}) {
  return (
    <a
      href={href}
      className={cn('section-handoff', `is-${theme}`, `is-${accent}`, className)}
    >
      <span className="section-handoff-eyebrow">{eyebrow}</span>
      <span className="section-handoff-label">
        {label}
        <span className="section-handoff-arrow" aria-hidden="true">
          →
        </span>
      </span>
    </a>
  )
}
