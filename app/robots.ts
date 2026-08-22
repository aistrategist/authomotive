import type { MetadataRoute } from 'next'
import { getSiteUrl, isPubliclyIndexable } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  // Until SITE_URL points at the live www origin, keep every host closed.
  if (!isPubliclyIndexable()) {
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
