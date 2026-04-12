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

  // Unique continents
  const continents = [...new Set(locations.map(l => l.continentSlug))]

  // Unique continent/country combos
  const countries = [
    ...new Map(
      locations.map(l => [`${l.continentSlug}/${l.countrySlug}`, l])
    ).values()
  ]

  // Build all URLs
  const urls = [
    // Static pages
    {
      loc: `${BASE_URL}/`,
      lastmod: new Date().toISOString(),
    },
    {
      loc: `${BASE_URL}/locations`,
      lastmod: new Date().toISOString(),
    },

    // Continent pages
    ...continents.map(c => ({
      loc: `${BASE_URL}/locations/${c}`,
      lastmod: new Date().toISOString(),
    })),

    // Country pages
    ...countries.map(l => ({
      loc: `${BASE_URL}/locations/${l.continentSlug}/${l.countrySlug}`,
      lastmod: new Date(l._updatedAt).toISOString(),
    })),

    // City pages
    ...locations.map(l => ({
      loc: `${BASE_URL}/locations/${l.continentSlug}/${l.countrySlug}/${l.citySlug}`,
      lastmod: new Date(l._updatedAt).toISOString(),
    })),

    // Things-to-do pages
    ...locations.map(l => ({
      loc: `${BASE_URL}/locations/${l.continentSlug}/${l.countrySlug}/${l.citySlug}/things-to-do`,
      lastmod: new Date(l._updatedAt).toISOString(),
    })),
  ]

  // Build XML
  const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          u => `
        <url>
          <loc>${u.loc}</loc>
          <lastmod>${u.lastmod}</lastmod>
        </url>`
        )
        .join('')}
    </urlset>
  `.trim()

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
