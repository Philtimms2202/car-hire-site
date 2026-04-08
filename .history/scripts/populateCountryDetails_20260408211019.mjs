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

// Normalise ISO2
function normaliseISO(iso2) {
  if (!iso2) return null
  return iso2.trim().toUpperCase()
}

// Convert ISO3 → ISO2
function iso3ToIso2(code) {
  if (!code) return null
  const map = {
    GBR: "GB",
    USA: "US",
    CAN: "CA",
    AUS: "AU",
    NZL: "NZ",
    IND: "IN",
    ZAF: "ZA"
  }
  return map[code.toUpperCase()] || null
}

// Name-based fallback
function nameToIso2(name) {
  if (!name) return null
  const n = name.toLowerCase()

  if (n.includes("united kingdom") || n.includes("great britain") || n === "uk") return "GB"
  if (n.includes("united states") || n.includes("america")) return "US"
  if (n.includes("australia")) return "AU"
  if (n.includes("new zealand")) return "NZ"
  if (n.includes("south africa")) return "ZA"
  if (n.includes("india")) return "IN"
  if (n.includes("ireland")) return "IE"
  if (n.includes("singapore")) return "SG"

  return null
}

// Master resolver
function resolveCode(rawIso2, name) {
  // 1) Try ISO2 directly
  if (rawIso2 && rawIso2.trim().length === 2) {
    return rawIso2.trim().toUpperCase()
  }

  // 2) Try ISO3 → ISO2
  if (rawIso2 && rawIso2.trim().length === 3) {
    const mapped = iso3ToIso2(rawIso2)
    if (mapped) return mapped
  }

  // 3) Try name-based fallback
  const fromName = nameToIso2(name)
  if (fromName) return fromName

  // 4) Default
  return null
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

    const code = resolveCode(country.iso2, name)

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