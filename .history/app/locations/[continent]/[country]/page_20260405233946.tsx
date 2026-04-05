import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { client } from '../../../../sanity/lib/client'

export const revalidate = 60
export async function generateMetadata({ params }: any) {
  const resolved = await params
  const { continent, country } = resolved
  
  export async function generateMetadata({ params }: any) {
    const resolved = await params
    const { continent, country, city } = resolved
  
    const cityData = await client.fetch(
      `*[_type == "location" 
        && continentSlug.current == $continent
        && countrySlug.current == $country
        && slug.current == $city][0]{
          city,
          country
        }`,
      { continent, country, city }
    )
  
    const cityName = cityData?.city || city
    const countryName = cityData?.country || country
  
    return {
      title: `Things to do in ${cityName}`,
      description: `Find the best tours, activities, and experiences in ${cityName}, ${countryName}.`,
    }
  }

  // Fetch cities to get the REAL country name from Sanity
  const cities = await getCities(continent, country)
  const countryName = cities[0]?.country || country

  return {
    title: `Things to do in ${countryName}`,
    description: `Discover the best experiences, attractions, and adventures across ${countryName}.`,
  }
}

async function getCities(continentSlug: string, countrySlug: string) {
  try {
    const cities = await client.fetch(
      `*[_type == "location" && continentSlug.current == $continentSlug && countrySlug.current == $countrySlug] 
        | order(city asc) {
          city,
          country,
          countryEmoji,
          emoji,
          "citySlug": slug.current,
          "countrySlug": countrySlug.current,
          "continentSlug": continentSlug.current
        }`,
      { continentSlug, countrySlug }
    )
    return cities
  } catch (error) {
    return []
  }
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ continent: string; country: string }>
}) {
  // SAFELY unwrap params (your project requires Promise-based params)
  const resolved = await params

  const continent = resolved?.continent
  const country = resolved?.country

  // Prevent undefined params from crashing the route
  if (!continent || !country) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Invalid Route
          </h1>
          <a
            href="/locations"
            style={{ color: '#2f797c' }}
            className="font-semibold hover:opacity-75 transition"
          >
            Back to all continents
          </a>
        </div>
        <Footer />
      </main>
    )
  }

  const cities = await getCities(continent, country)

  const countryName = cities[0]?.country || country
  const countryEmoji = cities[0]?.countryEmoji || '🌍'
  const basePath = `/locations/${continent}/${country}`

  // Handle no cities found
  if (!cities || cities.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            No Cities Found
          </h1>
          <a
            href={`/locations/${continent}`}
            style={{ color: '#2f797c' }}
            className="font-semibold hover:opacity-75 transition"
          >
            Back to {continent}
          </a>
        </div>
        <Footer />
      </main>
    )
  }

  const cityCards = cities.map((city: any) => {
    const href = `${basePath}/${city.citySlug}`
    return (
      <a
        key={city.citySlug}
        href={href}
        className="card text-center hover:shadow-xl transition cursor-pointer"
      >
        <div className="text-4xl mb-2">{city.emoji}</div>
        <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>
          {city.city}
        </p>
        <p className="text-xs mt-1" style={{ color: '#2f797c' }}>
          Explore experiences
        </p>
      </a>
    )
  })

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <div className="text-6xl mb-4">{countryEmoji}</div>
        <h1 className="text-5xl font-bold mb-4">Explore {countryName}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover incredible experiences across {countryName}. Browse cities
          below to find tours, activities and adventures.
        </p>
      </section>

      {/* Cities */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: '#232e4e' }}
          >
            Cities in {countryName}
          </h2>
          <p className="text-gray-500 mb-10">
            Select a city to explore experiences and adventures.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cityCards}
          </div>

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
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="py-16 px-6 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">
          Ready to Explore {countryName}?
        </h2>
        <p className="text-gray-300 mb-8">
          Find amazing experiences and get there your way.
        </p>
        <a href="/" className="btn-primary inline-block">
          Search Cars
        </a>
      </section>

      <Footer />
    </main>
  )
}