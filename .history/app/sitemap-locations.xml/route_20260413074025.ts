import { client } from '../../sanity/lib/client'

const BASE_URL = 'https://timmstravel.com'

export async function GET() {
  // Fetch all locations from Sanity
  const locations = await client.fetch(`
    *[_type == "location"]{
      "continentSlug": continentSlug.current,
      "countrySlug": countrySlug.current,
      "citySlug": slug.current,
      _updatedAt
    }
  `)

  const now = new Date().toISOString()

  // Unique continents
  const continents = [...new Set(locations.map((l: any) => l.continentSlug))]

  // Unique continent/country combinations
  const countries = [
    ...new Map(
      locations.map((l: any) => [`${l.continentSlug}/${l.countrySlug}`, l])
    ).values()
  ] as any[]

  // Build all URLs
  const urls = [
    // Static pages
    { loc: `${BASE_URL}/`,            lastmod: now },
    { loc: `${BASE_URL}/locations`,   lastmod: now },
    { loc: `${BASE_URL}/hotels`,      lastmod: now },
    { loc: `${BASE_URL}/flights`,     lastmod: now },
    { loc: `${BASE_URL}/experiences`, lastmod: now },
    { loc: `${BASE_URL}/car-hire`,    lastmod: now },

    // Continent pages
    ...continents.map(continent => ({
      loc: `${BASE_URL}/locations/${continent}`,
      lastmod: now,
    })),

    // Country pages
    ...countries.map(l => ({
      loc: `${BASE_URL}/locations/${l.continentSlug}/${l.countrySlug}`,
      lastmod: new Date(l._updatedAt).toISOString(),
    })),

    // City pages
    ...locations.map((l: any) => ({
      loc: `${BASE_URL}/locations/${l.continentSlug}/${l.countrySlug}/${l.citySlug}`,
      lastmod: new Date(l._updatedAt).toISOString(),
    })),

    // Things-to-do pages
    ...locations.map((l: any) => ({
      loc: `${BASE_URL}/locations/${l.continentSlug}/${l.countrySlug}/${l.citySlug}/things-to-do`,
      lastmod: new Date(l._updatedAt).toISOString(),
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