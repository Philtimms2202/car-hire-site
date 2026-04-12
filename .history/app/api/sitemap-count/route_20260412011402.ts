import airports from "@/data/airports.json"

export async function GET() {
  // ─────────────────────────────────────────────
  // STATIC PAGES
  // ─────────────────────────────────────────────
  const staticCount = 2 // homepage + /locations

  // ─────────────────────────────────────────────
  // LOCATION PAGES (from Sanity)
  // ─────────────────────────────────────────────
  // If you still want to count continents/countries/cities,
  // you can fetch them here. For now, I’ll keep your structure:

  const locations = await fetchLocations() // you already have this logic

  const continents = [...new Set(locations.map((l: any) => l.continentSlug))]
  const continentCount = continents.length

  const countries = [
    ...new Map(
      locations.map((l: any) => [`${l.continentSlug}/${l.countrySlug}`, l])
    ).values(),
  ]
  const countryCount = countries.length

  const cityCount = locations.length
  const thingsToDoCount = locations.length

  // ─────────────────────────────────────────────
  // FLIGHT ROUTES (from airports.json)
  // ─────────────────────────────────────────────

  // Filter airports with valid IATA codes
  const airportsWithIATA = airports.filter(
    (a: any) => a.iata_code && a.iata_code.length === 3
  )

  // Count origin → destination combinations
  const routeCount =
    airportsWithIATA.length * airportsWithIATA.length -
    airportsWithIATA.length // remove origin=destination

  // ─────────────────────────────────────────────
  // TOTAL
  // ─────────────────────────────────────────────
  const total =
    staticCount +
    continentCount +
    countryCount +
    cityCount +
    thingsToDoCount +
    routeCount

  return Response.json({
    staticCount,
    continentCount,
    countryCount,
    cityCount,
    thingsToDoCount,
    airportCount: airportsWithIATA.length,
    routeCount,
    total,
  })
}

// Helper to keep your existing Sanity logic clean
async function fetchLocations() {
  return await client.fetch(`
    *[_type == "location"]{
      "continentSlug": continentSlug.current,
      "countrySlug": countrySlug.current,
      "citySlug": slug.current,
      _updatedAt
    }
  `)
}