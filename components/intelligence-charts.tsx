import { Fragment } from 'react'

const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] as const

const mixSeries = [
  {
    id: 'total',
    label: 'Total',
    values: [7800, 8600, 7100, 8400, 9700, 11400],
    stroke: 'stroke-ink/60',
    fill: 'fill-ink/10',
    mark: 'bg-ink/50',
    dot: 'fill-paper stroke-ink/70',
  },
  {
    id: 'organic',
    label: 'Organic',
    values: [3000, 3380, 2760, 3680, 4800, 6100],
    stroke: 'stroke-accent',
    fill: null,
    mark: 'bg-accent',
    dot: 'fill-paper stroke-accent',
  },
  {
    id: 'local',
    label: 'Local',
    values: [1580, 1880, 1460, 1960, 2380, 2860],
    stroke: 'stroke-action',
    fill: null,
    mark: 'bg-action',
    dot: 'fill-paper stroke-action',
  },
  {
    id: 'ai',
    label: 'AI / LLM',
    values: [360, 490, 300, 580, 820, 1120],
    stroke: 'stroke-proof-deep',
    fill: null,
    mark: 'bg-proof',
    dot: 'fill-paper stroke-proof-deep',
  },
] as const

type PlotPoint = { x: number; y: number }

function plotPoints(values: readonly number[], w: number, h: number, yMax: number, pad: number): PlotPoint[] {
  return values.map((v, i) => ({
    x: pad + (i / (values.length - 1)) * (w - pad * 2),
    y: pad + (1 - v / yMax) * (h - pad * 2),
  }))
}

function curvePath(points: PlotPoint[]) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

function areaFromCurve(points: PlotPoint[], h: number, pad: number) {
  const line = curvePath(points)
  const first = points[0]
  const last = points[points.length - 1]
  if (!first || !last) return ''
  return `${line} L ${last.x.toFixed(1)} ${h - pad} L ${first.x.toFixed(1)} ${h - pad} Z`
}

