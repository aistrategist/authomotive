'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { capabilitySystem } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const jobs = capabilitySystem.capabilities
const tones = ['accent', 'proof', 'action'] as const

type JobTone = (typeof tones)[number]

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

function JobMotif({ id, tone }: { id: string; tone: JobTone }) {
  const stroke =
    tone === 'proof' ? 'var(--proof-deep)' : tone === 'action' ? 'var(--action-deep)' : 'var(--accent-deep)'
  const mark = tone === 'proof' ? 'var(--proof)' : tone === 'action' ? 'var(--action)' : 'var(--accent)'

  if (id === 'get-found') {
    return (
      <svg className="cap-motif" viewBox="0 0 56 40" fill="none" aria-hidden="true">
        <path
          className="cap-ill-path"
          pathLength={1}
          d="M4 34 L13 22 L19 27 L29 11 L35 17 L48 6"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="4" cy="34" r="3" fill={mark} />
        <circle className="cap-ill-end" cx="48" cy="6" r="3" fill={stroke} />
      </svg>
    )
  }
  if (id === 'know-working') {
    return (
      <svg className="cap-motif" viewBox="0 0 56 40" fill="none" aria-hidden="true">
        {[10, 16, 14, 22, 28].map((h, i) => (
          <rect
            key={i}
            className="cap-ill-bar"
            x={6 + i * 10}
            y={36 - h}
            width="6"
            height={h}
            fill={i === 4 ? mark : stroke}
            opacity={i === 4 ? 1 : 0.45}
          />
        ))}
      </svg>
    )
  }
  return (
    <svg className="cap-motif" viewBox="0 0 56 40" fill="none" aria-hidden="true">
      <path className="cap-ill-path" pathLength={1} d="M6 20 H50" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <circle className="cap-ill-node" cx="8" cy="20" r="4" fill={stroke} />
      <circle className="cap-ill-node" cx="28" cy="20" r="4" fill={mark} />
      <circle className="cap-ill-node" cx="48" cy="20" r="4" fill={stroke} />
    </svg>
  )
}

export function CapabilitySystem() {
  const rootRef = useRef<HTMLElement>(null)
  const voyageRef = useRef<HTMLDivElement>(null)
  const playedRef = useRef(new Set<string>())

  useGSAP(
    () => {
      const root = rootRef.current
      const voyage = voyageRef.current
      if (!root || !voyage) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const played = playedRef.current
      const svg = root.querySelector<SVGSVGElement>('.cap-path')
      const run = root.querySelector<SVGPathElement>('.cap-path-run')
      const glide = root.querySelector<SVGPathElement>('.cap-path-glide')
      const tip = root.querySelector<SVGCircleElement>('.cap-path-tip')
      const halo = root.querySelector<SVGCircleElement>('.cap-path-halo')
      const stops = voyage.querySelectorAll<HTMLElement>('.cap-stop')

      let lastBox = ''
      let progress = 0
      let armed = false
      let activeIndex = -1
      let stations: { x: number; y: number }[] = []

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
          const len = run.getTotalLength()
          if (len > 0) {
            const at = run.getPointAtLength(progress * len)
            tip.setAttribute('cx', String(at.x))
            tip.setAttribute('cy', String(at.y))
            halo?.setAttribute('cx', String(at.x))
            halo?.setAttribute('cy', String(at.y))
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
        if (key !== lastBox) {
          lastBox = key
          stations = fitAdventureLine(root, voyage, svg, run)
        }
        paintTravel(progress)
        svg.classList.add('is-ready')
        if (armed) ScrollTrigger.refresh()
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
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="cap-band scroll-mt-24 overflow-x-clip border-b border-border"
      data-tone="accent"
    >
      <svg className="cap-path" viewBox="0 0 100 800" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="cap-path-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent-deep)" />
            <stop offset="0.5" stopColor="var(--proof-deep)" />
            <stop offset="1" stopColor="var(--action-deep)" />
          </linearGradient>
        </defs>
        <path className="cap-path-track" d="M50 0 V800" fill="none" strokeLinecap="round" />
        <path
          className="cap-path-run"
          pathLength={1}
          d="M50 0 V800"
          fill="none"
          stroke="url(#cap-path-grad)"
          strokeLinecap="round"
        />
        <path
          className="cap-path-glide"
          pathLength={1}
          d="M50 0 V800"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        />
        <circle className="cap-path-halo" r="12" />
        <circle className="cap-path-tip" r="5.5" />
      </svg>
      <SignalRail step={2} />
      <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <div className="max-w-[40rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-proof-deep">
            {capabilitySystem.eyebrow}
          </p>
          <h2
            id="capabilities-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {capabilitySystem.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
            {capabilitySystem.supporting}
          </p>
          <p className="mt-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink/55">
            {capabilitySystem.motto}
          </p>
        </div>

        <div ref={voyageRef} className="cap-voyage mt-10 md:mt-14" data-tone="accent">
          {jobs.map((job, i) => {
            const tone = tones[i] ?? 'accent'
            const side = i % 2 === 0 ? 'right' : 'left'
            return (
              <article
                key={job.id}
                className={`cap-stop${i === 0 ? ' is-on' : ''}`}
                data-tone={tone}
                data-side={side}
                data-job={job.id}
              >
                <span className="cap-pin" />
                <div className="cap-tick">
                  <p className="cap-index">{String(i + 1).padStart(2, '0')}</p>
                  <span data-cap-ill={job.id} className="cap-motif-wrap" aria-hidden="true">
                    <JobMotif id={job.id} tone={tone} />
                  </span>
                </div>
                <div className="cap-card">
                  <p className="cap-card-verb">{job.verb}</p>
                  <h3 className="cap-card-name">{job.brandedName}</h3>
                  <p className="cap-card-line">{job.line}</p>
                  <ul className="cap-proofs">
                    {job.proofs.map((proof) => (
                      <li key={proof}>
                        <span className="cap-dot" aria-hidden="true" />
                        {proof}
                      </li>
                    ))}
                  </ul>
                  <a href={job.nextHref} className="cap-dock">
                    {job.nextLabel}
                    <span className="cap-dock-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
