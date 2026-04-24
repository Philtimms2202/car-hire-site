// lib/generateCityAiContent.ts

export interface HighlightCard {
  title: string
  description: string
}

export interface CityAiContent {
  aiIntro: string
  aiHighlightsIntro: string
  aiHighlightCards: HighlightCard[]
  aiAboutFallback: string
}

export async function generateCityAiContent(
  cityName: string,
  countryName: string,
  continentName: string
): Promise<CityAiContent> {
  const prompt = `You are a knowledgeable travel writer creating unique, accurate, SEO-optimised content for a travel website page about ${cityName}, ${countryName}.

Return ONLY a valid JSON object — no markdown, no code fences, no preamble — with exactly these fields:

{
  "aiIntro": "2-3 sentence hero description of ${cityName}. Specific, vivid, and accurate. Mention real landmarks or characteristics. Around 60-80 words.",

  "aiHighlightsIntro": "2-3 sentence paragraph introducing the highlights of ${cityName}. Mention the city's actual strengths (e.g. architecture, food scene, history, nightlife). Avoid generic travel clichés. Around 50-70 words.",

  "aiHighlightCards": [
    {
      "title": "Top Attractions",
      "description": "2-3 sentences naming the most iconic landmarks and must-see sights in ${cityName}. Be specific — mention real monuments, museums or historic sites by name and why they are worth visiting. Around 40-50 words."
    },
    {
      "title": "Culture & Local Life",
      "description": "2-3 sentences about the authentic cultural experience in ${cityName}. Mention real neighbourhoods, festivals, traditions or local customs that make the city distinct from anywhere else. Around 40-50 words."
    },
    {
      "title": "Food & Dining",
      "description": "2-3 sentences about the food scene in ${cityName}. Name real local dishes, markets or dining districts the city is genuinely known for. Around 40-50 words."
    },
    {
      "title": "Day Trips",
      "description": "2-3 sentences about the best day trip destination reachable from ${cityName}. Name a specific real place — a town, natural site or attraction — and include the approximate travel time. Around 40-50 words."
    }
  ],

  "aiAboutFallback": "A 3-4 paragraph About section for ${cityName}. Each paragraph should cover a different angle: history, modern city life, geography/setting, and travel practicalities (best time to visit, how to get around). Specific and accurate. Around 200-250 words total."
}

Important rules:
- Every piece of content must be SPECIFIC to ${cityName}, ${countryName}
- Never use placeholder text or generic travel phrases like "offers something for everyone"
- Use British English spelling throughout
- All facts must be accurate — do not invent landmarks, dishes or place names
- Vary sentence structure and vocabulary so each section feels distinct
- The content should read naturally and be genuinely useful to a traveller`

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
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content?.trim()

  if (!raw) throw new Error('Empty response from OpenAI')

  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()

  try {
    return JSON.parse(cleaned) as CityAiContent
  } catch {
    throw new Error(`Failed to parse OpenAI response as JSON: ${cleaned.slice(0, 200)}`)
  }
}