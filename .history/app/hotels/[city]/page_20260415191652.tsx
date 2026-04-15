import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { client } from '../../../sanity/lib/client'
import airports from '@/data/airports.json'
import HotelCityClient from '.app/HotelCityClient'

export const revalidate = 86400

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
  aiNeighbourhoods?: { name: string; description: string }[] | null
}

// ---------------------------------------------
// SANITY FETCH (read‑only)
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
// PAGE (read‑only, ISR‑safe)
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

  return (
    <HotelCityClient
      cityName={cityData.name}
      country={cityData.country}
      emoji={cityData.emoji}
      heroDescription={cityData.heroDescription}
      citySlug={city}
      continentSlug={cityData.continentSlug}
      countrySlug={cityData.countrySlug}
      aiContent={{
        intro: cityData.aiIntro || null,
        neighbourhoods: cityData.aiNeighbourhoods || [],
      }}
    />
  )
}
