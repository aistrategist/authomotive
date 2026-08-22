import type { MetadataRoute } from 'next'
import { getSiteUrl, isPubliclyIndexable } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  // Do not advertise Vercel preview/staging or non-indexable routes.
  if (!isPubliclyIndexable()) {
    return []
  }

  const siteUrl = getSiteUrl()
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
