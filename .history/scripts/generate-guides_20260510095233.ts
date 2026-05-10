import OpenAI from 'openai'
import { createClient } from '@sanity/client'
import { categories } from '../lib/categories'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ─── Helpers ─────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length
  return Math.ceil(words / 200)
}

// ─── Step 1: Generate guide titles for a category ────────────────────

async function generateGuideTitles(categoryTitle: string): Promise<string[]> {
  console.log(`  Generating titles for: ${categoryTitle}`)

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a travel content strategist for Timms Travel, a UK-based travel comparison platform. 
Your job is to suggest practical, high-value guide titles for a global audience of travellers.
Respond ONLY with a JSON array of exactly 10 strings. No preamble, no markdown, no explanation.`,
      },
      {
        role: 'user',
        content: `Suggest 10 practical travel guide titles for the category: "${categoryTitle}".
Each title should be specific, useful and written for a British audience.
Return ONLY a JSON array of 10 strings.`,
      },
    ],
    temperature: 0.7,
  })

  const raw = response.choices[0].message.content ?? '[]'
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

// ─── Step 2: Generate full guide content ─────────────────────────────

async function generateGuideContent(
  title: string,
  categoryTitle: string
): Promise<{
  content: any[]
  excerpt: string
  metaTitle: string
  metaDescription: string
  ogDescription: string
}> {
  console.log(`    Writing: ${title}`)

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
        content: `Write a comprehensive travel guide for the following:

Title: "${title}"
Category: "${categoryTitle}"

Return a JSON object with exactly these fields:
{
  "excerpt": "A 2-sentence summary of the guide (plain text, British English)",
  "metaTitle": "SEO meta title under 60 characters including | Timms Travel",
  "metaDescription": "SEO meta description between 140-160 characters, British English",
  "ogDescription": "Open Graph description under 100 characters",
  "content": [
    // Portable Text blocks array
    // Use this structure:
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

// ─── Step 3: Check if guide already exists in Sanity ─────────────────

async function guideExists(slug: string): Promise<boolean> {
  const result = await sanity.fetch(
    `*[_type == "guide" && slug.current == $slug][0]._id`,
    { slug }
  )
  return !!result
}

// ─── Step 4: Check if category already exists in Sanity ──────────────

async function getCategoryId(slug: string): Promise<string | null> {
  const result = await sanity.fetch(
    `*[_type == "guideCategory" && slug.current == $slug][0]._id`,
    { slug }
  )
  return result ?? null
}

// ─── Step 5: Create or fetch category in Sanity ──────────────────────

async function upsertCategory(category: (typeof categories)[0]): Promise<string> {
  const existing = await getCategoryId(category.slug)
  if (existing) {
    console.log(`  Category already exists: ${category.title}`)
    return existing
  }

  console.log(`  Creating category: ${category.title}`)
  const doc = await sanity.create({
    _type: 'guideCategory',
    title: category.title,
    slug: { _type: 'slug', current: category.slug },
    description: category.description,
    emoji: category.emoji,
    metaTitle: category.metaTitle,
    metaDescription: category.metaDescription,
  })

  return doc._id
}

// ─── Step 6: Write guide to Sanity ───────────────────────────────────

async function writeGuideToSanity(
  title: string,
  slug: string,
  categoryId: string,
  data: Awaited<ReturnType<typeof generateGuideContent>>
) {
  const plainText = data.content
    .map((block: any) => block.children?.map((c: any) => c.text).join(' ') ?? '')
    .join(' ')

  await sanity.create({
    _type: 'guide',
    title,
    slug: { _type: 'slug', current: slug },
    category: { _type: 'reference', _ref: categoryId },
    excerpt: data.excerpt,
    content: data.content,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    ogDescription: data.ogDescription,
    readingTime: estimateReadingTime(plainText),
  })

  console.log(`    ✓ Saved: ${title}`)
}

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting guide generation...\n')

  for (const category of categories) {
    console.log(`\n📁 Category: ${category.title}`)

    // Upsert category document
    const categoryId = await upsertCategory(category)

    // Generate 10 titles for this category
    const titles = await generateGuideTitles(category.title)

    for (const title of titles) {
      const slug = slugify(title)

      // Skip if already exists
      const exists = await guideExists(slug)
      if (exists) {
        console.log(`    ⏭  Skipping (exists): ${title}`)
        continue
      }

      try {
        // Generate content
        const data = await generateGuideContent(title, category.title)

        // Write to Sanity
        await writeGuideToSanity(title, slug, categoryId, data)

        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 500))
      } catch (err) {
        console.error(`    ✗ Failed: ${title}`, err)
      }
    }
  }

  console.log('\n✅ Guide generation complete.')
}

main()