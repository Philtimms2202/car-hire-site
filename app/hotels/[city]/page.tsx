import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import OpenAI from 'openai'
import { client } from '../../../sanity/lib/client'
import airports from '@/data/airports.json'
import HotelCityClient from './HotelCityClient'

export const revalidate = 86400 // 👈 cache page for 24h (less AI pressure)

// ---------------------------------------------
// OPENAI (lazy safe init)
// ---------------------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// ---------------------------------------------
// SIMPLE IN-MEMORY CACHE (KEY FIX)
// ---------------------------------------------
const aiCache = new Map<string, AIContent>()

// ---------------------------------------------
// TYPES
// ---------------------------------------------
type AirportRecord = {
  city: string
  country: string
}

type CityData = {
  name: string
  country: string
  emoji?: string
  heroDescription?: string
  slug: string
  continentSlug?: string
  countrySlug?: string
}

type AIContent = {
  intro: string
  neighbourhoods: { name: string; description: string }[]
}

// ---------------------------------------------
// SANITY FETCH
// ---------------------------------------------
async function getCityFromSanity(citySlug: string): Promise<CityData | null> {
  try {
    const data = await client.fetch(
      `*[_type == "city" && slug.current == $citySlug][0]{
        name,
        "slug": slug.current,
        emoji,
        heroDescription,
        country->{ name, "slug": slug.current },
        country->continent->{ "slug": slug.current }
      }`,
      { citySlug }
    )

    if (!data) return null

    return {
      name: data.name,
      country: data.country?.name || '',
      emoji: data.emoji,
      heroDescription: data.heroDescription,
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
// AI CONTENT GENERATION (CACHED + SAFE)
// ---------------------------------------------
async function generateAIContent(
  cityName: string,
  country: string
): Promise<AIContent> {
  const cacheKey = `${cityName}-${country}`

  // 1. RETURN FROM CACHE (ZERO COST)
  if (aiCache.has(cacheKey)) {
    console.log(`[AI] Cache hit for ${cacheKey}`)
    return aiCache.get(cacheKey)!
  }

  console.log(`[AI] Cache miss → generating for ${cacheKey}`)

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
    const parsed = JSON.parse(content)

    if (!parsed.intro || !Array.isArray(parsed.neighbourhoods)) {
      throw new Error('Invalid AI response')
    }

    // 2. STORE IN CACHE (KEY OPTIMISATION)
    aiCache.set(cacheKey, parsed)

    return parsed
  } catch (err) {
    console.error(`[AI] Failed for ${cacheKey}`, err)

    const fallback = {
      intro: `${cityName} is a fantastic destination with a wide range of places to stay. Whether you are after a luxury hotel, a boutique stay or a budget-friendly option, the city has something for every traveller.`,
      neighbourhoods: [
        {
          name: 'City Centre',
          description: `The heart of ${cityName}, close to attractions and transport.`,
        },
        {
          name: 'Historic Quarter',
          description: `Rich in culture and history, ideal for exploring.`,
        },
        {
          name: 'Waterfront District',
          description: `Scenic and lively with restaurants and bars.`,
        },
        {
          name: 'Residential Suburbs',
          description: `Quiet and spacious, great for families.`,
        },
      ],
    }

    aiCache.set(cacheKey, fallback) // even fallback is cached

    return fallback
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
    cityData.country
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