import { client } from "@/sanity/lib/client"

export async function GET() {
  // Fetch all locations with the fields we need
  const locations = await client.fetch(`
    *[_type == "location"]{
      "continentSlug": continentSlug.current,
      "countrySlug": countrySlug.current,
      "citySlug": slug.current,
      primaryIATA,
      _updatedAt
    }
  `)

  // ─────────────────────────────────────────────
  // STATIC PAGES
  // ─────────────────────────────────────────────
  const staticCount = 2 // homepage + /locations (adjust if needed)

  // ─────────────────────────────────────────────
  // CONTINENTS
  // ─────────────────────────────────────────────
  const continents = [...new Set(locations.map((l: any) => l.continentSlug))]
  const continentCount = continents.length

  // ─────────────────────────────────────────────
  // COUNTRIES (unique continent/country combos)
  // ─────────────────────────────────────────────
  const countries = [
    ...new Map(
      locations.map((l: any) => [`${l.continentSlug}/${l.countrySlug}`, l])
    ).values(),
  ]
  const countryCount = countries.length

  // ─────────────────────────────────────────────
  // CITIES
  // ─────────────────────────────────────────────
  const cityCount = locations.length

  // ─────────────────────────────────────────────
  // THINGS TO DO (one per city)
  // ─────────────────────────────────────────────
  const thingsToDoCount = locations.length

  // ─────────────────────────────────────────────
  // FLIGHT ROUTES (origin → destination)
  // ─────────────────────────────────────────────
  const citiesWithIATA = locations.filter((l: any) => l.primaryIATA)

  // Diagnostic log (optional)
  console.log("Cities with IATA:", citiesWithIATA.map((c) => c.primaryIATA))

  const routeCount =
    citiesWithIATA.length * citiesWithIATA.length -
    citiesWithIATA.length // remove origin=destination

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
    routeCount,
    total,
  })
}