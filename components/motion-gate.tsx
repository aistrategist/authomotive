'use client'

import { useEffect } from 'react'

const ARM_TIMEOUT_MS = 1800

/**
 * Desktop TBT: keep decorative CSS loops paused until the main thread is idle,
 * and keep below-fold loops paused until their section is near. Shopper-path
 * motion is owned by HeroStage, not this gate.
 */
export function MotionGate() {
  useEffect(() => {
    const root = document.documentElement
    let idleId = 0
    let timer = 0

    const arm = () => {
      idleId = 0
      timer = 0
      root.classList.add('is-decor-motion')
    }

    if (typeof requestIdleCallback === 'function') {
      idleId = requestIdleCallback(arm, { timeout: ARM_TIMEOUT_MS })
    } else {
      timer = window.setTimeout(arm, ARM_TIMEOUT_MS)
    }

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
      if (timer) window.clearTimeout(timer)
      root.classList.remove('is-decor-motion')
    }
  }, [])

  return null
}
