import { client } from '../sanity/lib/client'

const BASE_URL = 'https://timmstravel.com'

export default async function sitemap() {
  const locations = await client.fetch(
    `*[_type == "location"]{
      "continentSlug": continentSlug.current,
      "countrySlug": countrySlug.current,
      "citySlug": slug.current,
      _updatedAt
    }`
  )

  // Get unique continents
  const continents = [...new Set(locations.map((l: any) => l.continentSlug))]

  // Get unique continent/country combos
  const countries = [...new Map(locations.map((l: any) => 
    [`${l.continentSlug}/${l.countrySlug}`, l]
  )).values()]

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

  // Continent pages e.g. /locations/europe
  const continentPages = continents.map((continent: any) => ({
    url: `${BASE_URL}/locations/${continent}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Country pages e.g. /locations/europe/united-kingdom
  const countryPages = countries.map((location: any) => ({
    url: `${BASE_URL}/locations/${location.continentSlug}/${location.countrySlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  // City pages e.g. /locations/europe/united-kingdom/london
  const cityPages = locations.map((location: any) => ({
    url: `${BASE_URL}/locations/${location.continentSlug}/${location.countrySlug}/${location.citySlug}`,
    lastModified: new Date(location._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...continentPages, ...countryPages, ...cityPages]
}