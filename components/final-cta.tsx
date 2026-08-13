'use client'

import { useState, type FormEvent } from 'react'
import { finalCta } from '@/lib/site-data'
import { submitOpportunityReview, type ReviewRequest } from '@/lib/submit-review'
import { Reveal } from '@/components/reveal'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const inputClasses =
  'w-full rounded-md border border-graphite bg-carbon px-4 py-3 text-base text-porcelain placeholder:text-fog focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime'

const labelClasses = 'text-sm font-semibold text-porcelain'

export function FinalCta() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return
    const form = e.currentTarget
    const formData = new FormData(form)

    const data: ReviewRequest = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      dealership: String(formData.get('dealership') ?? '').trim(),
      website: String(formData.get('website') ?? '').trim(),
      role: String(formData.get('role') ?? '').trim(),
      concern: String(formData.get('concern') ?? ''),
      notes: String(formData.get('notes') ?? '').trim(),
      company_website: String(formData.get('company_website') ?? ''),
    }

    const nextErrors: Record<string, string> = {}
    if (!data.name) nextErrors.name = 'Please enter your name.'
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      nextErrors.email = 'Please enter a valid work email.'
    if (!data.dealership) nextErrors.dealership = 'Please enter your dealership or group.'
    if (!data.website) nextErrors.website = 'Please enter your website URL.'
    if (!data.concern) nextErrors.concern = 'Please choose a primary concern.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      return
    }

    setStatus('submitting')
    const result = await submitOpportunityReview(data)
    if (result.ok) {
      setStatus('success')
    } else {
      // Entered values stay in the uncontrolled fields — nothing is reset.
      if (result.errors) setErrors(result.errors)
      setStatus('error')
    }
  }

  return (
    <section
      id="opportunity-review"
      aria-labelledby="cta-heading"
      className="ink-grid scroll-mt-24 bg-ink"
    >
      {/* Orange directional endpoint marking the final move toward action */}
      <div className="h-[3px] w-full bg-action" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-lime">
            {finalCta.eyebrow}
          </p>
          <h2
            id="cta-heading"
            className="mt-4 text-3xl font-semibold tracking-tight text-porcelain md:text-5xl text-balance"
          >
            {finalCta.headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[color:var(--on-ink-muted)] text-pretty">
            {finalCta.supporting}
          </p>
          <div className="mt-10 border-l-2 border-lime pl-5">
            <p className="text-base leading-relaxed text-[color:var(--on-ink-muted)] md:text-lg">
              {finalCta.confidence}
            </p>
          </div>
        </Reveal>

        <Reveal delay={110} className="rounded-[8px] border border-graphite bg-carbon p-6 md:p-8">
          {status === 'success' ? (
            <div role="status" className="flex min-h-[400px] flex-col items-start justify-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-ink">
                  <path d="M4 11.5l5 5L18 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="text-2xl font-semibold text-porcelain text-balance">
                {finalCta.successHeading}
              </h3>
              <p className="text-base leading-relaxed text-[color:var(--on-ink-muted)]">{finalCta.successCopy}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-4">
              {/* Honeypot — hidden from real users, filled only by bots */}
              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="cta-company-website">Company website</label>
                <input
                  id="cta-company-website"
                  name="company_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
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
                  <span className="font-normal text-fog">(optional)</span>
                </label>
                <textarea id="cta-notes" name="notes" rows={4} className={inputClasses} />
              </div>

              {status === 'error' && (
                <p role="alert" className="rounded-md border border-coral/50 bg-coral/10 px-4 py-3 text-sm text-porcelain">
                  {finalCta.errorCopy}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                aria-busy={status === 'submitting'}
                className="btn btn-action-dark mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending your request…' : finalCta.submitLabel}
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
              <p className="text-sm leading-relaxed text-fog">{finalCta.consent}</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
