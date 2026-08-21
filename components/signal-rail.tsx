'use client'

import { useLayoutEffect, useRef, type CSSProperties } from 'react'

const TOTAL = 7

const chapters = [
  {
    step: 1,
    label: 'Buyer Questions to Inventory',
    anchors: ['platforms'],
    color: 'var(--accent)',
    surface: 'paper',
  },
  {
    step: 2,
    label: 'One System · Three Jobs',
    anchors: ['capabilities'],
    color: 'var(--ink)',
    surface: 'paper',
  },
  {
    step: 3,
    label: 'Authority Experience',
    anchors: ['authority-experiences'],
    color: 'var(--accent)',
    surface: 'stage',
  },
  {
    step: 4,
    label: 'Intelligence',
    anchors: ['reporting'],
    color: 'var(--proof)',
    surface: 'stage',
  },
  {
    step: 5,
    label: 'Measurement',
    anchors: ['measurement', 'how-it-works'],
    color: 'var(--ink)',
    surface: 'paper',
  },
  {
    step: 6,
    label: 'Engagement',
    anchors: ['engagement'],
    color: 'var(--ink)',
    surface: 'paper',
  },
  {
    step: 7,
    label: 'Opportunity Review',
    anchors: ['opportunity-review'],
    color: 'var(--action)',
    surface: 'stage',
  },
] as const

function widthFor(step: number) {
  return step >= TOTAL ? 100 : (step / TOTAL) * 100
}

export function SignalRail({ step }: { step: 1 | 2 | 3 | 4 | 5 | 6 | 7 }) {
  const chapter = chapters[step - 1]
  const rootRef = useRef<HTMLDivElement>(null)
  const to = widthFor(step)
  const from = step === 1 ? 0 : widthFor(step - 1)
  const counter = `${String(step).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`

  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el || !chapter) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hash = window.location.hash.replace('#', '')
    const landedOnChapter = (chapter.anchors as readonly string[]).includes(hash)
    if (reduced || landedOnChapter) return

    el.classList.add('is-pending')

    const target = el.closest('section') ?? el
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        el.classList.remove('is-pending')
        el.classList.add('is-in')
        io.disconnect()
      },
      { threshold: 0.18, rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(target)
    return () => io.disconnect()
  }, [chapter, step])

  if (!chapter) return null

  return (
    <div
      ref={rootRef}
      className={`journey-rail journey-${chapter.surface}`}
      style={
        {
          '--journey-from': `${from}%`,
          '--journey-to': `${to}%`,
          '--journey-color': chapter.color,
        } as CSSProperties
      }
    >
      <p className="sr-only">{`Chapter ${step} of ${TOTAL}: ${chapter.label}`}</p>
      <div className="journey-track" aria-hidden="true">
        <span className="journey-rest" />
        <span className="journey-fill">
          <span className="journey-station" />
        </span>
      </div>
      <span className="journey-count font-mono" aria-hidden="true">
        {counter}
      </span>
    </div>
  )
}
