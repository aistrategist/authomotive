'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Section-entry hook. Content is visible during SSR and stays visible
 * during hash navigation — no blank opacity-0 wait for intersection.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    ref.current?.classList.add('reveal-io', 'is-visible')
  }, [])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  )
}
