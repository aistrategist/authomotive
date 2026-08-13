import Link from 'next/link'
import { cta } from '@/lib/site-data'

export default function NotFound() {
  return (
    <main className="paper-grid flex min-h-screen flex-col items-center justify-center bg-paper px-5 py-24 text-center">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-signal-deep">
        Page not found
      </p>
      <h1 className="mt-5 font-mono text-7xl font-bold tracking-tight text-ink md:text-8xl">
        404
      </h1>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
        The page you&apos;re looking for doesn&apos;t exist or has moved. The homepage has
        everything Authomotive builds, measures, and reports.
      </p>
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link href="/" className="btn btn-action">
          Back to the homepage
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
        </Link>
        <Link
          href="/#opportunity-review"
          className="editorial-link"
        >
          {cta.primary}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  )
}
