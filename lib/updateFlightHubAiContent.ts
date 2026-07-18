import type { FlightHubAiContent } from './generateFlightHubAiContent'

export function buildFlightHubDocId(citySlug: string, direction: 'to' | 'from'): string {
  return `flightHub-${direction}-${citySlug}`
}

export async function updateFlightHubAiContent(
  citySlug: string,
  cityName: string,
  direction: 'to' | 'from',
  content: FlightHubAiContent,
  factsUsed: string[]
): Promise<void> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_WRITE_TOKEN

  if (!projectId || !dataset || !token) {
    throw new Error(
      'Missing Sanity env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_WRITE_TOKEN'
    )
  }

  const docId = buildFlightHubDocId(citySlug, direction)

  const mutations = [
    {
      createOrReplace: {
        _id: docId,
        _type: 'flightHubContent',
        citySlug,
        cityName,
        direction,
        introText: content.introText,
        goodToKnow: content.goodToKnow,
        travelerTip: content.travelerTip,
        factsUsed,
        generatedAt: new Date().toISOString(),
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