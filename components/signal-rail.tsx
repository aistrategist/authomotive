'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

const TOTAL = 7

const chapters = [
  {
    step: 1,
    title: 'Turn Questions Into Inventory',
    label: 'Buyer Questions to Inventory',
    anchors: ['platforms'],
    color: 'var(--accent-deep)',
    rest: 'color-mix(in srgb, var(--accent) 28%, #fff)',
    seam: 'light',
  },
  {
    step: 2,
    title: 'Connect The Whole System',
    label: 'One System · Three Jobs',
    anchors: ['capabilities'],
    color: 'var(--proof-deep)',
    rest: 'color-mix(in srgb, var(--proof) 28%, #fff)',
    seam: 'light',
  },
  {
    step: 3,
    title: 'Guide Better Buyer Decisions',
    label: 'Authority Experience',
    anchors: ['authority-experiences'],
    color: 'var(--accent)',
    rest: 'var(--alloy)',
    seam: 'light',
  },
  {
    step: 4,
    title: 'Know What Changed',
    label: 'Intelligence',
    anchors: ['reporting'],
    color: 'var(--proof)',
    rest: 'var(--action-soft)',
    seam: 'light',
  },
  {
    step: 5,
    title: 'Track What Matters',
    label: 'Measurement',
    anchors: ['measurement', 'how-it-works'],
    color: 'var(--action)',
    rest: 'var(--ink)',
    seam: 'dark',
  },
  {
    step: 6,
    title: 'Decide What Comes Next',
    label: 'Engagement',
    anchors: ['engagement'],
    color: 'var(--ink)',
    rest: 'var(--porcelain)',
    seam: 'light',
  },
  {
    step: 7,
    title: 'Find Your Opportunity',
    label: 'Opportunity Review',
    anchors: ['opportunity-review'],
    color: 'var(--action)',
    rest: 'var(--alloy)',
    seam: 'light',
  },
] as const

function progressFor(step: number) {
  return step >= TOTAL ? 1 : step / TOTAL
}

export function SignalRail({ step }: { step: 1 | 2 | 3 | 4 | 5 | 6 | 7 }) {
  const chapter = chapters[step - 1]
  const rootRef = useRef<HTMLDivElement>(null)
  const to = progressFor(step)
  const from = step === 1 ? 0 : progressFor(step - 1)
  const counter = `${String(step).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`

  useEffect(() => {
    const root = rootRef.current
    if (!root || !chapter) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hash = window.location.hash.replace('#', '')
    const landedOnChapter = (chapter.anchors as readonly string[]).includes(hash)
    if (reduced || landedOnChapter) {
      root.classList.add('is-in')
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        root.classList.add('is-in')
        io.disconnect()
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0.01 },
    )
    io.observe(root.closest('section') ?? root)
    return () => io.disconnect()
  }, [chapter])

  if (!chapter) return null

  return (
    <div
      ref={rootRef}
      className="journey-rail"
      data-seam={chapter.seam}
      style={
        {
          '--journey-from': from,
          '--journey-to': to,
          '--journey-color': chapter.color,
          '--journey-rest': chapter.rest,
        } as CSSProperties
      }
    >
      <p className="sr-only">{`Chapter ${step} of ${TOTAL}: ${chapter.label}`}</p>
      <div className="journey-track" aria-hidden="true">
        <span className="journey-rest" />
        <span className="journey-fill" />
      </div>
      <div className="journey-row" aria-hidden="true">
        <span className="journey-title font-mono">{chapter.title}</span>
        <span className="journey-meter">
          <span className="journey-dots">
            {Array.from({ length: TOTAL }, (_, i) => {
              const on = i < step
              const live = i === step - 1
              return (
                <i
                  key={i}
                  className={`journey-dot${on ? ' is-on' : ''}${live ? ' is-live' : ''}`}
                />
              )
            })}
          </span>
          <span className="journey-count font-mono">{counter}</span>
        </span>
      </div>
    </div>
  )
}
