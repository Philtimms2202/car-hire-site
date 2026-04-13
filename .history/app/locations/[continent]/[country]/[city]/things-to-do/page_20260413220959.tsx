import Navbar from '../../../../../components/Navbar'
import Footer from '../../../../../components/Footer'
import { client } from '../../../../../../sanity/lib/client'
import ThingsToDoSearch from '../../../../../components/ThingsToDoSearch'
import Link from 'next/link'

export const revalidate = 60

// ---------------------------------------------
// Metadata
// ---------------------------------------------
export async function generateMetadata({ params }: any) {
  const { continent, country, city } = await params

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
    title: `Top Things to Do in ${cityName}`,
    description: `Discover the best things to do in ${cityName}, ${countryName}. Explore tours, food experiences, nightlife, outdoor adventures and more.`,
  }
}

// ---------------------------------------------
// Fetch City
// ---------------------------------------------
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

// ---------------------------------------------
// Page Component
// ---------------------------------------------
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

  const cityName = cityData.city
  const countryName = cityData.country

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <div className="text-6xl mb-4">{cityData.emoji}</div>

        <h1 className="text-5xl font-bold mb-4">
          Things to Do in {cityName}
        </h1>

        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover top tours, activities and unforgettable experiences in {cityName}
        </p>

        <div className="mt-10">
          <ThingsToDoSearch cityName={cityName} />
        </div>
      </section>

      {/* TOP EXPERIENCE CATEGORIES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold mb-6 text-center"
            style={{ color: '#232e4e' }}
          >
            Top Categories in {cityName}, {countryName}
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-gray-700">

            <a
              href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(cityName + ' city tours')}&partner_id=P7B7GRH`}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition block"
            >
              <strong>City Tours</strong>
              <p className="text-sm mt-1">
                Walking tours, bus tours, guided sightseeing.
              </p>
            </a>

            <a
              href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(cityName + ' food tours')}&partner_id=P7B7GRH`}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition block"
            >
              <strong>Food & Drink</strong>
              <p className="text-sm mt-1">
                Food tours, wine tastings, cooking classes.
              </p>
            </a>

            <a
              href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(cityName + ' outdoor activities')}&partner_id=P7B7GRH`}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition block"
            >
              <strong>Adventure & Outdoors</strong>
              <p className="text-sm mt-1">
                Boat trips, hiking, water sports and more.
              </p>
            </a>

          </div>
        </div>
      </section>

      
      {/* BREADCRUMBS */}
      <section className="pb-10 px-6">
        <div className="max-w-4xl mx-auto flex gap-4 text-sm flex-wrap">
          <Link href="/locations" className="hover:opacity-75 transition" style={{ color: '#2f797c' }}>
            All Continents
          </Link>
          <span className="text-gray-400">→</span>

          <Link href={`/locations/${continent}`} className="hover:opacity-75 transition capitalize" style={{ color: '#2f797c' }}>
            {continent}
          </Link>
          <span className="text-gray-400">→</span>

          <Link href={`/locations/${continent}/${country}`} className="hover:opacity-75 transition capitalize" style={{ color: '#2f797c' }}>
            {country}
          </Link>
          <span className="text-gray-400">→</span>

          <Link href={`/locations/${continent}/${country}/${city}`} className="hover:opacity-75 transition" style={{ color: '#2f797c' }}>
            {cityName}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
