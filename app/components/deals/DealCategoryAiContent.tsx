import {
  generateDealCategoryAiContent,
  type DealCategoryFacts,
} from '@/lib/generateDealCategoryAiContent'
import { updateDealCategoryAiContent } from '@/lib/updateDealCategoryAiContent'

interface Props {
  categorySlug: string
  categoryTitle: string
  categorySubtitle: string
  maxPrice?: number
  destinations?: string[]
  months?: number[]
  cachedIntroText?: string
  cachedGoodToKnowHeading?: string
  cachedGoodToKnow?: string
  cachedTravelerTipHeading?: string
  cachedTravelerTip?: string
}

export default async function DealCategoryAiContent({
  categorySlug,
  categoryTitle,
  categorySubtitle,
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

  const hasFullCache = introText && goodToKnowHeading && goodToKnow && travelerTipHeading && travelerTip

  if (!hasFullCache) {
    try {
      const facts: DealCategoryFacts = {
        categoryTitle,
        categorySubtitle,
        maxPrice,
        destinations,
        months,
      }
      const generated = await generateDealCategoryAiContent(facts)

      const factsUsed = [
        ...(destinations ?? []),
        ...(months?.map(String) ?? []),
        ...(maxPrice ? [`under-${maxPrice}`] : []),
      ]

      await updateDealCategoryAiContent(categorySlug, categoryTitle, generated, factsUsed)

      introText = generated.introText
      goodToKnowHeading = generated.goodToKnowHeading
      goodToKnow = generated.goodToKnow
      travelerTipHeading = generated.travelerTipHeading
      travelerTip = generated.travelerTip
    } catch (err) {
      console.error(`[AI] DealCategoryAiContent generation failed for ${categorySlug}:`, err)
      // fall through to static fallback below, do not return null
    }
  }

  // Static fallback — guarantees this section (and its H2) always renders,
  // even on generation failure or a cold cache mid-request.
  const finalIntroText =
    introText ??
    `${categorySubtitle} Browse live fares below and select your departure airport for pricing tailored to you.`
  const finalGoodToKnowHeading = goodToKnow ? (goodToKnowHeading ?? 'Good to know') : 'Good to know'
  const finalGoodToKnow =
    goodToKnow ??
    `Prices on this page update regularly, so a route that looks fully booked one week can open up the next. It's worth checking back if your dates are flexible.`
  const finalTravelerTipHeading = travelerTip ? (travelerTipHeading ?? 'Traveller tip') : 'Traveller tip'
  const finalTravelerTip =
    travelerTip ??
    `Set your departure airport above to see indicative pricing rather than browsing generic fares, as costs can vary significantly depending on where you're flying from.`

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6" style={{ color: '#232e4e' }}>
          About {categoryTitle}
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