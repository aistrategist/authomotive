import { fieldProof } from '@/lib/site-data'

/** Compact observed-result strip between Intelligence and Signal Architecture. */
export function FieldProof() {
  return (
    <aside className="fp-band" aria-labelledby="field-proof-heading">
      <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-8 md:py-9">
        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-proof-deep">
          {fieldProof.eyebrow}
        </p>
        <h2
          id="field-proof-heading"
          className="mt-2 max-w-[36rem] text-xl font-semibold tracking-tight text-ink md:text-2xl text-balance"
        >
          {fieldProof.headline}
        </h2>
        <p className="mt-2.5 max-w-[42rem] text-[0.9375rem] leading-relaxed text-ink/80 text-pretty">
          {fieldProof.supporting}
        </p>
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
    </aside>
  )
}
