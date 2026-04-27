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

type Neighbourhood = {
  name: string
  description: string
}

type HighlightCard = {
  title: string
  description: string
}

type CityData = {
  _id?: string
  name: string
  countryName: string
  emoji?: string
  heroDescription?: string
  slug: string
  countrySlug?: string
  continentSlug?: string

  aiIntro?: string | null
  aiNeighbourhoods?: Neighbourhood[] | null
  aiFirstTimers?: string | null
  aiBudget?: string | null
  aiCouples?: string | null
  aiFamilies?: string | null
  aiWhenToVisit?: string | null
  aiNightlife?: string | null
  aiFood?: string | null
  aiSafety?: string | null
  aiTransport?: string | null
  aiLocalTips?: string | null
  aiHowManyDays?: string | null
  aiDigitalNomads?: string | null
  aiAreasToAvoid?: string | null
  aiFaqs?: FAQ[] | null

  aiHighlightsIntro?: string | null
  aiHighlightCards?: HighlightCard[] | null
}

async function getCityFromSanity(citySlug: string): Promise<CityData | null> {
  try {
    const city = await client.fetch(
      `*[_type == "city" && slug.current == $slug][0]{
        _id,
        name,
        "slug": slug.current,
        country->{
          name,
          "slug": slug.current,
          continent->{ "slug": slug.current }
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
        aiNightlife,
        aiFood,
        aiSafety,
        aiTransport,
        aiLocalTips,
        aiHowManyDays,
        aiDigitalNomads,
        aiAreasToAvoid,
        aiFaqs,

        aiHighlightsIntro,
        aiHighlightCards
      }`,
      { slug: citySlug }
    )

    if (!city) return null

    return {
      _id: city._id,
      name: city.name,
      countryName: city.country?.name || '',
      emoji: city.emoji,
      heroDescription: city.heroDescription,

      aiIntro: city.aiIntro,
      aiNeighbourhoods: city.aiNeighbourhoods,
      aiFirstTimers: city.aiFirstTimers,
      aiBudget: city.aiBudget,
      aiCouples: city.aiCouples,
      aiFamilies: city.aiFamilies,
      aiWhenToVisit: city.aiWhenToVisit,
      aiNightlife: city.aiNightlife,
      aiFood: city.aiFood,
      aiSafety: city.aiSafety,
      aiTransport: city.aiTransport,
      aiLocalTips: city.aiLocalTips,
      aiHowManyDays: city.aiHowManyDays,
      aiDigitalNomads: city.aiDigitalNomads,
      aiAreasToAvoid: city.aiAreasToAvoid,
      aiFaqs: city.aiFaqs,

      aiHighlightsIntro: city.aiHighlightsIntro,
      aiHighlightCards: city.aiHighlightCards,

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

  return {
    name: match.city,
    countryName: match.country,
    slug: citySlug,
  }
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
    title: `Where to Stay in ${cityData.name}, ${cityData.countryName} | Timms Travel`,
    description:
      cityData.aiIntro?.slice(0, 155) ||
      `Find the best areas and hotels in ${cityData.name}, ${cityData.countryName}. A neighbourhood-by-neighbourhood guide for every budget and travel style.`,
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
      countryName={cityData.countryName}
      emoji={cityData.emoji}
      heroDescription={cityData.heroDescription}
      citySlug={city}
      countrySlug={cityData.countrySlug}
      continentSlug={cityData.continentSlug}
      aiIntro={cityData.aiIntro}
      aiNeighbourhoods={cityData.aiNeighbourhoods}
      aiFirstTimers={cityData.aiFirstTimers}
      aiBudget={cityData.aiBudget}
      aiCouples={cityData.aiCouples}
      aiFamilies={cityData.aiFamilies}
      aiWhenToVisit={cityData.aiWhenToVisit}
      aiNightlife={cityData.aiNightlife}
      aiFood={cityData.aiFood}
      aiSafety={cityData.aiSafety}
      aiTransport={cityData.aiTransport}
      aiLocalTips={cityData.aiLocalTips}
      aiHowManyDays={cityData.aiHowManyDays}
      aiDigitalNomads={cityData.aiDigitalNomads}
      aiAreasToAvoid={cityData.aiAreasToAvoid}
      aiFaqs={cityData.aiFaqs}
      aiHighlightsIntro={cityData.aiHighlightsIntro}
      aiHighlightCards={cityData.aiHighlightCards}
    />
  )
}
