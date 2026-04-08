import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { client } from '../../../../sanity/lib/client'

export const revalidate = 60

// -----------------------------
// Fetch country data
// -----------------------------
async function getCountryData(countrySlug: string) {
  return client.fetch(
    `*[_type == "country" && slug.current == $slug][0]{
      name,
      capital,
      population,
      languages,
      currency,
      flag,
      iso2
    }`,
    { slug: countrySlug }
  )
}

// -----------------------------
// Fetch cities
// -----------------------------
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

// -----------------------------
// Metadata
// -----------------------------
export async function generateMetadata({ params }: any) {
  const resolved = await params
  const { country } = resolved

  const countryData = await getCountryData(country)
  const countryName = countryData?.name || country

  return {
    title: `Timms Travel | ${countryName}`,
    description: `Discover the best experiences, attractions, and adventures across ${countryName}.`,
  }
}

// -----------------------------
// PAGE
// -----------------------------
export default async function CountryPage({ params }: { params: Promise<{ continent: string; country: string }> }) {
  const resolved = await params
  const { continent, country } = resolved

  if (!continent || !country) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>Invalid Route</h1>
          <a href="/locations" style={{ color: '#2f797c' }} className="font-semibold hover:opacity-75 transition">
            Back to all continents
          </a>
        </div>
        <Footer />
      </main>
    )
  }

  const cities = await getCities(continent, country)
  const countryData = await getCountryData(country)

  const countryName = countryData?.name || cities[0]?.country || country
  const countryEmoji = countryData?.flag || cities[0]?.countryEmoji || '🌍'

  const capital = countryData?.capital || 'Unknown'
  const population = countryData?.population ? Intl.NumberFormat().format(countryData.population) : 'Unknown'
  const languages = countryData?.languages?.join(', ') || 'Unknown'
  const currency = countryData?.currency || 'Unknown'
  const iso2 = countryData?.iso2?.toUpperCase() || 'N/A'

  const basePath = `/locations/${continent}/${country}`

  if (!cities || cities.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>No Cities Found</h1>
          <a
            href={`/locations/${continent}`}
            style={{ color: '#2f797c' }}
            className="font-semibold hover:opacity-75 transition capitalize"
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
      <a key={city.citySlug} href={href} className="card text-center hover:shadow-xl transition cursor-pointer">
        <div className="text-4xl mb-2">{city.emoji}</div>
        <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>{city.city}</p>
        <p className="text-xs mt-1" style={{ color: '#2f797c' }}>Explore experiences</p>
      </a>
    )
  })

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-20 px-6 text-center">
        <div className="text-6xl mb-4">{countryEmoji}</div>
        <h1 className="text-5xl font-bold mb-4">Explore {countryName}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover incredible experiences across {countryName}. Browse cities below to find tours, activities and adventures.
        </p>
      </section>

      {/* Cities */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>Cities in {countryName}</h2>
          <p className="text-gray-500 mb-10">Select a city to explore experiences and adventures.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{cityCards}</div>

          <div className="mt-8 flex gap-4 text-sm">
            <a href="/locations/continents" style={{ color: '#2f797c' }} className="hover:opacity-75 transition">
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



 {/* FAQ SECTION */}
<section className="py-20 px-6 bg-gray-50">
  <div className="max-w-4xl mx-auto">
    <h2
      className="text-3xl font-bold mb-10 text-center"
      style={{ color: '#232e4e' }}
    >
      Frequently Asked Questions about {countryName}
    </h2>

    <div className="space-y-4">

      {/* FAQ Item */}
      <details className="group bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
        <summary className="cursor-pointer flex justify-between items-center font-semibold text-lg"
          style={{ color: '#232e4e' }}
        >
          <span>What is the capital of {countryName}?</span>
          <span className="text-xl transition group-open:rotate-180">⌄</span>
        </summary>
        <p className="mt-3 text-gray-600">
          The capital city of {countryName} is <strong>{capital}</strong>.
        </p>
      </details>

      <details className="group bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
        <summary className="cursor-pointer flex justify-between items-center font-semibold text-lg"
          style={{ color: '#232e4e' }}
        >
          <span>What language is spoken in {countryName}?</span>
          <span className="text-xl transition group-open:rotate-180">⌄</span>
        </summary>
        <p className="mt-3 text-gray-600">
          The main languages spoken are <strong>{languages}</strong>.
        </p>
      </details>

      <details className="group bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
        <summary className="cursor-pointer flex justify-between items-center font-semibold text-lg"
          style={{ color: '#232e4e' }}
        >
          <span>What currency is used in {countryName}?</span>
          <span className="text-xl transition group-open:rotate-180">⌄</span>
        </summary>
        <p className="mt-3 text-gray-600">
          {countryName} uses the <strong>{currency}</strong>.
        </p>
      </details>

      <details className="group bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
        <summary className="cursor-pointer flex justify-between items-center font-semibold text-lg"
          style={{ color: '#232e4e' }}
        >
          <span>How many people live in {countryName}?</span>
          <span className="text-xl transition group-open:rotate-180">⌄</span>
        </summary>
        <p className="mt-3 text-gray-600">
          The population is approximately <strong>{population}</strong>.
        </p>
      </details>

    </div>
  </div>
</section>

      {/* CTA */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Explore {countryName}?</h2>
        <p className="text-gray-300 mb-8">Find amazing experiences and get there your way.</p>
        <a href="/" className="btn-primary inline-block">Get Started</a>
      </section>

      <Footer />
    </main>
  )
}