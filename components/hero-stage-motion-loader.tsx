'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const HeroStageMotion = dynamic(
  () => import('@/components/hero-stage-motion').then((mod) => ({ default: mod.HeroStageMotion })),
  { ssr: false },
)

/**
 * Tiny client loader. Static Hero markup is already on screen; traveler JS
 * downloads after idle, scroll, or a real interaction.
 */
export function HeroStageMotionLoader() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let idleId = 0
    let started = false

    const start = () => {
      if (started) return
      started = true
      if (idleId && typeof cancelIdleCallback === 'function') cancelIdleCallback(idleId)
      idleId = 0
      setReady(true)
    }

    window.addEventListener('pointerdown', start, { once: true, passive: true })
    window.addEventListener('keydown', start, { once: true })
    window.addEventListener('scroll', start, { once: true, passive: true })
    window.addEventListener('touchstart', start, { once: true, passive: true })

    if (typeof requestIdleCallback === 'function') {
      idleId = requestIdleCallback(start)
    } else if (document.readyState === 'complete') {
      requestAnimationFrame(start)
    } else {
      window.addEventListener('load', start, { once: true })
    }

    return () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
      window.removeEventListener('scroll', start)
      window.removeEventListener('touchstart', start)
      window.removeEventListener('load', start)
      if (idleId && typeof cancelIdleCallback === 'function') cancelIdleCallback(idleId)
    }
  }, [])

  return ready ? <HeroStageMotion /> : null
}
