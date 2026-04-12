import { client } from "@/sanity/lib/client"

const BASE_URL = "https://timmstravel.com"

const MAJOR_HUBS = [
  // existing hubs...
  "LHR", "LGW", "MAN", "EDI",
  "CDG", "AMS", "FRA", "MUC",
  "JFK", "LAX", "SFO", "ORD",
  "DXB", "DOH", "SIN", "BKK",

  // ⭐ NEW: Top tourist destinations
  "BCN", "MAD", "AGP", "ALC", "PMI", "TFS", "ACE",
  "FCO", "MXP", "VCE", "ATH", "LIS", "OPO", "PRG",
  "MCO", "MIA", "LAS", "BOS", "SEA",
  "CUN", "PUJ", "MBJ", "NAS",
  "DPS", "HKT", "KUL", "HKG", "ICN",
  "CPT", "RAK", "CAI",
  "SYD", "MEL", "AKL",
]


export async function GET() {
  const cities = await client.fetch(`
    *[_type == "city" && defined(primaryIATA)]{
      "slug": slug.current,
      primaryIATA
    }
  `)

  const hubs = cities.filter((c: any) =>
    MAJOR_HUBS.includes(c.primaryIATA)
  )

  const urls: string[] = []

  for (const origin of hubs) {
    for (const destination of hubs) {
      if (origin.primaryIATA === destination.primaryIATA) continue

      const originCode = origin.primaryIATA.toLowerCase()
      const destinationCode = destination.primaryIATA.toLowerCase()
      const slug = `${origin.slug}-to-${destination.slug}`

      const url = `${BASE_URL}/flights/${originCode}/${destinationCode}/${slug}`

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
