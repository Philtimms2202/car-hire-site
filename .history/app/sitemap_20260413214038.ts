import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://timmstravel.com'
  const now = new Date()

  return [
    {
      url: `${base}/sitemap-static.xml`,
      lastModified: now,
    },
    {
      url: `${base}/sitemap-locations.xml`,
      lastModified: now,
    },
    {
      url: `${base}/sitemap-route-hubs.xml`,
      lastModified: now,
    },
    {
      url: `${base}/sitemap-blog.xml`,
      lastModified: now,
    }
  ]
}