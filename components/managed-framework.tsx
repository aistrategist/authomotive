'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import {
  MF_COUNT,
  MF_RING_C,
  ManagedHub,
  mfWorks,
} from '@/components/managed-framework-view'

const DWELL_MS = 4200

function sliceOffset(index: number, progress: number) {
  const from = MF_RING_C * (1 - index / MF_COUNT)
  const to = MF_RING_C * (1 - (index + 1) / MF_COUNT)
  return from + (to - from) * progress
}

export function ManagedFramework() {
  const [activeId, setActiveId] = useState(mfWorks[0]!.id)
  const stageRef = useRef<HTMLDivElement>(null)
  const arcRef = useRef<SVGCircleElement>(null)
  const railRef = useRef<HTMLSpanElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeIndexRef = useRef(0)
  const elapsedRef = useRef(0)
  const heldRef = useRef(false)
  const nearRef = useRef(false)
  const reducedRef = useRef(false)

  const activeIndex = Math.max(0, mfWorks.findIndex((work) => work.id === activeId))
  activeIndexRef.current = activeIndex

  const paint = (progress: number, index: number) => {
    const arc = arcRef.current
    if (arc) arc.style.strokeDashoffset = String(sliceOffset(index, progress))
    const rail = railRef.current
    if (rail) rail.style.transform = `scaleX(${(index + progress) / MF_COUNT})`
  }

  const goTo = (index: number, focus = false) => {
    const work = mfWorks[index]
    if (!work) return
    elapsedRef.current = 0
    activeIndexRef.current = index
    paint(reducedRef.current ? 1 : 0, index)
    setActiveId(work.id)
    if (focus) tabRefs.current[index]?.focus()
  }

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      reducedRef.current = motion.matches
      paint(motion.matches ? 1 : elapsedRef.current / DWELL_MS, activeIndexRef.current)
    }
    syncMotion()
    motion.addEventListener('change', syncMotion)

    const root = stageRef.current
    let raf = 0
    let last = performance.now()
    let running = true

    const stopLoop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    const tick = (now: number) => {
      if (!running) return
      const visible = nearRef.current && !document.hidden
      if (!visible) {
        raf = 0
        return
      }

      const dt = Math.min(48, now - last)
      last = now
      const index = activeIndexRef.current

      if (reducedRef.current) {
        paint(1, index)
      } else if (!heldRef.current) {
        elapsedRef.current += dt
        if (elapsedRef.current >= DWELL_MS) {
          const next = (index + 1) % MF_COUNT
          elapsedRef.current = 0
          activeIndexRef.current = next
          paint(0, next)
          setActiveId(mfWorks[next]!.id)
        } else {
          paint(elapsedRef.current / DWELL_MS, index)
        }
      } else {
        paint(Math.min(1, elapsedRef.current / DWELL_MS), index)
      }

      raf = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (!running || raf || document.hidden || !nearRef.current) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        nearRef.current = Boolean(entry?.isIntersecting)
        if (nearRef.current) startLoop()
        else stopLoop()
      },
      { rootMargin: '120px 0px', threshold: 0 },
    )
    if (root) io.observe(root)

    const onVisibility = () => {
      if (document.hidden) stopLoop()
      else startLoop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      stopLoop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      motion.removeEventListener('change', syncMotion)
    }
  }, [])

  const hold = () => {
    heldRef.current = true
  }
  const release = () => {
    heldRef.current = false
  }

  const activate = (id: string, focus = false) => {
    const i = mfWorks.findIndex((work) => work.id === id)
    if (i < 0) return
    goTo(i, focus)
  }

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = mfWorks.length - 1
    let next = index
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    activate(mfWorks[next]!.id, true)
  }

  return (
    <ManagedHub
      activeId={activeId}
      stageRef={stageRef}
      arcRef={arcRef}
      railRef={railRef}
      tabRefs={tabRefs}
      onActivate={activate}
      onTabKeyDown={onTabKeyDown}
      onHold={hold}
      onRelease={release}
    />
  )
}
