import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import Script from 'next/script'
import { client } from '../../../../../sanity/lib/client'
import { PortableText } from '@portabletext/react'
import CitySearchBar from '../../../../components/Search/CitySearchBar'
import Link from 'next/link'

export const revalidate = 60

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
      country->{ name }
    }`,
    { continent, country, city }
  )

  const cityName = data?.name || city
  const countryName = data?.country?.name || country

  const desc =
    data?.metaDescription ||
    data?.heroDescription ||
    `Explore ${cityName}, ${countryName} — top attractions, tours, travel tips and things to do.`

  return {
    title: `Timms Travel | Explore ${cityName}`,
    description: desc,
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
        }
      }`,
      { continentSlug, countrySlug, citySlug }
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

  if (!cityDoc) {
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
  const emoji = cityDoc.emoji
  const heroDescription = cityDoc.heroDescription
  const mainContent = cityDoc.mainContent

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <div className="text-6xl mb-4">{emoji}</div>

        <h1 className="text-5xl font-bold mb-4">Explore {cityName}</h1>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          {heroDescription ||
            `Discover top attractions, tours, and unforgettable experiences in ${cityName}, ${countryName}.`}
        </p>

        <div className="mt-10">
          <CitySearchBar defaultCity={cityName} />
        </div>
      </section>

{/* CITY HIGHLIGHTS */}
<section className="py-16 px-6 bg-white">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-3xl font-bold mb-6" style={{ color: '#232e4e' }}>
      Highlights of {cityName}
    </h2>

    <p className="text-gray-600 mb-8 leading-relaxed">
      {cityName} is one of the most iconic destinations in {countryName}. Whether you're
      visiting for culture, food, nightlife, or history, the city offers something for every
      traveller. Here are some of the reasons people love visiting {cityName}.
    </p>

    <ul className="grid md:grid-cols-2 gap-6 text-gray-700">

      <li className="p-4 border rounded-lg shadow-sm">
        <strong>Top Attractions in {countryName}</strong>
        <p className="text-sm mt-1">
          Explore world‑famous landmarks, museums, and must‑see sights that make {cityName}
          one of the most visited cities in {countryName}.
        </p>
      </li>

      <li className="p-4 border rounded-lg shadow-sm">
        <strong>Culture & Local Life</strong>
        <p className="text-sm mt-1">
          Experience the traditions, neighbourhoods, and cultural highlights that define
          {` ${countryName }`} — all through the unique lens of {cityName}.
        </p>
      </li>

      <li className="p-4 border rounded-lg shadow-sm">
        <strong>Food & Dining in {countryName}</strong>
        <p className="text-sm mt-1">
          From regional dishes to modern cuisine, {cityName} showcases some of the best
          flavours {countryName} has to offer.
        </p>
      </li>

      <li className="p-4 border rounded-lg shadow-sm">
        <strong>Day Trips in {countryName}</strong>
        <p className="text-sm mt-1">
          Discover nearby towns, natural wonders, and coastal escapes — all easily accessible
          from {cityName}.
        </p>
      </li>

    </ul>
  </div>
</section>


      {/* GYG Widget */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Top Experiences in {cityName}
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Hand‑picked activities and tours in {cityName}
          </p>

          <div
            data-gyg-widget="activities"
            data-gyg-partner-id="P7B7GRH"
            data-gyg-q={cityName}
            data-gyg-number-of-items="8"
          ></div>
        </div>
      </section>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link
          href={`/locations/${continent}/${country}/${city}/things-to-do`}
          className="
            inline-flex items-center justify-center 
            px-6 py-3 rounded-xl font-semibold 
            bg-[#2f797c] text-white 
            shadow-md hover:opacity-90 transition
          "
        >
          View More Things To Do in {cityName}
        </Link>
      </div>

      {/* ABOUT */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: '#03989e' }}
          >
            About {cityName}
          </h2>

          {mainContent ? (
            <div className="prose max-w-none mt-8">
              <PortableText value={mainContent} />
            </div>
          ) : (
            <p className="text-gray-600 leading-relaxed">
              {cityName} is a vibrant destination in {countryName}, known for its culture,
              attractions, and unique character. Explore the city’s highlights, discover local
              neighbourhoods, and enjoy unforgettable experiences.
            </p>
          )}

          {/* Breadcrumbs */}
          <div className="mt-10 flex gap-4 text-sm">
            <Link
              href="/locations"
              className="hover:opacity-75 transition"
              style={{ color: '#2f797c' }}
            >
              All Continents
            </Link>
            <span className="text-gray-400">→</span>

            <Link
              href={`/locations/${continent}`}
              className="hover:opacity-75 transition capitalize"
              style={{ color: '#2f797c' }}
            >
              {continent}
            </Link>
            <span className="text-gray-400">→</span>

            <Link
              href={`/locations/${continent}/${country}`}
              className="hover:opacity-75 transition capitalize"
              style={{ color: '#2f797c' }}
            >
              {country}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
