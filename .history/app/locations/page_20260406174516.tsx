// ============================================
// LOCATIONS PAGE - app/locations/page.tsx
// ============================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: {
    default: "Timms Travel | Locations",
    template: "Timms Travel |",
  },
  description: "Discover amazing experiences around the world.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function Locations() {
  const ukDestinations = [
    // ... unchanged
  ]

  const worldDestinations = [
    // ... unchanged
  ]

  const continents = [
    { name: 'Europe', slug: 'europe', emoji: '🇪🇺' },
    { name: 'North America', slug: 'north-america', emoji: '🌎' },
    { name: 'Asia', slug: 'asia', emoji: '🌏' },
    { name: 'Australia', slug: 'australia', emoji: '🇦🇺' },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <h1 className="text-5xl font-bold mb-4">Most Popular Destinations</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Whether you're exploring closer to home or heading somewhere a little
          more exotic, we've got travel covered across the UK and worldwide.
        </p>
      </section>

      {/* 🌍 CONTINENTS NAV (NEW) */}
      <section className="py-12 px-6 bg-white border-b">
        <div className="max-w-6xl mx-auto text-center">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: '#232e4e' }}
          >
            Explore by Continent
          </h2>
          <p className="text-gray-500 mb-8">
            Start broad, then drill down into countries and cities
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {continents.map((c) => (
              <a
                key={c.slug}
                href={`/locations/${c.slug}`}
                className="bg-gray-50 hover:bg-gray-100 border rounded-lg p-4 transition cursor-pointer flex items-center justify-center gap-2 font-semibold"
                style={{ color: '#232e4e' }}
              >
                <span className="text-xl">{c.emoji}</span>
                {c.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* UK Destinations */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: '#232e4e' }}
          >
            UK Destinations
          </h2>
          <p className="text-gray-500 mb-10">
            From city breaks to coastal road trips, find the best experience deals
            at cities across the UK.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ukDestinations.map((dest) => (
              <div
                key={dest.city}
                className="card hover:shadow-xl transition cursor-pointer"
              >
                <div className="text-4xl mb-3">{dest.emoji}</div>
                <h3
                  className="font-bold text-xl mb-1"
                  style={{ color: '#232e4e' }}
                >
                  {dest.city}
                </h3>
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: '#2f797c' }}
                >
                  ✈ {dest.airport}
                </p>
                <p className="text-gray-500 text-sm leading-6">
                  {dest.description}
                </p>
                <a
                  href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`}
                  className="inline-block mt-4 text-sm font-semibold hover:opacity-75 transition"
                  style={{ color: '#2f797c' }}
                >
                  Search experiences in {dest.city} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Worldwide Destinations */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: '#232e4e' }}
          >
            Worldwide Destinations
          </h2>
          <p className="text-gray-500 mb-10">
            Heading further afield? Get on board with an exciting adventure wherever you are in the world.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {worldDestinations.map((dest) => (
              <div
                key={dest.city}
                className="card hover:shadow-xl transition cursor-pointer"
              >
                <div className="text-4xl mb-3">{dest.emoji}</div>
                <h3
                  className="font-bold text-lg mb-1"
                  style={{ color: '#232e4e' }}
                >
                  {dest.city}
                </h3>
                <p className="text-sm font-medium mb-3 text-gray-400">
                  {dest.country}
                </p>
                <p className="text-gray-500 text-sm leading-6">
                  {dest.description}
                </p>
                <a
                  href={`/locations/${dest.continent}/${dest.countrySlug}/${dest.slug}`}
                  className="inline-block mt-4 text-sm font-semibold hover:opacity-75 transition"
                  style={{ color: '#2f797c' }}
                >
                  Search experiences in {dest.city} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="py-16 px-6 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Can't See Your Destination?</h2>
        <p className="text-gray-300 mb-8 text-lg">
          We cover thousands of locations worldwide. Search above and we'll find
          the best deals wherever you're headed.
        </p>
        <a href="/locations/continents" className="btn-primary inline-block">
          Search All Locations
        </a>
      </section>

      <Footer />
    </main>
  )
}