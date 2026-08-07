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
    const doc = await client.fetch(
      `*[_id == $docId][0]{ introText, goodToKnow, travelerTip }`,
      { docId },
      {
        // ── CACHE FIX ──────────────────────────────────────────────────
        // Cache in Next.js Data Cache for 7 days globally (604,800 seconds)
        next: { 
          revalidate: 604800, 
          tags: [`flight-hub-ai-${docId}`] 
        },
      }
    )
    return doc ?? null
  } catch {
    return null
  }
}