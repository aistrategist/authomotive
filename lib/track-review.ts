import { track } from '@vercel/analytics'

export const REVIEW_CTA_CLICK = 'opportunity_review_cta_click'
export const REVIEW_FORM_START = 'opportunity_review_form_start'
export const REVIEW_SUBMIT_SUCCESS = 'opportunity_review_submit_success'

export type ReviewCtaLocation = 'hero' | 'header' | 'mobile_nav' | 'footer' | '404'

const locations = new Set<ReviewCtaLocation>(['hero', 'header', 'mobile_nav', 'footer', '404'])

let formStartSent = false
let submitSuccessSent = false

export function isReviewCtaHref(href: string | null) {
  if (!href) return false
  const hash = href.split('#')[1]
  return hash === 'opportunity-review'
}

export function reviewCtaLocation(anchor: Element): ReviewCtaLocation | null {
  const marked = anchor.getAttribute('data-review-cta')
  if (marked && locations.has(marked as ReviewCtaLocation)) {
    return marked as ReviewCtaLocation
  }
  if (anchor.closest('.site-nav-sheet')) return 'mobile_nav'
  if (anchor.closest('.site-header')) return 'header'
  if (anchor.closest('footer')) return 'footer'
  if (anchor.closest('.hero-atmosphere')) return 'hero'
  return null
}

export function trackReviewCtaClick(location: ReviewCtaLocation) {
  track(REVIEW_CTA_CLICK, { location })
}

export function trackReviewFormStart() {
  if (formStartSent) return
  formStartSent = true
  track(REVIEW_FORM_START)
}

export function trackReviewSubmitSuccess() {
  if (submitSuccessSent) return
  submitSuccessSent = true
  track(REVIEW_SUBMIT_SUCCESS)
}

export function isMeaningfulFormControl(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.getAttribute('name') === 'company_website') return false
  return target.matches('input, select, textarea, button[type="submit"]')
}
