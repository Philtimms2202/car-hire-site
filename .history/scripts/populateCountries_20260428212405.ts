// /scripts/populateCountries.ts
import { client as readClient } from "@/sanity/lib/client"

async function run() {
  console.log("Fetching countries from Sanity…")

  const countries = await readClient.fetch(`
    *[_type == "country"]{
      _id,
      name,
      "slug": slug.current
    }
  `)

  if (!countries.length) {
    console.log("No countries found in Sanity.")
    return
  }

  console.log(`Found ${countries.length} countries.\n`)

  for (const country of countries) {
    const url = `http://localhost:3000/api/generate-country-ai?country=${country.slug}`

    console.log(`→ Generating AI data for ${country.name} (${country.slug})`)

    try {
      const res = await fetch(url, { method: "POST" })
      const json = await res.json()

      if (json.status === "exists") {
        console.log(`   ✓ Already populated — skipping\n`)
      } else if (json.status === "created") {
        console.log(`   ✓ Created successfully\n`)
      } else {
        console.log(`   ⚠ Unexpected response:`, json, "\n")
      }
    } catch (err) {
      console.log(`   ✗ Error generating ${country.name}:`, err, "\n")
    }

    // Avoid hammering OpenAI
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  console.log("All done.")
}

run()
