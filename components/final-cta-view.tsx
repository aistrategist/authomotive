import type { FormEvent, Ref } from 'react'
import { finalCta } from '@/lib/site-data'
import { SignalRail } from '@/components/signal-rail'

export type FinalCtaStatus = 'idle' | 'submitting' | 'success' | 'error'
export type FinalScopeId = 'authority' | 'intelligence' | 'measurement'

const inputClasses =
  'or-field w-full rounded-md border border-stage-line bg-stage-deep px-4 py-3 text-base text-stage-foreground placeholder:text-stage-muted'

const labelClasses = 'text-sm font-semibold text-stage-foreground'

const reviewAreas: { id: FinalScopeId; mark: string; label: string }[] = [
  { id: 'authority', mark: 'bg-accent', label: 'Authority content' },
  { id: 'intelligence', mark: 'bg-proof', label: 'Intelligence and reporting' },
  { id: 'measurement', mark: 'bg-paper', label: 'Measurement gaps' },
]

const concernToScopes: Record<string, FinalScopeId[] | 'neutral' | 'all'> = {
  'Our content is not earning enough visibility': ['authority'],
  'Our AI discovery foundation is unclear': ['authority'],
  'We cannot clearly explain performance': ['intelligence'],
  'Important buyer actions are not being tracked': ['measurement'],
  'We need the complete framework': 'all',
  'I am not sure yet': 'neutral',
}

export function scopesFor(concern: string): { active: FinalScopeId[]; connected: boolean } {
  const mapped = concernToScopes[concern]
  if (!concern || mapped === 'neutral' || mapped == null) {
    return { active: [], connected: false }
  }
  if (mapped === 'all') {
    return { active: ['authority', 'intelligence', 'measurement'], connected: true }
  }
  return { active: mapped, connected: false }
}

