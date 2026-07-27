import { config } from 'dotenv'
config({ path: '.env.local' })

import { DEAL_CATEGORIES } from '../data/dealCategories'
import { getPrimaryAirportSlugs, resolveAirportSlugToIata, resolveIataToLabel } from '../lib/airportUtils'
import {
  generateDealAirportAiContent,
  type DealAirportFacts,
  type DealAirportDestinationFact,
} from '../lib/generateDealAirportAiContent'
import { updateDealAirportAiContent, buildDealAirportDocId } from '../lib/updateDealAirportAiContent'
import { getAirportCoordinates, resolveLocationLabel } from '../lib/airportUtils'
import { getDistanceKm, estimateFlightDurationLabel } from '../lib/geo'

const FORCE = process.argv.includes('--force')
const DELAY_MS = 750

async function docExists(categorySlug: string, airportSlug: string): Promise<boolean> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_WRITE_TOKEN

  if (!projectId || !dataset || !token) {
    throw new Error(
      'Missing Sanity env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_WRITE_TOKEN'
    )
  }

  const docId = buildDealAirportDocId(categorySlug, airportSlug)
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
  return !!(doc && doc.introText && doc.goodToKnowHeading && doc.travelerTipHeading)
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const categorySlugs = Object.keys(DEAL_CATEGORIES)
  const airports = getPrimaryAirportSlugs()
  const total = categorySlugs.length * airports.length

  console.log(
    `Pre-warming ${categorySlugs.length} categories × ${airports.length} airports = ${total} combinations${FORCE ? ' (force regenerate all)' : ''}...\n`
  )

  const failed: string[] = []
  let generated = 0
  let skipped = 0
  let processed = 0

  for (const categorySlug of categorySlugs) {
    const categoryConfig = DEAL_CATEGORIES[categorySlug]

    for (const airport of airports) {
      processed++
      const label = `${categorySlug}/${airport.slug}`
      const progress = `[${processed}/${total}]`

      if (!FORCE) {
        const exists = await docExists(categorySlug, airport.slug)
        if (exists) {
          console.log(`${progress} ⏭  ${label} — already cached, skipping`)
          skipped++
          continue
        }
      }

      try {
        console.log(`${progress} ⏳ ${label} — generating...`)

        const originIata = airport.iata
        const originCoords = getAirportCoordinates(originIata)
        const destinationFacts: DealAirportDestinationFact[] = (categoryConfig.destinations ?? [])
          .slice(0, 5)
          .map((destIata) => {
            const destCoords = getAirportCoordinates(destIata)
            const city = resolveLocationLabel(destIata, 'short')
            if (originCoords && destCoords) {
              const distanceKm = getDistanceKm(
                originCoords.lat,
                originCoords.lng,
                destCoords.lat,
                destCoords.lng
              )
              return { city, distanceKm, durationLabel: estimateFlightDurationLabel(distanceKm) }
            }
            return { city }
          })

        const airportLabel = resolveIataToLabel(originIata)

        const facts: DealAirportFacts = {
          categoryTitle: categoryConfig.title,
          categorySubtitle: categoryConfig.subtitle,
          airportLabel,
          maxPrice: categoryConfig.maxPrice,
          months: categoryConfig.months,
          destinations: destinationFacts,
        }

        const content = await generateDealAirportAiContent(facts)

        const factsUsed = [
          airportLabel,
          ...destinationFacts.map((d) => d.city),
          ...(categoryConfig.months?.map(String) ?? []),
          ...(categoryConfig.maxPrice ? [`under-${categoryConfig.maxPrice}`] : []),
        ]

        await updateDealAirportAiContent(
          categorySlug,
          airport.slug,
          categoryConfig.title,
          airportLabel,
          content,
          factsUsed
        )

        console.log(`${progress} ✅ ${label} — done`)
        generated++
      } catch (err) {
        console.error(`${progress} ❌ ${label} — failed:`, err instanceof Error ? err.message : err)
        failed.push(label)
      }

      await delay(DELAY_MS)
    }
  }

  console.log(`\nDone. Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed.length}`)
  if (failed.length) {
    console.log(`Failed combinations: ${failed.join(', ')}`)
    process.exitCode = 1
  }
}

main()