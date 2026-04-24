// lib/updateCityAiContent.ts
import { CityAiContent } from './generateCityAiContent'

/**
 * Writes AI-generated content back to a Sanity city document.
 * Uses SANITY_WRITE_TOKEN — never call this client-side.
 */
export async function updateCityAiContent(
  documentId: string,
  content: CityAiContent
): Promise<void> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_WRITE_TOKEN

  if (!projectId || !dataset || !token) {
    throw new Error('Missing Sanity env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_WRITE_TOKEN')
  }

  const mutations = [
    {
      patch: {
        id: documentId,
        set: {
          aiIntro: content.aiIntro,
          aiHighlightsIntro: content.aiHighlightsIntro,
          aiHighlightCards: content.aiHighlightCards,
          aiAboutFallback: content.aiAboutFallback,
        },
      },
    },
  ]

  const response = await fetch(
    `https://${projectId}.api.sanity.io/v2023-08-01/data/mutate/${dataset}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Sanity write failed: ${response.status} — ${error}`)
  }
}