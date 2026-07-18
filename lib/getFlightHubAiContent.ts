import { client } from '@/sanity/lib/client'
import { buildFlightHubDocId } from './updateFlightHubAiContent'

export interface CachedFlightHubContent {
  introText?: string
  goodToKnow?: string
  travelerTip?: string
}

export async function getFlightHubAiContent(
  citySlug: string,
  direction: 'to' | 'from'
): Promise<CachedFlightHubContent | null> {
  const docId = buildFlightHubDocId(citySlug, direction)

  try {
    const doc = await client.fetch(`*[_id == $docId][0]{ introText, goodToKnow, travelerTip }`, {
      docId,
    })
    return doc ?? null
  } catch {
    return null
  }
}