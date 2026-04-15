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
  console.log(`[AI] generateAIContent called for: ${cityName}, ${country}`)
  console.log(`[AI] ANTHROPIC_API_KEY present: ${!!process.env.ANTHROPIC_API_KEY}`)

  try {
    const anthropic = new Anthropic()
    console.log(`[AI] Anthropic client created, sending request...`)

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a travel writer for Timms Travel, a UK-based travel website. Write in natural, warm British English — conversational but polished. Avoid sounding like a list or a brochure.

Write content for a "Where to Stay in ${cityName}, ${country}" page.

Respond ONLY with a valid JSON object, no markdown, no backticks, no preamble. Use this exact structure:
{
  "intro": "A natural, flowing paragraph of 4-5 sentences about staying in ${cityName}. Cover the overall vibe of the city, what kind of travellers it suits, and what to generally expect when choosing where to stay. Write as if you have been there.",
  "neighbourhoods": [
    { "name": "Neighbourhood Name", "description": "2-3 sentences about this area. Mention what it feels like to stay there, what it is close to, and who it suits best." },
    { "name": "Neighbourhood Name", "description": "2-3 sentences about this area. Mention what it feels like to stay there, what it is close to, and who it suits best." },
    { "name": "Neighbourhood Name", "description": "2-3 sentences about this area. Mention what it feels like to stay there, what it is close to, and who it suits best." },
    { "name": "Neighbourhood Name", "description": "2-3 sentences about this area. Mention what it feels like to stay there, what it is close to, and who it suits best." }
  ]
}

Use real, well-known neighbourhood names for ${cityName}. Do not use generic placeholder names. Write in British English throughout — use spellings like neighbourhood, centre, travelling, organised.`,
        },
      ],
    })

    console.log(`[AI] Response received, content blocks: ${message.content.length}`)

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    console.log(`[AI] Raw response text: ${text.slice(0, 200)}...`)

    const parsed = JSON.parse(text.trim())
    console.log(`[AI] Successfully parsed JSON for ${cityName}`)
    return parsed as AIContent

  } catch (error) {
    console.error(`[AI] Error generating content for ${cityName}:`, error)
    console.warn(`[AI] Falling back to default content for ${cityName}`)
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