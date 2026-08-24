'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { submitOpportunityReview, type ReviewRequest } from '@/lib/submit-review'
import { FinalCtaView, type FinalCtaStatus } from '@/components/final-cta-view'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export function FinalCta() {
  const [status, setStatus] = useState<FinalCtaStatus>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [concern, setConcern] = useState('')
  const submittingRef = useRef(false)
  const rootRef = useRef<HTMLElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const frameRuleRef = useRef<HTMLSpanElement>(null)
  const successHeadingRef = useRef<HTMLHeadingElement>(null)
  const errorRegionRef = useRef<HTMLDivElement>(null)

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
    if (submittingRef.current || status === 'submitting') return
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
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email))
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

    submittingRef.current = true
    setStatus('submitting')
    try {
      const result = await submitOpportunityReview(data)
      if (result.ok) {
        setStatus('success')
        return
      }
      if (result.errors) setErrors(result.errors)
      setStatus('error')
      submittingRef.current = false
    } catch {
      setStatus('error')
      submittingRef.current = false
    }
  }

  return (
    <FinalCtaView
      status={status}
      errors={errors}
      concern={concern}
      onConcern={setConcern}
      onSubmit={handleSubmit}
      rootRef={rootRef}
      ruleRef={ruleRef}
      frameRuleRef={frameRuleRef}
      successHeadingRef={successHeadingRef}
      errorRegionRef={errorRegionRef}
    />
  )
}
