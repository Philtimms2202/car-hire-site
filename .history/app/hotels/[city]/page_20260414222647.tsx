import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import OpenAI from 'openai'
import { client } from '../../../sanity/lib/client'
import airports from '@/data/airports.json'
import HotelCityClient from './HotelCityClient'

export const revalidate = 3600

// ---------------------------------------------
// OPENAI
// ---------------------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

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
  } catch (err) {
    console.error('[Sanity] Error:', err)
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
// AI CONTENT GENERATION
// ---------------------------------------------
async function generateAIContent(
  cityName: string,
  country: string
): Promise<AIContent> {
  console.log(`[AI] Generating content for ${cityName}, ${country}`)

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: `You are a travel writer for Timms Travel, a UK-based travel website. Write in natural, warm British English — conversational but polished.

Write content for a "Where to Stay in ${cityName}, ${country}" page.

Return ONLY valid JSON:

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
- Use REAL neighbourhoods in ${cityName}
- British English spelling
- No markdown or explanation`,
        },
      ],
    })

    const content = res.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(content)

    if (!parsed.intro || !Array.isArray(parsed.neighbourhoods)) {
      throw new Error('Invalid AI response structure')
    }

    return parsed
  } catch (err) {
    console.error(`[AI] Error for ${cityName}:`, err)

    return {
      intro: `${cityName} is a fantastic destination with a wide range of places to stay. Whether you are after a luxury hotel, a boutique stay or a budget-friendly option, the city has something for every traveller.`,
      neighbourhoods: [
        {
          name: 'City Centre',
          description: `The heart of ${cityName}, perfect for first-time visitors who want to be close to the main attractions and transport links.`,
        },
        {
          name: 'Historic Quarter',
          description: `Full of character and charm, ideal for soaking up local history and culture.`,
        },
        {
          name: 'Waterfront District',
          description: `A scenic area popular with leisure travellers, offering great views and dining options.`,
        },
        {
          name: 'Residential Suburbs',
          description: `A quieter option, ideal for families and longer stays.`,
        },
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

  if (!cityData) {
    return { title: 'Hotels | Timms Travel' }
  }

  return {
    title: `Where to Stay in ${cityData.name} | Timms Travel`,
    description: `Discover the best areas and hotels to stay in ${cityData.name}, ${cityData.country}. Curated neighbourhood guides and hotel recommendations for every budget.`,
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

  if (!cityData) {
    redirect('/hotels')
  }

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