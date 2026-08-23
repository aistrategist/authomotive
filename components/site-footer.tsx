import { navLinks, siteConfig } from '@/lib/site-data'
import { Wordmark } from '@/components/site-header'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-stage">
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="flex flex-col gap-3">
            <p>
              <span className="sr-only">Authomotive</span>
              <Wordmark inverted />
            </p>
            <p className="text-base text-stage-muted">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-sm text-sm font-medium text-stage-muted transition-colors hover:text-stage-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#opportunity-review"
              className="rounded-sm text-sm font-medium text-stage-muted transition-colors hover:text-stage-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="mt-12 border-t border-stage-line pt-6">
          <p className="text-sm text-stage-muted">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
