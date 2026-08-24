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

    const loadShader = () => {
      if (capable === null) capable = canUseShader()
      if (capable) setEnabled(true)
      else setEnabled(false)
    }

    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onCapabilityChange = () => {
      capable = null
      if (near) loadShader()
      else setEnabled(false)
    }
    reduceMq.addEventListener('change', onCapabilityChange)

    const io = new IntersectionObserver(
      ([entry]) => {
        near = Boolean(entry?.isIntersecting)
        if (near) loadShader()
        setPaused(document.hidden || !near)
      },
      { rootMargin: '0px 0px -28% 0px', threshold: 0.12 },
    )
    io.observe(root)

    const onVisibility = () => {
      setPaused(document.hidden || !near)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      reduceMq.removeEventListener('change', onCapabilityChange)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
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
