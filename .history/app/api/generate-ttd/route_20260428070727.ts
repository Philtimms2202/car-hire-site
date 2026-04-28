import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { client as readClient } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const citySlug = searchParams.get('city')

    if (!citySlug) {
      return NextResponse.json({ error: 'Missing city param' }, { status: 400 })
    }

    const city = await readClient.fetch(
      `*[_type == "city" && slug.current == $citySlug][0]{
        _id,
        name,
        country->{name},
        ttdIntro,
        ttdHighlights,
        ttdNeighbourhoods,
        ttdWithKids,
        ttdOnABudget,
        ttdForCouples,
        ttdDayTrips,
        ttdWhenToGo,
        ttdLocalTips,
        ttdFaqs
      }`,
      { citySlug }
    )

    if (!city?._id) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    const alreadyDone =
      city.ttdIntro &&
      city.ttdHighlights?.length &&
      city.ttdNeighbourhoods?.length &&
      city.ttdWithKids &&
      city.ttdOnABudget &&
      city.ttdForCouples &&
      city.ttdDayTrips &&
      city.ttdWhenToGo &&
      city.ttdLocalTips &&
      city.ttdFaqs?.length

    if (alreadyDone) {
      return NextResponse.json({ status: 'exists' })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing OpenAI key' }, { status: 500 })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.75,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a knowledgeable British travel writer specialising in experiences and activities.
Write in natural, warm British English. Be specific and genuinely useful — name real places, landmarks,
neighbourhoods, festivals and local experiences. Never use phrases like "nestled", "vibrant", "bustling",
"boasts", "perfect for", or "offers something for everyone". Write like a well-travelled friend giving
honest advice, not a brochure. Return only valid JSON with no markdown.`,
        },
        {
          role: 'user',
          content: `Write a detailed "Things to Do in ${city.name}, ${city.country?.name}" activities guide.

Return ONLY this JSON structure:
{
  "intro": "4–5 sentences introducing what makes ${city.name} worth visiting for experiences and activities. Be specific about what the city does well — its cultural scene, outdoor options, food, history, or whatever genuinely defines it. Mention one or two things that set it apart from similar destinations.",

  "highlights": [
    { "title": "Short punchy label", "description": "2 sentences on why this aspect of ${city.name} is worth your time. Be specific." },
    { "title": "Short punchy label", "description": "2 sentences." },
    { "title": "Short punchy label", "description": "2 sentences." },
    { "title": "Short punchy label", "description": "2 sentences." }
  ],

  "neighbourhoods": [
    { "name": "Real area name", "description": "2–3 sentences on what activities and experiences this part of ${city.name} is best for. Name specific streets, squares or landmarks." },
    { "name": "Real area name", "description": "2–3 sentences." },
    { "name": "Real area name", "description": "2–3 sentences." },
    { "name": "Real area name", "description": "2–3 sentences." }
  ],

  "withKids": "100–120 words on the best things to do in ${city.name} with children. Name specific attractions, parks, museums or experiences that genuinely work well for families. Mention age ranges where relevant. Practical and reassuring.",

  "onABudget": "100–120 words on free and cheap things to do in ${city.name}. Name specific free attractions, parks, markets, viewpoints or walking routes. Be honest about where you can and can't save money.",

  "forCouples": "100–120 words on the most romantic or memorable experiences in ${city.name} for couples. Think atmospheric restaurants, evening walks, boat trips, cultural experiences. Specific and evocative without being clichéd.",

  "dayTrips": "100–120 words on the best day trips from ${city.name}. Name specific towns, beaches, national parks or landmarks within a reasonable distance. Mention roughly how far each is and the best way to get there.",

  "whenToGo": "120–150 words on the best time of year to visit ${city.name} specifically for activities and experiences. Cover weather, peak tourist season, local festivals or events worth timing a trip around, and any months where key attractions may be closed or less accessible.",

  "localTips": "100–120 words of insider advice for getting the most out of ${city.name}. Think booking tips, things most tourists miss, local etiquette around tours or attractions, and any practical advice specific to this destination.",

  "faqs": [
    { "question": "A real question someone planning a trip to ${city.name} would search for", "answer": "Direct, specific 2–3 sentence answer." },
    { "question": "Another genuinely useful question", "answer": "Direct 2–3 sentence answer." },
    { "question": "Another genuinely useful question", "answer": "Direct 2–3 sentence answer." },
    { "question": "Another genuinely useful question", "answer": "Direct 2–3 sentence answer." }
  ]
}

Rules:
- Use real named places, attractions and landmarks specific to ${city.name}
- British English spelling (colour, favourite, centre, organised)
- No markdown, no bullet points within strings
- Do not start any section with "Whether you" or "From X to Y"
- Vary sentence structure — not every sentence should start with "The"
- FAQ questions should target People Also Ask style queries: "Is ${city.name} worth visiting?", "How many days do you need in ${city.name}?", etc.
`,
        },
      ],
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: 'OpenAI returned no content' }, { status: 500 })
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON from OpenAI' }, { status: 500 })
    }

    const required = [
      'intro', 'highlights', 'neighbourhoods', 'withKids',
      'onABudget', 'forCouples', 'dayTrips', 'whenToGo',
      'localTips', 'faqs',
    ]
    for (const key of required) {
      if (!parsed[key]) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 500 })
      }
    }

    const withKeys = (arr: any[]) =>
      arr.map((item) => ({ _key: crypto.randomUUID(), ...item }))

    await writeClient
      .patch(city._id)
      .set({
        ttdIntro:          parsed.intro,
        ttdHighlights:     withKeys(parsed.highlights),
        ttdNeighbourhoods: withKeys(parsed.neighbourhoods),
        ttdWithKids:       parsed.withKids,
        ttdOnABudget:      parsed.onABudget,
        ttdForCouples:     parsed.forCouples,
        ttdDayTrips:       parsed.dayTrips,
        ttdWhenToGo:       parsed.whenToGo,
        ttdLocalTips:      parsed.localTips,
        ttdFaqs:           withKeys(parsed.faqs),
      })
      .commit()

    return NextResponse.json({ status: 'created' })
  } catch (err: any) {
    console.error('TTD GENERATION ERROR:', err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}