import type { CSSProperties, KeyboardEvent, Ref } from 'react'
import { managedFramework } from '@/lib/site-data'

export const mfWorks = managedFramework.works
export const MF_COUNT = mfWorks.length
export const MF_STEP = 72
export const MF_START = -90
export const MF_RING_R = 38
export const MF_RING_C = 2 * Math.PI * MF_RING_R

export function mfSpokePoint(index: number, radius = MF_RING_R) {
  const rad = ((index * MF_STEP + MF_START) * Math.PI) / 180
  return {
    x: 50 + radius * Math.cos(rad),
    y: 50 + radius * Math.sin(rad),
  }
}

export function ManagedFrameworkCopy() {
  return (
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
      <p className="lede mt-4 text-muted-foreground text-pretty">{managedFramework.lead}</p>
      <p className="mt-3 text-base font-semibold leading-snug text-ink text-pretty md:text-lg">
        {managedFramework.relation}
      </p>
      <p className="mt-3 text-base leading-snug text-ink text-pretty md:text-lg">
        {managedFramework.proof}
      </p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {managedFramework.beats.map((beat) => (
          <div key={beat.id} className="min-w-0">
            <dt className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.16em] text-signal-deep">
              {beat.verb}
            </dt>
            <dd className="mt-1 text-sm leading-snug text-ink">{beat.line}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function ManagedHub({
  activeId = mfWorks[0]!.id,
  stageRef,
  arcRef,
  railRef,
  tabRefs,
  onActivate,
  onTabKeyDown,
  onHold,
  onRelease,
}: {
  activeId?: string
  stageRef?: Ref<HTMLDivElement>
  arcRef?: Ref<SVGCircleElement>
  railRef?: Ref<HTMLSpanElement>
  tabRefs?: { current: Array<HTMLButtonElement | null> }
  onActivate?: (id: string) => void
  onTabKeyDown?: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void
  onHold?: () => void
  onRelease?: () => void
}) {
  const { hub } = managedFramework
  const active = mfWorks.find((work) => work.id === activeId) ?? mfWorks[0]!

  return (
    <div ref={stageRef} className="mf-stage mt-8 md:mt-10">
      <div className="mf-orbit" data-tone={active.tone}>
        <svg className="mf-web" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="mf-web-ring" cx="50" cy="50" r={MF_RING_R} />
          <circle
            ref={arcRef}
            className="mf-load-arc"
            cx="50"
            cy="50"
            r={MF_RING_R}
            style={{ strokeDasharray: MF_RING_C, strokeDashoffset: MF_RING_C }}
          />
          {mfWorks.map((work, i) => {
            const point = mfSpokePoint(i)
            return (
              <line
                key={work.id}
                className={`mf-spoke${work.id === activeId ? ' is-on' : ''}`}
                data-tone={work.tone}
                x1="50"
                y1="50"
                x2={point.x}
                y2={point.y}
              />
            )
          })}
          {mfWorks.map((work, i) => {
            const point = mfSpokePoint(i)
            return (
              <circle
                key={`tick-${work.id}`}
                className={`mf-tick${work.id === activeId ? ' is-on' : ''}`}
                data-tone={work.tone}
                cx={point.x}
                cy={point.y}
                r="1.15"
              />
            )
          })}
        </svg>

        <div className="mf-center">
          <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-signal-deep">
            {hub.kicker}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">{hub.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/80 text-pretty md:text-base">{hub.line}</p>
        </div>

        <div
          role="tablist"
          aria-label="What works this month"
          className="mf-ring"
          onPointerEnter={onHold}
          onPointerLeave={onRelease}
        >
          {mfWorks.map((work, i) => {
            const selected = work.id === activeId
            const point = mfSpokePoint(i)
            return (
              <button
                key={work.id}
                ref={
                  tabRefs
                    ? (el) => {
                        tabRefs.current[i] = el
                      }
                    : undefined
                }
                type="button"
                role="tab"
                id={`mf-tab-${work.id}`}
                aria-selected={selected}
                aria-controls={`mf-panel-${work.id}`}
                tabIndex={selected ? 0 : -1}
                data-tone={work.tone}
                style={
                  {
                    '--x': `${point.x}%`,
                    '--y': `${point.y}%`,
                  } as CSSProperties
                }
                onClick={onActivate ? () => onActivate(work.id) : undefined}
                onKeyDown={onTabKeyDown ? (event) => onTabKeyDown(event, i) : undefined}
                className={`mf-work${selected ? ' is-on' : ''}`}
              >
                {work.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mf-rail-load" aria-hidden="true">
        <span
          ref={railRef}
          className="mf-rail-arc"
          data-tone={active.tone}
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <div className="mf-dock" onPointerEnter={onHold} onPointerLeave={onRelease}>
        {mfWorks.map((work) => {
          const selected = work.id === activeId
          return (
            <p
              key={work.id}
              role="tabpanel"
              id={`mf-panel-${work.id}`}
              aria-labelledby={`mf-tab-${work.id}`}
              data-tone={work.tone}
              className={`mf-sheet${selected ? ' is-on' : ''}`}
              inert={selected ? undefined : true}
              aria-hidden={!selected}
            >
              <span className="mf-sheet-kicker font-mono">This month · {work.label}</span>
              {work.move}
            </p>
          )
        })}
      </div>
    </div>
  )
}
