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

function WirePage({
  label,
  regions,
  highlight,
  nextLabel,
  className = '',
}: {
  label: string
  regions: { label: string; accent?: 'quiet' | 'lime' | 'orange' | 'ink' }[]
  highlight?: number
  nextLabel?: string
  className?: string
}) {
  return (
    <div className={`rounded-[8px] border-2 border-ink bg-paper p-3 shadow-[6px_6px_0_0_var(--ink)] ${className}`}>
      <WireLabel>{label}</WireLabel>
      <ul className="mt-2 flex flex-col gap-1">
        {regions.map((r, i) => (
          <Region key={r.label} label={r.label} accent={i === highlight ? 'lime' : r.accent} />
        ))}
      </ul>
      {nextLabel ? (
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-action-deep">
          {nextLabel}
          <span aria-hidden="true">→</span>
        </p>
      ) : null}
    </div>
  )
}

export function WebsiteLayersViz() {
  return (
    <div
      className="relative"
      role="img"
      aria-label="Illustrative dealership website, Authority Experience, and inventory destination layers"
    >
      <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Illustrative example — not a live dealership page
      </p>
      <div className="relative md:min-h-[330px]">
        <div className="hidden w-[46%] md:absolute md:left-0 md:top-7 md:block md:opacity-90">
          <WirePage
            label="Dealer website"
            regions={[
              { label: 'Homepage Hero' },
              { label: 'Inventory Search' },
              { label: 'Featured Vehicles' },
              { label: 'Service and Ownership' },
            ]}
          />
        </div>
        <div className="relative z-[2] md:absolute md:left-[20%] md:top-0 md:w-[46%]">
          <WirePage
            label="Authority Experience"
            highlight={1}
            regions={[
              { label: 'Buyer Question' },
              { label: 'Short Answer', accent: 'lime' },
              { label: 'Comparison Guidance' },
              { label: 'Ownership Insight' },
              { label: 'Inventory Pathway', accent: 'orange' },
            ]}
          />
        </div>
        <div className="relative z-[3] mt-4 md:absolute md:right-0 md:top-12 md:mt-0 md:w-[40%]">
          <WirePage
            label="Inventory destination"
            nextLabel="View Vehicle"
            regions={[
              { label: 'Matching Vehicles', accent: 'lime' },
              { label: 'Model and Trim' },
              { label: 'Price and Availability' },
              { label: 'View Vehicle', accent: 'orange' },
            ]}
          />
        </div>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink md:mt-6">
        <span className="text-signal-deep">Dealer website</span>
        <span className="text-lime" aria-hidden="true">
          →
        </span>
        <span className="text-signal-deep">Authority Experience</span>
        <span className="text-lime" aria-hidden="true">
          →
        </span>
        <span className="text-action-deep">Matching inventory</span>
      </p>
    </div>
  )
}

export function SearchOpportunityViz() {
  return (
    <div
      className="flex flex-col gap-4"
      role="img"
      aria-label="Illustrative discovery-intelligence wireframe for search opportunity, signals, and content priority"
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Illustrative opportunity interface — not client results
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <WirePage
          label="Search opportunity"
          regions={[
            { label: 'Non-Branded Questions' },
            { label: 'Local Model Demand' },
            { label: 'Comparison Topics' },
            { label: 'Ownership Questions' },
          ]}
        />
        <WirePage
          label="Discovery signals"
          regions={[
            { label: 'Search Visibility', accent: 'lime' },
            { label: 'AI Referral Observations' },
            { label: 'Locality Movement' },
            { label: 'Competitor Content Gaps' },
          ]}
        />
        <WirePage
          label="Content priority"
          nextLabel="Build Next"
          regions={[
            { label: 'Build Next', accent: 'orange' },
            { label: 'Refresh' },
            { label: 'Protect' },
            { label: 'Measure' },
          ]}
        />
      </div>
      <div className="flex items-end justify-between gap-4 rounded-[8px] border-2 border-ink bg-porcelain px-4 py-3">
        <div>
          <WireLabel>Research visibility opportunity</WireLabel>
          <div className="mt-2 flex h-8 items-end gap-1" aria-hidden="true">
            {[8, 11, 10, 14, 13, 18].map((h, i) => (
              <span
                key={i}
                className={`w-3 ${i === 5 ? 'bg-lime' : 'bg-ink/25'}`}
                style={{ height: `${h * 1.4}px` }}
              />
            ))}
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-action-deep">
          Prioritize next →
        </span>
      </div>
    </div>
  )
}

function FlowCol({
  label,
  items,
  node,
}: {
  label: string
  items: { name: string; state: 'ink' | 'lime' | 'orange' }[]
  node: 'ink' | 'lime' | 'orange'
}) {
  const nodeClass = node === 'lime' ? 'bg-lime' : node === 'orange' ? 'bg-action' : 'bg-ink'
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 ${nodeClass}`} aria-hidden="true" />
        <WireLabel>{label}</WireLabel>
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center gap-2 border border-ink/15 bg-paper px-2.5 py-2 text-[12px] font-semibold text-ink"
          >
            <span
              className={`h-2 w-2 shrink-0 ${
                item.state === 'lime' ? 'bg-lime' : item.state === 'orange' ? 'bg-action' : 'bg-ink'
              }`}
              aria-hidden="true"
            />
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MeasurementFlowViz() {
  return (
    <div
      className="flex flex-col gap-3"
      role="img"
      aria-label="Illustrative measurement flow from shopper actions through a governed event standard to useful outcomes"
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Illustrative measurement standard — not client results
      </p>
      <div className="flex flex-col gap-4 rounded-[8px] border-2 border-ink bg-paper p-4 md:flex-row md:items-start md:gap-3">
        <FlowCol
          label="Shopper actions"
          node="orange"
          items={[
            { name: 'Research Interaction', state: 'lime' },
            { name: 'Inventory Handoff', state: 'lime' },
            { name: 'VDP View', state: 'lime' },
            { name: 'Form Start', state: 'orange' },
            { name: 'Call Click', state: 'orange' },
            { name: 'Digital Retailing Start', state: 'lime' },
          ]}
        />
        <div className="hidden w-px self-stretch bg-ink/20 md:block" aria-hidden="true" />
        <FlowCol
          label="Measurement standard"
          node="ink"
          items={[
            { name: 'Named Event', state: 'ink' },
            { name: 'GA4 and GTM', state: 'ink' },
            { name: 'Validation', state: 'lime' },
            { name: 'Source and Page Context', state: 'ink' },
          ]}
        />
        <div className="hidden w-px self-stretch bg-ink/20 md:block" aria-hidden="true" />
        <FlowCol
          label="Useful outcomes"
          node="lime"
          items={[
            { name: 'Website Reporting', state: 'lime' },
            { name: 'Advertising Measurement', state: 'orange' },
            { name: 'Authomotive Intelligence', state: 'lime' },
            { name: 'Next Content Decision', state: 'orange' },
          ]}
        />
      </div>
    </div>
  )
}

export function JobAuthorityPreview() {
  return (
    <div className="rounded-[8px] border-2 border-ink bg-paper p-4" aria-hidden="true">
      <WireLabel>Authority Experience</WireLabel>
      <p className="mt-2 text-sm font-semibold leading-snug text-ink">
        Which three-row SUV fits this family?
      </p>
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
      <p className="mt-2 text-sm font-semibold leading-snug text-ink">Executive story</p>
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
