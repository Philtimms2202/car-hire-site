import { client } from '@/sanity/lib/client'
import { buildDealAirportDocId } from './updateDealAirportAiContent'

export interface CachedDealAirportContent {
  introText?: string
  goodToKnowHeading?: string
  goodToKnow?: string
  travelerTipHeading?: string
  travelerTip?: string
}

export async function getDealAirportAiContent(
  categorySlug: string,
  airportSlug: string
): Promise<CachedDealAirportContent | null> {
  const docId = buildDealAirportDocId(categorySlug, airportSlug)

  try {
    const doc = await client.fetch(
      `*[_id == $docId][0]{ introText, goodToKnowHeading, goodToKnow, travelerTipHeading, travelerTip }`,
      { docId }
    )
    return doc ?? null
  } catch {
    return null
  }
}