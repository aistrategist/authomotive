'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Restrained section-entry reveal. Content is fully visible during SSR;
 * the hiding class is only added on the client for below-the-fold content,
 * and prefers-reduced-motion users see states change immediately.
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
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible')
      return
    }
    // Skip animating anything already in the initial viewport
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      el.classList.add('reveal-io', 'is-visible')
      return
    }
    el.classList.add('reveal-io')
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            io.disconnect()
          }
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  )
}
