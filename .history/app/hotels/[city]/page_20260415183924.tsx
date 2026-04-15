import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@sanity/client'
import OpenAI from 'openai'
import { client } from '../../../sanity/lib/client'
import airports from '@/data/airports.json'
import HotelCityClient from './HotelCityClient'

export const revalidate = 86400

// ---------------------------------------------
// OPENAI
// ---------------------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// ---------------------------------------------
// SANITY WRITE CLIENT
// ---------------------------------------------
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

// ---------------------------------------------
// TYPES
// ---------------------------------------------
type AirportRecord = {
  city: string
  country: string
}

type CityData = {
  _id?: string
  name: string
  country: string
  emoji?: string
  heroDescription?: string
  slug: string
  continentSlug?: string
  countrySlug?: string
  aiIntro?: string | null
  aiNeighbourhoods?: AIContent['neighbourhoods'] | null
}

type AIContent = {
  intro: string
  neighbourhoods: { name: string; description: string }[]
}

// ---------------------------------------------
// SANITY FETCH (now includes AI fields + _id)
// ---------------------------------------------
async function getCityFromSanity(citySlug: string): Promise<CityData | null> {
  try {
    const data = await client.fetch(
      `*[_type == "city" && slug.current == $citySlug][0]{
        _id,
        name,
        "slug": slug.current,
        emoji,
        heroDescription,
        aiIntro,
        aiNeighbourhoods,
        country->{ name, "slug": slug.current },
        country->continent->{ "slug": slug.current }
      }`,
      { citySlug }
    )

    if (!data) return null

    return {
      _id: data._id,
      name: data.name,
      country: data.country?.name || '',
      emoji: data.emoji,
      heroDescription: data.heroDescription,
      aiIntro: data.aiIntro || null,
      aiNeighbourhoods: data.aiNeighbourhoods || null,
      slug: data.slug,
      countrySlug: data.country?.slug,
      continentSlug: data.country?.continent?.slug,
    }
  } catch {
    return null
  }
}

// ---------------------------------------------
// AIRPORT FALLBACK
// ---------------------------------------------
function getCityFromAirports(citySlug: string): CityData | null {
  const name = citySlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const match = (airports as AirportRecord[]).find(
    a => a.city?.toLowerCase() === name.toLowerCase()
  )

  if (!match) return null

  return {
    name: match.city,
    country: match.country,
    slug: citySlug,
  }
}

// ---------------------------------------------
// AI CONTENT (checks Sanity first, calls OpenAI only once)
// ---------------------------------------------
async function generateAIContent(
  cityName: string,
  country: string,
  sanityId?: string,
  existingIntro?: string | null,
  existingNeighbourhoods?: AIContent['neighbourhoods'] | null
): Promise<AIContent> {

  // 1. ALREADY IN SANITY → FREE FOREVER
  if (existingIntro && existingNeighbourhoods?.length) {
    console.log(`[AI] Sanity cache hit for ${cityName}`)
    return { intro: existingIntro, neighbourhoods: existingNeighbourhoods }
  }

  console.log(`[AI] Cache miss → calling OpenAI for ${cityName}`)

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: `Write a "Where to Stay in ${cityName}, ${country}" guide.

Return ONLY JSON:
{
  "intro": "4-5 sentence paragraph",
  "neighbourhoods": [
    { "name": "...", "description": "2-3 sentences" },
    { "name": "...", "description": "2-3 sentences" },
    { "name": "...", "description": "2-3 sentences" },
    { "name": "...", "description": "2-3 sentences" }
  ]
}

Rules:
- Real neighbourhoods only
- British English
- No markdown`,
        },
      ],
    })

    const content = res.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(content) as AIContent

    if (!parsed.intro || !Array.isArray(parsed.neighbourhoods)) {
      throw new Error('Invalid AI response structure')
    }

    // 2. SAVE TO SANITY → OpenAI never called again for this city
    if (sanityId) {
      try {
        await writeClient
          .patch(sanityId)
          .set({
            aiIntro: parsed.intro,
            aiNeighbourhoods: parsed.neighbourhoods,
          })
          .commit()
        console.log(`[AI] Saved to Sanity for ${cityName}`)
      } catch (writeErr) {
        // Don't fail the page if the write fails — content still returns fine
        console.error(`[AI] Sanity write failed for ${cityName}`, writeErr)
      }
    }

    return parsed

  } catch (err) {
    console.error(`[AI] OpenAI failed for ${cityName}`, err)

    return {
      intro: `${cityName} is a fantastic destination with a wide range of places to stay. Whether you are after a luxury hotel, a boutique stay or a budget-friendly option, the city has something for every traveller.`,
      neighbourhoods: [
        { name: 'City Centre', description: `The heart of ${cityName}, close to attractions and transport.` },
        { name: 'Historic Quarter', description: `Rich in culture and history, ideal for exploring on foot.` },
        { name: 'Waterfront District', description: `Scenic and lively with restaurants and bars nearby.` },
        { name: 'Residential Suburbs', description: `Quiet and spacious, great for families and longer stays.` },
      ],
    }
  }
}

// ---------------------------------------------
// METADATA
// ---------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city } = await params
  const sanityCity = await getCityFromSanity(city)
  const cityData = sanityCity || getCityFromAirports(city)
  if (!cityData) return { title: 'Hotels | Timms Travel' }

  return {
    title: `Where to Stay in ${cityData.name} | Timms Travel`,
    description: `Discover the best areas and hotels in ${cityData.name}, ${cityData.country}.`,
    alternates: {
      canonical: `https://timmstravel.com/hotels/${city}`,
    },
  }
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default async function HotelCityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params

  const sanityCity = await getCityFromSanity(city)
  const cityData = sanityCity || getCityFromAirports(city)

  if (!cityData) redirect('/hotels')

  const aiContent = await generateAIContent(
    cityData.name,
    cityData.country,
    cityData._id,
    cityData.aiIntro,
    cityData.aiNeighbourhoods
  )

  return (
    <HotelCityClient
      cityName={cityData.name}
      country={cityData.country}
      emoji={cityData.emoji}
      heroDescription={cityData.heroDescription}
      citySlug={city}
      continentSlug={cityData.continentSlug}
      countrySlug={cityData.countrySlug}
      aiContent={aiContent}
    />
  )
}