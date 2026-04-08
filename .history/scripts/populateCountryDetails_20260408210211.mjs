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
// GLOBAL DATASETS (ACCURATE)
// -----------------------------

// Countries that drive on the LEFT
const leftSideCountries = new Set([
  "GB","UK","IE","AU","NZ","JP","IN","PK","BD","LK","ZA","KE","TZ",
  "UG","CY","MT","TH","ID","MY","SG","HK"
])

// Plug types by ISO2 (accurate)
const plugTypeMap = {
  GB: "Type G",
  UK: "Type G",
  IE: "Type G",
  US: "Type A / B",
  CA: "Type A / B",
  AU: "Type I",
  NZ: "Type I",
  CN: "Type A / I",
  JP: "Type A / B",
  IN: "Type C / D / M",
  ZA: "Type C / D / M / N",
  SG: "Type G",
  HK: "Type G",
  AE: "Type G",
  // fallback for most of Europe
  DEFAULT: "Type C / F"
}

// Emergency numbers by ISO2 (accurate)
const emergencyMap = {
  GB: "999 / 112",
  UK: "999 / 112",
  IE: "112 / 999",
  US: "911",
  CA: "911",
  AU: "000",
  NZ: "111",
  IN: "112",
  ZA: "10111",
  SG: "999 / 995",
  HK: "999",
  DEFAULT: "112"
}

// Tipping culture by region
const tippingMap = {
  UK: "10–12% is typical in restaurants. Not required in pubs.",
  GB: "10–12% is typical in restaurants. Not required in pubs.",
  US: "Tipping is expected. 15–20% in restaurants is standard.",
  CA: "Tipping is expected. 15–20% is common.",
  AU: "Tipping is not expected but appreciated for great service.",
  NZ: "Tipping is not expected but appreciated.",
  IN: "Small tips are appreciated. 5–10% in restaurants.",
  ZA: "10% is customary in restaurants.",
  DEFAULT: "Tipping is appreciated but not mandatory. Rounding up or 5–10% is common."
}

// -----------------------------
// HELPERS
// -----------------------------

function normaliseISO(iso2) {
  if (!iso2) return null
  return iso2.trim().toUpperCase()
}

function getPlugType(code) {
  return plugTypeMap[code] || plugTypeMap.DEFAULT
}

function getEmergency(code) {
  return emergencyMap[code] || emergencyMap.DEFAULT
}

function getTipping(code) {
  return tippingMap[code] || tippingMap.DEFAULT
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
    const { _id, name } = country
    const code = normaliseISO(country.iso2)

    if (!code) {
      console.log(`⚠️  ${name} has NO ISO2 — using defaults`)
    }

    console.log(`🌍 Processing ${name} (${code || "no ISO2"})`)

    const data = {
      plugType: getPlugType(code),
      drivingSide: leftSideCountries.has(code) ? "left" : "right",
      emergencyNumber: getEmergency(code),
      tippingCulture: getTipping(code),
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