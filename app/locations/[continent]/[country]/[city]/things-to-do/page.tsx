import { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { redirect } from 'next/navigation'
import ThingsToDoClient from './ThingsToDoClient'

export const revalidate = 86400

type HighlightCard = { title: string; description: string }
type AreaCard      = { name: string; description: string }
type FAQ           = { question: string; answer: string }

type LocationData = {
  _id: string
  city: string
  country: string
  emoji?: string
  citySlug: string
  countrySlug: string
  continentSlug: string
}

type CityAI = {
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

// ── Fetch location document (for city name, country, emoji etc) ──────────────
// FIXED: was querying _type == "location" with flat continentSlug/countrySlug
// fields that don't exist on your schema. Your data is _type == "city" with
// a nested country->continent-> reference chain, same as the main city page.
async function getLocation(
  continentSlug: string,
  countrySlug: string,
  citySlug: string
): Promise<LocationData | null> {
  try {
    const data = await client.fetch(
      `*[
        _type == "city" &&
        slug.current == $citySlug &&
        country->slug.current == $countrySlug &&
        country->continent->slug.current == $continentSlug
      ][0]{
        _id,
        "city": name,
        "country": country->name,
        emoji,
        "citySlug": slug.current,
        "countrySlug": country->slug.current,
        "continentSlug": country->continent->slug.current
      }`,
      { continentSlug, countrySlug, citySlug },
      { next: { revalidate: 86400, tags: [`city-${citySlug}`] } }
    )
    return data ?? null
  } catch {
    return null
  }
}

// ── Fetch ttd* AI fields from city document ──────────────────────────────────
async function getCityAI(citySlug: string): Promise<CityAI> {
  try {
    const data = await client.fetch(
      `*[_type == "city" && slug.current == $citySlug][0]{
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
      { citySlug },
      { next: { revalidate: 86400, tags: [`city-ai-${citySlug}`] } }
    )
    return data ?? {}
  } catch {
    return {}
  }
}

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ continent: string; country: string; city: string }>
}): Promise<Metadata> {
  const { continent, country, city } = await params
  const [location, cityAI] = await Promise.all([
    getLocation(continent, country, city),
    getCityAI(city),
  ])

  if (!location) return { title: 'Things To Do | Timms Travel' }

  const url = `https://timmstravel.com/locations/${continent}/${country}/${city}/things-to-do`

  return {
    title: `Things to Do in ${location.city}, ${location.country} | Timms Travel`,
    description:
      cityAI.ttdIntro?.slice(0, 155) ||
      `Discover the best things to do in ${location.city}, ${location.country}. Tours, activities, day trips and local tips.`,
    openGraph: { url },
    alternates: { canonical: url },
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ThingsToDoPage({
  params,
}: {
  params: Promise<{ continent: string; country: string; city: string }>
}) {
  const { continent, country, city } = await params

  const [location, cityAI] = await Promise.all([
    getLocation(continent, country, city),
    getCityAI(city),
  ])

  if (!location) redirect(`/locations/${continent}/${country}`)

  return (
    <ThingsToDoClient
      _id={location._id}
      city={location.city}
      country={location.country}
      emoji={location.emoji}
      citySlug={location.citySlug}
      countrySlug={location.countrySlug}
      continentSlug={location.continentSlug}
      ttdIntro={cityAI.ttdIntro}
      ttdHighlights={cityAI.ttdHighlights}
      ttdNeighbourhoods={cityAI.ttdNeighbourhoods}
      ttdWithKids={cityAI.ttdWithKids}
      ttdOnABudget={cityAI.ttdOnABudget}
      ttdForCouples={cityAI.ttdForCouples}
      ttdDayTrips={cityAI.ttdDayTrips}
      ttdWhenToGo={cityAI.ttdWhenToGo}
      ttdLocalTips={cityAI.ttdLocalTips}
      ttdFaqs={cityAI.ttdFaqs}
    />
  )
}