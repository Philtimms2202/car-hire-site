import "./bootstrap"   // ⭐ MUST be first, guaranteed to run before imports
import { client } from "@/sanity/lib/client"
import airports from "@/app/data/airports.json" assert { type: "json" }


async function run() {
  console.log("🔍 DRY RUN — Matching Sanity cities with airports.json")
  console.log("------------------------------------------------------")

  // 1. Fetch all cities from Sanity
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
    const match = airports.find(
      (a) =>
        a.city.toLowerCase() === city.name.toLowerCase() &&
        a.country.toLowerCase() === city.countryName.toLowerCase()
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
  console.log(`✨ DRY RUN COMPLETE`)
  console.log(`✔️ Matches: ${matchCount}`)
  console.log(`❌ No matches: ${noMatchCount}`)
  console.log("⚠️ No changes were written to Sanity.")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
