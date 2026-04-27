import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import airports from '@/data/airports.json'
import HotelCityClient from './HotelCityClient'

export const revalidate = 86400

type AirportRecord = {
  city: string
  country: string
}

type FAQ = {
  question: string
  answer: string
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
  aiFirstTimers?: string | null
  aiBudget?: string | null
  aiCouples?: string | null
  aiFamilies?: string | null
  aiWhenToVisit?: string | null
  aiFaqs?: FAQ[] | null
}

async function getCityFromSanity(citySlug: string): Promise<CityData | null> {
  try {
    const city = await client.fetch(
      `*[_type == "city" && slug.current == $slug][0]{
        _id,
        name,
        slug,
        country->{
          name,
          slug,
          continent->{ slug }
        },
        emoji,
        heroDescription,
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

    if (!city) return null

    return {
      _id: city._id,
      name: city.name,
      country: city.country?.name || '',
      emoji: city.emoji,
      heroDescription: city.heroDescription,
      aiIntro: city.aiIntro || null,
      aiNeighbourhoods: city.aiNeighbourhoods || null,
      aiFirstTimers: city.aiFirstTimers || null,
      aiBudget: city.aiBudget || null,
      aiCouples: city.aiCouples || null,
      aiFamilies: city.aiFamilies || null,
      aiWhenToVisit: city.aiWhenToVisit || null,
      aiFaqs: city.aiFaqs || null,
      slug: city.slug,
      countrySlug: city.country?.slug,
      continentSlug: city.country?.continent?.slug,
    }
  } catch (err) {
    console.error('SANITY FETCH ERROR:', err)
    return null
  }
}

function getCityFromAirports(citySlug: string): CityData | null {
  const name = citySlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const match = (airports as AirportRecord[]).find(
    (a) => a.city?.toLowerCase() === name.toLowerCase()
  )

  if (!match) return null

  return { name: match.city, country: match.country, slug: citySlug }
}

async function resolveCity(citySlug: string): Promise<CityData | null> {
  const sanityCity = await getCityFromSanity(citySlug)
  if (sanityCity) return sanityCity
  return getCityFromAirports(citySlug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city } = await params
  const cityData = await resolveCity(city)

  if (!cityData) {
    return {
      title: 'Hotels | Timms Travel',
      alternates: { canonical: 'https://timmstravel.com/hotels' },
    }
  }

  const url = `https://timmstravel.com/hotels/${city}`

  return {
    title: `Where to Stay in ${cityData.name}, ${cityData.country} | Timms Travel`,
    description:
      cityData.aiIntro?.slice(0, 155) ||
      `Find the best areas and hotels in ${cityData.name}, ${cityData.country}. A neighbourhood-by-neighbourhood guide for every budget and travel style.`,
    openGraph: { url },
    alternates: { canonical: url },
  }
}

export default async function HotelCityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const cityData = await resolveCity(city)

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
        intro: cityData.aiIntro,
        neighbourhoods: cityData.aiNeighbourhoods || [],
        firstTimers: cityData.aiFirstTimers,
        budget: cityData.aiBudget,
        couples: cityData.aiCouples,
        families: cityData.aiFamilies,
        whenToVisit: cityData.aiWhenToVisit,
        faqs: cityData.aiFaqs || [],
      }}
    />
  )
}