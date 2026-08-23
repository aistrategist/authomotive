'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const TOP = 11
const BOTTOM = 44

function buildGrid(width: number, height: number) {
  if (width < 8 || height < 8) return { vertical: '', horizontal: '' }

  const scale = BOTTOM / TOP
  const mid = width / 2
  const extra = 3
  const cols = Math.ceil(width / TOP) + extra * 2
  const startX = ((width % TOP) / 2) - extra * TOP

  let vertical = ''
  for (let i = 0; i < cols; i += 1) {
    const x0 = startX + i * TOP
    const x1 = mid + (x0 - mid) * scale
    vertical += `M${x0.toFixed(1)} 0 L${x1.toFixed(1)} ${height} `
  }

  let horizontal = ''
  let y = 0
  let guard = 0
  while (y <= height + 0.5 && guard < 400) {
    horizontal += `M0 ${y.toFixed(1)} L${width} ${y.toFixed(1)} `
    const size = TOP + ((BOTTOM - TOP) * y) / height
    y += Math.max(size, TOP)
    guard += 1
  }

  return { vertical, horizontal }
}

/**
 * Growing graph for the Discovery chapter. Same path is drawn twice:
 * ink on paper, white only over the three living color blooms.
 */
export function QtiScaleGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const host = el.closest('.qti-bloom-host')

    let visible = true
    const measure = () => {
      if (!visible) return
      const next = { w: Math.round(el.clientWidth), h: Math.round(el.clientHeight) }
      setBox((prev) => (prev.w === next.w && prev.h === next.h ? prev : next))
    }
    const schedule = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(measure, { timeout: 180 })
      } else {
        requestAnimationFrame(measure)
      }
    }
    schedule()

    const ro = new ResizeObserver(schedule)
    ro.observe(el)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting)
        host?.classList.toggle('is-paused', !visible || document.hidden)
        if (visible) schedule()
      },
      { rootMargin: '80px 0px', threshold: 0.01 },
    )
    io.observe(host ?? el)

    const onVisibility = () => {
      host?.classList.toggle('is-paused', document.hidden || !visible)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const paths = useMemo(() => buildGrid(box.w, box.h), [box])

  const frame = box.w > 0 && box.h > 0

  return (
    <div ref={ref} className="qti-grid" aria-hidden="true">
      {frame ? (
        <>
          <svg
            className="qti-grid-svg qti-grid-ink"
            viewBox={`0 0 ${box.w} ${box.h}`}
            width={box.w}
            height={box.h}
          >
            <path className="qti-grid-line" d={paths.vertical} />
            <path className="qti-grid-line" d={paths.horizontal} />
          </svg>
          <svg
            className="qti-grid-svg qti-grid-snow"
            viewBox={`0 0 ${box.w} ${box.h}`}
            width={box.w}
            height={box.h}
          >
            <path className="qti-grid-line" d={paths.vertical} />
            <path className="qti-grid-line" d={paths.horizontal} />
          </svg>
        </>
      ) : null}
    </div>
  )
}
