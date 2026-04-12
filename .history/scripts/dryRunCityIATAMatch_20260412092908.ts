import "./bootstrap"
import { client } from "@/sanity/lib/client"
import airports from "../data/airports.json" assert { type: "json" }

// Country normalization
const countryAliases: Record<string, string> = {
  USA: "United States",
  US: "United States",
  UAE: "United Arab Emirates",
  UK: "United Kingdom",
  England: "United Kingdom",
  Scotland: "United Kingdom",
  Wales: "United Kingdom",
  Holland: "Netherlands",
}

// City alias mapping
const cityAliases: Record<string, string> = {
  Palma: "Palma de Mallorca",
  Seville: "Sevilla",
  Corfu: "Kerkyra",
  Rhodes: "Rodos",
  Kyoto: "Osaka",
  Queenstown: "Queenstown",
  Cappadocia: "Nevsehir",
  Bali: "Denpasar",
  Dubai: "Dubai",
  "Abu Dhabi": "Abu Dhabi",
}

// Multi-airport cities
const multiAirportCities: Record<string, string[]> = {
  London: ["LHR", "LGW", "STN", "LTN", "LCY"],
  "New York": ["JFK", "LGA", "EWR"],
  Tokyo: ["HND", "NRT"],
  Paris: ["CDG", "ORY"],
  Rome: ["FCO", "CIA"],
  Milan: ["MXP", "LIN"],
  Istanbul: ["IST", "SAW"],
}

function normalizeCountry(country: string) {
  return countryAliases[country] || country
}

function normalizeCity(city: string) {
  return cityAliases[city] || city
}

async function run() {
  console.log("🔍 ADVANCED DRY RUN — Intelligent IATA Matching")
  console.log("------------------------------------------------------")

  const cities = await client.fetch(`
    *[_type == "city"]{
      _id,
      name,
      "countryName": country->name
    }
  `)

  console.log(`📍 Found ${cities.length} cities in Sanity\n`)

  let matchCount = 0
  let noMatchCount = 0

  for (const city of cities) {
    const normalizedCity = normalizeCity(city.name)
    const normalizedCountry = normalizeCountry(city.countryName)

    // Multi-airport override
    if (multiAirportCities[city.name]) {
      const primary = multiAirportCities[city.name][0]
      const alternates = multiAirportCities[city.name].slice(1)

      console.log(
        `✔️ MULTI-AIRPORT: ${city.name}, ${normalizedCountry} → ${primary} (alts: ${alternates.join(", ")})`
      )
      matchCount++
      continue
    }

    // Find airport match
    const match = airports.find(
      (a) =>
        a.city.toLowerCase() === normalizedCity.toLowerCase() &&
        a.country.toLowerCase() === normalizedCountry.toLowerCase()
    )

    if (!match) {
      console.log(`❌ No match for: ${city.name}, ${city.countryName}`)
      noMatchCount++
      continue
    }

    console.log(
      `✔️ MATCH: ${city.name}, ${city.countryName} → ${match.iata_code}`
    )
    matchCount++
  }

  console.log("\n------------------------------------------------------")
  console.log(`✨ ADVANCED DRY RUN COMPLETE`)
  console.log(`✔️ Matches: ${matchCount}`)
  console.log(`❌ No matches: ${noMatchCount}`)
  console.log("⚠️ No changes were written to Sanity.")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})