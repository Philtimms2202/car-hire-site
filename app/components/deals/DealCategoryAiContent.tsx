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
  cachedGoodToKnow?: string
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
  cachedGoodToKnow,
  cachedTravelerTip,
}: Props) {
  let introText = cachedIntroText
  let goodToKnow = cachedGoodToKnow
  let travelerTip = cachedTravelerTip

  if (!introText || !goodToKnow || !travelerTip) {
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
      goodToKnow = generated.goodToKnow
      travelerTip = generated.travelerTip
    } catch (err) {
      console.error(`[AI] DealCategoryAiContent generation failed for ${categorySlug}:`, err)
      return null
    }
  }

  if (!introText || !goodToKnow || !travelerTip) return null

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6" style={{ color: '#232e4e' }}>
          About {categoryTitle}
        </h2>
        <p>{introText}</p>
        <p>{goodToKnow}</p>
        <p>{travelerTip}</p>
      </div>
    </section>
  )
}