import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { redirect } from 'next/navigation'
import ThingsToDoClient from './ThingsToDoClient'

export const revalidate = 86400

type HighlightCard  = { title: string; description: string }
type AreaCard       = { name: string; description: string }
type FAQ            = { question: string; answer: string }

type LocationData = {
  _id: string
  city: string
  country: string
  emoji?: string
  citySlug: string
  countrySlug: string
  continentSlug: string
  ttdIntro?: string | null
  ttdHighlights?: HighlightCard[]
  ttdNeighbourhoods?: AreaCard[]
  ttdWithKids?: string | null
  ttdOnABudget?: string | null
  ttdForCouples?: string | null
  ttdDayTrips?: string | null
  ttdWhenToGo?: string | null
  ttdLocalTips?: string | null
  ttdFaqs?: FAQ[]
}

async function getLocation(
  continentSlug: string,
  countrySlug: string,
  citySlug: string
): Promise<LocationData | null> {
  try {
    const data = await client.fetch(
      `*[_type == "city"
        && continentSlug.current == $continentSlug
        && countrySlug.current == $countrySlug
        && slug.current == $citySlug][0]{
        _id,
        city,
        country,
        emoji,
        "citySlug":      slug.current,
        "countrySlug":   countrySlug.current,
        "continentSlug": continentSlug.current,
        ttdIntro,
        ttdHighlights,
        ttdNeighbourhoods,
        ttdWithKids,
        ttdOnABudget,
        ttdForCouples,
        ttdDayTrips,
        ttdWhenToGo,
        ttdLocalTips,
        ttdFaqs
      }`,
      { continentSlug, countrySlug, citySlug }
    )
    return data ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ continent: string; country: string; city: string }>
}): Promise<Metadata> {
  const { continent, country, city } = await params
  const data = await getLocation(continent, country, city)

  if (!data) return { title: 'Things To Do | Timms Travel' }

  const url = `https://timmstravel.com/locations/${continent}/${country}/${city}/things-to-do`

  return {
    title: `Things to Do in ${data.city}, ${data.country} | Timms Travel`,
    description:
      data.ttdIntro?.slice(0, 155) ||
      `Discover the best things to do in ${data.city}, ${data.country}. Tours, activities, day trips and local tips.`,
    openGraph: { url },
    alternates: { canonical: url },
  }
}

export default async function ThingsToDoPage({
  params,
}: {
  params: Promise<{ continent: string; country: string; city: string }>
}) {
  const { continent, country, city } = await params
  const data = await getLocation(continent, country, city)

  if (!data) redirect(`/locations/${continent}/${country}`)

  return (
    <ThingsToDoClient
      _id={data._id}
      city={data.city}
      country={data.country}
      emoji={data.emoji}
      citySlug={data.citySlug}
      countrySlug={data.countrySlug}
      continentSlug={data.continentSlug}
      ttdIntro={data.ttdIntro}
      ttdHighlights={data.ttdHighlights}
      ttdNeighbourhoods={data.ttdNeighbourhoods}
      ttdWithKids={data.ttdWithKids}
      ttdOnABudget={data.ttdOnABudget}
      ttdForCouples={data.ttdForCouples}
      ttdDayTrips={data.ttdDayTrips}
      ttdWhenToGo={data.ttdWhenToGo}
      ttdLocalTips={data.ttdLocalTips}
      ttdFaqs={data.ttdFaqs}
    />
  )
}