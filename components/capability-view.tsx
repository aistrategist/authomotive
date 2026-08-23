import type { Ref } from 'react'
import { capabilitySystem } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'
import { VisitorGlyph } from '@/components/visitor-glyph'

const jobs = capabilitySystem.capabilities
const tones = ['accent', 'proof', 'action'] as const

type JobTone = (typeof tones)[number]

function JobMotif({ id, tone }: { id: string; tone: JobTone }) {
  const stroke =
    tone === 'proof' ? 'var(--proof-deep)' : tone === 'action' ? 'var(--action-deep)' : 'var(--accent-deep)'
  const mark = tone === 'proof' ? 'var(--proof)' : tone === 'action' ? 'var(--action)' : 'var(--accent)'

  if (id === 'get-found') {
    return (
      <svg className="cap-motif" viewBox="0 0 56 40" fill="none" aria-hidden="true">
        <path
          className="cap-ill-path"
          pathLength={1}
          d="M4 34 L13 22 L19 27 L29 11 L35 17 L48 6"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="4" cy="34" r="3" fill={mark} />
        <circle className="cap-ill-end" cx="48" cy="6" r="3" fill={stroke} />
      </svg>
    )
  }
  if (id === 'know-working') {
    return (
      <svg className="cap-motif" viewBox="0 0 56 40" fill="none" aria-hidden="true">
        {[10, 16, 14, 22, 28].map((h, i) => (
          <rect
            key={i}
            className="cap-ill-bar"
            x={6 + i * 10}
            y={36 - h}
            width="6"
            height={h}
            fill={i === 4 ? mark : stroke}
            opacity={i === 4 ? 1 : 0.45}
          />
        ))}
      </svg>
    )
  }
  return (
    <svg className="cap-motif" viewBox="0 0 56 40" fill="none" aria-hidden="true">
      <path className="cap-ill-path" pathLength={1} d="M6 20 H50" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <circle className="cap-ill-node" cx="8" cy="20" r="4" fill={stroke} />
      <circle className="cap-ill-node" cx="28" cy="20" r="4" fill={mark} />
      <circle className="cap-ill-node" cx="48" cy="20" r="4" fill={stroke} />
    </svg>
  )
}

export function CapabilityView({
  rootRef,
  voyageRef,
}: {
  rootRef?: Ref<HTMLElement>
  voyageRef?: Ref<HTMLDivElement>
} = {}) {
  return (
    <section
      ref={rootRef}
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="cap-band scroll-mt-24 overflow-x-clip border-b border-border"
      data-tone="accent"
    >
      <svg className="cap-path" viewBox="0 0 100 800" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="cap-path-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent-deep)" />
            <stop offset="0.5" stopColor="var(--proof-deep)" />
            <stop offset="1" stopColor="var(--action-deep)" />
          </linearGradient>
        </defs>
        <path className="cap-path-track" d="M50 0 V800" fill="none" strokeLinecap="round" />
        <path
          className="cap-path-run"
          pathLength={1}
          d="M50 0 V800"
          fill="none"
          stroke="url(#cap-path-grad)"
          strokeLinecap="round"
        />
        <path
          className="cap-path-glide"
          pathLength={1}
          d="M50 0 V800"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        />
        <g className="cap-path-tip">
          <g className="cap-path-shopper">
            <circle className="cap-path-halo" cx="0" cy="1.4" r="10.5" />
            <circle className="cap-path-pulse" cx="0" cy="1.4" r="10.5" />
            <VisitorGlyph color="var(--paper)" />
          </g>
        </g>
      </svg>
      <SignalRail step={2} />
      <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <div className="max-w-[40rem]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-proof-deep">
            {capabilitySystem.eyebrow}
          </p>
          <h2
            id="capabilities-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-5xl text-balance"
          >
            {capabilitySystem.headline}
          </h2>
          <p className="lede mt-4 text-muted-foreground text-pretty">
            {capabilitySystem.supporting}
          </p>
          <p className="mt-3 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-ink/55">
            {capabilitySystem.motto}
          </p>
        </div>

        <div ref={voyageRef} className="cap-voyage mt-10 md:mt-14" data-tone="accent">
          {jobs.map((job, i) => {
            const tone = tones[i] ?? 'accent'
            const side = i % 2 === 0 ? 'right' : 'left'
            return (
              <article
                key={job.id}
                className={`cap-stop${i === 0 ? ' is-on' : ''}`}
                data-tone={tone}
                data-side={side}
                data-job={job.id}
              >
                <span className="cap-pin" />
                <div className="cap-tick">
                  <p className="cap-index">{String(i + 1).padStart(2, '0')}</p>
                  <span data-cap-ill={job.id} className="cap-motif-wrap" aria-hidden="true">
                    <JobMotif id={job.id} tone={tone} />
                  </span>
                </div>
                <div className="cap-card">
                  <p className="cap-card-verb">{job.verb}</p>
                  <h3 className="cap-card-name">{job.brandedName}</h3>
                  <p className="cap-card-line">{job.line}</p>
                  <ul className="cap-proofs">
                    {job.proofs.map((proof) => (
                      <li key={proof}>
                        <span className="cap-dot" aria-hidden="true" />
                        {proof}
                      </li>
                    ))}
                  </ul>
                  <a href={job.nextHref} className="cap-dock">
                    {job.nextLabel}
                    <span className="cap-dock-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
