/** Shared chapter-entry mark: 2px rule, 72–96px emphasis, square node. */

const bars = {
  ink: 'bg-ink',
  lime: 'bg-lime',
  orange: 'bg-action',
} as const

const rests = {
  ink: 'bg-ink/15',
  lime: 'bg-lime/25',
  orange: 'bg-action/25',
} as const

export function SignalRail({
  tone = 'ink',
}: {
  tone?: 'ink' | 'lime' | 'orange' | 'handoff'
}) {
  if (tone === 'handoff') {
    return (
      <div className="mb-8 flex items-center md:mb-10" aria-hidden="true">
        <span className="h-[2px] w-[4.5rem] bg-lime md:w-16" />
        <span className="h-[2px] w-8 bg-action md:w-10" />
        <span className="h-2 w-2 shrink-0 bg-action" />
        <span className="h-[2px] flex-1 bg-porcelain/15" />
      </div>
    )
  }

  return (
    <div className="mb-8 flex items-center md:mb-10" aria-hidden="true">
      <span className={`h-[2px] w-[4.5rem] md:w-24 ${bars[tone]}`} />
      <span className={`h-2 w-2 shrink-0 ${bars[tone]}`} />
      <span className={`h-[2px] flex-1 ${rests[tone]}`} />
    </div>
  )
}
