import {
  generateDealAirportAiContent,
  type DealAirportFacts,
  type DealAirportDestinationFact,
} from '@/lib/generateDealAirportAiContent'
import { updateDealAirportAiContent } from '@/lib/updateDealAirportAiContent'
import { getAirportCoordinates, resolveLocationLabel } from '@/lib/airportUtils'
import { getDistanceKm, estimateFlightDurationLabel } from '@/lib/geo'

interface Props {
  categorySlug: string
  airportSlug: string
  categoryTitle: string
  categorySubtitle: string
  airportLabel: string
  originIata: string
  maxPrice?: number
  destinations?: string[]
  months?: number[]
  cachedIntroText?: string
  cachedGoodToKnow?: string
  cachedTravelerTip?: string
}

export default async function DealAirportAiContent({
  categorySlug,
  airportSlug,
  categoryTitle,
  categorySubtitle,
  airportLabel,
  originIata,
  maxPrice,
  destinations,
  months,
  cachedIntroText,
  cachedGoodToKnow,
  cachedTravelerTip,
}: Props) {
  let introText = cachedIntroText
  let goodToKnow = cachedGoodToKnow
  let travelerTip = cachedTravelerTip

  if (!introText || !goodToKnow || !travelerTip) {
    try {
      // Build real distance/duration facts from this specific airport to the
      // category's destinations, where coordinates are available for both ends
      const originCoords = getAirportCoordinates(originIata)
      const destinationFacts: DealAirportDestinationFact[] = (destinations ?? [])
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

      const facts: DealAirportFacts = {
        categoryTitle,
        categorySubtitle,
        airportLabel,
        maxPrice,
        months,
        destinations: destinationFacts,
      }
      const generated = await generateDealAirportAiContent(facts)

      const factsUsed = [
        airportLabel,
        ...destinationFacts.map((d) => d.city),
        ...(months?.map(String) ?? []),
        ...(maxPrice ? [`under-${maxPrice}`] : []),
      ]

      await updateDealAirportAiContent(
        categorySlug,
        airportSlug,
        categoryTitle,
        airportLabel,
        generated,
        factsUsed
      )

      introText = generated.introText
      goodToKnow = generated.goodToKnow
      travelerTip = generated.travelerTip
    } catch (err) {
      console.error(`[AI] DealAirportAiContent generation failed for ${categorySlug}/${airportSlug}:`, err)
      return null
    }
  }

  if (!introText || !goodToKnow || !travelerTip) return null

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6" style={{ color: '#232e4e' }}>
          {categoryTitle} from {airportLabel}
        </h2>
        <p>{introText}</p>
        <p>{goodToKnow}</p>
        <p>{travelerTip}</p>
      </div>
    </section>
  )
}