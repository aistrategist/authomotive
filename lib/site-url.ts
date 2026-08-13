/**
 * Centralized production URL. NEXT_PUBLIC_SITE_URL should be set to
 * https://www.authomotive.com in production. Preview deployments fall
 * back to the same intended production value for canonical/schema
 * purposes and are excluded from indexing via robots rules.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '')
  return configured && configured.startsWith('http') ? configured : 'https://www.authomotive.com'
}

/** True only for the production Vercel deployment (or local prod build). */
export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : true
}
