// app/locations/[continent]/[country]/[city]/page.tsx

import { client } from '../../../../../sanity/lib/client'
import { redirect } from 'next/navigation'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import Link from 'next/link'
import JsonLd from '../../../../components/JsonLd'
import CityPageClient from './CityPageClient'
import { getCityHubByName } from '@/lib/airports'

export const revalidate = false

type PageParams = Promise<{ continent: string; country: string; city: string }>

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: PageParams }) {
  const { continent, country, city } = await params

  const data = await client.fetch(
    `*[
      _type == "city" &&
      slug.current == $city &&
      country->slug.current == $country &&
      country->continent->slug.current == $continent
    ][0]{
      name,
      heroDescription,
      metaDescription,
      aiIntro,
      country->{ name }
    }`,
    { continent, country, city }
  )

  const cityName = data?.name || city
  const countryName = data?.country?.name || country
  const desc =
    data?.metaDescription ||
    data?.heroDescription ||
    data?.aiIntro ||
    `Looking to visit ${cityName}, ${countryName}? View the top attractions, tours, travel tips and local experiences.`

  return {
    title: `${cityName}, ${countryName}  Travel Guide`,
    description: desc,
    alternates: {
      canonical: `https://timmstravel.com/locations/${continent}/${country}/${city}`,
    },
  }
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function getCity(
  continentSlug: string,
  countrySlug: string,
  citySlug: string
) {
  try {
    return await client.fetch(
      `*[
        _type == "city" &&
        slug.current == $citySlug &&
        country->slug.current == $countrySlug &&
        country->continent->slug.current == $continentSlug
      ][0]{
        _id,
        name,
        "slug": slug.current,
        emoji,
        airport,
        heroDescription,
        mainContent,
        metaDescription,
        country->{
          name,
          "slug": slug.current,
          emoji,
          continent->{ name, "slug": slug.current, emoji }
        },
        aiIntro,
        aiHighlightsIntro,
        aiHighlightCards,
        aiAboutFallback
      }`,
      { continentSlug, countrySlug, citySlug }
    )
  } catch {
    return null
  }
}

async function findCorrectLocation(countrySlug: string, citySlug: string) {
  try {
    return await client.fetch(
      `*[
        _type == "city" &&
        slug.current == $citySlug &&
        country->slug.current == $countrySlug
      ][0]{
        "slug": slug.current,
        "countrySlug": country->slug.current,
        "continentSlug": country->continent->slug.current
      }`,
      { countrySlug, citySlug }
    )
  } catch {
    return null
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CityPage({ params }: { params: PageParams }) {
  const { continent, country, city } = await params
  const cityDoc = await getCity(continent, country, city)

  if (!cityDoc) {
    const correct = await findCorrectLocation(country, city)
    if (correct?.continentSlug) {
      redirect(
        `/locations/${correct.continentSlug}/${correct.countrySlug}/${correct.slug}`
      )
    }

    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#022135' }}>
            City Not Found
          </h1>
          <Link
            href={`/locations/${continent}/${country}`}
            className="font-semibold hover:opacity-75 transition"
            style={{ color: '#03989e' }}
          >
            Back to {country}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const cityName = cityDoc.name
  const countryName = cityDoc.country?.name || country
  const continentName = cityDoc.country?.continent?.name || continent
  const basePath = `/locations/${continent}/${country}/${cityDoc.slug}`

  // ─── Structured Data (JSON-LD) ──────────────────────────────────────────────

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'All destinations', item: 'https://timmstravel.com/locations' },
      { '@type': 'ListItem', position: 2, name: continentName, item: `https://timmstravel.com/locations/${continent}` },
      { '@type': 'ListItem', position: 3, name: countryName, item: `https://timmstravel.com/locations/${continent}/${country}` },
      { '@type': 'ListItem', position: 4, name: cityName, item: `https://timmstravel.com${basePath}` },
    ],
  }

  const cityEntitySchema = {
    '@context': 'https://schema.org',
    '@type': ['TouristDestination', 'City'],
    name: cityName,
    description: cityDoc.metaDescription || cityDoc.heroDescription || cityDoc.aiIntro || `Discover top attractions, tours, and activities in ${cityName}, ${countryName}.`,
    url: `https://timmstravel.com${basePath}`,
    containedInPlace: {
      '@type': 'Country',
      name: countryName,
      url: `https://timmstravel.com/locations/${continent}/${country}`,
    },
  }

  const flightHub = getCityHubByName(cityDoc.name)

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={cityEntitySchema} />
      <CityPageClient
        cityId={cityDoc._id}
        cityName={cityDoc.name}
        citySlug={cityDoc.slug}
        countryName={cityDoc.country?.name}
        countrySlug={cityDoc.country?.slug}
        continentName={cityDoc.country?.continent?.name}
        continentSlug={continent}
        emoji={cityDoc.emoji}
        airport={cityDoc.airport}
        heroDescription={cityDoc.heroDescription}
        mainContent={cityDoc.mainContent}
        aiIntro={cityDoc.aiIntro}
        aiHighlightsIntro={cityDoc.aiHighlightsIntro}
        aiHighlightCards={cityDoc.aiHighlightCards}
        aiAboutFallback={cityDoc.aiAboutFallback}
        flightsFromSlug={flightHub?.slug ?? null}
        flightsToSlug={flightHub?.slug ?? null}
      />
    </>
  )
}