console.log("🚀 Script started")

import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

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

const DRY_RUN = false

// -----------------------------
// STATIC DATASETS
// -----------------------------

// Driving side
const leftSideCountries = new Set([
  "GB", "IE", "AU", "NZ", "JP", "IN", "PK", "BD", "LK", "ZA", "KE", "TZ",
  "UG", "CY", "MT", "TH", "ID", "MY", "SG"
])

// Plug types (simplified global mapping)
const plugTypes = {
  EU: "Type C / F",
  UK: "Type G",
  US: "Type A / B",
  AU: "Type I",
  IN: "Type C / D / M",
  ZA: "Type C / D / M / N"
}

// Emergency numbers (regional defaults)
const emergencyNumbers = {
  EU: "112",
  UK: "999 / 112",
  US: "911",
  AU: "000",
  IN: "112",
  ZA: "10111"
}

// Tipping culture (region‑based)
const tippingCulture = {
  EU: "Tipping is appreciated but not mandatory. Rounding up or 5–10% is common.",
  UK: "10–12% is typical in restaurants. Not required in pubs.",
  US: "Tipping is expected. 15–20% in restaurants is standard.",
  AU: "Tipping is not expected but appreciated for great service.",
  IN: "Small tips are appreciated. 5–10% in restaurants.",
  ZA: "10% is customary in restaurants."
}

// Region mapping by ISO2
function getRegion(iso2) {
  if (!iso2) return "EU"
  if (["GB"].includes(iso2)) return "UK"
  if (["US", "CA"].includes(iso2)) return "US"
  if (["AU", "NZ"].includes(iso2)) return "AU"
  if (["IN", "PK", "BD"].includes(iso2)) return "IN"
  if (["ZA"].includes(iso2)) return "ZA"
  return "EU"
}

// Plug type by region
function getPlugType(region) {
  return plugTypes[region] || "Type C"
}

// Emergency number by region
function getEmergency(region) {
  return emergencyNumbers[region] || "112"
}

// Tipping culture by region
function getTipping(region) {
  return tippingCulture[region] || "Tipping is appreciated but not required."
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
    const code = iso2?.toUpperCase()

    console.log(`🌍 Processing ${name} (${code || "no ISO2"})`)

    const region = getRegion(code)

    const data = {
      plugType: getPlugType(region),
      drivingSide: leftSideCountries.has(code) ? "left" : "right",
      emergencyNumber: getEmergency(region),
      tippingCulture: getTipping(region),
      visaInfo: `Visa requirements for ${name} vary by nationality. Check official government guidance before travelling.`
    }

    console.log("   Generated Data:", data)

    if (DRY_RUN) {
      console.log("   🟡 DRY RUN — no changes written.\n")
      continue
    }

    await client.patch(_id).set(data).commit()

    console.log("   ✅ Updated in Sanity.\n")
  }

  console.log("🎉 Done!")
}

run()