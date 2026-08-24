'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { platformCredibility } from '@/lib/platform-data'
import { discoveryToInventory } from '@/lib/site-data'

const websiteMarks =
  platformCredibility.categories.find((category) => category.id === 'website')?.marks ?? []

const disciplines = discoveryToInventory.disciplines
const events = discoveryToInventory.events

type NodeId = 'site' | (typeof disciplines)[number]['id'] | (typeof events)[number]['id']

const LINKS: { from: NodeId; to: NodeId; kind: 'trunk' | 'fan' | 'cross' }[] = [
  { from: 'site', to: 'seo', kind: 'trunk' },
  { from: 'site', to: 'aeo', kind: 'trunk' },
  { from: 'site', to: 'geo', kind: 'trunk' },
  { from: 'seo', to: 'vsrp', kind: 'fan' },
  { from: 'seo', to: 'vdp', kind: 'fan' },
  { from: 'aeo', to: 'form', kind: 'fan' },
  { from: 'aeo', to: 'chat', kind: 'fan' },
  { from: 'geo', to: 'call', kind: 'fan' },
  { from: 'geo', to: 'lead', kind: 'fan' },
  { from: 'seo', to: 'aeo', kind: 'cross' },
  { from: 'aeo', to: 'geo', kind: 'cross' },
  { from: 'seo', to: 'form', kind: 'cross' },
  { from: 'aeo', to: 'vdp', kind: 'cross' },
  { from: 'aeo', to: 'call', kind: 'cross' },
  { from: 'geo', to: 'chat', kind: 'cross' },
  { from: 'vsrp', to: 'form', kind: 'cross' },
  { from: 'vdp', to: 'chat', kind: 'cross' },
  { from: 'form', to: 'call', kind: 'cross' },
]

const TONE_BY_NODE: Record<string, 'accent' | 'proof' | 'action'> = {
  seo: 'accent',
  aeo: 'proof',
  geo: 'action',
  vsrp: 'accent',
  vdp: 'accent',
  form: 'proof',
  chat: 'proof',
  call: 'action',
  lead: 'action',
}

type Point = { x: number; y: number }

