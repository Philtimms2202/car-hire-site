import OpenAI from 'openai'
import { createClient } from '@sanity/client'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ─── Check if guide content mentions British travellers ──────────────

function mentionsBritishTravellers(guide: any): boolean {
  const textToCheck = [
    guide.excerpt ?? '',
    ...(guide.content ?? []).map((block: any) =>
      block.children?.map((c: any) => c.text ?? '').join(' ') ?? ''
    ),
  ]
    .join(' ')
    .toLowerCase()

  return (
    textToCheck.includes('british traveller') ||
    textToCheck.includes('british traveler') ||
    textToCheck.includes('uk traveller') ||
    textToCheck.includes('uk traveler') ||
    textToCheck.includes('from the uk') ||
    textToCheck.includes('travelling from the uk') ||
    textToCheck.includes('british passport')
  )
}

// ─── Rewrite guide content ────────────────────────────────────────────

async function rewriteGuideContent(
  title: string,
  categoryTitle: string
): Promise<{ content: any[]; excerpt: string }> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 2500,
    messages: [
      {
        role: 'system',
        content: `You are a senior travel writer for Timms Travel, a UK-based travel platform.
Write in natural, confident British English spelling and grammar — "travelled", "colour", "whilst" and so on.
Your guides are written for a global audience of travellers, not just British ones. Advice should be universally applicable regardless of nationality.
Your tone is practical, warm and authoritative — never generic or padded.
Respond ONLY with a valid JSON object. No markdown fences, no preamble.`,
      },
      {
        role: 'user',
        content: `Rewrite this travel guide for a global audience of travellers. Remove any references specific to British travellers — the advice should apply to anyone, regardless of nationality.

Title: "${title}"
Category: "${categoryTitle}"

Return a JSON object with exactly these fields:
{
  "excerpt": "A 2-sentence summary of the guide (plain text, British English spelling)",
  "content": [
    // Portable Text blocks array
    // { "_type": "block", "style": "h2", "children": [{ "_type": "span", "text": "Section heading" }] }
    // { "_type": "block", "style": "normal", "children": [{ "_type": "span", "text": "Paragraph text..." }] }
    // { "_type": "block", "style": "h3", "children": [{ "_type": "span", "text": "Subsection heading" }] }
    // Include at least 6 sections with h2 headings, each with 2-3 paragraphs beneath
    // Total content should be approximately 1200 words
  ]
}`,
      },
    ],
    temperature: 0.6,
  })

  const raw = response.choices[0].message.content ?? '{}'
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

// ─── Estimate reading time ────────────────────────────────────────────

function estimateReadingTime(content: any[]): number {
  const text = content
    .map((block: any) => block.children?.map((c: any) => c.text).join(' ') ?? '')
    .join(' ')
  return Math.ceil(text.split(/\s+/).length / 200)
}

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Fetching all guides from Sanity...\n')

  const guides = await sanity.fetch(
    `*[_type == "guide"] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      content,
      "categoryTitle": category->title
    }`
  )

  console.log(`Found ${guides.length} guides. Checking for British-specific content...\n`)

  const toUpdate = guides.filter(mentionsBritishTravellers)

  console.log(`${toUpdate.length} guides need updating.\n`)

  if (toUpdate.length === 0) {
    console.log('✅ Nothing to update.')
    return
  }

  for (const guide of toUpdate) {
    console.log(`✏️  Rewriting: ${guide.title}`)

    try {
      const data = await rewriteGuideContent(guide.title, guide.categoryTitle)

      await sanity
        .patch(guide._id)
        .set({
          excerpt: data.excerpt,
          content: data.content,
          readingTime: estimateReadingTime(data.content),
        })
        .commit()

      console.log(`  ✓ Updated: ${guide.title}`)

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 500))
    } catch (err) {
      console.error(`  ✗ Failed: ${guide.title}`, err)
    }
  }

  console.log('\n✅ Update complete.')
}

main()