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
  apiVersion: "2023-10-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
})

const DRY_RUN = false // change to false to write changes

// -----------------------------
// HELPERS
// -----------------------------
async function fetchCountryData(name, iso2) {
  try {
    // Prefer ISO2 lookup (more accurate)
    const url = iso2
      ? `https://restcountries.com/v3.1/alpha/${iso2}`
      : `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`

    const res = await fetch(url)
    const data = await res.json()

    if (!Array.isArray(data) || !data[0]) return null

    const c = data[0]

    return {
      capital: c.capital?.[0] || "",
      population: c.population || null,
      languages: c.languages ? Object.values(c.languages) : [],
      currency: c.currencies ? Object.values(c.currencies)[0]?.name : "",
      flag: c.flag || ""
    }
  } catch (err) {
    console.error(`❌ API error for ${name}:`, err)
    return null
  }
}

// -----------------------------
// MAIN SCRIPT
// -----------------------------
async function run() {
  console.log("🔍 Fetching countries from Sanity...")

  const countries = await client.fetch(`
    *[_type == "country"]{
      _id,
      name,
      iso2
    }
  `)

  console.log(`Found ${countries.length} countries.\n`)

  for (const country of countries) {
    const { _id, name, iso2 } = country

    console.log(`🌍 Processing ${name} (${iso2 || "no ISO2"})`)

    const apiData = await fetchCountryData(name, iso2)

    if (!apiData) {
      console.log(`   ❌ No API match for ${name}\n`)
      continue
    }

    console.log("   API Data:", apiData)

    if (DRY_RUN) {
      console.log("   🟡 DRY RUN — no changes written.\n")
      continue
    }

    // Write to Sanity
    await client
      .patch(_id)
      .set(apiData)
      .commit()

    console.log("   ✅ Updated in Sanity.\n")
  }

  console.log("🎉 Done!")
}

run()