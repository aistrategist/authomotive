'use client'

import { useEffect } from 'react'

const LINKS: { from: string; to: string }[] = [
  { from: 'site', to: 'seo' },
  { from: 'site', to: 'aeo' },
  { from: 'site', to: 'geo' },
  { from: 'seo', to: 'vsrp' },
  { from: 'seo', to: 'vdp' },
  { from: 'aeo', to: 'form' },
  { from: 'aeo', to: 'chat' },
  { from: 'geo', to: 'call' },
  { from: 'geo', to: 'lead' },
  { from: 'seo', to: 'aeo' },
  { from: 'aeo', to: 'geo' },
  { from: 'seo', to: 'form' },
  { from: 'aeo', to: 'vdp' },
  { from: 'aeo', to: 'call' },
  { from: 'geo', to: 'chat' },
  { from: 'vsrp', to: 'form' },
  { from: 'vdp', to: 'chat' },
  { from: 'form', to: 'call' },
]

const QTI_HASHES = ['platforms', 'question-to-inventory-heading']

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

function neighborsOf(id: string) {
  const next = new Set<string>([id])
  for (const link of LINKS) {
    if (link.from === id) next.add(link.to)
    if (link.to === id) next.add(link.from)
  }
  return next
}

function isDeepLinked() {
  const hash = window.location.hash.replace(/^#/, '')
  return QTI_HASHES.includes(hash)
}

function hasUserMoved() {
  return window.scrollY > 8
}

function applyLit(root: HTMLElement, id: string | null) {
  if (id) root.setAttribute('data-lit', id)
  else root.removeAttribute('data-lit')

  const lit = id ? neighborsOf(id) : null
  root.querySelectorAll<HTMLElement>('[data-node]').forEach((el) => {
    const nid = el.dataset.node
    if (nid && lit?.has(nid)) el.setAttribute('data-lit', '')
    else el.removeAttribute('data-lit')
  })
  root.querySelectorAll<SVGPathElement>('.qti-web-strand').forEach((path) => {
    const from = path.dataset.from
    const to = path.dataset.to
    if (id && (from === id || to === id)) path.setAttribute('data-lit', '')
    else path.removeAttribute('data-lit')
  })
}

/**
 * Tiny interaction/layout controller. Static webbing is server-rendered.
 */
export function QtiWeb() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.qti-web')
    const svg = root?.querySelector<SVGSVGElement>('.qti-web-svg')
    if (!root || !svg) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let live = false
    let started = false
    let ro: ResizeObserver | null = null

    const markLive = () => {
      if (live) return
      live = true
      root.classList.add('is-live')
    }

    const paint = () => {
      fitStrands(root, svg)
    }

    const start = () => {
      if (started) return
      started = true
      paint()
      if (reduced.matches) {
        markLive()
      } else {
        requestAnimationFrame(markLive)
      }
      ro = new ResizeObserver(() => {
        requestAnimationFrame(paint)
      })
      ro.observe(root)
    }

    const mayStart = () => isDeepLinked() || hasUserMoved()

    const onInteract = (event: Event) => {
      const node = event.target
      if (!(node instanceof Element)) return
      const host = node.closest<HTMLElement>('[data-node]')
      if (!host || !root.contains(host)) return
      start()
      const id = host.dataset.node
      if (event.type === 'pointerleave' || event.type === 'blur') {
        if (!root.contains(document.activeElement) && !root.matches(':hover')) applyLit(root, null)
        return
      }
      if (id) applyLit(root, id)
    }

    root.addEventListener('pointerenter', onInteract, true)
    root.addEventListener('focusin', onInteract)
    root.addEventListener('pointerleave', () => applyLit(root, null))
    root.addEventListener('focusout', (event) => {
      const next = event.relatedTarget
      if (next instanceof Node && root.contains(next)) return
      applyLit(root, null)
    })

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        if (!mayStart()) return
        start()
        io.disconnect()
      },
      { threshold: 0.35, rootMargin: '0px' },
    )
    io.observe(root)

    const onMove = () => {
      if (!mayStart()) return
      const box = root.getBoundingClientRect()
      const approaching = box.top < window.innerHeight * 0.92 && box.bottom > window.innerHeight * 0.08
      if (approaching || isDeepLinked()) {
        start()
        window.removeEventListener('scroll', onMove)
        window.removeEventListener('hashchange', onMove)
      }
    }

    if (isDeepLinked()) start()
    window.addEventListener('scroll', onMove, { passive: true })
    window.addEventListener('hashchange', onMove)

    const onMotion = () => {
      if (reduced.matches) markLive()
    }
    reduced.addEventListener('change', onMotion)

    return () => {
      io.disconnect()
      ro?.disconnect()
      window.removeEventListener('scroll', onMove)
      window.removeEventListener('hashchange', onMove)
      reduced.removeEventListener('change', onMotion)
      root.removeEventListener('pointerenter', onInteract, true)
      root.removeEventListener('focusin', onInteract)
    }
  }, [])

  return null
}
