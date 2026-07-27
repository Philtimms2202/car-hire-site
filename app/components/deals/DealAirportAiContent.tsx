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
  cachedGoodToKnowHeading?: string
  cachedGoodToKnow?: string
  cachedTravelerTipHeading?: string
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
  cachedGoodToKnowHeading,
  cachedGoodToKnow,
  cachedTravelerTipHeading,
  cachedTravelerTip,
}: Props) {
  let introText = cachedIntroText
  let goodToKnowHeading = cachedGoodToKnowHeading
  let goodToKnow = cachedGoodToKnow
  let travelerTipHeading = cachedTravelerTipHeading
  let travelerTip = cachedTravelerTip

  const hasFullCache =
    introText && goodToKnowHeading && goodToKnow && travelerTipHeading && travelerTip

  if (!hasFullCache) {
    try {
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
      goodToKnowHeading = generated.goodToKnowHeading
      goodToKnow = generated.goodToKnow
      travelerTipHeading = generated.travelerTipHeading
      travelerTip = generated.travelerTip
    } catch (err) {
      console.error(`[AI] DealAirportAiContent generation failed for ${categorySlug}/${airportSlug}:`, err)
      // fall through to static fallback below, do not return null
    }
  }

  // Static fallback — guarantees this section (and its H2) always renders,
  // even on generation failure or a cold cache mid-request.
  const finalIntroText =
    introText ??
    `${categorySubtitle} Live pricing departing ${airportLabel} updates regularly below.`
  const finalGoodToKnowHeading = goodToKnow ? (goodToKnowHeading ?? 'Good to know') : 'Good to know'
  const finalGoodToKnow =
    goodToKnow ??
    `Prices from ${airportLabel} on this page update regularly, so a route that looks fully booked one week can open up the next. It's worth checking back if your dates are flexible.`
  const finalTravelerTipHeading = travelerTip ? (travelerTipHeading ?? 'Traveller tip') : 'Traveller tip'
  const finalTravelerTip =
    travelerTip ??
    `Flight availability from ${airportLabel} can shift quickly on popular routes, so it's worth checking live fares directly rather than relying on indicative pricing alone.`

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6" style={{ color: '#232e4e' }}>
          {categoryTitle} from {airportLabel}
        </h2>
        <p className="mb-6">{finalIntroText}</p>

        <div className="mb-5">
          <h3 className="text-base font-semibold mb-1" style={{ color: '#232e4e' }}>
            {finalGoodToKnowHeading}
          </h3>
          <p>{finalGoodToKnow}</p>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-1" style={{ color: '#232e4e' }}>
            {finalTravelerTipHeading}
          </h3>
          <p>{finalTravelerTip}</p>
        </div>
      </div>
    </section>
  )
}