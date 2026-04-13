import { client } from "@/sanity/lib/client"

const BASE_URL = "https://timmstravel.com"

const MAJOR_HUBS = [
  // UK & Ireland
  "LHR", "LGW", "MAN", "EDI", "DUB",

  // Western Europe
  "CDG", "AMS", "FRA", "MUC", "ZRH", "VIE", "BRU", "CPH", "OSL", "ARN",

  // Southern Europe
  "BCN", "MAD", "AGP", "ALC", "PMI", "TFS", "ACE",
  "FCO", "MXP", "VCE", "ATH", "LIS", "OPO", "PRG",

  // United States
  "ATL", "LAX", "ORD", "DFW", "DEN", "JFK", "SFO", "SEA", "LAS",
  "MCO", "MIA", "PHX", "IAH", "BOS", "CLT",

  // Canada
  "YYZ", "YVR", "YYC",

  // Mexico & Caribbean
  "CUN", "SJD", "PUJ", "MBJ", "NAS", "AUA", "CUR", "GCM",

  // Latin America
  "GRU", "GIG", "EZE", "SCL", "BOG", "LIM",

  // Middle East
  "DXB", "DOH", "AUH", "AMM", "BEY",

  // Turkey
  "IST",

  // India
  "DEL", "BOM", "MAA", "BLR", "HYD",

  // China
  "PEK", "PVG", "CAN", "SZX",

  // Japan
  "HND", "NRT", "KIX", "CTS",

  // Korea
  "ICN",

  // Singapore
  "SIN",

  // Thailand
  "BKK", "HKT",

  // Indonesia
  "DPS", "CGK",

  // Vietnam
  "SGN", "HAN",

  // Australia & NZ
  "SYD", "MEL", "BNE", "PER", "AKL",

  // Africa
  "CPT", "JNB", "NBO", "ZNZ", "CAI", "RAK", "MBA",

  // Your previous additions
  "TLL", "RIX", "WAW", "KRK", "BUD", "ZAG", "DBV", "SPU",
  "HER", "RHO", "CFU", "SKG", "MLA", "TIV",
  "SAN", "TPA", "HNL", "OGG", "STT", "STX",
  "CEB", "MNL", "KUL", "HKG", "SSH", "HRG", "CNS"
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
