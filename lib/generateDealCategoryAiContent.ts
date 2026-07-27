export interface DealCategoryFacts {
  categoryTitle: string
  categorySubtitle: string
  maxPrice?: number
  destinations?: string[]
  months?: number[]
}

export interface DealCategoryAiContent {
  introText: string
  goodToKnowHeading: string
  goodToKnow: string
  travelerTipHeading: string
  travelerTip: string
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export async function generateDealCategoryAiContent(
  facts: DealCategoryFacts
): Promise<DealCategoryAiContent> {
  const { categoryTitle, categorySubtitle, maxPrice, destinations, months } = facts

  const destinationsList = destinations?.length ? destinations.join(', ') : null
  const monthsList = months?.length ? months.map((m) => MONTH_NAMES[m - 1]).join(', ') : null

  const constraintFacts = [
    maxPrice ? `Fares in this collection are typically under £${maxPrice} per person.` : null,
    destinationsList ? `Featured destinations include: ${destinationsList}.` : null,
    monthsList ? `This collection focuses on travel during: ${monthsList}.` : null,
  ]
    .filter(Boolean)
    .join(' ')

  const prompt = `You are a travel writer for a UK flight deals website, writing the "${categoryTitle}" category page. Write like an experienced human travel writer, not an AI assistant.

Category description: ${categorySubtitle}

Facts to use (do not invent additional facts beyond these):
${constraintFacts || 'This is a general collection without specific price, destination, or seasonal constraints.'}

Return ONLY a valid JSON object — no markdown, no code fences, no preamble — with exactly these fields:

{
  "introText": "3-4 sentence intro paragraph for this category page, referencing the specific facts above where available (destinations, price point, or season). Naturally work in phrasing a UK traveller might actually search for, such as '${categoryTitle.toLowerCase()} deals' or 'cheap flights to' a named destination, without keyword stuffing or making it read like an SEO exercise. Around 100-140 words.",
  "goodToKnowHeading": "A short 2-4 word heading for the goodToKnow paragraph, e.g. 'Booking window' or 'When to book'.",
  "goodToKnow": "A practical paragraph (90-130 words) with genuinely useful booking advice specific to this category — for example, best booking windows for the destinations or season mentioned, or how to make the most of a tight budget if a price cap is mentioned.",
  "travelerTipHeading": "A short 2-4 word heading for the travelerTip paragraph, e.g. 'Local know-how' or 'One thing to check'.",
  "travelerTip": "A specific paragraph (70-100 words) giving one genuinely specific and distinct tip for someone booking this type of trip — different in substance from the booking advice already given in goodToKnow."
}

Writing style — this matters as much as the content:
- Write in British English throughout (favourite, organise, travelling, -ise endings)
- Vary sentence length and structure naturally, the way a person drafting quickly would, rather than three uniformly-balanced sentences per paragraph
- Do not use em dashes
- Avoid stock AI phrasing entirely: no "whether you're... or...", no "it's worth noting", no "in today's world", no "look no further", no "elevate your", no "unlock", no "unforgettable", no "hidden gem", no sentences that open with "when it comes to"
- Do not structure every paragraph as a neat rule-of-three list of examples
- Prefer concrete, specific detail over broad claims — a specific detail beats an adjective
- It is fine to start a sentence with "But" or "And" if it reads naturally
- Do not use exclamation marks
- Write as if a knowledgeable colleague were quickly explaining this to a friend, not as marketing copy

Content rules:
- Every piece of content must be SPECIFIC to this category, not generic travel filler
- Do not invent destination names, prices, or dates beyond what is listed above
- The content should be genuinely useful to someone browsing this category
- Headings should be plain and specific, not clever or punny`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
      body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.7,
            response_format: { type: 'json_object' },
            messages: [
        {
          role: 'system',
          content:
            'You are a professional travel writer. You always return valid JSON only — no markdown, no code fences, no explanation.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content?.trim()

  if (!raw) throw new Error('Empty response from OpenAI')

  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()

  try {
    return JSON.parse(cleaned) as DealCategoryAiContent
  } catch {
    throw new Error(`Failed to parse OpenAI response as JSON: ${cleaned.slice(0, 200)}`)
  }
}