function strandPath(a: Point, b: Point) {
  const dx = Math.abs(b.x - a.x)
  const dy = Math.abs(b.y - a.y)
  if (dx > dy) {
    const midX = (a.x + b.x) / 2
    const lift = Math.min(22, dx * 0.16)
    return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${midX.toFixed(1)} ${((a.y + b.y) / 2 - lift).toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
  }
  const midY = (a.y + b.y) / 2
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${a.x.toFixed(1)} ${midY.toFixed(1)}, ${b.x.toFixed(1)} ${midY.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}

function fitStrands(root: HTMLElement, svg: SVGSVGElement) {
  const w = root.clientWidth
  const h = root.clientHeight
  if (w < 8 || h < 8) return

  const box = root.getBoundingClientRect()
  const nodes = new Map<string, Point>()
  root.querySelectorAll<HTMLElement>('[data-node]').forEach((el) => {
    const id = el.dataset.node
    if (!id) return
    const r = el.getBoundingClientRect()
    nodes.set(id, {
      x: r.left + r.width / 2 - box.left,
      y: r.top + r.height / 2 - box.top,
    })
  })
  const next = [...svg.querySelectorAll<SVGPathElement>('[data-from]')].map((path) => {
    const from = nodes.get(path.dataset.from ?? '')
    const to = nodes.get(path.dataset.to ?? '')
    return { path, d: from && to ? strandPath(from, to) : null }
  })

  svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  for (const { path, d } of next) {
    if (d) path.setAttribute('d', d)
  }
}

function neighborsOf(id: NodeId) {
  const next = new Set<NodeId>([id])
  for (const link of LINKS) {
    if (link.from === id) next.add(link.to)
    if (link.to === id) next.add(link.from)
  }
  return next
}

/**
 * 1 / 3 / 6 webbing: named dealer platforms, SEO / AEO / GEO, then the
 * six actions a GM can actually read. Strands are fitted to node centers.
 */
export function QtiWeb() {
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [lit, setLit] = useState<NodeId | null>(null)
  const litNodes = lit ? neighborsOf(lit) : null

  const paint = useCallback(() => {
    const root = rootRef.current
    const svg = svgRef.current
    if (root && svg) fitStrands(root, svg)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let live = false
    const markLive = () => {
      if (live) return
      live = true
      root.classList.add('is-live')
    }

    const start = () => {
      paint()
      if (reduced.matches) {
        markLive()
        return
      }
      requestAnimationFrame(() => {
        paint()
        requestAnimationFrame(markLive)
      })
    }

    if (reduced.matches) {
      paint()
      markLive()
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start()
      },
      { threshold: 0.12 },
    )
    io.observe(root)

    const box = root.getBoundingClientRect()
    if (box.top < window.innerHeight && box.bottom > 0) start()

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(paint)
    })
    ro.observe(root)

    const onMotion = () => {
      if (reduced.matches) markLive()
    }
    reduced.addEventListener('change', onMotion)

    return () => {
      io.disconnect()
      ro.disconnect()
      reduced.removeEventListener('change', onMotion)
    }
  }, [paint])

  return (
    <div
      ref={rootRef}
      className="qti-web"
      data-lit={lit ?? undefined}
      onPointerLeave={() => setLit(null)}
    >
      <svg ref={svgRef} className="qti-web-svg" aria-hidden="true">
        {LINKS.map((link) => (
          <path
            key={`${link.from}-${link.to}`}
            className="qti-web-strand"
            data-from={link.from}
            data-to={link.to}
            data-kind={link.kind}
            data-tone={TONE_BY_NODE[link.to] ?? 'accent'}
            data-lit={lit && (link.from === lit || link.to === lit) ? '' : undefined}
            pathLength={1}
          />
        ))}
      </svg>

      <div className="qti-web-row" data-row="platforms">
        <p className="qti-web-strategy">
          {discoveryToInventory.platforms.lockup.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </p>
        <div
          className="qti-web-site"
          data-node="site"
          data-lit={litNodes?.has('site') ? '' : undefined}
          tabIndex={0}
          onPointerEnter={() => setLit('site')}
          onFocus={() => setLit('site')}
          onBlur={() => setLit(null)}
        >
          <ul className="qti-wordmarks" aria-label="Website platforms Authomotive works with">
            {websiteMarks.map((mark) => (
              <li key={mark.id} className="qti-wordmark">
                {mark.name}
              </li>
            ))}
          </ul>
          <p className="qti-web-site-line">{discoveryToInventory.platforms.line}</p>
        </div>
      </div>

      <ul className="qti-web-row" data-row="disciplines" aria-label="Strategy layer Authomotive adds">
        {disciplines.map((discipline) => (
          <li key={discipline.id}>
            <div
              className="qti-web-chip"
              data-node={discipline.id}
              data-tone={discipline.tone}
              data-lit={litNodes?.has(discipline.id) ? '' : undefined}
              tabIndex={0}
              onPointerEnter={() => setLit(discipline.id)}
              onFocus={() => setLit(discipline.id)}
              onBlur={() => setLit(null)}
            >
              <p className="qti-web-chip-label">{discipline.label}</p>
              <p className="qti-web-chip-line">{discipline.line}</p>
            </div>
          </li>
        ))}
      </ul>

      <ul className="qti-web-row" data-row="events" aria-label="Actions the dealership can read">
        {events.map((event) => {
          const tone = TONE_BY_NODE[event.id] ?? 'accent'
          return (
            <li key={event.id}>
              <div
                className="qti-web-event"
                data-node={event.id}
                data-tone={tone}
                data-lit={litNodes?.has(event.id) ? '' : undefined}
                tabIndex={0}
                onPointerEnter={() => setLit(event.id)}
                onFocus={() => setLit(event.id)}
                onBlur={() => setLit(null)}
              >
                {event.label}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
