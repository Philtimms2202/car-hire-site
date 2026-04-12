import { client } from "@/sanity/lib/client"
import { promises as fs } from "fs"
import path from "path"

async function loadAirports() {
  // Load airports.json from the root-level /data folder
  const filePath = path.join(process.cwd(), "data", "airports.json")
  const file = await fs.readFile(filePath, "utf8")
  return JSON.parse(file)
}

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

export async function GET() {
  // Load airports.json safely
  const airports = await loadAirports()

  // Load Sanity locations
  const locations = await fetchLocations()

  // Static pages
  const staticCount = 2

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

  // Airports with valid IATA codes
  const airportsWithIATA = airports.filter(
    (a: any) => a.iata_code && a.iata_code.length === 3
  )

  // Route combinations (origin → destination)
  const routeCount =
    airportsWithIATA.length * airportsWithIATA.length -
    airportsWithIATA.length

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
