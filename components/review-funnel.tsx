'use client'

import { useEffect } from 'react'
import {
  isMeaningfulFormControl,
  isReviewCtaHref,
  reviewCtaLocation,
  trackReviewCtaClick,
  trackReviewFormStart,
} from '@/lib/track-review'

function isReviewFormEvent(event: Event) {
  const target = event.target
  if (!(target instanceof Element)) return false
  if (!isMeaningfulFormControl(target)) return false
  return Boolean(target.closest('#opportunity-review form'))
}

/**
 * First-party Opportunity Review funnel measurement. Appearance, navigation,
 * and form behavior stay with the existing UI; this only records events.
 */
export function ReviewFunnel() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }
      const node = event.target
      if (!(node instanceof Element)) return
      const anchor = node.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (!isReviewCtaHref(anchor.getAttribute('href'))) return
      const location = reviewCtaLocation(anchor)
      if (location) trackReviewCtaClick(location)
    }

    function onFormInteract(event: Event) {
      if (isReviewFormEvent(event)) trackReviewFormStart()
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('focusin', onFormInteract)
    document.addEventListener('input', onFormInteract)
    document.addEventListener('change', onFormInteract)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('focusin', onFormInteract)
      document.removeEventListener('input', onFormInteract)
      document.removeEventListener('change', onFormInteract)
    }
  }, [])

  return null
}
