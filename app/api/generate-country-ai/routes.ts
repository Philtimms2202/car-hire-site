import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { client as readClient } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const countrySlug = searchParams.get('country')

    if (!countrySlug) {
      return NextResponse.json({ error: 'Missing country param' }, { status: 400 })
    }

    // Fetch the country document
    const country = await readClient.fetch(
      `*[_type == "country" && slug.current == $countrySlug][0]{
        _id,
        name,
        capital,
        population,
        languages,
        currency,
        plugType,
        drivingSide,
        emergencyNumber,
        tippingCulture,
        visaInfo,
        bestTimeToVisit,
        safetyOverview,
        localLaws,
        costOfTravel,
        transportBasics,
        vaccinations,
        internetConnectivity,
        timeZone,
        mainAirports,
        neighbouringCountries
      }`,
      { countrySlug }
    )

    if (!country?._id) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 })
    }

    // If already generated, skip
    const alreadyDone =
      country.bestTimeToVisit &&
      country.safetyOverview &&
      country.localLaws &&
      country.costOfTravel &&
      country.transportBasics &&
      country.vaccinations &&
      country.internetConnectivity &&
      country.timeZone &&
      country.mainAirports?.length &&
      country.neighbouringCountries?.length

    if (alreadyDone) {
      return NextResponse.json({ status: 'exists' })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing OpenAI key' }, { status: 500 })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // British natural-language prompt
    const prompt = `
You are writing practical, friendly travel information for the country: ${country.name}.
Write in natural British English. Keep the tone warm, clear and human — like a UK travel writer.
Avoid clichés, avoid flowery language, avoid sounding like AI.

Return ONLY valid JSON with the following fields:

{
  "bestTimeToVisit": "",
  "safetyOverview": "",
  "localLaws": "",
  "costOfTravel": "",
  "transportBasics": "",
  "vaccinations": "",
  "internetConnectivity": "",
  "timeZone": "",
  "mainAirports": [],
  "neighbouringCountries": []
}

Guidelines:
- Keep each field to 2–4 sentences.
- Be factual, steady and helpful.
- No prices or specific costs.
- No markdown.
- No commentary outside the JSON.
- Use British spelling.
- Keep it evergreen and globally accurate.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }]
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
      'bestTimeToVisit',
      'safetyOverview',
      'localLaws',
      'costOfTravel',
      'transportBasics',
      'vaccinations',
      'internetConnectivity',
      'timeZone',
      'mainAirports',
      'neighbouringCountries'
    ]

    for (const key of required) {
      if (!parsed[key]) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 500 })
      }
    }

    // Write to Sanity
    await writeClient
      .patch(country._id)
      .set({
        bestTimeToVisit: parsed.bestTimeToVisit,
        safetyOverview: parsed.safetyOverview,
        localLaws: parsed.localLaws,
        costOfTravel: parsed.costOfTravel,
        transportBasics: parsed.transportBasics,
        vaccinations: parsed.vaccinations,
        internetConnectivity: parsed.internetConnectivity,
        timeZone: parsed.timeZone,
        mainAirports: parsed.mainAirports,
        neighbouringCountries: parsed.neighbouringCountries
      })
      .commit()

    return NextResponse.json({ status: 'created' })
  } catch (err: any) {
    console.error('COUNTRY AI GENERATION ERROR:', err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}
