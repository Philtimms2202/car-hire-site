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

    const prompt = `
You are a knowledgeable UK travel writer creating a structured, SEO-optimised travel guide for ${country.name}.

Write in warm, clear, natural British English. Be specific and factual — a traveller should finish reading and feel genuinely informed, not like they've read a brochure. Avoid clichés, AI-sounding phrasing, and generic filler.

Return ONLY valid JSON. No commentary, no markdown code fences, no preamble.

Each text field should use the following structure:
- A short opening sentence that directly answers the question.
- 2–4 bullet points (formatted as "• Point here.") covering the most useful specifics.
- A closing sentence with practical advice or a genuine insight.

Array fields (mainAirports, neighbouringCountries) should be plain string arrays.

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

Field-specific guidance:

bestTimeToVisit — Cover peak season, shoulder season, and any weather patterns to avoid. Mention specific months.

safetyOverview — Cover overall safety level, common risks (petty theft, scams, natural hazards), and any areas or situations to be cautious about. Be honest but balanced.

localLaws — Cover dress codes, alcohol rules, photography restrictions, and any laws that commonly catch tourists off guard. Be specific.

costOfTravel — Cover budget, mid-range and comfortable daily spend ranges in GBP. Mention what drives costs up or down (cities vs rural, season, etc). Be realistic.

transportBasics — Cover how to get between cities, local city transport options, taxi/ride-share availability, and any tips for getting around efficiently.

vaccinations — Cover recommended vaccinations, any required ones (e.g. yellow fever certificates), and any health advisories relevant to travellers from the UK.

internetConnectivity — Cover mobile network quality, whether eSIMs work well, local SIM availability, and typical speeds or coverage gaps to be aware of.

timeZone — State the primary time zone(s) clearly. Mention if the country spans multiple zones or observes daylight saving.

mainAirports — List 3–6 key international or major regional airports by full name and IATA code, e.g. "London Heathrow (LHR)".

neighbouringCountries — List all bordering countries by their common English name.

British spelling throughout. Keep it evergreen. Do not include specific prices for individual items.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.6,
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