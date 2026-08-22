/**
 * Single server-side source of truth for the public site origin.
 *
 * Resolution order:
 * 1. Explicit SITE_URL (preferred) or NEXT_PUBLIC_SITE_URL
 * 2. https://${VERCEL_PROJECT_PRODUCTION_URL}
 * 3. http://localhost:3000 for local development
 *
 * Indexing is gated separately: only https://www.authomotive.com may emit
 * index, follow. Until that SITE_URL is configured, Vercel hosts stay
 * noindex and never advertise the parked GoDaddy domain.
 */

const CANONICAL_PRODUCTION_ORIGIN = 'https://www.authomotive.com'

function normalizeOrigin(raw: string | undefined | null): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const url = new URL(withProtocol)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    if (!url.hostname) return null
    // Prefer www for the Authomotive production hostname.
    if (url.hostname === 'authomotive.com') {
      url.hostname = 'www.authomotive.com'
    }
    url.hash = ''
    url.search = ''
    url.pathname = ''
    return url.origin.replace(/\/+$/, '')
  } catch {
    return null
  }
}

/**
 * Public origin used for metadataBase, canonicals, Open Graph, JSON-LD,
 * sitemap, and robots. Never falls back to a hard-coded parked domain.
 */
export function getSiteUrl(): string {
  const explicit =
    normalizeOrigin(process.env.SITE_URL) ?? normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL)
  if (explicit) return explicit

  const vercelProduction = normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  if (vercelProduction) return vercelProduction

  return 'http://localhost:3000'
}

/** True only when metadata may advertise the live www Authomotive origin. */
export function isPubliclyIndexable(): boolean {
  return getSiteUrl() === CANONICAL_PRODUCTION_ORIGIN
}

/** @deprecated Use isPubliclyIndexable — kept for call-site clarity during migration. */
export function isProductionDeployment(): boolean {
  return isPubliclyIndexable()
}

export const canonicalProductionOrigin = CANONICAL_PRODUCTION_ORIGIN
