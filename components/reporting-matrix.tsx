'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import { flushSync } from 'react-dom'
import { reportingMatrix, type MatrixRow } from '@/lib/platform-data'

function SourceChips({ activeSources }: { activeSources: string[] }) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Reporting sources activated by the selected lens">
      {reportingMatrix.sources.map((source) => {
        const active = activeSources.includes(source.id)
        return (
          <span
            key={source.id}
            className={`flex min-h-[32px] items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${
              active ? 'border-proof-deep/50 bg-proof-soft text-ink' : 'border-border text-fog'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-proof-deep' : 'bg-border'}`}
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
    <div className="min-h-[170px] rounded-lg border-l-4 border-proof bg-porcelain p-4 md:min-h-[130px] md:p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-proof-deep">
        {row.lens} — plain-English interpretation
      </p>
      <p className="mt-2.5 text-lg font-semibold leading-snug text-ink md:text-xl text-pretty">
        {row.interpretation}
      </p>
      <p className="mt-3 text-base leading-relaxed text-ink">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-proof-deep">
          The decision this supports:{' '}
        </span>
        {row.decision}
      </p>
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
  const desktopRefs = useRef<Array<HTMLButtonElement | null>>([])
  const mobileRefs = useRef<Array<HTMLButtonElement | null>>([])
  const rows = reportingMatrix.rows
  const activeRow = rows.find((r) => r.id === activeId) ?? rows[0]

  const activate = (id: string, focus: 'desktop' | 'mobile' | false = false) => {
    flushSync(() => {
      setActiveId(id)
    })
    if (focus) {
      const i = rows.findIndex((r) => r.id === id)
      const refs = focus === 'desktop' ? desktopRefs : mobileRefs
      refs.current[i]?.focus()
    }
  }

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    focus: 'desktop' | 'mobile',
    orientation: 'horizontal' | 'vertical',
  ) => {
    const last = rows.length - 1
    let next = index
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
    if (event.key === nextKey || (orientation === 'vertical' && event.key === 'ArrowRight')) {
      next = index === last ? 0 : index + 1
    } else if (event.key === prevKey || (orientation === 'vertical' && event.key === 'ArrowLeft')) {
      next = index === 0 ? last : index - 1
    } else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return
    event.preventDefault()
    activate(rows[next]!.id, focus)
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-3xl text-xl font-semibold leading-snug text-ink md:text-2xl text-pretty">
        {reportingMatrix.statement}
      </p>

      <SourceChips activeSources={activeRow.sources} />

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
            {rows.map((row, i) => {
              const selected = row.id === activeId
              return (
                <tr
                  key={row.id}
                  className={`border-b border-border last:border-b-0 ${
                    selected ? 'bg-proof-soft' : ''
                  }`}
                >
                  <th scope="row" className="p-0 align-top">
                    <button
                      ref={(el) => {
                        desktopRefs.current[i] = el
                      }}
                      type="button"
                      onClick={() => activate(row.id)}
                      onKeyDown={(event) => onKeyDown(event, i, 'desktop', 'vertical')}
                      aria-pressed={selected}
                      tabIndex={selected ? 0 : -1}
                      className="ri-tab flex min-h-[44px] w-full items-start gap-2.5 px-4 py-4 text-left text-base font-semibold text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-proof-deep"
                    >
                      <span
                        className={`ri-dot mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border ${
                          selected ? 'border-proof-deep bg-proof' : 'border-fog bg-transparent'
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

      <div className="flex flex-col gap-3 lg:hidden">
        <div
          role="tablist"
          aria-label="Reporting lenses"
          aria-orientation="horizontal"
          className="flex flex-wrap gap-2"
        >
          {rows.map((row, i) => {
            const selected = row.id === activeId
            return (
              <button
                key={row.id}
                ref={(el) => {
                  mobileRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`lens-tab-${row.id}`}
                aria-selected={selected}
                aria-controls="lens-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => activate(row.id)}
                onKeyDown={(event) => onKeyDown(event, i, 'mobile', 'horizontal')}
                className={`ri-tab flex min-h-[44px] items-center gap-2 rounded-md border-2 px-3.5 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-proof-deep ${
                  selected
                    ? 'border-ink bg-ink text-porcelain'
                    : 'border-border text-muted-foreground'
                }`}
              >
                <span
                  className={`ri-dot h-1.5 w-1.5 rounded-full ${selected ? 'bg-proof' : 'bg-border'}`}
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
