import { platformCredibility } from '@/lib/platform-data'
import { discoveryToInventory } from '@/lib/site-data'

const websiteMarks =
  platformCredibility.categories.find((category) => category.id === 'website')?.marks ?? []

const disciplines = discoveryToInventory.disciplines
const events = discoveryToInventory.events

const LINKS: { from: string; to: string; kind: 'trunk' | 'fan' | 'cross' }[] = [
  { from: 'site', to: 'seo', kind: 'trunk' },
  { from: 'site', to: 'aeo', kind: 'trunk' },
  { from: 'site', to: 'geo', kind: 'trunk' },
  { from: 'seo', to: 'vsrp', kind: 'fan' },
  { from: 'seo', to: 'vdp', kind: 'fan' },
  { from: 'aeo', to: 'form', kind: 'fan' },
  { from: 'aeo', to: 'chat', kind: 'fan' },
  { from: 'geo', to: 'call', kind: 'fan' },
  { from: 'geo', to: 'lead', kind: 'fan' },
  { from: 'seo', to: 'aeo', kind: 'cross' },
  { from: 'aeo', to: 'geo', kind: 'cross' },
  { from: 'seo', to: 'form', kind: 'cross' },
  { from: 'aeo', to: 'vdp', kind: 'cross' },
  { from: 'aeo', to: 'call', kind: 'cross' },
  { from: 'geo', to: 'chat', kind: 'cross' },
  { from: 'vsrp', to: 'form', kind: 'cross' },
  { from: 'vdp', to: 'chat', kind: 'cross' },
  { from: 'form', to: 'call', kind: 'cross' },
]

const TONE_BY_NODE: Record<string, 'accent' | 'proof' | 'action'> = {
  seo: 'accent',
  aeo: 'proof',
  geo: 'action',
  vsrp: 'accent',
  vdp: 'accent',
  form: 'proof',
  chat: 'proof',
  call: 'action',
  lead: 'action',
}

/**
 * Static 1 / 3 / 6 webbing. Interaction and strand fitting live in QtiWeb.
 */
export function QtiWebView() {
  return (
    <div className="qti-web">
      <svg className="qti-web-svg" aria-hidden="true">
        {LINKS.map((link) => (
          <path
            key={`${link.from}-${link.to}`}
            className="qti-web-strand"
            data-from={link.from}
            data-to={link.to}
            data-kind={link.kind}
            data-tone={TONE_BY_NODE[link.to] ?? 'accent'}
            pathLength={1}
          />
        ))}
      </svg>

      <div className="qti-web-row" data-row="platforms">
        <p className="qti-web-strategy">
          {discoveryToInventory.platforms.lockup.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </p>
        <div className="qti-web-site" data-node="site" tabIndex={0}>
          <ul className="qti-wordmarks" aria-label="Website platforms Authomotive works with">
            {websiteMarks.map((mark) => (
              <li key={mark.id} className="qti-wordmark">
                {mark.name}
              </li>
            ))}
          </ul>
          <p className="qti-web-site-line">{discoveryToInventory.platforms.line}</p>
        </div>
      </div>

      <ul className="qti-web-row" data-row="disciplines" aria-label="Strategy layer Authomotive adds">
        {disciplines.map((discipline) => (
          <li key={discipline.id}>
            <div
              className="qti-web-chip"
              data-node={discipline.id}
              data-tone={discipline.tone}
              tabIndex={0}
            >
              <p className="qti-web-chip-label">{discipline.label}</p>
              <p className="qti-web-chip-line">{discipline.line}</p>
            </div>
          </li>
        ))}
      </ul>

      <ul className="qti-web-row" data-row="events" aria-label="Actions the dealership can read">
        {events.map((event) => {
          const tone = TONE_BY_NODE[event.id] ?? 'accent'
          return (
            <li key={event.id}>
              <div className="qti-web-event" data-node={event.id} data-tone={tone} tabIndex={0}>
                {event.label}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
