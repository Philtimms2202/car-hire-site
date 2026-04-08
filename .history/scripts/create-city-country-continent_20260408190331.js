import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@sanity/client'
import slugify from 'slugify'

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
// Helper: Create slug
// -----------------------------
function makeSlug(str) {
  return slugify(str, { lower: true })
}

// -----------------------------
// Main Script
// -----------------------------
async function createHierarchy() {
  console.log('🔍 Fetching all location documents…')

  const locations = await client.fetch(`*[_type == "location"]`)
  console.log(`📄 Found ${locations.length} location docs\n`)

  for (const loc of locations) {
    const cityName = loc.city
    const countryName = loc.country
    const continentName = loc.continent

    if (!cityName || !countryName || !continentName) {
      console.log(`❌ Skipping ${loc._id} — missing city/country/continent`)
      continue
    }

    const citySlug = makeSlug(cityName)
    const countrySlug = makeSlug(countryName)
    const continentSlug = makeSlug(continentName)

    // -----------------------------
    // 1. Ensure Continent exists
    // -----------------------------
    let continent = await client.fetch(
      `*[_type == "continent" && slug.current == $slug][0]`,
      { slug: continentSlug }
    )

    if (!continent) {
      console.log(`🌍 Creating continent: ${continentName}`)

      continent = await client.create({
        _type: 'continent',
        name: continentName,
        slug: { _type: 'slug', current: continentSlug },
      })
    }

    // -----------------------------
    // 2. Ensure Country exists
    // -----------------------------
    let country = await client.fetch(
      `*[_type == "country" && slug.current == $slug][0]`,
      { slug: countrySlug }
    )

    if (!country) {
      console.log(`🇨🇴 Creating country: ${countryName}`)

      country = await client.create({
        _type: 'country',
        name: countryName,
        slug: { _type: 'slug', current: countrySlug },
        continent: { _type: 'reference', _ref: continent._id },
      })
    }

    // -----------------------------
    // 3. Ensure City exists
    // -----------------------------
    let city = await client.fetch(
      `*[_type == "city" && slug.current == $slug][0]`,
      { slug: citySlug }
    )

    if (!city) {
      console.log(`🏙️ Creating city: ${cityName}`)

      city = await client.create({
        _type: 'city',
        name: cityName,
        slug: { _type: 'slug', current: citySlug },
        country: { _type: 'reference', _ref: country._id },
      })
    }

    // -----------------------------
    // 4. Patch missing fields from Location
    // -----------------------------
    const patch = {}

    if (!city.emoji && loc.emoji) patch.emoji = loc.emoji
    if (!city.airport && loc.airport) patch.airport = loc.airport
    if (!city.heroDescription && loc.heroDescription) patch.heroDescription = loc.heroDescription
    if (!city.mainContent && loc.mainContent) patch.mainContent = loc.mainContent
    if (!city.metaDescription && loc.metaDescription) patch.metaDescription = loc.metaDescription

    if (Object.keys(patch).length > 0) {
      console.log(`✏️ Updating city fields for: ${cityName}`)
      await client.patch(city._id).set(patch).commit()
    } else {
      console.log(`✔ City ${cityName} already has all fields`)
    }
  }

  console.log('\n🎉 City / Country / Continent creation complete.')
}

createHierarchy().catch((err) => {
  console.error(err)
  process.exit(1)
})