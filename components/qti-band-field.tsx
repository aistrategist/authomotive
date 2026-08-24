'use client'

import dynamic from 'next/dynamic'
import {
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

const QtiFieldSurface = dynamic(() => import('@/components/qti-field-surface'), {
  ssr: false,
})

const QTI_HASHES = ['platforms', 'question-to-inventory-heading']

function canUseShader() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    const ok = Boolean(gl)
    if (gl) gl.getExtension('WEBGL_lose_context')?.loseContext()
    return ok
  } catch {
    return false
  }
}

function isDeepLinked() {
  const hash = window.location.hash.replace(/^#/, '')
  return QTI_HASHES.includes(hash)
}

function hasUserMoved() {
  return window.scrollY > 8
}

class ShaderGuard extends Component<{ children: ReactNode }, { dead: boolean }> {
  state = { dead: false }

  static getDerivedStateFromError() {
    return { dead: true }
  }

  render() {
    return this.state.dead ? null : this.props.children
  }
}

/**
 * Absolute field slot. CSS fallback stays visible until WebGL2 is
 * confirmed, the section is near, and motion is allowed.
 */
export function QtiBandField() {
  const slotRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [paused, setPaused] = useState(true)

  useEffect(() => {
    const root = slotRef.current
    if (!root) return

    let capable: boolean | null = null
    let near = false
    let shaderIdle = 0

    const loadShader = () => {
      if (capable === null) capable = canUseShader()
      if (capable) setEnabled(true)
      else setEnabled(false)
    }

    const cancelIdle = () => {
      if (shaderIdle && typeof cancelIdleCallback === 'function') {
        cancelIdleCallback(shaderIdle)
        shaderIdle = 0
      }
    }

    const begin = () => {
      shaderIdle = 0
      if (!near || document.hidden) {
        setPaused(true)
        return
      }
      loadShader()
      setPaused(false)
    }

    const schedule = () => {
      if (!near || document.hidden) return
      if (!isDeepLinked() && !hasUserMoved()) return
      cancelIdle()
      if (isDeepLinked()) {
        begin()
        return
      }
      if (typeof requestIdleCallback === 'function') {
        shaderIdle = requestIdleCallback(begin)
      } else {
        requestAnimationFrame(begin)
      }
    }

    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onCapabilityChange = () => {
      capable = null
      if (near && (isDeepLinked() || hasUserMoved())) loadShader()
      else setEnabled(false)
    }
    reduceMq.addEventListener('change', onCapabilityChange)

    const io = new IntersectionObserver(
      ([entry]) => {
        near = Boolean(entry?.isIntersecting)
        if (near) schedule()
        else {
          cancelIdle()
          setPaused(true)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.2 },
    )
    io.observe(root)

    const onVisibility = () => {
      setPaused(document.hidden || !near)
    }
    const onMove = () => schedule()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('hashchange', onMove)

    if (isDeepLinked()) {
      near = true
      schedule()
    }

    return () => {
      reduceMq.removeEventListener('change', onCapabilityChange)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('scroll', onMove)
      window.removeEventListener('hashchange', onMove)
      cancelIdle()
    }
  }, [])

  return (
    <div ref={slotRef} className="qti-shader-slot" aria-hidden="true">
      {enabled ? (
        <ShaderGuard>
          <QtiFieldSurface paused={paused} />
        </ShaderGuard>
      ) : null}
    </div>
  )
}
