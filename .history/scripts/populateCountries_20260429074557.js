// scripts/populateCountries.js
import "dotenv/config"
import { createClient } from "@sanity/client"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function run() {
  console.log("Fetching countries from Sanity…")

  const countries = await client.fetch(`
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

    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  console.log("All done.")
}

run()