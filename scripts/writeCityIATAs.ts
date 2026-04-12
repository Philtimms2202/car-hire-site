import "./bootstrap"
import { writeClient as client } from "@/sanity/lib/writeClient"
import airports from "../data/airports.json" assert { type: "json" }

// ------------------------------
// COUNTRY NORMALIZATION
// ------------------------------
const countryAliases: Record<string, string> = {
  USA: "United States",
  US: "United States",
  UAE: "United Arab Emirates",
  UK: "United Kingdom",
  England: "United Kingdom",
  Scotland: "United Kingdom",
  Wales: "United Kingdom",
  Holland: "Netherlands",
  Ireland: "Ireland",
}

// ------------------------------
// CITY ALIASES (MATCHING YOUR DATA EXACTLY)
// ------------------------------
const cityAliases: Record<string, string> = {
  Palma: "Palma de Mallorca",
  Seville: "Sevilla",

  // Corfu
  Corfu: "Kerkyra/corfu",

  // Rhodes
  Rhodes: "Rhodos",

  // Queenstown
  Queenstown: "Queenstown International",

  // Regions
  Cappadocia: "Nevsehir",
  Bali: "Denpasar",

  // Kyoto → Osaka
  Kyoto: "Osaka",

  // UAE
  Dubai: "Dubai",
  "Abu Dhabi": "Abu Dhabi",

  // Dublin fix
  Dublin: "Dublin",
}

// ------------------------------
// MULTI-AIRPORT CITIES
// ------------------------------
const multiAirportCities: Record<string, string[]> = {
  London: ["LHR", "LGW", "STN", "LTN", "LCY"],
  "New York": ["JFK", "LGA", "EWR"],
  Tokyo: ["HND", "NRT"],
  Paris: ["CDG", "ORY"],
  Rome: ["FCO", "CIA"],
  Milan: ["MXP", "LIN"],
  Istanbul: ["IST", "SAW"],
}

// ------------------------------
// HELPERS
// ------------------------------
function normalizeCountry(country: string) {
  return countryAliases[country] || country
}

function normalizeCity(city: string) {
  return cityAliases[city] || city
}

// ------------------------------
// MAIN WRITE SCRIPT
// ------------------------------
async function run() {
  console.log("✍️ WRITE MODE — Updating Sanity with IATA codes")
  console.log("------------------------------------------------------")

  const cities = await client.fetch(`
    *[_type == "city"]{
      _id,
      name,
      primaryIATA,
      alternateIATAs,
      "countryName": country->name
    }
  `)

  let updated = 0
  let skipped = 0

  const patches: any[] = []

  for (const city of cities) {
    let normalizedCity = normalizeCity(city.name)
    let normalizedCountry = normalizeCountry(city.countryName)

    // Fix Dublin country
    if (city.name === "Dublin") {
      normalizedCountry = "Ireland"
    }

    // Multi-airport override
    if (multiAirportCities[city.name]) {
      const primary = multiAirportCities[city.name][0]
      const alternates = multiAirportCities[city.name].slice(1)

      patches.push({
        id: city._id,
        patch: {
          set: {
            primaryIATA: primary,
            alternateIATAs: alternates,
          },
        },
      })

      console.log(`✔️ Updating ${city.name}: primary=${primary}, alts=[${alternates.join(", ")}]`)
      updated++
      continue
    }

    // Normalize airport city names too
    const match = airports.find((a) => {
      const airportCityNorm = normalizeCity(a.city)
      return (
        airportCityNorm.toLowerCase() === normalizedCity.toLowerCase() &&
        a.country.toLowerCase() === normalizedCountry.toLowerCase()
      )
    })

    if (!match) {
      console.log(`⚠️ SKIPPED (no match): ${city.name}, ${city.countryName}`)
      skipped++
      continue
    }

    patches.push({
      id: city._id,
      patch: {
        set: {
          primaryIATA: match.iata_code,
          alternateIATAs: [],
        },
      },
    })

    console.log(`✔️ Updating ${city.name}: primary=${match.iata_code}`)
    updated++
  }

  console.log("\n📦 Committing patches to Sanity…")

  // Batch commit
  const transaction = client.transaction()
  patches.forEach((p) => transaction.patch(p.id, p.patch))
  await transaction.commit()

  console.log("\n------------------------------------------------------")
  console.log("✨ WRITE MODE COMPLETE")
  console.log(`✔️ Updated: ${updated}`)
  console.log(`⚠️ Skipped: ${skipped}`)
  console.log("------------------------------------------------------")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
