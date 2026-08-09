import { client } from '../../sanity/lib/client'

export const revalidate = 86400

const BASE_URL = 'https://timmstravel.com'

export async function GET() {
  // FIXED: was querying _type == "location" — a deprecated/leftover schema
  // with flat continentSlug/countrySlug fields. Your live data is
  // _type == "city", referenced to country -> continent, same structure
  // used by the actual location page routes.
  const cities = await client.fetch(
    `*[_type == "city" && defined(slug.current) && defined(country->slug.current) && defined(country->continent->slug.current)]{
      "citySlug": slug.current,
      "countrySlug": country->slug.current,
      "continentSlug": country->continent->slug.current,
      _updatedAt
    }`,
    {},
    { next: { revalidate: 86400, tags: ['cities'] } }
  )

  const now = new Date().toISOString()

  // Unique continents
  const continents = [...new Set(cities.map((c: any) => c.continentSlug))]

  // Unique continent/country combinations
  const countries = [
    ...new Map(
      cities.map((c: any) => [`${c.continentSlug}/${c.countrySlug}`, c])
    ).values()
  ] as any[]

  // Build dynamic URLs
  const urls = [
    // Continent pages
    ...continents.map(continent => ({
      loc: `${BASE_URL}/locations/${continent}`,
      lastmod: now,
    })),

    // Country pages
    ...countries.map(c => ({
      loc: `${BASE_URL}/locations/${c.continentSlug}/${c.countrySlug}`,
      lastmod: new Date(c._updatedAt).toISOString(),
    })),

    // City pages
    ...cities.map(c => ({
      loc: `${BASE_URL}/locations/${c.continentSlug}/${c.countrySlug}/${c.citySlug}`,
      lastmod: new Date(c._updatedAt).toISOString(),
    })),

    // Things-to-do pages
    ...cities.map(c => ({
      loc: `${BASE_URL}/locations/${c.continentSlug}/${c.countrySlug}/${c.citySlug}/things-to-do`,
      lastmod: new Date(c._updatedAt).toISOString(),
    })),

    // Hotels city pages
    ...cities.map(c => ({
      loc: `${BASE_URL}/hotels/${c.citySlug}`,
      lastmod: new Date(c._updatedAt).toISOString(),
    })),
  ]

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map(
      u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
    )
    .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}