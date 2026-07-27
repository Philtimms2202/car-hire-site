export interface DealAirportDestinationFact {
  city: string
  distanceKm?: number
  durationLabel?: string
}

export interface DealAirportFacts {
  categoryTitle: string
  categorySubtitle: string
  airportLabel: string
  maxPrice?: number
  months?: number[]
  destinations: DealAirportDestinationFact[]
}

export interface DealAirportAiContent {
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

export async function generateDealAirportAiContent(
  facts: DealAirportFacts
): Promise<DealAirportAiContent> {
  const { categoryTitle, categorySubtitle, airportLabel, maxPrice, months, destinations } = facts

  const destinationsList = destinations.length
    ? destinations
        .map((d) =>
          d.distanceKm
            ? `${d.city} (~${d.distanceKm}km, approx ${d.durationLabel})`
            : d.city
        )
        .join(', ')
    : null

  const monthsList = months?.length ? months.map((m) => MONTH_NAMES[m - 1]).join(', ') : null

  const constraintFacts = [
    maxPrice ? `Fares in this collection are typically under £${maxPrice} per person.` : null,
    destinationsList ? `Specific routes from ${airportLabel}: ${destinationsList}.` : null,
    monthsList ? `This collection focuses on travel during: ${monthsList}.` : null,
  ]
    .filter(Boolean)
    .join(' ')

  const prompt = `You are a travel writer for a UK flight deals website, writing a page titled "${categoryTitle} from ${airportLabel}". Write like an experienced human travel writer, not an AI assistant.

Category description: ${categorySubtitle}

Facts to use (do not invent additional facts beyond these):
${constraintFacts || `This is a general collection of deals departing ${airportLabel}, without specific price, distance, or seasonal constraints.`}

Return ONLY a valid JSON object — no markdown, no code fences, no preamble — with exactly these fields:

{
  "introText": "3-4 sentence intro paragraph specifically about this category of trip departing ${airportLabel}. Reference at least one specific route with its distance or flight time if provided above. Naturally work in phrasing a UK traveller might actually search for, such as 'flights from ${airportLabel}' or '${categoryTitle.toLowerCase()} from ${airportLabel}', without keyword stuffing or making it read like an SEO exercise. Around 100-140 words.",
  "goodToKnowHeading": "A short 2-4 word heading for the goodToKnow paragraph, e.g. 'Flying from ${airportLabel}' or 'When to book'.",
  "goodToKnow": "A practical paragraph (90-130 words) with booking advice specific to departing ${airportLabel} for this category — for example, how the flight times to the listed destinations affect trip length, airport-specific practicalities (e.g. terminal, parking, or route frequency if relevant), or booking-window advice for this season if mentioned.",
  "travelerTipHeading": "A short 2-4 word heading for the travelerTip paragraph, e.g. 'One thing to check' or 'Local know-how'.",
  "travelerTip": "A specific paragraph (70-100 words) giving one genuinely specific tip for someone flying this category of trip from ${airportLabel} — different in substance from the booking advice already given in goodToKnow."
}

Writing style — this matters as much as the content:
- Write in British English throughout (favourite, organise, travelling, -ise endings)
- Vary sentence length and structure naturally, the way a person drafting quickly would
- Do not use em dashes
- Avoid stock AI phrasing entirely: no "whether you're... or...", no "it's worth noting", no "in today's world", no "look no further", no "elevate your", no "unlock", no "unforgettable", no "hidden gem", no sentences that open with "when it comes to"
- Do not structure every paragraph as a neat rule-of-three list of examples
- Prefer concrete, specific detail (named destinations, flight times) over broad claims
- It is fine to start a sentence with "But" or "And" if it reads naturally
- Do not use exclamation marks
- Write as if a knowledgeable colleague were quickly explaining this to a friend, not as marketing copy

Content rules:
- Every piece of content must be SPECIFIC to this category AND to ${airportLabel} specifically, not generic travel filler
- Do not invent destination names, distances, prices, or dates beyond what is listed above
- The content should be genuinely useful to someone browsing this category from this airport
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
    return JSON.parse(cleaned) as DealAirportAiContent
  } catch {
    throw new Error(`Failed to parse OpenAI response as JSON: ${cleaned.slice(0, 200)}`)
  }
}