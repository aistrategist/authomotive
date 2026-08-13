'use client'

import { useEffect, useState } from 'react'

function useCountUp(end: number, duration = 900) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setValue(Math.round(end * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, duration])

  return value
}

function ChartNote({ children }: { children: string }) {
  return <p className="mt-2.5 text-sm text-muted-foreground">{children}</p>
}

function sparkline(values: number[], w: number, h: number, pad = 4) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = Math.max(1, max - min)
  return values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2)
      const y = h - pad - ((v - min) / span) * (h - pad * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function areaPath(values: number[], w: number, h: number, pad = 4) {
  const line = sparkline(values, w, h, pad)
  return `M ${pad} ${h - pad} L ${line} L ${w - pad} ${h - pad} Z`
}

export function ExecutiveCharts() {
  const mom = [38, 44, 41, 52, 58, 71]
  const yoy = [22, 25, 31, 29, 36, 48]
  const vis = useCountUp(18)
  const ae = useCountUp(2)
  const inv = useCountUp(12)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { value: `+${vis}%`, label: 'Research visibility' },
          { value: String(ae), label: 'Authority Experiences launched' },
          { value: `+${inv}%`, label: 'Inventory-pathway clicks' },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            className="iq-fade-up rounded-lg border border-border bg-porcelain/70 px-4 py-3"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <p className="font-mono text-2xl font-semibold tracking-tight text-signal-deep">{kpi.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 rounded-lg border border-border p-5 sm:grid-cols-2 md:p-6">
        <TimeSeriesChart
          values={mom}
          labels={['M1', 'M2', 'M3', 'M4', 'M5', 'M6']}
          title="Month over month"
          note="Illustrative shape, not client data"
        />
        <TimeSeriesChart
          values={yoy}
          labels={['Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6']}
          title="Year over year"
          note="Illustrative shape, not client data"
        />
      </div>
    </div>
  )
}

function TimeSeriesChart({
  values,
  labels,
  title,
  note,
}: {
  values: number[]
  labels: string[]
  title: string
  note: string
}) {
  const max = Math.max(...values)
  const w = 320
  const h = 118
  const points = sparkline(values, w, h, 8)
  const area = areaPath(values, w, h, 8)

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">{title}</p>
      <div className="relative mt-3 h-36" role="img" aria-label={`${title} illustrative trend`}>
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={area} className="iq-fade-up fill-lime/20" />
          <polyline
            points={points}
            pathLength={1}
            className="iq-draw fill-none stroke-signal-deep"
            strokeWidth="2.25"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="relative z-[1] flex h-full items-end gap-2">
          {values.map((v, i) => (
            <div key={labels[i]} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
              <div
                className={`iq-bar-in w-full max-w-8 rounded-t-sm ${
                  i === values.length - 1 ? 'iq-pulse-lime bg-lime ring-1 ring-signal-deep/50' : 'bg-ink/12'
                }`}
                style={{ height: `${(v / max) * 78}%`, animationDelay: `${i * 70}ms` }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-wider text-fog">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      <ChartNote>{note}</ChartNote>
    </div>
  )
}

const searchTopics = [
  { label: 'Three-row SUV research', value: 92, delta: '+18' },
  { label: 'Winter driving guidance', value: 74, delta: '+11' },
  { label: 'Lease vs. buy', value: 61, delta: '+7' },
  { label: 'Trade-in value', value: 48, delta: '+2' },
  { label: 'CPO vs. new', value: 41, delta: '0' },
]

export function SearchContentCharts() {
  const trend = [28, 31, 30, 38, 44, 52, 61]
  const points = sparkline(trend, 280, 64, 6)

  return (
    <div className="rounded-lg border border-border p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">Query contribution</p>
          <p className="mt-1 text-base font-semibold text-ink">Non-branded topics earning discovery</p>
        </div>
        <svg width="160" height="40" viewBox="0 0 280 64" aria-hidden="true" className="text-signal-deep">
          <polyline
            points={points}
            pathLength={1}
            className="iq-draw fill-none stroke-current"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <ul className="mt-5 flex flex-col gap-2.5" aria-label="Illustrative query contribution ranking">
        {searchTopics.map((row, i) => (
          <li key={row.label} className="iq-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium text-ink">{row.label}</span>
              <span
                className={`font-mono text-xs font-semibold ${
                  row.delta.startsWith('+') ? 'text-signal-deep' : 'text-fog'
                }`}
              >
                {row.delta === '0' ? 'flat' : row.delta}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-porcelain">
              <div
                className={`iq-bar-in-x h-full rounded-full ${
                  i === 0 ? 'bg-lime' : 'bg-signal-deep/55'
                }`}
                style={{ width: `${row.value}%`, animationDelay: `${120 + i * 80}ms` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <ChartNote>Illustrative ranking of buyer questions, not client data</ChartNote>
    </div>
  )
}

const markets = [
  { name: 'North-side', strength: 86, status: 'Strengthened', hot: true },
  { name: 'Metro core', strength: 64, status: 'Stable', hot: false },
  { name: 'East corridor', strength: 51, status: 'Opportunity', hot: false },
  { name: 'South county', strength: 38, status: 'Watch', hot: false },
]

export function LocalityCharts() {
  return (
    <div className="rounded-lg border border-border p-5 md:p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">Priority markets</p>
      <p className="mt-1 text-base font-semibold text-ink">Where local visibility is moving</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2" role="img" aria-label="Illustrative locality strength by market">
        {markets.map((m, i) => (
          <div
            key={m.name}
            className={`iq-fade-up relative overflow-hidden rounded-lg border p-4 ${
              m.hot ? 'border-signal-deep/50 bg-lime/15' : 'border-border bg-porcelain/50'
            }`}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3 shrink-0">
                  {m.hot ? <span className="iq-ping absolute inset-0 rounded-full bg-lime" /> : null}
                  <span
                    className={`relative h-3 w-3 rounded-full ${m.hot ? 'bg-lime ring-2 ring-signal-deep' : 'bg-fog/70'}`}
                  />
                </span>
                <div>
                  <p className="text-base font-semibold text-ink">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.status}</p>
                </div>
              </div>
              <p className="font-mono text-lg font-semibold text-signal-deep">{m.strength}</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper">
              <div
                className={`iq-bar-in-x h-full rounded-full ${m.hot ? 'bg-lime' : 'bg-signal-deep/50'}`}
                style={{ width: `${m.strength}%`, animationDelay: `${140 + i * 80}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
      <ChartNote>Illustrative market movement, not client data</ChartNote>
    </div>
  )
}

const funnel = [
  { label: 'Research interactions', value: 4820, width: 100 },
  { label: 'Inventory handoffs', value: 2980, width: 68 },
  { label: 'Digital retailing', value: 1640, width: 44 },
  { label: 'Calls and forms', value: 860, width: 28 },
]

export function BuyerActionCharts() {
  return (
    <div className="rounded-lg border border-border p-5 md:p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">Measured pathway</p>
      <p className="mt-1 text-base font-semibold text-ink">How shopper actions move through the site</p>

      <div className="relative mt-6" aria-label="Illustrative buyer-action funnel">
        <div className="pointer-events-none absolute top-2 bottom-2 left-3 hidden w-px bg-alloy sm:block" aria-hidden="true">
          <span className="iq-funnel-dot absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-lime" />
          <span className="iq-funnel-dot iq-funnel-dot-b absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-signal-deep" />
        </div>

        <ol className="flex flex-col gap-3 sm:pl-8">
          {funnel.map((step, i) => (
            <li key={step.label} className="iq-fade-up" style={{ animationDelay: `${i * 90}ms` }}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-ink">{step.label}</span>
                <FunnelCount end={step.value} />
              </div>
              <div className="h-9 overflow-hidden rounded-md bg-porcelain">
                <div
                  className={`iq-bar-in-x flex h-full items-center rounded-md px-3 ${
                    i === funnel.length - 1 ? 'bg-action/80' : i === 0 ? 'bg-lime' : 'bg-signal-deep/45'
                  }`}
                  style={{ width: `${step.width}%`, animationDelay: `${100 + i * 90}ms` }}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
      <ChartNote>Illustrative conversion pathway, not client data</ChartNote>
    </div>
  )
}

function FunnelCount({ end }: { end: number }) {
  const n = useCountUp(end, 1100)
  return <span className="font-mono text-sm font-semibold tabular-nums text-signal-deep">{n.toLocaleString()}</span>
}

const radarBlips = [
  { a: 18, r: 0.38, seen: true },
  { a: 52, r: 0.62, seen: true },
  { a: 88, r: 0.28, seen: false },
  { a: 126, r: 0.7, seen: true },
  { a: 168, r: 0.48, seen: false },
  { a: 210, r: 0.82, seen: true },
  { a: 248, r: 0.34, seen: false },
  { a: 292, r: 0.58, seen: true },
  { a: 328, r: 0.74, seen: false },
]

export function AiVisibilityCharts() {
  const referrals = [8, 11, 9, 14, 18, 16, 22]
  const points = sparkline(referrals, 260, 72, 8)
  const cx = 110
  const cy = 110
  const maxR = 92

  return (
    <div className="grid gap-6 rounded-lg border border-border p-5 md:grid-cols-[minmax(0,220px)_1fr] md:p-6">
      <div className="mx-auto w-full max-w-[220px]">
        <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">Observed footprint</p>
        <svg
          className="mt-3 h-auto w-full"
          viewBox="0 0 220 220"
          role="img"
          aria-label="Illustrative AI visibility radar with observed and unobserved signals"
        >
          <circle cx={cx} cy={cy} r={maxR} className="fill-porcelain/80 stroke-border" />
          <circle cx={cx} cy={cy} r={maxR * 0.66} className="fill-none stroke-border" />
          <circle cx={cx} cy={cy} r={maxR * 0.33} className="fill-none stroke-border" />
          <g transform={`translate(${cx} ${cy})`}>
            <g className="iq-sweep">
              <path
                d={`M 0 0 L 0 ${-maxR} A ${maxR} ${maxR} 0 0 1 ${maxR * 0.42} ${-maxR * 0.91} Z`}
                className="fill-lime/25 stroke-lime/60"
                strokeWidth="1"
              />
            </g>
          </g>
          {radarBlips.map((b, i) => {
            const rad = ((b.a - 90) * Math.PI) / 180
            const x = cx + Math.cos(rad) * maxR * b.r
            const y = cy + Math.sin(rad) * maxR * b.r
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={b.seen ? 4.5 : 3.5}
                className={b.seen ? 'iq-pulse-lime fill-lime stroke-signal-deep' : 'fill-fog/40 stroke-fog'}
                strokeWidth="1.25"
              />
            )
          })}
          <circle cx={cx} cy={cy} r="3.5" className="fill-signal-deep" />
        </svg>
        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-lime ring-1 ring-signal-deep" /> Observed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-fog/50" /> Unobserved
          </span>
        </div>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">Identifiable AI referrals</p>
        <p className="mt-1 text-base font-semibold text-ink">Signals we can actually attribute</p>
        <svg className="mt-4 h-24 w-full" viewBox="0 0 260 72" preserveAspectRatio="none" aria-hidden="true">
          <path d={areaPath(referrals, 260, 72, 8)} className="iq-fade-up fill-lime/20" />
          <polyline
            points={points}
            pathLength={1}
            className="iq-draw fill-none stroke-signal-deep"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Lime marks identifiable referrals and observed visibility. Dim marks remain outside honest
          attribution — we do not invent complete AI journey tracking.
        </p>
        <ChartNote>Illustrative AI footprint, not client data</ChartNote>
      </div>
    </div>
  )
}
