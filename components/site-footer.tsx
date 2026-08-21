import { navLinks, siteConfig } from '@/lib/site-data'
import { Wordmark } from '@/components/site-header'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 md:py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="flex flex-col gap-3">
            <Wordmark inverted />
            <p className="text-base text-fog">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-sm text-sm font-medium text-porcelain/80 transition-colors hover:text-porcelain focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#opportunity-review"
              className="rounded-sm text-sm font-medium text-porcelain/80 transition-colors hover:text-porcelain focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="mt-12 border-t border-graphite pt-6">
          <p className="text-sm text-fog">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
