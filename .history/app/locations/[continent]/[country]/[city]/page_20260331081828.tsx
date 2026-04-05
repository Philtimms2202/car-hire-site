import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import { client } from '../../../../../sanity/lib/client'

export const revalidate = 60

async function getCity(continentSlug: string, countrySlug: string, citySlug: string) {
  try {
    const city = await client.fetch(
      `*[_type == "location" 
        && continentSlug.current == $continentSlug 
        && countrySlug.current == $countrySlug
        && slug.current == $citySlug][0]{
          city,
          country,
          emoji,
          countryEmoji,
          description,
          "citySlug": slug.current,
          "countrySlug": countrySlug.current,
          "continentSlug": continentSlug.current
      }`,
      { continentSlug, countrySlug, citySlug }
    )
    return city
  } catch (error) {
    return null
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ continent: string; country: string; city: string }>
}) {
  const resolved = await params
  const { continent, country, city } = resolved

  const cityData = await getCity(continent, country, city)

  if (!cityData) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            City Not Found
          </h1>
          <a
            href={`/locations/${continent}/${country}`}
            style={{ color: '#2f797c' }}
            className="font-semibold hover:opacity-75 transition"
          >
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
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <div className="text-6xl mb-4">{cityData.emoji}</div>
        <h1 className="text-5xl font-bold mb-4">Explore {cityData.city}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover amazing experiences in {cityData.city}, {cityData.country}.
        </p>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            About {cityData.city}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {cityData.description || `Explore top attractions, tours, and activities in ${cityData.city}.`}
          </p>

          <div className="mt-8 flex gap-4 text-sm">
            <a
              href="/locations"
              style={{ color: '#2f797c' }}
              className="hover:opacity-75 transition"
            >
              All Continents
            </a>
            <span className="text-gray-400">→</span>
            <a
              href={`/locations/${continent}`}
              style={{ color: '#2f797c' }}
              className="hover:opacity-75 transition capitalize"
            >
              {continent}
            </a>
            <span className="text-gray-400">→</span>
            <a
              href={`/locations/${continent}/${country}`}
              style={{ color: '#2f797c' }}
              className="hover:opacity-75 transition capitalize"
            >
              {country}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}