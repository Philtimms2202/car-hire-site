import { client } from "@/sanity/lib/client"

export async function GET() {
  const locations = await client.fetch(`
    *[_type == "location"]{
      "continentSlug": continentSlug.current,
      "countrySlug": countrySlug.current,
      "citySlug": slug.current,
      primaryIATA
    }
  `)

  // Count static pages
  const staticCount = 2 // homepage + /locations (adjust if needed)

  // Continents
  const continents = [...new Set(locations.map((l: any) => l.continentSlug))]
  const continentCount = continents.length

  // Countries
  const countries = [
    ...new Map(
      locations.map((l: any) => [`${l.continentSlug}/${l.countrySlug}`, l])
    ).values(),
  ]
  const countryCount = countries.length

  // Cities
  const cityCount = locations.length

  // Things to do
  const thingsToDoCount = locations.length

// Cities with IATA codes
const locations = await client.fetch(`
  *[_type == "location"]{
    "continentSlug": continentSlug.current,
    "countrySlug": countrySlug.current,
    "citySlug": slug.current,
    primaryIATA,
    _updatedAt
  }
`)

// Count origin → destination combinations
const routeCount =
  citiesWithIATA.length * citiesWithIATA.length -
  citiesWithIATA.length // remove origin=destination

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