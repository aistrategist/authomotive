import { fieldProof } from '@/lib/site-data'

/** Observed-result callout between Intelligence and Signal Architecture. */
export function FieldProof() {
  return (
    <aside className="fp-band" aria-labelledby="field-proof-heading">
      <div className="fp-wrap">
        <p className="fp-stamp font-mono">{fieldProof.stamp}</p>
        <h2 id="field-proof-heading" className="fp-title">
          {fieldProof.headline}
        </h2>
        <ul className="fp-strip" aria-label="Observed dealership result">
          {fieldProof.metrics.map((metric) => (
            <li key={metric.id} className="fp-metric" data-tone={metric.tone}>
              <p className="fp-metric-value font-mono">{metric.value}</p>
              <p className="fp-metric-label">{metric.label}</p>
            </li>
          ))}
        </ul>
        <div className="fp-foot">
          <p className="fp-context">
            <span>{fieldProof.context}</span>
            <span aria-hidden="true">·</span>
            <span className="fp-period font-mono">{fieldProof.period}</span>
          </p>
          <p className="fp-method font-mono">{fieldProof.method}</p>
        </div>
      </div>
    </aside>
  )
}
