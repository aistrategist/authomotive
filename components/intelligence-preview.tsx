'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reporting } from '@/lib/site-data'
import { IntelligenceFrame } from '@/components/intelligence-view'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function IntelligencePreview() {
  const [activeId, setActiveId] = useState<string>(reporting.metrics[0]!.id)
  const rootRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const frame = frameRef.current
      const rule = ruleRef.current
      if (!root || !frame || !rule) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(rule, { scaleX: 1 })
        return
      }

      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })
      ScrollTrigger.create({
        trigger: frame,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(rule, { scaleX: 1, duration: 0.55, ease: 'power2.out', overwrite: 'auto' })
        },
      })
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef}>
      <IntelligenceFrame
        activeId={activeId}
        onSelect={setActiveId}
        frameRef={frameRef}
        ruleRef={ruleRef}
      />
    </div>
  )
}
