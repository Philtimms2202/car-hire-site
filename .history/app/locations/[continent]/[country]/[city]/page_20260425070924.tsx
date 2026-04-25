// app/locations/[continent]/[country]/[city]/page.tsx

import { Suspense } from 'react'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import Script from 'next/script'
import { client } from '../../../../../sanity/lib/client'
import { PortableText } from '@portabletext/react'
import FlightSearch from '@/app/components/Search/FlightSearch'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CityHighlights from '@/app/components/city/CityHighlights'


export const revalidate = 0

// Static once AI content is cached in Sanity
export const revalidate = false

// -----------------------------
// Metadata
// -----------------------------
export async function generateMetadata({ params }: any) {
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
    `Explore ${cityName}, ${countryName} — top attractions, tours, travel tips and things to do.`

  return {
    title: `Timms Travel | Explore ${cityName}`,
    description: desc,
    alternates: {
      canonical: `https://timmstravel.com/locations/${continent}/${country}/${city}`,
    },
  }
}

// -----------------------------
// City Fetch
// -----------------------------
async function getCity(continentSlug: string, countrySlug: string, citySlug: string) {
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

// -----------------------------
// Fallback: find correct continent for this country/city
// -----------------------------
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

// -----------------------------
// Page Component
// -----------------------------
export default async function CityPage({ params }: any) {
  const { continent, country, city } = await params
  const cityDoc = await getCity(continent, country, city)

  // If not found, try to redirect to the correct continent URL
  if (!cityDoc) {
    const correct = await findCorrectLocation(country, city)
    if (correct?.continentSlug) {
      redirect(`/locations/${correct.continentSlug}/${correct.countrySlug}/${correct.slug}`)
    }

    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            City Not Found
          </h1>
          <Link
            href={`/locations/${continent}/${country}`}
            className="font-semibold hover:opacity-75 transition"
            style={{ color: '#2f797c' }}
          >
            Back to {country}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const cityName = cityDoc.name
  const countryName = cityDoc.country?.name
  const continentName = cityDoc.country?.continent?.name
  const emoji = cityDoc.emoji
  const mainContent = cityDoc.mainContent

  const heroDescription =
    cityDoc.heroDescription ||
    cityDoc.aiIntro ||
    `Discover top attractions, tours, and unforgettable experiences in ${cityName}, ${countryName}.`

  const aboutFallback =
    cityDoc.aiAboutFallback ||
    `${cityName} is a vibrant destination in ${countryName}, known for its culture, attractions and unique character.`

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TouristDestination',
            name: cityName,
            description: heroDescription,
            containedInPlace: {
              '@type': 'Country',
              name: countryName,
            },
          }),
        }}
      />

      {/* HERO — renders immediately */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <div className="text-6xl mb-4">{emoji}</div>
        <h1 className="text-5xl font-bold mb-4">Explore {cityName}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">{heroDescription}</p>
        <div className="mt-10">
          <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
            <FlightSearch />
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS — streams in when ready, hidden until then */}
      <Suspense fallback={null}>
        <CityHighlights
          documentId={cityDoc._id}
          cityName={cityName}
          countryName={countryName}
          continentName={continentName || ''}
          cachedHighlightsIntro={cityDoc.aiHighlightsIntro}
          cachedHighlightCards={cityDoc.aiHighlightCards}
        />
      </Suspense>

      {/* GYG EXPERIENCES WIDGET — renders immediately */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Top Experiences in {cityName}
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Hand-picked activities and tours in {cityName}
          </p>
          <div
            data-gyg-widget="activities"
            data-gyg-partner-id="P7B7GRH"
            data-gyg-q={cityName}
            data-gyg-number-of-items="8"
          />
        </div>
      </section>

      {/* VIEW MORE CTA — renders immediately */}
      <div className="py-10 text-center">
        <Link
          href={`/locations/${continent}/${country}/${city}/things-to-do`}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-[#2f797c] text-white shadow-md hover:opacity-90 transition"
        >
          View More Things To Do in {cityName}
        </Link>
      </div>

      {/* ABOUT — renders immediately */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#03989e' }}>
            About {cityName}
          </h2>
          {mainContent ? (
            <div className="prose max-w-none mt-8">
              <PortableText value={mainContent} />
            </div>
          ) : (
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{aboutFallback}</p>
          )}

          {/* Breadcrumbs */}
          <nav className="mt-10 flex flex-wrap gap-2 items-center text-sm">
            <Link href="/locations" className="hover:opacity-75 transition" style={{ color: '#2f797c' }}>
              All Continents
            </Link>
            <span className="text-gray-400">→</span>
            <Link
              href={`/locations/${continent}`}
              className="hover:opacity-75 transition capitalize"
              style={{ color: '#2f797c' }}
            >
              {continentName || continent}
            </Link>
            <span className="text-gray-400">→</span>
            <Link
              href={`/locations/${continent}/${country}`}
              className="hover:opacity-75 transition capitalize"
              style={{ color: '#2f797c' }}
            >
              {countryName || country}
            </Link>
            <span className="text-gray-400">→</span>
            <span style={{ color: '#232e4e' }} className="font-semibold">
              {cityName}
            </span>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  )
}