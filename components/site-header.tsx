'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cta, navLinks, siteConfig } from '@/lib/site-data'

function Wordmark({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`text-[1.375rem] font-bold tracking-tight md:text-[1.625rem] ${
        inverted ? 'text-paper' : 'text-ink'
      }`}
    >
      Auth<span className={inverted ? 'text-accent' : 'text-accent-deep'}>o</span>motive
    </span>
  )
}

export { Wordmark }

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [ctaRest, setCtaRest] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Transparent-over-hero → solid Warm Paper scroll state. A single listener
  // attached once, throttled via rAF, so it never flickers near the threshold.
  // Also re-synced on bfcache restore, tab refocus, and resize/layout shifts,
  // since those can change or reveal scroll position without a scroll event.
  useEffect(() => {
    const THRESHOLD = 28
    let ticking = false

    function apply() {
      setScrolled(window.scrollY > THRESHOLD)
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(apply)
      }
    }

    function onPageShow() {
      // Fires on bfcache restore (back/forward navigation), where React
      // effects don't re-run but scroll position may already be non-zero.
      apply()
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') apply()
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('pageshow', onPageShow)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pageshow', onPageShow)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  // One active nav item from a viewport band. Hero, platforms, interludes,
  // and the Opportunity Review clear the state instead of leaving a false hit.
  useEffect(() => {
    const navOrder = [
      'capabilities',
      'authority-experiences',
      'reporting',
      'measurement',
      'how-it-works',
    ] as const
    const clearIds = new Set(['top', 'platforms', 'opportunity-review', 'clear'])
    const sources = new Map<Element, { key: string; ratio: number }>()

    function spyKey(el: Element) {
      if (el.id && (navOrder as readonly string[]).includes(el.id)) return el.id
      if (el.id && clearIds.has(el.id)) return el.id
      return el.getAttribute('data-spy') || el.id
    }

    function pick() {
      const ratios = new Map<string, number>()
      for (const { key, ratio } of sources.values()) {
        ratios.set(key, Math.max(ratios.get(key) ?? 0, ratio))
      }

      const atForm = (ratios.get('opportunity-review') ?? 0) > 0.12
      setCtaRest(atForm)
      if (atForm) {
        setActiveSection('')
        return
      }

      let clearScore = 0
      for (const id of clearIds) {
        clearScore = Math.max(clearScore, ratios.get(id) ?? 0)
      }

      let best: string | null = null
      let bestRatio = 0
      for (const id of navOrder) {
        const r = ratios.get(id) ?? 0
        if (r > bestRatio) {
          bestRatio = r
          best = id
        }
      }

      if (!best || bestRatio < 0.1 || clearScore > bestRatio + 0.04) {
        setActiveSection('')
        return
      }
      setActiveSection(`#${best}`)
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = spyKey(entry.target)
          if (!key) continue
          sources.set(entry.target, {
            key,
            ratio: entry.isIntersecting ? entry.intersectionRatio : 0,
          })
        }
        pick()
      },
      {
        root: null,
        rootMargin: '-22% 0px -58% 0px',
        threshold: [0, 0.08, 0.16, 0.28, 0.45, 0.7, 1],
      },
    )

    const nodes: Element[] = []
    for (const id of [...navOrder, 'top', 'platforms', 'opportunity-review']) {
      const el = document.getElementById(id)
      if (el) nodes.push(el)
    }
    document.querySelectorAll('[data-spy]').forEach((el) => nodes.push(el))
    nodes.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Body scroll lock
  useEffect(() => {
    if (!menuOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [menuOpen])

  // Focus trap + escape
  useEffect(() => {
    if (!menuOpen) return
    const dialog = dialogRef.current
    if (!dialog) return

    const focusables = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null)

    const first = focusables()[0]
    first?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMenu()
        return
      }
      if (e.key === 'Tab') {
        const list = focusables()
        if (list.length === 0) return
        const firstEl = list[0]
        const lastEl = list[list.length - 1]
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, closeMenu])

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 border-b ${
        scrolled ? 'border-ink/10 bg-paper' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="site-header-bar mx-auto flex h-[4.5rem] max-w-[1280px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-5 md:px-8">
        <a
          href="#top"
          aria-label="Authomotive home"
          className={`min-w-0 shrink rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 ${
            scrolled ? 'focus-visible:outline-accent-deep' : 'focus-visible:outline-accent'
          }`}
        >
          <Wordmark inverted={!scrolled} />
        </a>

        <nav aria-label="Primary" className="hidden items-center lg:flex lg:gap-4 xl:gap-6">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative whitespace-nowrap rounded-sm py-1 text-[14px] font-semibold tracking-[-0.006em] hover:underline hover:underline-offset-[6px] hover:decoration-accent hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 active:translate-y-px xl:text-[15px] ${
                  scrolled ? 'text-ink focus-visible:outline-accent-deep' : 'text-paper focus-visible:outline-accent'
                }`}
              >
                {link.label}
                {/* Compact active-section signal — a small Lime marker with a Petrol Ink outline, not a glowing dot */}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-2 left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-[1px] border border-ink bg-lime transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
            )
          })}
          <a
            href="#opportunity-review"
            className={`btn btn-action header-cta !min-h-[44px] !whitespace-nowrap !px-4 !text-[15px] xl:!px-5${ctaRest ? ' is-rest' : ''}`}
          >
            {cta.primary}
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </nav>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          className={`site-header-menu flex h-11 w-11 items-center justify-center rounded-md border-2 focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden ${
            scrolled
              ? 'border-ink bg-paper text-ink focus-visible:outline-accent-deep'
              : 'border-paper/60 bg-stage/30 text-paper focus-visible:outline-accent'
          }`}
        >
          <span className="sr-only">Open menu</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {mounted &&
        menuOpen &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="site-nav-sheet fixed inset-0 z-[60] flex h-dvh flex-col bg-stage"
          >
            <div className="flex h-[4.5rem] items-center justify-between border-b border-stage-line px-4 sm:px-5">
              <span className="sr-only">Authomotive</span>
              <Wordmark inverted />
              <button
                type="button"
                onClick={closeMenu}
                className="flex h-11 w-11 items-center justify-center rounded-md border border-stage-line text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="sr-only">Close menu</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex items-center gap-3 rounded-md px-3 py-4 text-2xl transition-colors hover:bg-stage-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      isActive ? 'font-bold text-accent' : 'font-semibold text-paper'
                    }`}
                  >
                    {isActive && (
                      <span aria-hidden="true" className="h-[9px] w-[9px] shrink-0 rounded-[1px] border border-ink bg-lime" />
                    )}
                    {link.label}
                  </a>
                )
              })}
              <a
                href="#opportunity-review"
                onClick={closeMenu}
                className={`btn btn-action-dark header-cta mt-6 !text-lg${ctaRest ? ' is-rest' : ''}`}
              >
                {cta.primary}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <p className="mt-auto pt-10 text-sm text-fog">{siteConfig.tagline}</p>
            </nav>
          </div>,
          document.body,
        )}
    </header>
  )
}
