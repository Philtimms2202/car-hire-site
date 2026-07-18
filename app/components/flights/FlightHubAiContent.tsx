import {
  generateFlightHubAiContent,
  type FlightHubFacts,
} from '@/lib/generateFlightHubAiContent'
import { updateFlightHubAiContent } from '@/lib/updateFlightHubAiContent'

interface Props {
  citySlug: string
  cityName: string
  countryName: string
  direction: 'to' | 'from'
  airportNames: string[]
  topDestinations: { city: string; distanceKm?: number; durationLabel?: string }[]
  cachedIntroText?: string
  cachedGoodToKnow?: string
  cachedTravelerTip?: string
}

export default async function FlightHubAiContent({
  citySlug,
  cityName,
  countryName,
  direction,
  airportNames,
  topDestinations,
  cachedIntroText,
  cachedGoodToKnow,
  cachedTravelerTip,
}: Props) {
  let introText = cachedIntroText
  let goodToKnow = cachedGoodToKnow
  let travelerTip = cachedTravelerTip

  // Regenerate if any field is missing — including travelerTip, so cities
  // generated before this field was added get it filled in automatically
  if (!introText || !goodToKnow || !travelerTip) {

    try {
      const facts: FlightHubFacts = {
        cityName,
        countryName,
        direction,
        airportNames,
        topDestinations,
      }
      const generated = await generateFlightHubAiContent(facts)

      const factsUsed = [...airportNames, ...topDestinations.map((d) => d.city)]

      await updateFlightHubAiContent(citySlug, cityName, direction, generated, factsUsed)

      introText = generated.introText
      goodToKnow = generated.goodToKnow
      travelerTip = generated.travelerTip
    } catch (err) {
      console.error(`[AI] FlightHubAiContent generation failed for ${direction} ${cityName}:`, err)
      return null
    }
  }

  if (!introText || !goodToKnow || !travelerTip) return null

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6" style={{ color: '#232e4e' }}>
          {direction === 'from' ? `Flying from ${cityName}` : `Flying to ${cityName}`}
        </h2>
        <p>{introText}</p>
        <p>{goodToKnow}</p>
        <p>{travelerTip}</p>
      </div>
    </section>
  )
}