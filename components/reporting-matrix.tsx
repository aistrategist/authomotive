'use client'

import { useState } from 'react'
import { reportingMatrix, type MatrixRow } from '@/lib/platform-data'

function SourceChips({ activeSources }: { activeSources: string[] }) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Reporting sources activated by the selected lens">
      {reportingMatrix.sources.map((source) => {
        const active = activeSources.includes(source.id)
        return (
          <span
            key={source.id}
            className={`flex min-h-[32px] items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none ${
              active
                ? 'border-signal-deep/50 bg-lime/25 text-ink'
                : 'border-border text-fog'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-signal-deep' : 'bg-border'}`}
              aria-hidden="true"
            />
            {source.label}
            <span className="sr-only">{active ? ' (active for selected lens)' : ''}</span>
          </span>
        )
      })}
    </div>
  )
}

function InterpretationPanel({ row }: { row: MatrixRow }) {
  return (
    <div className="min-h-[170px] rounded-lg border-l-4 border-lime bg-porcelain p-4 md:min-h-[130px] md:p-5">
      <div key={row.id} className="panel-swap">
        <p className="font-mono text-xs uppercase tracking-wider text-signal-deep">
          {row.lens} — plain-English interpretation
        </p>
        <p className="mt-2.5 text-lg font-semibold leading-snug text-ink md:text-xl text-pretty">
          {row.interpretation}
        </p>
        <p className="mt-3 text-base leading-relaxed text-ink">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-accent-deep">
            The decision this supports:{' '}
          </span>
          {row.decision}
        </p>
      </div>
    </div>
  )
}

/**
 * Interactive evidence-to-decision matrix. Desktop renders a semantic table
 * with selectable rows; mobile renders four selectable reporting lenses with
 * identical content. Selecting a lens activates its source marks and updates
 * one large interpretation panel.
 */
export function ReportingMatrix() {
  const [activeId, setActiveId] = useState(reportingMatrix.rows[0].id)
  const activeRow =
    reportingMatrix.rows.find((r) => r.id === activeId) ?? reportingMatrix.rows[0]

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-3xl text-xl font-semibold leading-snug text-ink md:text-2xl text-pretty">
        {reportingMatrix.statement}
      </p>

      <SourceChips activeSources={activeRow.sources} />

      {/* Desktop: semantic matrix */}
      <div className="hidden overflow-hidden rounded-lg border border-border lg:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            How Authomotive turns reporting evidence into decisions, by reporting lens
          </caption>
          <thead>
            <tr className="border-b-2 border-ink bg-porcelain/60">
              <th scope="col" className="px-4 py-3.5 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Reporting lens
              </th>
              {reportingMatrix.columns.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-4 py-3.5 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportingMatrix.rows.map((row) => {
              const selected = row.id === activeId
              return (
                <tr
                  key={row.id}
                  className={`border-b border-border transition-colors duration-200 last:border-b-0 motion-reduce:transition-none ${
                    selected ? 'bg-lime/15' : 'hover:bg-porcelain/50'
                  }`}
                >
                  <th scope="row" className="p-0 align-top">
                    <button
                      onClick={() => setActiveId(row.id)}
                      aria-pressed={selected}
                      className="flex min-h-[44px] w-full items-start gap-2.5 px-4 py-4 text-left text-base font-semibold text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal-deep"
                    >
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border transition-colors ${
                          selected ? 'border-signal-deep bg-lime' : 'border-fog bg-transparent'
                        }`}
                        aria-hidden="true"
                      />
                      {row.lens}
                      <span className="sr-only">{selected ? ' (selected)' : ''}</span>
                    </button>
                  </th>
                  <td className="px-4 py-4 align-top text-[15px] leading-relaxed text-muted-foreground">
                    {row.changed}
                  </td>
                  <td className="px-4 py-4 align-top text-[15px] leading-relaxed text-muted-foreground">
                    {row.contributed}
                  </td>
                  <td className="px-4 py-4 align-top text-[15px] leading-relaxed text-muted-foreground">
                    {row.means}
                  </td>
                  <td className={`px-4 py-4 align-top text-[15px] leading-relaxed ${selected ? 'font-medium text-ink' : 'text-muted-foreground'}`}>
                    {row.next}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet: four selectable reporting lenses */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div role="tablist" aria-label="Reporting lenses" className="flex flex-wrap gap-2">
          {reportingMatrix.rows.map((row) => {
            const selected = row.id === activeId
            return (
              <button
                key={row.id}
                role="tab"
                id={`lens-tab-${row.id}`}
                aria-selected={selected}
                aria-controls="lens-panel"
                onClick={() => setActiveId(row.id)}
                className={`flex min-h-[44px] items-center gap-2 rounded-md border-2 px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-deep ${
                  selected
                    ? 'border-ink bg-ink text-porcelain'
                    : 'border-border text-muted-foreground'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${selected ? 'bg-lime' : 'bg-border'}`}
                  aria-hidden="true"
                />
                {row.lens}
              </button>
            )
          })}
        </div>
        <dl
          role="tabpanel"
          id="lens-panel"
          aria-labelledby={`lens-tab-${activeRow.id}`}
          className="rounded-lg border border-border"
        >
          {(
            [
              [reportingMatrix.columns[0], activeRow.changed],
              [reportingMatrix.columns[1], activeRow.contributed],
              [reportingMatrix.columns[2], activeRow.means],
              [reportingMatrix.columns[3], activeRow.next],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="border-b border-border p-4 last:border-b-0">
              <dt className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 text-base leading-relaxed text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <InterpretationPanel row={activeRow} />

      <p className="text-sm leading-relaxed text-muted-foreground">
        {reportingMatrix.qualification}
      </p>
    </div>
  )
}
