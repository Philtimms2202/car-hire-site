import Navbar from '../../../../../components/Navbar'
import Footer from '../../../../../components/Footer'
import { client } from '../../../../../../sanity/lib/client'
import { PortableText } from '@portabletext/react'
import ThingsToDoSearch from '../../../../../components/ThingsToDoSearch'

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
    title: `Top Things to do in ${cityName}`,
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

export default async function ThingsToDoPage({
  params,
}: {
  params: Promise<{ continent: string; country: string; city: string }>
}) {
  const { continent, country, city } = await params
  const cityData = await getCity(continent, country, city)

  const cityName =
    cityData?.city ||
    city.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  if (!cityData) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            City Not Found
          </h1>
          <a href={`/locations/${continent}/${country}`} style={{ color: '#2f797c' }} className="font-semibold hover:opacity-75 transition">
            Back to {country}
          </a>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-20 px-6 text-center">
        <div className="text-6xl mb-4">{cityData.emoji}</div>
        <h1 className="text-5xl font-bold mb-4">Things to do in {cityData.city}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Search thousands of experiences, tours and activities in {cityData.city}
        </p>

        {/* Search + Category Pills + Widget all in one client component */}
        <ThingsToDoSearch cityName={cityName} />
      </section>


      {/* Breadcrumbs */}
      <section className="pb-10 px-6">
        <div className="max-w-4xl mx-auto flex gap-4 text-sm flex-wrap">
          <a href="/locations" style={{ color: '#2f797c' }} className="hover:opacity-75 transition">All Continents</a>
          <span className="text-gray-400">→</span>
          <a href={`/locations/${continent}`} style={{ color: '#2f797c' }} className="hover:opacity-75 transition capitalize">{continent}</a>
          <span className="text-gray-400">→</span>
          <a href={`/locations/${continent}/${country}`} style={{ color: '#2f797c' }} className="hover:opacity-75 transition capitalize">{country}</a>
          <span className="text-gray-400">→</span>
          <a href={`/locations/${continent}/${country}/${city}`} style={{ color: '#2f797c' }} className="hover:opacity-75 transition">{cityData.city}</a>
        </div>
      </section>

      <Footer />
    </main>
  )
}