'use client'

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const SIGNAL_STATES = ['question', 'guidance', 'inventory', 'evidence'] as const

const WEBGL2_ATTRIBUTES: WebGLContextAttributes = {
  alpha: true,
  antialias: false,
  depth: false,
  stencil: false,
  powerPreference: 'low-power',
  preserveDrawingBuffer: false,
}

type GrainSurface = ComponentType<{ paused: boolean }>

let webgl2Support: boolean | null = null

function hasWebGL2() {
  if (webgl2Support !== null) return webgl2Support
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2', WEBGL2_ATTRIBUTES)
    webgl2Support = gl instanceof WebGL2RenderingContext
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    canvas.width = 0
    canvas.height = 0
  } catch {
    webgl2Support = false
  }
  return webgl2Support
}

function canUseShader() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.matchMedia('(max-width: 767px)').matches) return false
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean }
    }
  ).connection
  if (connection?.saveData) return false
  if (window.matchMedia('(prefers-reduced-data: reduce)').matches) return false
  if (!hasWebGL2()) return false
  return true
}

function stageIndexFromProgress(progress: number) {
  return Math.min(3, Math.max(0, Math.floor(progress * 3.999)))
}

export function QtiJourney({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const lineHRef = useRef<HTMLDivElement>(null)
  const lineVRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const signalRef = useRef<HTMLDivElement>(null)
  const grainRef = useRef<GrainSurface | null>(null)
  const [shaderEnabled, setShaderEnabled] = useState(false)
  const [shaderPaused, setShaderPaused] = useState(true)
  const [GrainSurface, setGrainSurface] = useState<GrainSurface | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let cancelled = false
    let enabled = false
    let near = false

    const loadShader = () => {
      if (cancelled || !enabled || !near) {
        if (!enabled) setShaderEnabled(false)
        return
      }
      if (grainRef.current) {
        setGrainSurface(() => grainRef.current)
        setShaderEnabled(true)
        return
      }
      void import('@/components/qti-grain-surface').then((mod) => {
        if (cancelled || !canUseShader()) return
        grainRef.current = mod.default
        setGrainSurface(() => mod.default)
        setShaderEnabled(true)
      })
    }

    const syncCapability = () => {
      enabled = canUseShader()
      if (!enabled) {
        setShaderEnabled(false)
        return
      }
      loadShader()
    }
    syncCapability()

    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktopMq = window.matchMedia('(min-width: 768px)')
    const onCapabilityChange = () => syncCapability()
    reduceMq.addEventListener('change', onCapabilityChange)
    desktopMq.addEventListener('change', onCapabilityChange)

    const io = new IntersectionObserver(
      ([entry]) => {
        near = Boolean(entry?.isIntersecting)
        if (enabled && near) loadShader()
        setShaderPaused(document.hidden || !near)
      },
      { rootMargin: '160px 0px', threshold: 0.01 },
    )
    io.observe(root)

    const onVisibility = () => {
      const rect = root.getBoundingClientRect()
      const inRange = rect.bottom > -160 && rect.top < window.innerHeight + 160
      setShaderPaused(document.hidden || !inRange)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      reduceMq.removeEventListener('change', onCapabilityChange)
      desktopMq.removeEventListener('change', onCapabilityChange)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useGSAP(
    () => {
      const root = rootRef.current
      const lineH = lineHRef.current
      const lineV = lineVRef.current
      const track = trackRef.current
      const signal = signalRef.current
      if (!root || !lineH || !lineV || !track || !signal) return

      const applyStage = (progress: number, live: boolean) => {
        const idx = stageIndexFromProgress(progress)
        root.setAttribute('data-qti-stage', String(idx))
        signal.setAttribute('data-state', SIGNAL_STATES[idx] ?? 'question')
        if (live) {
          const maxX = Math.max(0, track.offsetWidth - signal.offsetWidth)
          gsap.set(signal, { x: progress * maxX })
        }
      }

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        root.setAttribute('data-qti-motion', 'reduced')
        root.setAttribute('data-qti-stage', '')
        gsap.set(lineH, { scaleX: 1 })
        gsap.set(lineV, { scaleY: 1 })
        gsap.set(signal, { autoAlpha: 0, x: 0 })
      })

      mm.add(
        '(prefers-reduced-motion: no-preference) and (min-width: 1024px)',
        () => {
          root.setAttribute('data-qti-motion', 'live')
          gsap.set(lineH, { scaleX: 0, transformOrigin: 'left center' })
          gsap.set(lineV, { scaleY: 1 })
          gsap.set(signal, { autoAlpha: 1, x: 0 })
          applyStage(0, true)

          ScrollTrigger.create({
            trigger: root,
            start: 'top 78%',
            end: 'bottom 52%',
            scrub: 0.45,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress
              gsap.set(lineH, { scaleX: p })
              applyStage(p, true)
            },
            onRefresh: (self) => {
              gsap.set(lineH, { scaleX: self.progress })
              applyStage(self.progress, true)
            },
          })
        },
      )

      mm.add(
        '(prefers-reduced-motion: no-preference) and (max-width: 1023px)',
        () => {
          root.setAttribute('data-qti-motion', 'live')
          gsap.set(lineH, { scaleX: 1 })
          gsap.set(lineV, { scaleY: 0, transformOrigin: 'top center' })
          gsap.set(signal, { autoAlpha: 0, x: 0 })
          applyStage(0, false)

          ScrollTrigger.create({
            trigger: root,
            start: 'top 82%',
            end: 'bottom 58%',
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress
              gsap.set(lineV, { scaleY: p })
              applyStage(p, false)
            },
            onRefresh: (self) => {
              gsap.set(lineV, { scaleY: self.progress })
              applyStage(self.progress, false)
            },
          })
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  const ShaderSurface = shaderEnabled ? GrainSurface : null

  return (
    <div
      ref={rootRef}
      className="qti-artifact mt-9 md:mt-10"
      data-qti-motion="static"
    >
      <div className="qti-shader-slot" aria-hidden="true">
        {ShaderSurface ? <ShaderSurface paused={shaderPaused} /> : null}
      </div>

      <div ref={lineVRef} className="qti-line qti-line-v" aria-hidden="true" />
      <div ref={trackRef} className="qti-track-h" aria-hidden="true">
        <div ref={lineHRef} className="qti-line qti-line-h" />
        <div
          ref={signalRef}
          className="qti-signal"
          data-state="question"
          aria-hidden="true"
        >
          <span className="qti-signal-mark" data-mark="question" />
          <span className="qti-signal-mark" data-mark="guidance" />
          <span className="qti-signal-mark" data-mark="inventory" />
          <span className="qti-signal-mark" data-mark="evidence" />
        </div>
      </div>

      {children}
    </div>
  )
}