export function TrafficMixModule() {
  const w = 480
  const h = 148
  const pad = 16
  const yMax = Math.max(...mixSeries[0].values) * 1.1
  const plotted = mixSeries.map((series) => ({
    ...series,
    points: plotPoints(series.values, w, h, yMax, pad),
  }))

  return (
    <div className="ri-module ri-module-trend border border-ink/15 bg-porcelain/60 px-3 py-3 md:px-4">
      <p className="font-mono text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-ink">
        Discovery trend
      </p>
      <p className="mt-0.5 text-sm font-semibold text-ink md:text-base">Traffic mix</p>
      <p className="ri-module-ask">Is growth broad or channel-specific?</p>
      <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1" aria-label="Traffic types">
        {mixSeries.map((series) => (
          <li key={series.id} className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink">
            <span className={`h-1.5 w-3 ${series.mark}`} aria-hidden="true" />
            {series.label}
          </li>
        ))}
      </ul>
      <div className="ri-cal mt-2">
        <svg
          className="h-auto w-full"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Month-over-month website traffic. Total, organic, local, and AI referrals."
        >
          {months.map((month, i) => {
            const x = pad + (i / (months.length - 1)) * (w - pad * 2)
            const half = (w - pad * 2) / (months.length - 1) / 2
            const reporting = i >= 4
            return (
              <rect
                key={month}
                x={Math.max(pad, x - half)}
                y={pad}
                width={i === 0 || i === months.length - 1 ? half : half * 2}
                height={h - pad * 2}
                className={reporting ? 'fill-proof/10' : i % 2 === 0 ? 'fill-ink/5' : 'fill-transparent'}
              />
            )
          })}
          {[0.25, 0.5, 0.75, 1].map((t) => {
            const y = pad + (1 - t) * (h - pad * 2)
            return (
              <line
                key={t}
                x1={pad}
                x2={w - pad}
                y1={y}
                y2={y}
                className="stroke-ink/10"
                strokeWidth="1"
              />
            )
          })}
          {months.map((month, i) => {
            const x = pad + (i / (months.length - 1)) * (w - pad * 2)
            return (
              <line
                key={`tick-${month}`}
                x1={x}
                x2={x}
                y1={pad}
                y2={h - pad}
                className="stroke-ink/12"
                strokeWidth="1"
              />
            )
          })}
          {plotted.map((series) =>
            series.fill ? (
              <path key={`${series.id}-area`} d={areaFromCurve(series.points, h, pad)} className={series.fill} />
            ) : null,
          )}
          {plotted.map((series) => (
            <path
              key={series.id}
              d={curvePath(series.points)}
              className={`ri-mix-line fill-none ${series.stroke}`}
              strokeWidth={series.id === 'total' ? 2.75 : 2.25}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {plotted.map((series) =>
            series.points.map((point, i) => (
              <circle
                key={`${series.id}-dot-${months[i]}`}
                cx={point.x}
                cy={point.y}
                r={i === series.points.length - 1 ? 4.2 : 3.2}
                className={series.dot}
                strokeWidth="1.6"
              />
            )),
          )}
        </svg>
        <div className="relative mt-1 h-4">
          {months.map((month, i) => (
            <span
              key={month}
              className={`absolute -translate-x-1/2 font-mono text-[0.5625rem] uppercase tracking-[0.12em] ${
                i >= 4 ? 'font-semibold text-ink' : 'text-muted-foreground'
              }`}
              style={{ left: `${((pad + (i / (months.length - 1)) * (w - pad * 2)) / w) * 100}%` }}
            >
              {month}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

const pathway = [
  { id: 'vsrp', label: 'VSRP', value: 2980 },
  { id: 'vdp', label: 'VDP', value: 1640 },
  { id: 'leads', label: 'Leads', value: 860 },
] as const

export function InventoryLeadModule() {
  return (
    <div className="ri-module ri-module-flow border border-ink/15 bg-porcelain/60 px-3 py-3 md:px-4">
      <p className="font-mono text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-ink">
        Buyer movement
      </p>
      <p className="mt-0.5 text-sm font-semibold text-ink md:text-base">Inventory flow</p>
      <p className="ri-module-ask">Are shoppers reaching vehicles?</p>
      <ol className="ri-flow" aria-label="Inventory-to-lead pathway: 2,980 VSRP results, 1,640 VDP views, 860 leads">
        {pathway.map((step, i) => (
          <Fragment key={step.id}>
            <li className="ri-flow-step">
              <span className="ri-flow-value font-mono">{step.value.toLocaleString()}</span>
              <span className="ri-flow-label">{step.label}</span>
            </li>
            {i < pathway.length - 1 ? (
              <li className="ri-flow-join" aria-hidden="true">
                <svg className="ri-flow-arrow" viewBox="0 0 16 16" width="14" height="14">
                  <path
                    d="M2.5 8h11M9.5 4.5 13.5 8l-4 3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </li>
            ) : null}
          </Fragment>
        ))}
      </ol>
    </div>
  )
}

const markets = [
  { name: 'North-side', strength: 86, status: 'Strengthened', hot: true },
  { name: 'Metro core', strength: 64, status: 'Stable', hot: false },
  { name: 'East corridor', strength: 51, status: 'Opportunity', hot: false },
  { name: 'South county', strength: 38, status: 'Watch', hot: false },
]

export function LocalityModule() {
  return (
    <div className="ri-module ri-module-market border border-ink/15 bg-porcelain/60 px-3 py-3 md:px-4">
      <p className="font-mono text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-ink">
        Market movement
      </p>
      <p className="mt-0.5 text-sm font-semibold text-ink md:text-base">Locality</p>
      <p className="ri-module-ask">Where is local momentum strongest?</p>
      <ul className="ri-markets" aria-label="Locality strength by market">
        {markets.map((market) => (
          <li key={market.name} className={`ri-market${market.hot ? ' is-hot' : ''}`}>
            <span className="ri-market-name">{market.name}</span>
            <span className="ri-market-score font-mono">{market.strength}</span>
            <span className="ri-market-status">{market.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
