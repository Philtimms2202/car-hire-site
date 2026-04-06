// ============================================
// LOCATIONS PAGE - app/locations/page.tsx
// ============================================

'use client'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useState } from 'react'

const ukDestinations = [
  // ... your existing UK destinations
]

const worldDestinations = [
  // ... your existing world destinations
]

const continents = [
  { name: 'All', slug: 'all', emoji: '🌍' },
  { name: 'Europe', slug: 'europe', emoji: '🇪🇺' },
  { name: 'North America', slug: 'north-america', emoji: '🌎' },
  { name: 'Asia', slug: 'asia', emoji: '🌏' },
  { name: 'Australia', slug: 'australia', emoji: '🇦🇺' },
]

const allDestinations = [
  ...ukDestinations.map((d) => ({ ...d, group: 'UK' })),
  ...worldDestinations.map((d) => ({ ...d, group: 'World' })),
]

export default function Locations() {
  const [activeContinent, setActiveContinent] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = allDestinations.filter((dest) => {
    const matchesContinent = activeContinent === 'all' || dest.continent === activeContinent
    const matchesSearch = dest.city.toLowerCase().includes(search.toLowerCase())
    return matchesContinent && matchesSearch
  })

  const ukFiltered = filtered.filter((d) => d.group === 'UK')
  const worldFiltered = filtered.filter((d) => d.group === 'World')

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Most Popular Destinations</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Whether you're exploring closer to home or heading somewhere a little
          more exotic, we've got travel covered across the UK and worldwide.
        </p>

        {/* Search box */}
        <div className="max-w-xl mx-auto relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search a destination e.g. Paris, London..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-4 rounded-xl text-black text-base focus:outline-none shadow-lg"
          />
        </div>
      </section>

      {/* Continent Filter */}
      <section className="py-8 px-6 bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {continents.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveContinent(c.slug)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm border transition ${
                  activeContinent === c.slug
                    ? 'text-white border-transparent'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
                style={activeContinent === c.slug ? { backgroundColor: '#232e4e' } : {}}
              >
                <span>{c.emoji}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* No results */}
      {filtered.length === 0 && (
        <section className="py-24 px-6 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#232e4e' }}>
            No destinations found
          </h2>
          <p className="text-gray-500">Try a different search or browse by continent above.</p>
        </section>
      )}

      {/* UK Destinations */}
      {ukFiltered.length > 0 && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
              UK Destinations
            </h2>
            <p className="text-gray-500 mb-10">
              From city breaks to coastal road trips, find the best experience deals across the UK.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ukFiltered.map((dest) => (
                <div key={dest.city} className="card hover:shadow-xl transition cursor-pointer">
                  <div className="text-4xl mb-3">{dest.emoji}</div>
                  <h3 className="font-bold text-xl mb-1" style={{ color: '#232e4e' }}>{dest.city}</h3>
                  <p className="text-sm font-medium mb-3" style={{ color: '#2f797c' }}>✈ {dest.airport}</p>
                  <p className="text-gray-500 text-sm leading-6">{dest.description}</p>
                  
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
      )}

      {/* Worldwide Destinations */}
      {worldFiltered.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
              Worldwide Destinations
            </h2>
            <p className="text-gray-500 mb-10">
              Heading further afield? Get on board with an exciting adventure wherever you are in the world.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {worldFiltered.map((dest) => (
                <div key={dest.city} className="card hover:shadow-xl transition cursor-pointer">
                  <div className="text-4xl mb-3">{dest.emoji}</div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>{dest.city}</h3>
                  <p className="text-sm font-medium mb-3 text-gray-400">{dest.country}</p>
                  <p className="text-gray-500 text-sm leading-6">{dest.description}</p>
                  
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
      )}

      {/* CTA */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Can't See Your Destination?</h2>
        <p className="text-gray-300 mb-8 text-lg">
          We cover thousands of locations worldwide. Search above and we'll find the best deals wherever you're headed.
        </p>
        <a href="/locations/continents" className="btn-primary inline-block">
          Search All Locations
        </a>
      </section>

      <Footer />
    </main>
  )
}