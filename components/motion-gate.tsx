'use client'

import { useEffect } from 'react'

/**
 * Desktop TBT: keep decorative CSS loops paused until the main thread is idle,
 * with no timeout that can force work into the Lighthouse window. Shopper-path
 * motion is owned by HeroStage, not this gate.
 */
export function MotionGate() {
  useEffect(() => {
    const root = document.documentElement
    let idleId = 0
    let armed = false

    const arm = () => {
      if (armed) return
      armed = true
      idleId = 0
      root.classList.add('is-decor-motion')
    }

    if (typeof requestIdleCallback === 'function') {
      idleId = requestIdleCallback(arm)
    }

    const onEngage = () => arm()
    window.addEventListener('scroll', onEngage, { once: true, passive: true })
    window.addEventListener('pointerdown', onEngage, { once: true })
    window.addEventListener('keydown', onEngage, { once: true })

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('is-near', entry.isIntersecting)
        }
      },
      { rootMargin: '80px 0px', threshold: 0.01 },
    )
    document.querySelectorAll('[data-motion-gate]').forEach((el) => io.observe(el))

    return () => {
      io.disconnect()
      if (idleId && typeof cancelIdleCallback === 'function') cancelIdleCallback(idleId)
      window.removeEventListener('scroll', onEngage)
      window.removeEventListener('pointerdown', onEngage)
      window.removeEventListener('keydown', onEngage)
      root.classList.remove('is-decor-motion')
    }
  }, [])

  return null
}
