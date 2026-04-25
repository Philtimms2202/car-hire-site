// scripts/bulkGenerateCityContent.ts
// Run with: npx ts-node scripts/bulkGenerateCityContent.ts

import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { generateCityAiContent } from '../lib/generateCityAiContent'
import { updateCityAiContent } from '../lib/updateCityAiContent'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error('❌ Missing env vars. Check NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN in .env.local')
  process.exit(1)
}

// -----------------------------
// Fetch all cities from Sanity
// -----------------------------
async function getAllCities() {
  const query = encodeURIComponent(`*[_type == "city"]{
    _id,
    name,
    aiHighlightsIntro,
    country->{
      name,
      continent->{ name }
    }
  }`)

  const response = await fetch(
    `https://${projectId}.api.sanity.io/v2023-08-01/data/query/${dataset}?query=${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Sanity fetch failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.result as {
    _id: string
    name: string
    aiHighlightsIntro?: string
    country?: {
      name: string
      continent?: { name: string }
    }
  }[]
}

// -----------------------------
// Delay helper to avoid rate limits
// -----------------------------
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// -----------------------------
// Main
// -----------------------------
async function main() {
  console.log('🌍 Fetching all cities from Sanity...')
  const cities = await getAllCities()

  const total = cities.length
  const toGenerate = cities.filter(c => !c.aiHighlightsIntro)
  const alreadyCached = total - toGenerate.length

  console.log(`✅ Found ${total} cities total`)
  console.log(`⏭️  Skipping ${alreadyCached} already cached`)
  console.log(`🤖 Generating content for ${toGenerate.length} cities...\n`)

  if (toGenerate.length === 0) {
    console.log('🎉 All cities already have AI content. Nothing to do!')
    return
  }

  let success = 0
  let failed = 0
  const failures: string[] = []

  for (let i = 0; i < toGenerate.length; i++) {
    const city = toGenerate[i]
    const cityName = city.name
    const countryName = city.country?.name || ''
    const continentName = city.country?.continent?.name || ''

    console.log(`[${i + 1}/${toGenerate.length}] Generating: ${cityName}, ${countryName}...`)

    try {
      const content = await generateCityAiContent(cityName, countryName, continentName)
      await updateCityAiContent(city._id, content)
      console.log(`  ✅ Done: ${cityName}`)
      success++
    } catch (err: any) {
      console.error(`  ❌ Failed: ${cityName} — ${err.message}`)
      failures.push(cityName)
      failed++
    }

    // Wait 1 second between each city to avoid OpenAI rate limits
    if (i < toGenerate.length - 1) {
      await delay(1000)
    }
  }

  console.log('\n----------------------------')
  console.log(`🎉 Complete!`)
  console.log(`✅ Successfully generated: ${success} cities`)
  if (failed > 0) {
    console.log(`❌ Failed: ${failed} cities`)
    console.log(`   ${failures.join(', ')}`)
    console.log(`   Re-run the script to retry failed cities.`)
  }
  console.log('----------------------------')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})