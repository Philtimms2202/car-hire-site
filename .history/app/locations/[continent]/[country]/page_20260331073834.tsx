// ============================================
// COUNTRY PAGE - app/locations/[continent]/[country]/page.tsx
// URL: hirecarhub.com/locations/europe/united-kingdom
// ============================================

import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { client } from '../../../../sanity/lib/client'

export const revalidate = 60

async function getCities(continentSlug: string, countrySlug: string) {
  try {
    const cities = await client.fetch(
      `*[_type == "location" && continentSlug.current == $continentSlug && countrySlug.current == $countrySlug] | order(city asc) {
        _id,
        city,
        country,
        countryEmoji,
        continent,
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

export default async function CountryPage({ params }: { params: Promise<{ continent: string, country: string }> }) {
  const { continent, country } = await params
  const cities = await getCities(continent, country)

  const countryName = cities[0]?.country || country
  const countryEmoji = cities[0]?.countryEmoji || '🌍'

  if (!cities || cities.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-24">
          <h1 className="text-3xl font-bold mb-4" style={{color: '#232e4e'}}>No Cities Found</h1>
          <a href={`/locations/${continent}`} style={{color: '#2f797c'}} className="font-semibold hover:opacity-75 transition">← Back to {continent}</a>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{backgroundColor: '#232e4e'}} className="text-white py-20 px-6 text-center">
        <div className="text-6xl mb-4">{countryEmoji}</div>
        <h1 className="text-5xl font-bold mb-4">Explore {countryName}</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover incredible experiences across {countryName}. Browse cities below to find tours, activities and adventures waiting for you.
        </p>
      </section>

      {/* Cities Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2" style={{color: '#232e4e'}}>Cities in {countryName}</h2>
          <p className="text-gray-500 mb-10">Select a city to explore experiences and adventures.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cities.map((city: any) => (
              
                key={city.citySlug}
                href={`/locations/${continent}/${country}/${city.citySlug}`}
                className="card text-center hover:shadow-xl transition cursor-pointer"
              >
                <div className="text-4xl mb-2">{city.emoji}</div>
                <p className="font-semibold text-sm" style={{color: '#232e4e'}}>{city.city}</p>
                <p className="text-xs mt-1" style={{color: '#2f797c'}}>Explore experiences</p>
              </a>
            ))}
          </div>

          {/* Breadcrumb */}
          <div className="mt-8 flex gap-4 text-sm">
            <a href="/locations" style={{color: '#2f797c'}} className="hover:opacity-75 transition">All Continents</a>
            <span className="text-gray-400">→</span>
            <a href={`/locations/${continent}`} style={{color: '#2f797c'}} className="hover:opacity-75 transition capitalize">{continent}</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{backgroundColor: '#232e4e'}} className="py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Explore {countryName}?</h2>
        <p className="text-gray-300 mb-8">Find amazing experiences and get there your way.</p>
        <a href="/" className="btn-primary inline-block">Search Cars</a>
      </section>

      <Footer />
    </main>
  )
}