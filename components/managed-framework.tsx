'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { managedFramework } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const phaseClass = {
  between: 'is-between',
  during: 'is-during',
  after: 'is-after',
  lead: 'is-lead',
} as const

export function ManagedFramework() {
  const { leadInset, collab } = managedFramework
  const rootRef = useRef<HTMLElement>(null)
  const docRef = useRef<HTMLElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const agendaRef = useRef<HTMLOListElement>(null)
  const packetRef = useRef<HTMLSpanElement>(null)
  const leadRef = useRef<HTMLElement>(null)
  const leadStationRef = useRef<HTMLSpanElement>(null)
  const collabLineRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const doc = docRef.current
      const rule = ruleRef.current
      const agenda = agendaRef.current
      const packet = packetRef.current
      const lead = leadRef.current
      const leadStation = leadStationRef.current
      const collabLine = collabLineRef.current
      if (!root || !doc || !rule || !agenda || !packet || !lead || !leadStation || !collabLine) return

      const phases = gsap.utils.toArray<HTMLElement>('.mf-phase', root)
      const stations = gsap.utils.toArray<HTMLElement>('.mf-station', root)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const desktop = () => window.matchMedia('(min-width: 1024px)').matches

      const packetXY = (target: HTMLElement, pinToRoute = false) => {
        const d = doc.getBoundingClientRect()
        const r = target.getBoundingClientRect()
        const a = agenda.getBoundingClientRect()
        const x = r.left + r.width / 2 - d.left - 5
        const y = pinToRoute && desktop()
          ? a.top - d.top + 10
          : r.top + r.height / 2 - d.top - 5
        return { x, y }
      }

      const paintPacket = (phase: keyof typeof phaseClass) => {
        packet.classList.remove('is-between', 'is-during', 'is-after', 'is-lead')
        packet.classList.add(phaseClass[phase])
      }

      const complete = () => {
        gsap.set(rule, { scaleX: 1 })
        phases.forEach((el) => el.classList.add('is-on'))
        lead.classList.add('is-on')
        if (!desktop()) {
          gsap.set(packet, { autoAlpha: 0 })
          gsap.set(collabLine, { scaleY: 1, scaleX: 1 })
          return
        }
        gsap.set(collabLine, { scaleX: 1 })
        const end = packetXY(leadStation)
        paintPacket('lead')
        gsap.set(packet, { autoAlpha: 1, x: end.x, y: end.y })
      }

      const settlePacket = () => {
        if (!root.dataset.mfPlayed || !desktop()) return
        const end = packetXY(leadStation)
        gsap.set(packet, { x: end.x, y: end.y })
      }

      window.addEventListener('resize', settlePacket)

      if (reduced) {
        complete()
        root.dataset.mfPlayed = '1'
        return () => window.removeEventListener('resize', settlePacket)
      }

      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(packet, { autoAlpha: 0 })
      const verticalCollab = !desktop()
      gsap.set(collabLine, {
        transformOrigin: verticalCollab ? 'top center' : 'left center',
        scaleX: verticalCollab ? 1 : 0,
        scaleY: verticalCollab ? 0 : 1,
      })

      ScrollTrigger.create({
        trigger: doc,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          const usePacket = desktop() && stations.length === 3
          const tl = gsap.timeline({
            defaults: { ease: 'power2.out' },
            onComplete: () => {
              root.dataset.mfPlayed = '1'
            },
          })

          tl.to(rule, { scaleX: 1, duration: 0.5 }, 0)
          tl.add(() => phases[0]?.classList.add('is-on'), 0.04)

          if (usePacket) {
            const start = packetXY(stations[0]!, true)
            paintPacket('between')
            gsap.set(packet, { autoAlpha: 1, x: start.x, y: start.y })

            tl.to(
              packet,
              {
                ...packetXY(stations[1]!, true),
                duration: 0.48,
                ease: 'power2.inOut',
                onStart: () => paintPacket('during'),
              },
              0.28,
            )
            tl.add(() => phases[1]?.classList.add('is-on'), 0.76)
            tl.to(
              packet,
              {
                ...packetXY(stations[2]!, true),
                duration: 0.48,
                ease: 'power2.inOut',
                onStart: () => paintPacket('after'),
              },
              0.9,
            )
            tl.add(() => phases[2]?.classList.add('is-on'), 1.38)
            const leadPos = packetXY(leadStation)
            const gutterX = doc.getBoundingClientRect().width - 18
            const asideTop = lead.getBoundingClientRect().top - doc.getBoundingClientRect().top + 10
            tl.to(packet, { x: gutterX, duration: 0.15, ease: 'power2.inOut' }, 1.5)
            tl.to(packet, { y: asideTop, duration: 0.15, ease: 'power2.inOut' }, 1.65)
            tl.to(
              packet,
              { x: leadPos.x, y: leadPos.y, duration: 0.15, ease: 'power2.inOut', onStart: () => paintPacket('lead') },
              1.8,
            )
          } else {
            gsap.set(packet, { autoAlpha: 0 })
            tl.add(() => phases[1]?.classList.add('is-on'), 0.32)
            tl.add(() => phases[2]?.classList.add('is-on'), 0.64)
          }

          tl.add(() => lead.classList.add('is-on'), usePacket ? 1.95 : 0.96)
          tl.to(
            collabLine,
            verticalCollab ? { scaleY: 1, duration: 0.45 } : { scaleX: 1, duration: 0.45 },
            usePacket ? 2.05 : 1.1,
          )
        },
      })

      ScrollTrigger.refresh()
      return () => window.removeEventListener('resize', settlePacket)
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      id="engagement"
      data-spy="clear"
      aria-labelledby="framework-heading"
      className="scroll-mt-24 border-b border-border bg-alloy"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <SignalRail tone="ink" />
        <div className="max-w-[46rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
            {managedFramework.eyebrow}
          </p>
          <h2
            id="framework-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {managedFramework.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {managedFramework.lead}
          </p>
        </div>

        <article
          ref={docRef}
          className="mf-doc relative mt-9 overflow-hidden rounded-[8px] border-2 border-ink bg-paper md:mt-10"
        >
          <span ref={ruleRef} className="mf-doc-rule" aria-hidden="true" />
          <div className="mf-route" aria-hidden="true">
            <span ref={packetRef} className="mf-packet" />
          </div>
          <header className="flex items-start gap-3 border-b-2 border-ink bg-ink px-5 py-4 md:items-center md:gap-4 md:px-7 md:py-5">
            <span className="mt-1.5 h-3 w-3 shrink-0 bg-paper md:mt-0" aria-hidden="true" />
            <div>
              <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-stage-muted">
                Monthly operating agenda
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-paper md:text-2xl text-balance">
                {managedFramework.sessionTitle}
              </h3>
            </div>
          </header>

          <div className="mf-agenda-wrap relative">
            <ol ref={agendaRef} className="mf-agenda grid gap-0 lg:grid-cols-3">
              {managedFramework.sessionParts.map((part, i) => (
                <li
                  key={part.id}
                  data-phase={part.id}
                  className={`mf-phase flex flex-col p-5 md:p-6 ${
                    i < managedFramework.sessionParts.length - 1
                      ? 'border-b border-ink/15 lg:border-b-0 lg:border-r'
                      : ''
                  }`}
                >
                  <h4 className={`flex items-center gap-2.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] ${
                    part.id === 'during' ? 'text-proof-deep' : part.id === 'after' ? 'text-ink' : 'text-accent-deep'
                  }`}>
                    <span className={`mf-station h-2.5 w-2.5 shrink-0 ${part.mark}`} aria-hidden="true" />
                    <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    {part.label}
                  </h4>
                  <ul className="mt-4 flex flex-col">
                    {part.items.map((item) => (
                      <li
                        key={item}
                        className="border-t border-ink/10 py-2.5 text-base font-semibold leading-snug text-ink first:border-t-0 md:text-lg text-pretty"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          <aside ref={leadRef} className="mf-lead relative border-t-2 border-ink bg-porcelain px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
              <div className="md:max-w-[11rem] md:shrink-0">
                <h4 className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-signal-deep">
                  {leadInset.kicker}
                </h4>
              </div>
              <div className="relative min-w-0 flex-1 border-l-2 border-ink pl-4 md:pl-6">
                <span ref={leadStationRef} className="mf-lead-station" aria-hidden="true" />
                <p className="text-lg font-semibold leading-snug tracking-tight text-ink md:text-xl text-pretty">
                  {leadInset.copy}
                </p>
                <p className="mf-lead-sign mt-2 text-base leading-relaxed text-muted-foreground text-pretty">
                  {leadInset.supporting}
                </p>
              </div>
            </div>
          </aside>
        </article>

        <div className="mf-collab relative mt-6 border-t border-ink/15 pt-6">
          <p className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.14em] text-signal-deep md:text-xs">
            {collab.eyebrow}
          </p>
          <div className="mf-collab-track relative mt-3">
            <span ref={collabLineRef} className="mf-collab-line" aria-hidden="true" />
            <ul
              className="mf-collab-list grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              aria-label="Partners Authomotive works alongside"
            >
            {collab.partners.map((partner) => (
              <li key={partner} className="flex items-start gap-2.5">
                <span className="mf-collab-node mt-[0.45rem] h-1.5 w-1.5 shrink-0 bg-ink" aria-hidden="true" />
                <span className="text-sm font-semibold leading-snug text-ink md:text-base">
                  {partner}
                </span>
              </li>
            ))}
            </ul>
          </div>
          <p className="mt-4 max-w-[46rem] text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
            {collab.supporting}
          </p>
        </div>

        <p className="mt-6 max-w-[46rem] text-lg font-semibold leading-snug tracking-tight text-ink md:text-xl text-pretty">
          {managedFramework.fit}
        </p>

        <div className="mt-6 flex flex-col items-start gap-3">
          <a href="#opportunity-review" className="btn btn-action">
            {managedFramework.ctaLabel}
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <p className="max-w-[36rem] text-sm leading-relaxed text-muted-foreground text-pretty md:text-base">
            {managedFramework.ctaSupport}
          </p>
        </div>
      </div>
    </section>
  )
}
