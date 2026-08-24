'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cta, navLinks, siteConfig } from '@/lib/site-data'
import { HEADER_OFFSET } from '@/lib/scroll-to-id'

function Wordmark({ inverted = false, adaptive = false }: { inverted?: boolean; adaptive?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`header-wordmark text-[1.375rem] font-bold tracking-tight md:text-[1.625rem] ${
        adaptive ? '' : inverted ? 'text-paper' : 'text-ink'
      }`}
    >
      Auth
      <span
        className={`header-wordmark-o ${
          adaptive ? '' : inverted ? 'text-accent' : 'text-accent-deep'
        }`}
      >
        o
      </span>
      motive
    </span>
  )
}

export { Wordmark }

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Square under the current chapter. Hold the clicked link during a jump so
  // the dot does not flicker through every section on the way up or down.
  useEffect(() => {
    const chapters = [
      { href: '#capabilities', id: 'capabilities' },
      { href: '#authority-experiences', id: 'authority-experiences' },
      { href: '#reporting', id: 'reporting' },
      { href: '#measurement', id: 'measurement' },
      { href: '#how-it-works', id: 'how-it-works' },
      { href: '#how-it-works', id: 'engagement' },
    ] as const
    const line = HEADER_OFFSET + 40
    let ticking = false
    let held = false
    let heldHref = ''
    let settle = 0

    function setActive(next: string) {
      const header = headerRef.current
      if (!header || header.dataset.active === next) return
      header.dataset.active = next
      header.querySelectorAll<HTMLAnchorElement>('.header-nav-link').forEach((el) => {
        const href = el.getAttribute('href')
        if (next && href === next) el.setAttribute('aria-current', 'true')
        else el.removeAttribute('aria-current')
      })
    }

    function apply() {
      ticking = false
      const header = headerRef.current
      if (!header || held) return

      const form = document.getElementById('opportunity-review')
      const atForm = Boolean(form && form.getBoundingClientRect().top < window.innerHeight * 0.42)
      header.classList.toggle('is-cta-rest', atForm)
      header.querySelectorAll('.header-cta').forEach((el) => {
        el.classList.toggle('is-rest', atForm)
      })

      let next = ''
      if (!atForm) {
        for (const chapter of chapters) {
          const el = document.getElementById(chapter.id)
          if (el && el.getBoundingClientRect().top <= line) next = chapter.href
        }
        const first = document.getElementById('capabilities')
        if (first && first.getBoundingClientRect().top > line) next = ''
      }

      setActive(next)
    }

    function landedOn(href: string) {
      return chapters.some((chapter) => {
        if (chapter.href !== href) return false
        const el = document.getElementById(chapter.id)
        if (!el) return false
        const top = el.getBoundingClientRect().top
        return top > -160 && top < HEADER_OFFSET + 80
      })
    }

    function release() {
      window.clearTimeout(settle)
      const jumpTo = heldHref
      held = false
      heldHref = ''
      if (jumpTo && landedOn(jumpTo)) {
        setActive(jumpTo)
        return
      }
      apply()
    }

    function hold(next: string) {
      held = true
      heldHref = next
      window.clearTimeout(settle)
      settle = window.setTimeout(release, 750)
      setActive(next)
    }

    function onScroll() {
      if (held) return
      if (ticking) return
      ticking = true
      requestAnimationFrame(apply)
    }

    function onClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }
      const node = event.target
      if (!(node instanceof Element)) return
      const anchor = node.closest('a[href^="#"]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      const id = decodeURIComponent(href.slice(1))
      if (id === 'top' || id === 'opportunity-review') {
        hold('')
        return
      }
      const match = chapters.find((chapter) => chapter.id === id || chapter.href === href)
      if (match) hold(match.href)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('hashchange', apply)
    window.addEventListener('autho:scrolled', release)
    document.addEventListener('click', onClick, true)
    return () => {
      window.clearTimeout(settle)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('hashchange', apply)
      window.removeEventListener('autho:scrolled', release)
      document.removeEventListener('click', onClick, true)
    }
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
      ref={headerRef}
      className="site-header fixed inset-x-0 top-0 z-50 border-b"
    >
      <div className="site-header-bar mx-auto flex h-[4.5rem] max-w-[1280px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-5 md:px-8">
        <a
          href="#top"
          aria-label="Authomotive home"
          className="header-home header-logo min-w-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <img
            src="/authomotive-logo.png"
            alt=""
            width={1024}
            height={161}
          />
        </a>

        <nav aria-label="Primary" className="hidden items-center lg:flex lg:gap-4 xl:gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="header-nav-link relative whitespace-nowrap rounded-sm py-1 text-[14px] font-semibold tracking-[-0.006em] hover:underline hover:underline-offset-[6px] hover:decoration-accent hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 active:translate-y-px xl:text-[15px]"
            >
              {link.label}
              <span
                aria-hidden="true"
                className="header-spy absolute -bottom-2 left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-[1px] border border-ink bg-lime transition-opacity"
              />
            </a>
          ))}
          <a
            href="#opportunity-review"
            className="btn btn-action header-cta !min-h-[44px] !whitespace-nowrap !px-4 !text-[15px] xl:!px-5"
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
          className="site-header-menu flex h-11 w-11 items-center justify-center rounded-md border-2 focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
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
                const isActive = headerRef.current?.dataset.active === link.href
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
                className={`btn btn-action-dark header-cta mt-6 !text-lg${
                  headerRef.current?.classList.contains('is-cta-rest') ? ' is-rest' : ''
                }`}
              >
                {cta.primary}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <p className="mt-auto pt-10 text-sm text-stage-muted">{siteConfig.tagline}</p>
            </nav>
          </div>,
          document.body,
        )}
    </header>
  )
}
