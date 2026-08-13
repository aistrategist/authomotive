import type { ReactNode } from 'react'

/**
 * Accessible native disclosure. Content remains present in the document
 * for search systems and screen readers.
 */
export function Disclosure({
  title,
  children,
  dark = false,
}: {
  title: string
  children: ReactNode
  dark?: boolean
}) {
  return (
    <details
      className={`disclosure rounded-lg border ${
        dark ? 'border-graphite bg-carbon' : 'border-border bg-porcelain'
      }`}
    >
      <summary
        className={`flex min-h-[52px] items-center justify-between gap-4 rounded-lg px-4 py-3 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${
          dark ? 'text-porcelain focus-visible:outline-lime' : 'text-ink focus-visible:outline-signal-deep'
        }`}
      >
        {title}
        <span
          className={`disclosure-icon flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-base leading-none ${
            dark ? 'border-graphite text-lime' : 'border-border text-signal-deep'
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className={`px-4 pb-4 ${dark ? 'text-porcelain/80' : ''}`}>{children}</div>
    </details>
  )
}
