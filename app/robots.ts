import type { MetadataRoute } from 'next'
import { getSiteUrl, isProductionDeployment } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must never be indexed.
  if (!isProductionDeployment()) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  const siteUrl = getSiteUrl()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
