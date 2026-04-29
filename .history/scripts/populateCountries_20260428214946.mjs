import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

console.log("Loaded token:", process.env.SANITY_WRITE_TOKEN ? "YES" : "NO")

import fetch from "node-fetch"
import { createClient } from "@sanity/client"

// -----------------------------
// CONFIG
// -----------------------------
const client = createClient({
  projectId: "6ogv1wx8",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
})

// -----------------------------
// MAIN SCRIPT
// -----------------------------
async function run() {
  console.log("🔍 Fetching countries from Sanity...")

  const countries = await client.fetch(`
    *[_type == "country"]{
      _id,
      name,
      "slug": slug.current
    }
  `)

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

  console.log("🎉 Done!")
}

run()
