/** Compact semantic wireframes for product proof — labels over anonymous bars. */

function WireLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-signal-deep">
      {children}
    </p>
  )
}

function Region({
  label,
  accent = 'quiet',
}: {
  label: string
  accent?: 'quiet' | 'lime' | 'orange' | 'ink'
}) {
  const tone =
    accent === 'lime'
      ? 'border-l-[3px] border-l-lime bg-lime-mist'
      : accent === 'orange'
        ? 'border-l-[3px] border-l-action bg-orange-mist'
        : accent === 'ink'
          ? 'border-l-[3px] border-l-ink bg-teal-mist'
          : 'border-ink/15 bg-porcelain'

  return (
    <li className={`border px-2.5 py-1.5 text-[12px] font-semibold leading-snug text-ink ${tone}`}>
      {label}
    </li>
  )
}

function CompactFlow({
  route,
  disclaimer,
  columns,
  spark,
}: {
  route: string
  disclaimer: string
  columns: { title: string; items: string[] }[]
  spark?: boolean
}) {
  return (
    <div
      className="flex flex-col gap-3"
      role="img"
      aria-label={`${disclaimer}. ${route}. ${columns.map((col) => `${col.title}: ${col.items.join(', ')}`).join('. ')}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink/70">{disclaimer}</p>
      <p className="text-sm font-semibold tracking-tight text-ink">{route}</p>
      <div className="grid gap-3 md:grid-cols-3">
        {columns.map((col) => (
          <div key={col.title} className="min-w-0">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-signal-deep">
              {col.title}
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {col.items.map((item) => (
                <li
                  key={item}
                  className="border border-ink/20 bg-paper/80 px-2.5 py-1.5 text-[12px] font-semibold leading-snug text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {spark ? (
        <p className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:flex">
          <span className="flex h-3 items-end gap-px" aria-hidden="true">
            {[3, 5, 4, 7, 6, 8].map((h, i) => (
              <span key={i} className={`w-1 ${i === 5 ? 'bg-lime' : 'bg-ink/25'}`} style={{ height: `${h}px` }} />
            ))}
          </span>
          Illustrative shape — not client results
        </p>
      ) : null}
    </div>
  )
}

export function WebsiteLayersViz() {
  return (
    <CompactFlow
      disclaimer="Illustrative example — not a live dealership page"
      route="Dealer Website → Authority Experience → Matching Inventory"
      columns={[
        { title: 'Dealer Website', items: ['Homepage', 'Inventory Search'] },
        {
          title: 'Authority Experience',
          items: ['Buyer Question', 'Short Answer', 'Comparison Guidance', 'Ownership Insight'],
        },
        { title: 'Matching Inventory', items: ['Matching Vehicles', 'VDP View'] },
      ]}
    />
  )
}

export function SearchOpportunityViz() {
  return (
    <CompactFlow
      disclaimer="Illustrative opportunity interface — not client results"
      route="Search Opportunity → Discovery Signals → Next Content Action"
      spark
      columns={[
        {
          title: 'Search Opportunity',
          items: ['Non-Branded Questions', 'Local Model Demand', 'Comparison Topics'],
        },
        { title: 'Discovery Signals', items: ['AI Referral Observations', 'Content Gaps'] },
        { title: 'Next Content Action', items: ['Build Next', 'Refresh', 'Protect and Measure'] },
      ]}
    />
  )
}

export function MeasurementFlowViz() {
  return (
    <CompactFlow
      disclaimer="Illustrative measurement standard — not client results"
      route="Shopper Action → Named Event → Reporting Destination"
      columns={[
        {
          title: 'Shopper Action',
          items: ['Research Interaction', 'Inventory Handoff', 'VDP View', 'Form Start', 'Call Click'],
        },
        { title: 'Named Event', items: ['GA4 / GTM'] },
        {
          title: 'Reporting Destination',
          items: ['Advertising Measurement', 'Authomotive Intelligence'],
        },
      ]}
    />
  )
}

export function JobAuthorityPreview() {
  return (
    <div className="rounded-[8px] border-2 border-ink bg-paper p-4" aria-hidden="true">
      <WireLabel>Authority Experience</WireLabel>
      <ul className="mt-3 flex flex-col gap-1">
        <Region label="Buyer Question" />
        <Region label="Short Answer" accent="lime" />
        <Region label="Comparison Guidance" />
        <Region label="Ownership Insight" />
        <Region label="Inventory Pathway" accent="orange" />
      </ul>
    </div>
  )
}

export function JobIntelligencePreview() {
  return (
    <div className="rounded-[8px] border-2 border-ink bg-paper p-4" aria-hidden="true">
      <WireLabel>Authomotive Intelligence</WireLabel>
      <p className="mt-2 text-[12px] font-semibold leading-snug text-ink">
        What Changed → Why → Buyer Action → Next
      </p>
      <ul className="mt-3 flex flex-col gap-1">
        <Region label="What Changed" accent="lime" />
        <Region label="Why It Changed" />
        <Region label="What Buyers Did" />
        <Region label="Next Opportunity" accent="orange" />
      </ul>
    </div>
  )
}

export function JobSignalPreview() {
  return (
    <div className="rounded-[8px] border-2 border-ink bg-paper p-4" aria-hidden="true">
      <WireLabel>Signal Architecture</WireLabel>
      <p className="mt-2 text-[12px] font-semibold leading-snug text-ink">
        Shopper Action → Named Event → Destination
      </p>
      <ul className="mt-3 flex flex-col gap-1.5">
        {[
          { label: 'Shopper Action', state: 'orange' as const },
          { label: 'Event Definition', state: 'ink' as const },
          { label: 'Platform Signal', state: 'ink' as const },
          { label: 'Validation Status', state: 'lime' as const },
          { label: 'Reporting Destination', state: 'lime' as const },
        ].map((row) => (
          <li key={row.label} className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 shrink-0 ${
                row.state === 'lime' ? 'bg-lime' : row.state === 'orange' ? 'bg-action' : 'bg-ink'
              }`}
            />
            <span className="flex-1 border border-ink/15 bg-porcelain px-2.5 py-1.5 text-[12px] font-semibold text-ink">
              {row.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CompactLayerGlyph() {
  return (
    <svg viewBox="0 0 120 40" className="h-9 w-[7.5rem]" aria-hidden="true">
      <rect x="8" y="12" width="40" height="20" rx="3" className="fill-teal-mist stroke-ink" strokeWidth="1.25" />
      <rect x="36" y="8" width="40" height="20" rx="3" className="fill-paper stroke-ink" strokeWidth="1.25" />
      <rect x="64" y="14" width="44" height="20" rx="3" className="fill-lime-mist stroke-ink" strokeWidth="1.25" />
    </svg>
  )
}

export function CompactSearchGlyph() {
  return (
    <svg viewBox="0 0 120 40" className="h-9 w-[7.5rem]" aria-hidden="true">
      <rect x="8" y="8" width="32" height="24" rx="3" className="fill-lime-mist stroke-ink" strokeWidth="1.25" />
      <rect x="44" y="8" width="32" height="24" rx="3" className="fill-paper stroke-ink" strokeWidth="1.25" />
      <rect x="80" y="8" width="32" height="24" rx="3" className="fill-orange-mist stroke-ink" strokeWidth="1.25" />
      <rect x="86" y="14" width="20" height="4" className="fill-action" />
    </svg>
  )
}

export function CompactMeasureGlyph() {
  return (
    <svg viewBox="0 0 120 40" className="h-9 w-[7.5rem]" aria-hidden="true">
      <path d="M14 20 H106" className="stroke-ink/40" strokeWidth="1.5" />
      <rect x="8" y="14" width="12" height="12" className="fill-action" />
      <rect x="54" y="14" width="12" height="12" className="fill-ink" />
      <rect x="100" y="14" width="12" height="12" className="fill-lime" />
    </svg>
  )
}
