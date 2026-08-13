'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cta, navLinks, siteConfig } from '@/lib/site-data'

function Wordmark({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      className={`text-[1.375rem] font-bold tracking-tight md:text-[1.625rem] ${
        inverted ? 'text-paper' : 'text-ink'
      }`}
    >
      Auth<span className={inverted ? 'text-lime' : 'text-signal-deep'}>o</span>motive
    </span>
  )
}

export { Wordmark }

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
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

  // Restrained active-link indicator via scrollspy
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    sections.forEach((s) => io.observe(s))
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
      className={`fixed inset-x-0 top-0 z-40 border-b ${
        scrolled ? 'border-ink/10 bg-paper' : 'border-paper/15 bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[1320px] items-center justify-between gap-6 px-5 md:px-8">
        <a
          href="#top"
          className={`rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 ${
            scrolled ? 'focus-visible:outline-ink' : 'focus-visible:outline-lime'
          }`}
        >
          <Wordmark inverted={!scrolled} />
          <span className="sr-only">Authomotive home</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center lg:flex lg:gap-7">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative whitespace-nowrap rounded-sm py-1 text-[15px] font-semibold tracking-[-0.006em] hover:underline hover:underline-offset-[6px] hover:decoration-action hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 active:translate-y-px ${
                  scrolled ? 'text-ink focus-visible:outline-ink' : 'text-paper focus-visible:outline-lime'
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
            className="btn btn-action !min-h-[44px] !whitespace-nowrap !px-4 !text-[15px] xl:!px-5"
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
          className={`flex h-11 w-11 items-center justify-center rounded-md border-2 lg:hidden ${
            scrolled ? 'border-ink bg-paper text-ink' : 'border-paper/60 bg-ink/30 text-paper'
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
            className="fixed inset-0 z-50 flex h-dvh flex-col bg-ink"
          >
            <div className="flex h-[4.5rem] items-center justify-between border-b border-graphite px-5">
              <Wordmark inverted />
              <button
                type="button"
                onClick={closeMenu}
                className="flex h-11 w-11 items-center justify-center rounded-md border border-graphite text-paper"
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
                    className={`flex items-center gap-3 rounded-md px-3 py-4 text-2xl transition-colors hover:bg-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${
                      isActive ? 'font-bold text-lime' : 'font-semibold text-paper'
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
                className="btn btn-action-dark mt-6 !text-lg"
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
