import { client } from '@/sanity/lib/client'
import { buildDealCategoryDocId } from './updateDealCategoryAiContent'

export interface CachedDealCategoryContent {
  introText?: string
  goodToKnow?: string
  travelerTip?: string
}

export async function getDealCategoryAiContent(
  categorySlug: string
): Promise<CachedDealCategoryContent | null> {
  const docId = buildDealCategoryDocId(categorySlug)

  try {
    const doc = await client.fetch(`*[_id == $docId][0]{ introText, goodToKnow, travelerTip }`, {
      docId,
    })
    return doc ?? null
  } catch {
    return null
  }
}