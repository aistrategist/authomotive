'use client'

import { useEffect } from 'react'
import { scrollToId } from '@/lib/scroll-to-id'

/**
 * Intercepts same-page hash links and replaces unbounded CSS smooth
 * scrolling with a 600ms capped animation. Reveal content stays visible.
 */
export function AnchorScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return
      }
      const target = e.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href^="#"]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      const id = decodeURIComponent(href.slice(1))
      if (!document.getElementById(id)) return
      e.preventDefault()
      scrollToId(id)
      if (history.replaceState) history.replaceState(null, '', href)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
