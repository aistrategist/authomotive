'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  SA_DEFAULT_HIT,
  SignalArchitectureConsole,
  saStream,
} from '@/components/signal-architecture-view'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function SignalArchitecture() {
  const [openId, setOpenId] = useState<string>(SA_DEFAULT_HIT)
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<HTMLDivElement>(null)
  const scanRef = useRef<HTMLSpanElement>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useGSAP(
    () => {
      const root = rootRef.current
      const frame = frameRef.current
      const streamEl = streamRef.current
      const scan = scanRef.current
      if (!root || !frame || !streamEl || !scan) return

      const hits = streamEl.querySelectorAll<HTMLElement>('.ma-hit')
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(hits, { opacity: 1, y: 0 })
        gsap.set(scan, { opacity: 0.35, y: 0 })
        return
      }

      gsap.set(hits, { opacity: 0, y: 10 })
      gsap.set(scan, { opacity: 0, y: 0 })

      ScrollTrigger.create({
        trigger: frame,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(hits, {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.07,
            ease: 'power2.out',
            overwrite: 'auto',
            onComplete: () => {
              const travel = Math.max(streamEl.offsetHeight - 28, 80)
              gsap.to(scan, {
                opacity: 0.85,
                y: travel,
                duration: 1.7,
                ease: 'power2.inOut',
                overwrite: 'auto',
                onComplete: () => {
                  gsap.to(scan, { opacity: 0.22, duration: 0.35, overwrite: 'auto' })
                },
              })
            },
          })
        },
      })
    },
    { scope: rootRef },
  )

  useEffect(() => {
    const move = (delta: number) => {
      const ids = saStream.map((row) => row.id)
      const current = openId ? ids.indexOf(openId) : delta > 0 ? -1 : ids.length
      const next = Math.max(0, Math.min(ids.length - 1, current + delta))
      const id = ids[next]
      if (!id) return
      setOpenId(id)
      triggerRefs.current[id]?.focus()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const inConsole = frameRef.current?.contains(document.activeElement)
      if (!inConsole) return

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        move(1)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        move(-1)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openId])

  return (
    <div ref={rootRef}>
      <SignalArchitectureConsole
        openId={openId}
        onSelect={setOpenId}
        frameRef={frameRef}
        streamRef={streamRef}
        scanRef={scanRef}
        triggerRefs={triggerRefs}
      />
    </div>
  )
}
