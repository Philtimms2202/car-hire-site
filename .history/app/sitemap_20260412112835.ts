import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://timmstravel.com'

  return [
    {
      url: `${base}/sitemap-locations.xml`,
      lastModified: new Date(),
    },
    {
      url: `${base}/sitemap-routes-hubs.xml`,
      lastModified: new Date(),
    }
  ]
}
