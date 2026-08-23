'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { finalCta } from '@/lib/site-data'
import { submitOpportunityReview, type ReviewRequest } from '@/lib/submit-review'
import { SignalRail } from '@/components/signal-rail'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Status = 'idle' | 'submitting' | 'success' | 'error'
type ScopeId = 'authority' | 'intelligence' | 'measurement'

const inputClasses =
  'or-field w-full rounded-md border border-stage-line bg-stage-deep px-4 py-3 text-base text-stage-foreground placeholder:text-stage-muted'

const labelClasses = 'text-sm font-semibold text-stage-foreground'

const reviewAreas: { id: ScopeId; mark: string; label: string }[] = [
  { id: 'authority', mark: 'bg-accent', label: 'Authority content' },
  { id: 'intelligence', mark: 'bg-proof', label: 'Intelligence and reporting' },
  { id: 'measurement', mark: 'bg-paper', label: 'Measurement gaps' },
]

const concernToScopes: Record<string, ScopeId[] | 'neutral' | 'all'> = {
  'Our content is not earning enough visibility': ['authority'],
  'Our AI discovery foundation is unclear': ['authority'],
  'We cannot clearly explain performance': ['intelligence'],
  'Important buyer actions are not being tracked': ['measurement'],
  'We need the complete framework': 'all',
  'I am not sure yet': 'neutral',
}

function scopesFor(concern: string): { active: ScopeId[]; connected: boolean } {
  const mapped = concernToScopes[concern]
  if (!concern || mapped === 'neutral' || mapped == null) {
    return { active: [], connected: false }
  }
  if (mapped === 'all') {
    return { active: ['authority', 'intelligence', 'measurement'], connected: true }
  }
  return { active: mapped, connected: false }
}

export function FinalCta() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [concern, setConcern] = useState('')
  const rootRef = useRef<HTMLElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const frameRuleRef = useRef<HTMLSpanElement>(null)
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  const errorRegionRef = useRef<HTMLDivElement>(null)
  const { active, connected } = scopesFor(concern)

  useGSAP(
    () => {
      const root = rootRef.current
      const rule = ruleRef.current
      const frameRule = frameRuleRef.current
      if (!root || !rule || !frameRule) return

      const marks = gsap.utils.toArray<HTMLElement>('.or-mark', root)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const complete = () => {
        gsap.set(rule, { scaleX: 1 })
        gsap.set(frameRule, { scaleX: 1 })
        marks.forEach((el) => el.classList.add('is-ready'))
      }

      if (reduced) {
        complete()
        return
      }

      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(frameRule, { scaleX: 0, transformOrigin: 'left center' })

      ScrollTrigger.create({
        trigger: root,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
          tl.to(rule, { scaleX: 1, duration: 0.45 }, 0)
          marks.forEach((el, i) => {
            tl.add(() => el.classList.add('is-ready'), 0.2 + i * 0.14)
          })
          tl.to(frameRule, { scaleX: 1, duration: 0.5 }, 0.45)
        },
      })

      ScrollTrigger.refresh()
    },
    { scope: rootRef },
  )

  useEffect(() => {
    if (status === 'success') {
      successHeadingRef.current?.focus()
    }
    if (status === 'error') {
      errorRegionRef.current?.focus()
    }
  }, [status])

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
      const firstKey = ['name', 'email', 'dealership', 'website', 'concern'].find((key) => nextErrors[key])
      requestAnimationFrame(() => {
        form.querySelector<HTMLElement>(firstKey ? `#cta-${firstKey}` : '[aria-invalid="true"]')?.focus()
      })
      return
    }

    setStatus('submitting')
    const result = await submitOpportunityReview(data)
    if (result.ok) {
      setStatus('success')
    } else {
      if (result.errors) setErrors(result.errors)
      setStatus('error')
    }
  }

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
            <p className="mt-5 text-lg leading-relaxed text-[color:var(--on-ink-muted)] text-pretty">
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
              <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-4">
                <div
                  className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
                  aria-hidden="true"
                  inert
                >
                  <label htmlFor="cta-company-website">Company website</label>
                  <input
                    id="cta-company-website"
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
                      onChange={(event) => setConcern(event.target.value)}
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
                <p className="text-sm leading-relaxed text-fog">{finalCta.consent}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
