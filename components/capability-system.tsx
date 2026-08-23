'use client'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { capabilitySystem } from '@/lib/site-data'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const jobs = capabilitySystem.capabilities
const tones = ['accent', 'proof', 'action'] as const

function fitAdventureLine(root: HTMLElement, voyage: HTMLElement, svg: SVGSVGElement, run: SVGPathElement) {
  const w = root.clientWidth
  const h = root.clientHeight
  if (w < 8 || h < 8) return []

  svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  const box = root.getBoundingClientRect()
  const pins = [...voyage.querySelectorAll<HTMLElement>('.cap-pin')]
  const stations = pins.map((pin) => {
    const r = pin.getBoundingClientRect()
    return {
      x: r.left + r.width / 2 - box.left,
      y: r.top + r.height / 2 - box.top,
    }
  })
  const x = stations.length
    ? stations.reduce((sum, station) => sum + station.x, 0) / stations.length
    : w / 2
  const bow = Math.min(36, w * 0.03)
  const wide = window.matchMedia('(min-width: 1024px)').matches
  const voyageBox = voyage.getBoundingClientRect()
  const startY = wide ? 0 : Math.max(0, voyageBox.top - box.top)
  const endY = wide ? h : Math.min(h, voyageBox.bottom - box.top)
  const points = [{ x, y: startY }, ...stations, { x, y: endY }]

  let d = `M ${points[0]!.x.toFixed(1)} ${points[0]!.y.toFixed(1)}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!
    const curr = points[i]!
    const midY = (prev.y + curr.y) / 2
    const swing = i % 2 === 0 ? bow : -bow
    d += ` C ${(prev.x + swing).toFixed(1)} ${midY.toFixed(1)}, ${(curr.x - swing).toFixed(1)} ${midY.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`
  }

  run.setAttribute('d', d)
  svg.querySelector('.cap-path-track')?.setAttribute('d', d)
  svg.querySelector('.cap-path-glide')?.setAttribute('d', d)
  return stations
}

/** GSAP scrub only. Markup lives in the RSC CapabilityView. */
export function CapabilitySystem() {
  useGSAP(() => {
    const root = document.getElementById('capabilities')
    const voyage = root?.querySelector<HTMLElement>('.cap-voyage')
    if (!root || !voyage) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const played = new Set<string>()
    const svg = root.querySelector<SVGSVGElement>('.cap-path')
    const run = root.querySelector<SVGPathElement>('.cap-path-run')
    const glide = root.querySelector<SVGPathElement>('.cap-path-glide')
    const tip = root.querySelector<SVGGElement>('.cap-path-tip')
    const stops = voyage.querySelectorAll<HTMLElement>('.cap-stop')

    let lastBox = ''
    let progress = 0
    let armed = false
    let activeIndex = -1
    let stations: { x: number; y: number }[] = []
    let runLength = 0

    const playIllustration = (id: string, instant = false) => {
      const wrap = voyage.querySelector<HTMLElement>(`[data-cap-ill="${id}"]`)
      if (!wrap) return
      const paths = wrap.querySelectorAll<SVGElement>('.cap-ill-path')
      const bars = wrap.querySelectorAll<SVGElement>('.cap-ill-bar')
      const nodes = wrap.querySelectorAll<SVGElement>('.cap-ill-node')
      const ends = wrap.querySelectorAll<SVGElement>('.cap-ill-end')
      const skipGrow = instant || reduced || played.has(id) || id === 'track-matters'
      if (skipGrow) {
        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 0 })
        gsap.set(bars, { scaleY: 1, transformOrigin: '50% 100%' })
        gsap.set(nodes, { scale: 1, transformOrigin: '50% 50%', transformBox: 'fill-box' })
        gsap.set(ends, { scale: 1, transformOrigin: '50% 50%', transformBox: 'fill-box' })
        played.add(id)
        return
      }
      played.add(id)
      if (paths.length) {
        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
        gsap.to(paths, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
      }
      if (ends.length) {
        gsap.fromTo(
          ends,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.2,
            delay: 0.32,
            ease: 'power2.out',
            transformOrigin: '50% 50%',
            transformBox: 'fill-box',
            overwrite: 'auto',
          },
        )
      }
      if (bars.length) {
        gsap.fromTo(
          bars,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 0.38,
            stagger: 0.05,
            ease: 'power2.out',
            transformOrigin: '50% 100%',
            overwrite: 'auto',
          },
        )
      }
    }

    const setActive = (index: number) => {
      const i = Math.max(0, Math.min(stops.length - 1, index))
      if (i === activeIndex) return
      activeIndex = i
      stops.forEach((stop, n) => stop.classList.toggle('is-on', n === i))
      const tone = tones[i]
      const job = jobs[i]
      if (tone) {
        voyage.dataset.tone = tone
        root.dataset.tone = tone
      }
      if (job) playIllustration(job.id)
    }

    const activateFromProgress = (p: number, atY?: number) => {
      if (!stations.length) {
        setActive(Math.min(stops.length - 1, Math.floor(p * stops.length)))
        return
      }
      const y = atY ?? stations[0]!.y + p * (stations[stations.length - 1]!.y - stations[0]!.y)
      let best = 0
      let bestDist = Infinity
      stations.forEach((station, i) => {
        const dist = Math.abs(station.y - y)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActive(best)
    }

    const paintTravel = (p: number) => {
      progress = Math.max(0, Math.min(1, p))
      if (!reduced) {
        if (run) run.style.strokeDashoffset = String(1 - progress)
        if (glide) glide.style.strokeDashoffset = String(-progress)
      }
      if (run && tip) {
        const len = runLength
        if (len > 0) {
          const at = run.getPointAtLength(progress * len)
          tip.setAttribute('transform', `translate(${at.x} ${at.y})`)
          activateFromProgress(progress, at.y)
        } else {
          activateFromProgress(progress)
        }
      } else {
        activateFromProgress(progress)
      }
    }

    const fit = () => {
      if (!svg || !run) return
      const key = `${root.clientWidth}x${root.clientHeight}`
      const boxChanged = key !== lastBox
      if (boxChanged) {
        lastBox = key
        stations = fitAdventureLine(root, voyage, svg, run)
        runLength = run.getTotalLength()
      }
      paintTravel(progress)
      svg.classList.add('is-ready')
      if (armed && boxChanged) ScrollTrigger.refresh()
    }

    if (run) {
      run.style.strokeDasharray = '1'
      run.style.strokeDashoffset = reduced ? '0' : '1'
    }
    if (glide) {
      glide.style.strokeDasharray = '0.12 1'
      glide.style.strokeDashoffset = reduced ? '0' : '0'
    }

    const alreadyOnScreen = voyage.getBoundingClientRect().top < window.innerHeight
    playIllustration(jobs[0]!.id, alreadyOnScreen || reduced)

    const ro = new ResizeObserver(fit)
    requestAnimationFrame(() => {
      lastBox = ''
      fit()
      ScrollTrigger.create({
        trigger: root,
        start: 'top 80%',
        end: 'bottom 12%',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          paintTravel(self.progress)
        },
        onRefresh: (self) => {
          paintTravel(self.progress)
        },
      })
      armed = true
      ro.observe(root)
    })

    return () => ro.disconnect()
  })

  return null
}
