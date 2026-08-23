import { fieldProof } from '@/lib/site-data'

/** Observed-result plate between Intelligence and Signal Architecture. */
export function FieldProof() {
  return (
    <aside className="fp-band" aria-labelledby="field-proof-heading">
      <div className="fp-wrap">
        <div className="fp-shell">
          <span className="fp-rule" aria-hidden="true" />
          <p className="fp-eyebrow font-mono">
            <span>{fieldProof.eyebrow}</span>
            <span className="fp-eyebrow-dot" aria-hidden="true">
              ·
            </span>
            <span>{fieldProof.sub}</span>
          </p>
          <h2 id="field-proof-heading" className="fp-title">
            {fieldProof.headline}
          </h2>
          <p className="fp-copy">{fieldProof.supporting}</p>
          <ul className="fp-strip" aria-label="Observed dealership result">
            {fieldProof.metrics.map((metric) => (
              <li key={metric.id} className="fp-metric" data-tone={metric.tone}>
                <p className="fp-metric-value font-mono">{metric.value}</p>
                <p className="fp-metric-label">{metric.label}</p>
              </li>
            ))}
          </ul>
          <p className="fp-source font-mono">{fieldProof.source}</p>
        </div>
      </div>
    </aside>
  )
}
