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
      return NextResponse.json({ error: 'Missing city' }, { status: 400 })
    }

    const city = await readClient.fetch(
      `*[_type == "city" && slug.current == $slug][0]{
        _id,
        name,
        country->{name},
        aiIntro,
        aiNeighbourhoods,
        aiFirstTimers,
        aiBudget,
        aiCouples,
        aiFamilies,
        aiWhenToVisit,
        aiFaqs
      }`,
      { slug: citySlug }
    )

    if (!city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    // Skip if everything already generated
    const alreadyDone =
      city.aiIntro &&
      city.aiNeighbourhoods?.length &&
      city.aiFirstTimers &&
      city.aiBudget &&
      city.aiCouples &&
      city.aiFamilies &&
      city.aiWhenToVisit &&
      city.aiFaqs?.length

    if (alreadyDone) {
      return NextResponse.json({ status: 'exists' })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing OpenAI key' }, { status: 500 })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      temperature: 0.75,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a knowledgeable British travel writer. Write in natural, warm British English. 
Never use AI-sounding phrases like "nestled", "vibrant", "bustling", "perfect for", "boasts", or "offers something for everyone". 
Be specific and genuinely useful. Each paragraph should feel like advice from a friend who knows the destination well.
Return only valid JSON with no markdown formatting.`,
        },
        {
          role: 'user',
          content: `Write a detailed "Where to Stay in ${city.name}, ${city.country?.name}" hotel guide.

Return ONLY this JSON structure with no extra keys:
{
  "intro": "A 4-5 sentence introduction to staying in ${city.name}. Be specific about what makes the city's accommodation scene distinctive. Mention price range expectations, the general layout of the city in relation to hotels, and one or two things worth knowing before booking.",

  "neighbourhoods": [
    { "name": "Real neighbourhood name", "description": "2-3 sentences about why you'd stay here, what it's near, and who it suits best. Be specific." },
    { "name": "Real neighbourhood name", "description": "2-3 sentences." },
    { "name": "Real neighbourhood name", "description": "2-3 sentences." },
    { "name": "Real neighbourhood name", "description": "2-3 sentences." }
  ],

  "firstTimers": "A 100-120 word paragraph specifically about where first-time visitors to ${city.name} should base themselves. Name actual areas or streets. Explain why that location makes sense for someone who doesn't know the city — proximity to landmarks, ease of transport, walkability. Be direct and confident.",

  "budget": "A 100-120 word paragraph about the best areas to stay in ${city.name} on a budget. Name specific neighbourhoods that offer good-value accommodation. Mention roughly what to expect price-wise if possible, or the trade-offs of staying further out. Practical and honest.",

  "couples": "A 100-120 word paragraph about the most romantic or atmospheric areas to stay in ${city.name} for couples. Think about ambience, walkable evenings, good restaurants nearby, boutique hotels or interesting stays. Specific and evocative without being clichéd.",

  "families": "A 100-120 word paragraph about the best family-friendly areas to stay in ${city.name}. Consider space, safety, proximity to family attractions, ease of getting around with children, and whether self-catering is widely available. Practical and reassuring.",

  "whenToVisit": "A 120-150 word paragraph covering the best and worst times to visit ${city.name}. Mention weather patterns, peak tourist season, quieter periods, local events or festivals worth timing a trip around, and any months to avoid. Genuinely useful, not generic.",

  "faqs": [
    { "question": "A real question someone planning a trip to ${city.name} would Google", "answer": "A direct, specific 2-3 sentence answer." },
    { "question": "Another genuinely useful question", "answer": "Direct 2-3 sentence answer." },
    { "question": "Another genuinely useful question", "answer": "Direct 2-3 sentence answer." },
    { "question": "Another genuinely useful question", "answer": "Direct 2-3 sentence answer." }
  ]
}

Rules:
- Use real, named places, neighbourhoods and landmarks specific to ${city.name}
- British English spelling throughout (colour, favourite, centre, organised)
- No markdown, no bullet points within strings
- Do not start any paragraph with "Whether you" or "From X to Y"
- Vary sentence structure — not every sentence should start with "The"
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

    const required = ['intro', 'neighbourhoods', 'firstTimers', 'budget', 'couples', 'families', 'whenToVisit', 'faqs']
    for (const key of required) {
      if (!parsed[key]) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 500 })
      }
    }

    const neighbourhoodsWithKeys = parsed.neighbourhoods.map((n: any) => ({
      _key: crypto.randomUUID(),
      ...n,
    }))

    const faqsWithKeys = parsed.faqs.map((f: any) => ({
      _key: crypto.randomUUID(),
      ...f,
    }))

    await writeClient
      .patch(city._id)
      .set({
        aiIntro: parsed.intro,
        aiNeighbourhoods: neighbourhoodsWithKeys,
        aiFirstTimers: parsed.firstTimers,
        aiBudget: parsed.budget,
        aiCouples: parsed.couples,
        aiFamilies: parsed.families,
        aiWhenToVisit: parsed.whenToVisit,
        aiFaqs: faqsWithKeys,
      })
      .commit()

    return NextResponse.json({ status: 'created' })
  } catch (err: any) {
    console.error('API ERROR:', err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}