import Navbar from '../../../../../components/Navbar'
import Footer from '../../../../../components/Footer'
import { client } from '../../../../../../sanity/lib/client'
import { PortableText } from '@portabletext/react'
import ThingsToDoSearch from '../../../../../components/ThingsToDoSearch'
import Link from 'next/link'

export const revalidate = 60

export async function generateMetadata({ params }: any) {
  const resolved = await params
  const { continent, country, city } = resolved

  const cityData = await client.fetch(
    `*[_type == "location"
      && continentSlug.current == $continent
      && countrySlug.current == $country
      && slug.current == $city][0]{
        city,
        country,
        description
      }`,
    { continent, country, city }
  )

  const cityName = cityData?.city || city
  const countryName = cityData?.country || country

  return {
    title: `Top 12 Things to do in ${cityName}`,
    description: `Discover the best things to do in ${cityName}, ${countryName}. Search nightlife, food tours, adventures and more.`,
  }
}

async function getCity(continentSlug: string, countrySlug: string, citySlug: string) {
  try {
    return await client.fetch(
      `*[_type == "location"
        && continentSlug.current == $continentSlug
        && countrySlug.current == $countrySlug
        && slug.current == $citySlug][0]{
          city,
          country,
          emoji,
          description,
          mainContent,
          "citySlug": slug.current,
          "countrySlug": countrySlug.current,
          "continentSlug": continentSlug.current
      }`,
      { continentSlug, countrySlug, citySlug }
    )
  } catch {
    return null
  }
}

export default async function ThingsToDoPage({ params }: any) {
  const { continent, country, city } = await params
  const cityData = await getCity(continent, country, city)

  if (!cityData) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            City Not Found
          </h1>
          <Link href={`/locations/${continent}/${country}`} className="font-semibold hover:opacity-75 transition" style={{ color: '#2f797c' }}>
            Back to {country}
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const cityName = cityData.city
  const countryName = cityData.country

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-20 px-6 text-center">
        <div className="text-6xl mb-4">{cityData.emoji}</div>
        <h1 className="text-5xl font-bold mb-4">Things to do in {cityName}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Search thousands of experiences, tours and activities in {cityName}
        </p>

        <ThingsToDoSearch cityName={cityName} />
      </section>

      {/* WHY VISIT */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#232e4e' }}>
            Why Visit {cityName}?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            {cityName} is one of the most exciting destinations in {countryName}. Whether you're
            looking for culture, food, nightlife, or outdoor adventures, the city offers a wide
            range of unforgettable experiences.
          </p>

          <ul className="grid md:grid-cols-2 gap-6 text-gray-700">
            <li className="p-4 border rounded-lg shadow-sm">
              <strong>Iconic Attractions</strong>
              <p className="text-sm mt-1">
                Explore the must‑see landmarks and cultural highlights that make {cityName} famous.
              </p>
            </li>

            <li className="p-4 border rounded-lg shadow-sm">
              <strong>Local Experiences</strong>
              <p className="text-sm mt-1">
                Discover authentic neighbourhoods, markets, and local traditions unique to {countryName}.
              </p>
            </li>

            <li className="p-4 border rounded-lg shadow-sm">
              <strong>Food & Nightlife</strong>
              <p className="text-sm mt-1">
                From street food to fine dining, {cityName} offers some of the best flavours in {countryName}.
              </p>
            </li>

            <li className="p-4 border rounded-lg shadow-sm">
              <strong>Outdoor Adventures</strong>
              <p className="text-sm mt-1">
                Enjoy parks, viewpoints, and day trips that showcase the natural beauty of {countryName}.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* TOP CATEGORIES */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#232e4e' }}>
            Top Experience Categories in {cityName}
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-gray-700">
            <div className="p-4 border rounded-lg shadow-sm">
              <strong>City Tours</strong>
              <p className="text-sm mt-1">Walking tours, bus tours, and guided experiences.</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <strong>Food & Drink</strong>
              <p className="text-sm mt-1">Food tours, wine tastings, cooking classes.</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
              <strong>Adventure & Outdoors</strong>
              <p className="text-sm mt-1">Boat trips, hiking, water sports and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BEST TIME TO VISIT */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Best Time to Visit {cityName}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {cityName} can be enjoyed year‑round, but many travellers prefer the mild weather and
            vibrant atmosphere during spring and autumn. Summer brings festivals and outdoor events,
            while winter offers a quieter, more relaxed experience.
          </p>
        </div>
      </section>

      {/* WHERE TO STAY */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Where to Stay in {cityName}
          </h2>
          <p className="text-gray-600 mb-8">
            Find hotels, apartments, and unique stays across {cityName}.
          </p>

          <Link
            href={`/hotels?city=${cityName}`}
            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold bg-[#2f797c] text-white shadow-md hover:opacity-90 transition"
          >
            Browse Hotels in {cityName}
          </Link>
        </div>
      </section>

      {/* NEARBY CITIES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#232e4e' }}>
            Nearby Cities in {countryName}
          </h2>
          <p className="text-gray-600 mb-8">
            Explore more destinations across {countryName}.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href={`/locations/${continent}/${country}`} className="p-4 border rounded-lg hover:shadow-md transition">
              <strong>{countryName}</strong>
              <p className="text-sm text-gray-500 mt-1">View all cities →</p>
            </Link>
          </div>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <section className="pb-10 px-6">
        <div className="max-w-4xl mx-auto flex gap-4 text-sm flex-wrap">
          <Link href="/locations" className="hover:opacity-75 transition" style={{ color: '#2f797c' }}>All Continents</Link>
          <span className="text-gray-400">→</span>
          <Link href={`/locations/${continent}`} className="hover:opacity-75 transition capitalize" style={{ color: '#2f797c' }}>{continent}</Link>
          <span className="text-gray-400">→</span>
          <Link href={`/locations/${continent}/${country}`} className="hover:opacity-75 transition capitalize" style={{ color: '#2f797c' }}>{country}</Link>
          <span className="text-gray-400">→</span>
          <Link href={`/locations/${continent}/${country}/${city}`} className="hover:opacity-75 transition" style={{ color: '#2f797c' }}>{cityName}</Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
