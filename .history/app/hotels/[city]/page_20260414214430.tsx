import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Anthropic from '@anthropic-ai/sdk'
import { client } from '../../../sanity/lib/client'
import airports from '@/data/airports.json'
import HotelCityClient from './HotelCityClient'

export const revalidate = 3600

// ---------------------------------------------
// TYPES
// ---------------------------------------------
type AirportRecord = {
  city: string
  country: string
  iata_code?: string
  _geoloc?: { lat: number; lng: number }
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
// AIRPORTS.JSON FALLBACK
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
async function generateAIContent(cityName: string, country: string): Promise<AIContent> {
  try {
    const anthropic = new Anthropic()

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a travel writer for Timms Travel, a UK-based travel site. 
Write content for a "Where to Stay in ${cityName}, ${country}" page.

Respond ONLY with a valid JSON object, no markdown, no backticks, no preamble. Use this exact structure:
{
  "intro": "2-3 sentence introduction about staying in ${cityName}. Mention the overall vibe and who the city suits.",
  "neighbourhoods": [
    { "name": "Neighbourhood Name", "description": "1-2 sentences about this area and who it suits for staying." },
    { "name": "Neighbourhood Name", "description": "1-2 sentences about this area and who it suits for staying." },
    { "name": "Neighbourhood Name", "description": "1-2 sentences about this area and who it suits for staying." },
    { "name": "Neighbourhood Name", "description": "1-2 sentences about this area and who it suits for staying." }
  ]
}

Use real neighbourhood names for ${cityName}. Keep the tone warm, helpful and concise.`,
        },
      ],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text.trim())
    return parsed as AIContent
  } catch {
    return {
      intro: `${cityName} is a fantastic destination with a wide range of places to stay. Whether you are after a luxury hotel, a boutique stay or a budget-friendly option, the city has something for every traveller.`,
      neighbourhoods: [
        {
          name: 'City Centre',
          description: `The heart of ${cityName}, perfect for first-time visitors who want to be close to the main attractions and transport links.`,
        },
        {
          name: 'Historic Quarter',
          description: `Full of character and charm, this area is ideal for those who want to soak up the local history and culture.`,
        },
        {
          name: 'Waterfront District',
          description: `A popular choice for leisure travellers, offering scenic views and easy access to restaurants and bars.`,
        },
        {
          name: 'Residential Suburbs',
          description: `A quieter alternative to the city centre, great for longer stays and families looking for more space.`,
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

  const cityName = cityData.name
  const country = cityData.country

  return {
    title: `Where to Stay in ${cityName} | Timms Travel`,
    description: `Discover the best areas and hotels to stay in ${cityName}, ${country}. Curated neighbourhood guides and hotel recommendations for every budget.`,
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

  // 1. Try Sanity first
  const sanityCity = await getCityFromSanity(city)

  // 2. Fallback to airports.json
  const cityData = sanityCity || getCityFromAirports(city)

  // 3. Not found anywhere
  if (!cityData) {
    redirect('/hotels')
  }

  // 4. Generate AI content server-side (cached via revalidate)
  const aiContent = await generateAIContent(cityData.name, cityData.country)

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