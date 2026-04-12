import { client } from "@/sanity/lib/client"
import airports from "@/app/data/airports.json" assert { type: "json" }

async function run() {
  console.log("🔄 Starting city → IATA patch...")

  // 1. Fetch all cities from Sanity
  const cities = await client.fetch(`
    *[_type == "city"]{
      _id,
      name,
      "countryName": country->name
    }
  `)

  console.log(`📍 Found ${cities.length} cities in Sanity`)

  for (const city of cities) {
    const match = airports.find(
      (a) =>
        a.city.toLowerCase() === city.name.toLowerCase() &&
        a.country.toLowerCase() === city.countryName.toLowerCase()
    )

    if (!match) {
      console.log(`⚠️ No airport match for ${city.name}, ${city.countryName}`)
      continue
    }

    console.log(`✈️ Updating ${city.name} → ${match.iata_code}`)

    await client
      .patch(city._id)
      .set({
        primaryIATA: match.iata_code,
      })
      .commit()
  }

  console.log("✅ Done! All matching cities updated.")
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
