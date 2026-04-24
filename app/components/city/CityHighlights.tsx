// app/components/city/CityHighlights.tsx

import { generateCityAiContent } from '@/lib/generateCityAiContent'
import { updateCityAiContent } from '@/lib/updateCityAiContent'

interface Props {
  documentId: string
  cityName: string
  countryName: string
  continentName: string
  // Pass cached content from Sanity if it already exists
  cachedHighlightsIntro?: string
  cachedHighlightCards?: { title: string; description: string }[]
}

export default async function CityHighlights({
  documentId,
  cityName,
  countryName,
  continentName,
  cachedHighlightsIntro,
  cachedHighlightCards,
}: Props) {
  let highlightsIntro = cachedHighlightsIntro
  let highlightCards = cachedHighlightCards

  // Only call OpenAI if not already cached in Sanity
  if (!highlightsIntro || !highlightCards?.length) {
    try {
      const generated = await generateCityAiContent(cityName, countryName, continentName)
      await updateCityAiContent(documentId, generated)
      highlightsIntro = generated.aiHighlightsIntro
      highlightCards = generated.aiHighlightCards
    } catch (err) {
      console.error(`[AI] CityHighlights generation failed for ${cityName}:`, err)
      return null // Don't render the section at all if generation fails
    }
  }

  if (!highlightsIntro || !highlightCards?.length) return null

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6" style={{ color: '#232e4e' }}>
          Highlights of {cityName}
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{highlightsIntro}</p>
        <ul className="grid md:grid-cols-2 gap-6 text-gray-700">
          {highlightCards.map((card, i) => (
            <li key={i} className="p-4 border rounded-lg shadow-sm">
              <strong>{card.title}</strong>
              <p className="text-sm mt-1 text-gray-500">{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}