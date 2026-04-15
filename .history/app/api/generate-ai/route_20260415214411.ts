import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { client as readClient } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const citySlug = searchParams.get('city')

    console.log("🔵 API HIT: /api/generate-ai for", citySlug)

    if (!citySlug) {
      console.error("❌ Missing city slug")
      return NextResponse.json({ error: 'Missing city' }, { status: 400 })
    }

    // ---------------------------------------------
    // FETCH CITY FROM SANITY
    // ---------------------------------------------
    const city = await readClient.fetch(
      `*[_type == "city" && slug.current == $slug][0]{
        _id,
        name,
        country->{name},
        aiIntro,
        aiNeighbourhoods
      }`,
      { slug: citySlug }
    )

    console.log("📄 CITY FETCH RESULT:", city)

    if (!city) {
      console.error("❌ City not found in Sanity:", citySlug)
      return NextResponse.json({ error: 'City not found' }, { status: 404 })
    }

    // ---------------------------------------------
    // SKIP IF ALREADY GENERATED
    // ---------------------------------------------
    if (city.aiIntro && city.aiNeighbourhoods?.length) {
      console.log("⚪ Already exists — skipping generation")
      return NextResponse.json({ status: 'exists' })
    }

    // ---------------------------------------------
    // OPENAI CLIENT
    // ---------------------------------------------
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ Missing OPENAI_API_KEY")
      return NextResponse.json({ error: 'Missing OpenAI key' }, { status: 500 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    console.log("🤖 Calling OpenAI…")

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: `
Write a "Where to Stay in ${city.name}, ${city.country?.name}" guide.

Return ONLY valid JSON:
{
  "intro": "4-5 sentence paragraph",
  "neighbourhoods": [
    { "name": "Neighbourhood", "description": "2-3 sentences" },
    { "name": "Neighbourhood", "description": "2-3 sentences" },
    { "name": "Neighbourhood", "description": "2-3 sentences" },
    { "name": "Neighbourhood", "description": "2-3 sentences" }
  ]
}

Rules:
- Use real neighbourhoods
- British English
- No markdown
`
        }
      ]
    })

    const content = completion.choices[0]?.message?.content
    console.log("🟢 RAW OPENAI RESPONSE:", content)

    if (!content) {
      console.error("❌ OpenAI returned empty content")
      return NextResponse.json({ error: 'OpenAI returned no content' }, { status: 500 })
    }

    // ---------------------------------------------
    // PARSE JSON
    // ---------------------------------------------
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (err) {
      console.error("❌ JSON parse error:", err)
      console.error("Content was:", content)
      return NextResponse.json({ error: 'Invalid JSON from OpenAI' }, { status: 500 })
    }

    console.log("🟢 PARSED JSON:", parsed)

    if (!parsed.intro || !Array.isArray(parsed.neighbourhoods)) {
      console.error("❌ Parsed JSON missing required fields")
      return NextResponse.json({ error: 'Invalid AI content structure' }, { status: 500 })
    }

    // ---------------------------------------------
    // ADD _key FIELDS (FIXES SANITY WARNING)
    // ---------------------------------------------
    const neighbourhoodsWithKeys = parsed.neighbourhoods.map((n: any) => ({
      _key: crypto.randomUUID(),
      ...n,
    }))

    // ---------------------------------------------
    // WRITE TO SANITY
    // ---------------------------------------------
    console.log("✍️ Writing to Sanity…")

    await writeClient
      .patch(city._id)
      .set({
        aiIntro: parsed.intro,
        aiNeighbourhoods: neighbourhoodsWithKeys,
      })
      .commit()

    console.log("✅ SANITY WRITE COMPLETE")

    return NextResponse.json({ status: 'created' })
  } catch (err: any) {
    console.error("🔥 API ERROR:", err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}
