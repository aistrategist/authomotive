export const HEADER_OFFSET = 96
const DURATION = 600

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3
}

function done() {
  window.dispatchEvent(new Event('autho:scrolled'))
}

/** Capped hash scroll: 500–800ms, respects reduced motion and sticky header. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) {
    done()
    return
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.scrollIntoView()
    done()
    return
  }

  const target = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  const start = window.scrollY
  const distance = target - start
  if (Math.abs(distance) < 2) {
    done()
    return
  }

  const startTime = performance.now()
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / DURATION)
    window.scrollTo(0, start + distance * easeOutCubic(t))
    if (t < 1) requestAnimationFrame(step)
    else done()
  }
  requestAnimationFrame(step)
}