export function FinalCtaView({
  status = 'idle',
  errors = {},
  concern = '',
  onConcern,
  onSubmit,
  rootRef,
  ruleRef,
  frameRuleRef,
  successHeadingRef,
  errorRegionRef,
}: {
  status?: FinalCtaStatus
  errors?: Record<string, string>
  concern?: string
  onConcern?: (value: string) => void
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  rootRef?: Ref<HTMLElement>
  ruleRef?: Ref<HTMLSpanElement>
  frameRuleRef?: Ref<HTMLSpanElement>
  successHeadingRef?: Ref<HTMLHeadingElement>
  errorRegionRef?: Ref<HTMLDivElement>
}) {
  const { active, connected } = scopesFor(concern)

  return (
    <section
      ref={rootRef}
      id="opportunity-review"
      aria-labelledby="cta-heading"
      className="ink-grid scroll-mt-24 bg-stage"
    >
      <SignalRail step={7} />
      <div className="relative mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16 lg:py-[4.5rem]">
        <span ref={ruleRef} className="or-chapter-rule" aria-hidden="true" />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-lime">
              {finalCta.eyebrow}
            </p>
            <h2
              id="cta-heading"
              className="mt-4 text-3xl font-semibold tracking-tight text-stage-foreground md:text-5xl text-balance"
            >
              {finalCta.headline}
            </h2>
            <p className="lede mt-5 text-[color:var(--on-ink-muted)] text-pretty">
              {finalCta.supporting}
            </p>
            <ul
              className={`or-scopes mt-8 flex flex-col gap-3 ${connected ? 'is-connected' : ''}`}
              aria-label="What the Opportunity Review covers"
            >
              {reviewAreas.map((item) => {
                const selected = active.includes(item.id)
                return (
                  <li
                    key={item.id}
                    data-scope={item.id}
                    className={`or-scope flex min-h-[56px] items-center gap-3 border px-4 py-3 text-lg font-semibold tracking-tight text-paper ${
                      selected ? 'is-on' : ''
                    }`}
                  >
                    <span className={`or-mark h-3 w-3 shrink-0 ${item.mark}`} aria-hidden="true" />
                    {item.label}
                    {selected ? <span className="sr-only">Currently in review</span> : null}
                  </li>
                )
              })}
            </ul>
            <div className="mt-8 border-l-2 border-lime pl-5">
              <p className="text-base leading-relaxed text-[color:var(--on-ink-muted)] md:text-lg">
                {finalCta.confidence}
              </p>
            </div>
          </div>

          <div className="or-frame relative rounded-[8px] border-2 border-ink bg-stage-elevated p-6 shadow-[6px_6px_0_0_var(--accent)] md:p-8 lg:col-span-7">
            <span ref={frameRuleRef} className="or-frame-rule" aria-hidden="true" />
            {status === 'success' ? (
              <div role="status" className="flex min-h-[400px] flex-col items-start justify-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-ink">
                    <path d="M4 11.5l5 5L18 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3
                  ref={successHeadingRef}
                  tabIndex={-1}
                  className="text-2xl font-semibold text-stage-foreground text-balance focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
                >
                  {finalCta.successHeading}
                </h3>
                <p className="text-base leading-relaxed text-[color:var(--on-ink-muted)]">{finalCta.successCopy}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-4">
                <div
                  className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
                  aria-hidden="true"
                  inert
                >
                  <input
                    name="company_website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-name" className={labelClasses}>
                      Name
                    </label>
                    <input
                      id="cta-name"
                      name="name"
                      autoComplete="name"
                      required
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'cta-name-error' : undefined}
                      className={inputClasses}
                    />
                    {errors.name && (
                      <p id="cta-name-error" className="text-sm text-coral">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-email" className={labelClasses}>
                      Work email
                    </label>
                    <input
                      id="cta-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'cta-email-error' : undefined}
                      className={inputClasses}
                    />
                    {errors.email && (
                      <p id="cta-email-error" className="text-sm text-coral">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-dealership" className={labelClasses}>
                      Dealership or dealer group
                    </label>
                    <input
                      id="cta-dealership"
                      name="dealership"
                      autoComplete="organization"
                      required
                      aria-invalid={Boolean(errors.dealership)}
                      aria-describedby={errors.dealership ? 'cta-dealership-error' : undefined}
                      className={inputClasses}
                    />
                    {errors.dealership && (
                      <p id="cta-dealership-error" className="text-sm text-coral">
                        {errors.dealership}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-website" className={labelClasses}>
                      Website URL
                    </label>
                    <input
                      id="cta-website"
                      name="website"
                      type="url"
                      inputMode="url"
                      placeholder="https://"
                      autoComplete="url"
                      required
                      aria-invalid={Boolean(errors.website)}
                      aria-describedby={errors.website ? 'cta-website-error' : undefined}
                      className={inputClasses}
                    />
                    {errors.website && (
                      <p id="cta-website-error" className="text-sm text-coral">
                        {errors.website}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-role" className={labelClasses}>
                      Role
                    </label>
                    <input
                      id="cta-role"
                      name="role"
                      autoComplete="organization-title"
                      className={inputClasses}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="cta-concern" className={labelClasses}>
                      Primary concern
                    </label>
                    <select
                      id="cta-concern"
                      name="concern"
                      required
                      defaultValue=""
                      onChange={onConcern ? (event) => onConcern(event.target.value) : undefined}
                      aria-invalid={Boolean(errors.concern)}
                      aria-describedby={errors.concern ? 'cta-concern-error' : undefined}
                      className={inputClasses}
                    >
                      <option value="" disabled>
                        Choose one
                      </option>
                      {finalCta.concernOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.concern && (
                      <p id="cta-concern-error" className="text-sm text-coral">
                        {errors.concern}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cta-notes" className={labelClasses}>
                    What should your website be doing better?{' '}
                    <span className="font-normal text-[color:var(--on-ink-muted)]">(optional)</span>
                  </label>
                  <textarea id="cta-notes" name="notes" rows={4} className={inputClasses} />
                </div>

                {status === 'error' && (
                  <div
                    ref={errorRegionRef}
                    role="alert"
                    tabIndex={-1}
                    className="rounded-md border border-coral/50 bg-coral/10 px-4 py-3 text-sm text-stage-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
                  >
                    {finalCta.errorCopy}
                  </div>
                )}

                {status === 'submitting' ? (
                  <p role="status" className="sr-only">
                    Sending your request
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  aria-busy={status === 'submitting'}
                  className="btn btn-action-dark or-submit mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {finalCta.submitLabel}
                  <span className="btn-arrow" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M3 9h11m0 0L9.5 4.5M14 9l-4.5 4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                <p className="text-sm leading-relaxed text-[color:var(--on-ink-muted)]">{finalCta.consent}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
