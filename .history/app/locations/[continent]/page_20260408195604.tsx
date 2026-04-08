// ============================================
// CONTINENT PAGE - app/locations/[continent]/page.tsx
// URL: timmstravel.com/locations/europe
// ============================================

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { client } from '../../../sanity/lib/client'
import { countriesByContinentQuery } from '../../../sanity/lib/queries'

export const revalidate = 60
export async function generateMetadata({ params }: any) {
  const resolved = await params
  const { continent } = resolved

  // Fetch one city to get the REAL continent name from Sanity
  const cities = await client.fetch(
    `*[_type == "location" && continentSlug.current == $continent][0]{
      continent
    }`,
    { continent }
  )

  const continentName = cities?.continent || continent

  return {
    title: `Timms Travel | ${continentName}`,
    description: `Discover top attractions, tours, and activities across ${continentName}.`,
  }
}


async function getCountries(continentSlug: string) {
  try {
    const locations = await client.fetch(countriesByContinentQuery, { continentSlug })

    // Remove duplicate countries
    const seen = new Set()
    return locations.filter((loc: any) => {
      if (seen.has(loc.countrySlug)) return false
      seen.add(loc.countrySlug)
      return true
    })
  } catch (error) {
    return []
  }
}

export default async function ContinentPage({ params }: { params: Promise<{ continent: string }> }) {
  const { continent } = await params
  const countries = await getCountries(continent)

  const continentName = countries[0]?.continent || continent
  const continentEmoji = countries[0]?.continentEmoji || '🌍'
  

  if (!countries || countries.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            No Countries Found
          </h1>
          <a
            href="/locations"
            style={{ color: '#2f797c' }}
            className="font-semibold hover:opacity-75 transition"
          >
            ← Back to Locations
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
        <div className="text-6xl mb-4">{continentEmoji}</div>
        <h1 className="text-5xl font-bold mb-4">Explore {continentName}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover incredible experiences across {continentName}. Browse by country to find tours,
          activities and adventures waiting for you.
        </p>
      </section>

      {/* Countries Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
            Countries in {continentName}
          </h2>
          <p className="text-gray-500 mb-10">Select a country to explore cities and experiences.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countries.map((country: any) => (
              <a
                key={country.countrySlug}
                href={`/locations/${continent}/${country.countrySlug}`}
                className="card text-center hover:shadow-xl transition cursor-pointer"
              >
                <div className="text-4xl mb-2">{country.countryEmoji}</div>
                <p className="font-semibold text-sm" style={{ color: '#232e4e' }}>
                  {country.country}
                </p>
                <p className="text-xs mt-1" style={{ color: '#2f797c' }}>
                  View cities
                </p>
              </a>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="/locations/continents"
              style={{ color: '#2f797c' }}
              className="font-semibold hover:opacity-75 transition"
            >
              ← Back to all continents
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Explore {continentName}?</h2>
        <p className="text-gray-300 mb-8">Find amazing experiences and get there your way.</p>
        <a href="/" className="btn-primary inline-block">
          Get Started
        </a>
      </section>

      <Footer />
    </main>
  )
}