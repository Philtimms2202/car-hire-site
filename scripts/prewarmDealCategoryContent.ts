import { config } from 'dotenv'
config({ path: '.env.local' })

import { DEAL_CATEGORIES } from '../data/dealCategories'
import {
  generateDealCategoryAiContent,
  type DealCategoryFacts,
} from '../lib/generateDealCategoryAiContent'
import { updateDealCategoryAiContent, buildDealCategoryDocId } from '../lib/updateDealCategoryAiContent'

const FORCE = process.argv.includes('--force')

async function docExists(categorySlug: string): Promise<boolean> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_WRITE_TOKEN

  if (!projectId || !dataset || !token) {
    throw new Error(
      'Missing Sanity env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_WRITE_TOKEN'
    )
  }

  const docId = buildDealCategoryDocId(categorySlug)
  const query = encodeURIComponent(
    `*[_id == "${docId}"][0]{ introText, goodToKnowHeading, travelerTipHeading }`
  )

  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2023-08-01/data/query/${dataset}?query=${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (!res.ok) return false

  const data = await res.json()
  const doc = data.result
  // Only counts as "already warm" if it has the NEW heading fields too,
  // so old cached docs from before this update get regenerated automatically.
  return !!(doc && doc.introText && doc.goodToKnowHeading && doc.travelerTipHeading)
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const slugs = Object.keys(DEAL_CATEGORIES)
  console.log(`Pre-warming ${slugs.length} deal categories${FORCE ? ' (force regenerate all)' : ''}...\n`)

  const failed: string[] = []
  let generated = 0
  let skipped = 0

  for (const slug of slugs) {
    const config = DEAL_CATEGORIES[slug]

    if (!FORCE) {
      const exists = await docExists(slug)
      if (exists) {
        console.log(`⏭  ${slug} — already cached with headings, skipping`)
        skipped++
        continue
      }
    }

    try {
      console.log(`⏳ ${slug} — generating...`)
      const facts: DealCategoryFacts = {
        categoryTitle: config.title,
        categorySubtitle: config.subtitle,
        maxPrice: config.maxPrice,
        destinations: config.destinations,
        months: config.months,
      }
      const content = await generateDealCategoryAiContent(facts)

      const factsUsed = [
        ...(config.destinations ?? []),
        ...(config.months?.map(String) ?? []),
        ...(config.maxPrice ? [`under-${config.maxPrice}`] : []),
      ]

      await updateDealCategoryAiContent(slug, config.title, content, factsUsed)
      console.log(`✅ ${slug} — done`)
      generated++
    } catch (err) {
      console.error(`❌ ${slug} — failed:`, err instanceof Error ? err.message : err)
      failed.push(slug)
    }

    // Small delay between calls to stay comfortably under OpenAI/Sanity rate limits
    await delay(500)
  }

  console.log(`\nDone. Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed.length}`)
  if (failed.length) {
    console.log(`Failed slugs: ${failed.join(', ')}`)
    process.exitCode = 1
  }
}

main()