'use client'

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'

type Loader = () => Promise<{ default: ComponentType }>

/**
 * SSR the fallback immediately. Import the live client module only when
 * the section is near, already on screen, or targeted by a hash/CTA click.
 */
export function NearSwap({
  load,
  fallback,
  hashes = [],
  rootMargin = '420px 0px',
  idleMs,
  observe,
}: {
  load: Loader
  fallback: ReactNode
  hashes?: string[]
  rootMargin?: string
  idleMs?: number
  observe?: string
}) {
  const [Live, setLive] = useState<ComponentType | null>(null)
  const slotRef = useRef<HTMLDivElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const start = () => {
      if (startedRef.current) return
      startedRef.current = true
      load().then((mod) => setLive(() => mod.default))
    }

    const hashHits = () => {
      const hash = window.location.hash.replace('#', '')
      return Boolean(hash && hashes.includes(hash))
    }

    if (hashHits()) {
      start()
      return
    }

    const slot = slotRef.current
    const target =
      (observe ? document.querySelector<HTMLElement>(observe) : null) ??
      (slot?.firstElementChild as HTMLElement | null) ??
      slot
    if (!target) return

    if (target.getBoundingClientRect().top < window.innerHeight + 240) {
      start()
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        start()
      },
      { rootMargin, threshold: 0.01 },
    )
    io.observe(target)

    const onHash = () => {
      if (hashHits()) start()
    }
    const onClick = (event: MouseEvent) => {
      const node = event.target
      if (!(node instanceof Element)) return
      const anchor = node.closest('a[href^="#"]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      const id = decodeURIComponent((anchor.getAttribute('href') || '#').slice(1))
      if (hashes.includes(id)) start()
    }

    window.addEventListener('hashchange', onHash)
    document.addEventListener('click', onClick)

    let idleId = 0
    let idleTimer = 0
    if (idleMs && idleMs > 0) {
      const later = () => start()
      if (typeof requestIdleCallback === 'function') {
        idleId = requestIdleCallback(later, { timeout: idleMs })
      } else {
        idleTimer = window.setTimeout(later, idleMs)
      }
    }

    return () => {
      io.disconnect()
      window.removeEventListener('hashchange', onHash)
      document.removeEventListener('click', onClick)
      if (idleId && typeof cancelIdleCallback === 'function') cancelIdleCallback(idleId)
      if (idleTimer) window.clearTimeout(idleTimer)
    }
  }, [load, hashes, rootMargin, idleMs, observe])

  return (
    <div ref={slotRef} className="contents">
      {Live ? <Live /> : fallback}
    </div>
  )
}
