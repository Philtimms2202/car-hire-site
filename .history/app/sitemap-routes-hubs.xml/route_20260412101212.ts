import { client } from "@/sanity/lib/client"

const BASE_URL = "https://timmstravel.com"

// Define your major hubs (you can expand this list anytime)
const MAJOR_HUBS = [
  "LHR", "LGW", "MAN", "EDI", // UK
  "CDG", "ORY", "AMS", "FRA", "MUC", // EU
  "MAD", "BCN", "FCO", "MXP", // EU South
  "JFK", "LGA", "EWR", "LAX", "SFO", "ORD", "MIA", // US
  "DXB", "AUH", "DOH", // Middle East
  "SIN", "BKK", "HKG", "KUL", // Asia
  "SYD", "MEL", // Australia
  "YYZ", "YVR", // Canada
]

export async function GET() {
  // Fetch all cities with IATA codes
  const cities = await client.fetch(`
    *[_type == "city" && defined(primaryIATA)]{
      "slug": slug.current,
      primaryIATA,
      "cityName": name,
      "countrySlug": country->slug.current,
      "continentSlug": country->continent->slug.current
    }
  `)

  // Filter to only major hubs
  const hubs = cities.filter((c: any) =>
    MAJOR_HUBS.includes(c.primaryIATA)
  )

  const urls: string[] = []

  for (const origin of hubs) {
    for (const destination of hubs) {
      if (origin.primaryIATA === destination.primaryIATA) continue

      const url = `${BASE_URL}/flights/${origin.slug}-to-${destination.slug}`

      urls.push(`
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.9</priority>
        </url>
      `)
    }
  }

  const xml = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join("\n")}
    </urlset>
  `.trim()

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
