export interface FlightHubFacts {
  cityName: string
  countryName: string
  direction: 'to' | 'from'
  airportNames: string[]
  topDestinations: { city: string; distanceKm?: number; durationLabel?: string }[]
}

export interface FlightHubAiContent {
  introText: string
  goodToKnow: string
  travelerTip: string
}

export async function generateFlightHubAiContent(
  facts: FlightHubFacts
): Promise<FlightHubAiContent> {
  const { cityName, countryName, direction, airportNames, topDestinations } = facts

  const destinationsList = topDestinations
    .map((d) =>
      d.distanceKm
        ? `${d.city} (~${d.distanceKm}km, approx ${d.durationLabel})`
        : d.city
    )
    .join(', ')

  const directionContext =
    direction === 'from'
      ? `This page is for travellers based in ${cityName} searching for flights DEPARTING ${cityName}. Focus on departure logistics: which airport suits which type of trip, and the most popular routes people search for from here.`
      : `This page is for travellers elsewhere searching for flights ARRIVING INTO ${cityName}. Focus on why ${cityName} is worth flying to, and practical arrival information — which airport to land at and how to get from that airport into the city centre.`

  const prompt = `You are a knowledgeable travel writer creating unique, accurate, SEO-optimised content for a flight search page about flights ${direction} ${cityName}, ${countryName}.

${directionContext}

Facts to use (do not invent additional facts beyond these):
- Airports serving ${cityName}: ${airportNames.join(', ')}
- Popular routes ${direction === 'from' ? 'from' : 'to'} ${cityName}: ${destinationsList}

Return ONLY a valid JSON object — no markdown, no code fences, no preamble — with exactly these fields:

{
  "introText": "2-3 sentence intro paragraph for this page, using at least 2 of the facts above by name (specific airport names and/or specific destination cities). Around 60-90 words.",
  "goodToKnow": "${
    direction === 'from'
      ? 'A short practical paragraph (60-90 words) covering: which of the named airports suits which kind of trip (if more than one airport is listed), and general booking-timing advice for popular routes from here.'
      : 'A short practical paragraph (60-90 words) covering: which named airport to fly into and a brief note on getting from that airport into the city centre.'
  }",
  "travelerTip": "${
    direction === 'from'
      ? 'A short, specific paragraph (50-70 words) naming which type of traveller ' + cityName + ' departures suit best (e.g. short-haul city breaks, long-haul via a specific route from the list, budget vs full-service airlines) — genuinely distinct from the airport/booking advice already given.'
      : 'A short, specific paragraph (50-70 words) giving one genuinely specific seasonal or event-based reason to visit ' + cityName + ' at a particular time of year, distinct from the airport/transfer advice already given.'
  }"
}

Important rules:
- Every piece of content must be SPECIFIC to ${cityName}, ${countryName} and reference the facts provided
- Never use placeholder text or generic travel phrases like "offers something for everyone"
- Use British English spelling throughout
- Do not invent airport names, distances or destination names beyond what is listed above
- The content should read naturally and be genuinely useful to someone booking a flight`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
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
    return JSON.parse(cleaned) as FlightHubAiContent
  } catch {
    throw new Error(`Failed to parse OpenAI response as JSON: ${cleaned.slice(0, 200)}`)
  }
}