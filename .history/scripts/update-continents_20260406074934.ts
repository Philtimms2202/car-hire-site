import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: '6ogv1wx8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const continentMap: Record<string, any> = {
  Argentina:       { continent: "South America", continentSlug: "south-america", continentEmoji: "🌎" },
  Australia:       { continent: "Oceania",       continentSlug: "oceania",       continentEmoji: "🌏" },
  Austria:         { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  Belgium:         { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  Brazil:          { continent: "South America", continentSlug: "south-america", continentEmoji: "🌎" },
  Canada:          { continent: "North America", continentSlug: "north-america", continentEmoji: "🌎" },
  Columbia:        { continent: "South America", continentSlug: "south-america", continentEmoji: "🌎" },
  Croatia:         { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  "Czech Republic":{ continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  France:          { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  Germany:         { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  Greece:          { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  Hungary:         { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  India:           { continent: "Asia",          continentSlug: "asia",          continentEmoji: "🌏" },
  Indonesia:       { continent: "Asia",          continentSlug: "asia",          continentEmoji: "🌏" },
  Italy:           { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  Japan:           { continent: "Asia",          continentSlug: "asia",          continentEmoji: "🌏" },
  Mexico:          { continent: "North America", continentSlug: "north-america", continentEmoji: "🌎" },
  Morocco:         { continent: "Africa",        continentSlug: "africa",        continentEmoji: "🌍" },
  Netherlands:     { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  "New Zealand":   { continent: "Oceania",       continentSlug: "oceania",       continentEmoji: "🌏" },
  Peru:            { continent: "South America", continentSlug: "south-america", continentEmoji: "🌎" },
  Poland:          { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  Portugal:        { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  Singapore:       { continent: "Asia",          continentSlug: "asia",          continentEmoji: "🌏" },
  "South Africa":  { continent: "Africa",        continentSlug: "africa",        continentEmoji: "🌍" },
  Spain:           { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  Switzerland:     { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  Thailand:        { continent: "Asia",          continentSlug: "asia",          continentEmoji: "🌏" },
  Turkey:          { continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  UAE:             { continent: "Middle East",   continentSlug: "middle-east",   continentEmoji: "🌍" },
  "United Kingdom":{ continent: "Europe",        continentSlug: "europe",        continentEmoji: "🌍" },
  USA:             { continent: "North America", continentSlug: "north-america", continentEmoji: "🌎" },
}

async function run() {
  const docs = await client.fetch(`*[_type == "location"]{ _id, country }`)

  for (const doc of docs) {
    const info = continentMap[doc.country]
    if (!info) continue

    console.log(`Updating ${doc.country} → ${info.continent}`)

    await client
      .patch(doc._id)
      .set({
        continent: info.continent,
        continentSlug: { current: info.continentSlug },
        continentEmoji: info.continentEmoji,
      })
      .commit()
  }

  console.log("Done!")
}

run()