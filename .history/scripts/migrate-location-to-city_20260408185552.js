import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@sanity/client'

// -----------------------------
// Sanity Client
// -----------------------------
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-10-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// -----------------------------
// Migration Script
// -----------------------------
async function migrate() {
  console.log('Fetching all location documents…')

  const locations = await client.fetch(`*[_type == "location"]`)

  console.log(`Found ${locations.length} location docs\n`)

  for (const loc of locations) {
    const citySlug = loc.slug?.current
    const countrySlug = loc.countrySlug?.current

    if (!citySlug || !countrySlug) {
      console.log(`❌ Skipping ${loc._id} — missing slugs`)
      continue
    }

    // Find matching city doc
    const city = await client.fetch(
      `*[
        _type == "city" &&
        slug.current == $citySlug &&
        country->slug.current == $countrySlug
      ][0]`,
      { citySlug, countrySlug }
    )

    if (!city) {
      console.log(`❌ No city doc found for ${citySlug}, skipping`)
      continue
    }

    const patch = {}

    // Only copy fields that are missing in the City doc
    if (!city.emoji && loc.emoji) patch.emoji = loc.emoji
    if (!city.airport && loc.airport) patch.airport = loc.airport
    if (!city.heroDescription && loc.heroDescription) patch.heroDescription = loc.heroDescription
    if (!city.mainContent && loc.mainContent) patch.mainContent = loc.mainContent
    if (!city.metaDescription && loc.metaDescription) patch.metaDescription = loc.metaDescription

    if (Object.keys(patch).length === 0) {
      console.log(`✔ City "${citySlug}" already has all fields — skipping`)
      continue
    }

    await client.patch(city._id).set(patch).commit()

    console.log(`✅ Updated city: ${citySlug}`)
  }

  console.log('\n🎉 Migration complete.')
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})