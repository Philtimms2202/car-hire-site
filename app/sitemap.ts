import { client } from '../sanity/lib/client'

const BASE_URL = 'https://timmstravel.com'

export default async function sitemap() {
  // Fetch all locations from Sanity
  const locations = await client.fetch(
    `*[_type == "location"]{
      "continentSlug": continentSlug.current,
      "countrySlug": countrySlug.current,
      "citySlug": slug.current,
      _updatedAt
    }`
  )

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Dynamic city pages
  const cityPages = locations.map((location: any) => ({
    url: `${BASE_URL}/locations/${location.continentSlug}/${location.countrySlug}/${location.citySlug}`,
    lastModified: new Date(location._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...cityPages]
}