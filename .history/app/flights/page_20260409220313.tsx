'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'
import airports from '@/data/airports.json'

// -----------------------------
// TYPES
// -----------------------------
type Airport = {
  name: string
  city: string
  country: string
  iata_code: string
}

type Destination = {
  city: string
  iata: string
  emoji: string
}

// -----------------------------
// FEATURED DESTINATIONS
// -----------------------------
const featuredDestinations: Destination[] = [
  { city: 'London', iata: 'LON', emoji: '🏙️' },
  { city: 'Barcelona', iata: 'BCN', emoji: '⛪' },
  { city: 'New York', iata: 'NYC', emoji: '🗽' },
  { city: 'Paris', iata: 'PAR', emoji: '🗼' },
  { city: 'Dubai', iata: 'DXB', emoji: '🌆' },
  { city: 'Orlando', iata: 'MCO', emoji: '🎢' },
]

// -----------------------------
// AIRPORT LIST
// -----------------------------
const outboundAirports: Airport[] = (airports as Airport[])
  .filter(a => a.iata_code)
  .sort((a, b) => a.city.localeCompare(b.city))

// -----------------------------
// PAGE
// -----------------------------
export default function FlightsPage() {
  const [origin, setOrigin] = useState<string>('MAN')
  const [originSearch, setOriginSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const filteredAirports = outboundAirports.filter((a) => {
    if (!originSearch) return false
    const q = originSearch.toLowerCase()
    return (
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.iata_code.toLowerCase().includes(q)
    )
  })

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-24 px-6 text-center"
      >
        <p className="text-sm uppercase tracking-widest text-teal-400 mb-3 font-medium">
          Powered by Aviasales
        </p>

        <h1 className="text-5xl font-bold mb-4">
          Find Your Perfect Flight ✈️
        </h1>

        <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Compare hundreds of airlines instantly — real prices, no hidden fees.
        </p>

        {/* PAGE TABS */}
        <div className="flex justify-center gap-6 mb-8">
          {[
            { label: 'Flights', href: '/flights' },
            { label: 'Hotels', href: '/hotels' },
            { label: 'Experiences', href: '/experiences' },
            { label: 'Cars', href: '/hire-cars' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`pb-2 text-lg font-medium transition ${
                label === 'Flights'
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          <FlightSearch />
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Popular Destinations
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Choose your departure airport to see instant deep‑links
          </p>

          {/* SEARCHABLE AIRPORT SELECTOR */}
          <div className="flex justify-center mb-10 relative">
            <div className="w-80">
              <input
                type="text"
                placeholder="Search departure airport..."
                className="px-4 py-2 w-full rounded-lg border border-gray-300 shadow-sm"
                value={originSearch}
                onChange={(e) => {
                  setOriginSearch(e.target.value)
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
              />

              {showDropdown && filteredAirports.length > 0 && (
                <div className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 max-h-72 overflow-y-auto w-80">
                  {filteredAirports.map((a) => (
                    <div
                      key={a.iata_code}
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition"
                      onClick={() => {
                        setOrigin(a.iata_code)
                        setOriginSearch(`${a.city} (${a.iata_code})`)
                        setShowDropdown(false)
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          {a.city}, {a.country}
                        </span>
                        <span className="text-blue-600 font-bold">
                          {a.iata_code}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">{a.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DESTINATION GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((dest) => (
              <div
                key={dest.iata}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{dest.emoji}</span>
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#232e4e' }}>
                      {dest.city}
                    </p>
                    <p className="text-xs text-gray-400">Deep‑linked via Aviasales</p>
                  </div>
                </div>

                <a
                  href={`app/go/flights?origin=${origin}&dest=${dest.iata}`}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  View flights →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS BY SEASON */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Destinations by Season
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Find the perfect place to fly depending on the time of year
          </p>

          {[
            {
              season: "Spring",
              emoji: "🌸",
              items: [
                { city: "Amsterdam", iata: "AMS", temp: "12–18°C", rain: "Moderate", sun: "6 hrs" },
                { city: "Rome", iata: "ROM", temp: "15–22°C", rain: "Low", sun: "8 hrs" },
                { city: "Lisbon", iata: "LIS", temp: "16–23°C", rain: "Low", sun: "9 hrs" },
              ]
            },
            {
              season: "Summer",
              emoji: "☀️",
              items: [
                { city: "Barcelona", iata: "BCN", temp: "26–32°C", rain: "Low", sun: "10 hrs" },
                { city: "Ibiza", iata: "IBZ", temp: "28–33°C", rain: "Very Low", sun: "11 hrs" },
                { city: "Antalya", iata: "AYT", temp: "30–36°C", rain: "Very Low", sun: "12 hrs" },
              ]
            },
            {
              season: "Autumn",
              emoji: "🍂",
              items: [
                { city: "Paris", iata: "PAR", temp: "12–18°C", rain: "Moderate", sun: "5 hrs" },
                { city: "Prague", iata: "PRG", temp: "10–16°C", rain: "Low", sun: "5 hrs" },
                { city: "Budapest", iata: "BUD", temp: "12–18°C", rain: "Low", sun: "6 hrs" },
              ]
            },
            {
              season: "Winter",
              emoji: "❄️",
              items: [
                { city: "Dubai", iata: "DXB", temp: "22–28°C", rain: "Very Low", sun: "8 hrs" },
                { city: "Tenerife", iata: "TCI", temp: "18–24°C", rain: "Low", sun: "7 hrs" },
                { city: "Cape Verde", iata: "SID", temp: "24–28°C", rain: "Low", sun: "7 hrs" },
              ]
            }
          ].map(({ season, emoji, items }) => (
            <div key={season} className="mb-14">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#232e4e' }}>
                <span>{emoji}</span> {season}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((dest) => (
                  <div
                    key={dest.iata}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                  >
                    <p className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>
                      {dest.city}
                    </p>

                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p><strong>Avg Temp:</strong> {dest.temp}</p>
                      <p><strong>Rainfall:</strong> {dest.rain}</p>
                      <p><strong>Sunshine:</strong> {dest.sun}</p>
                    </div>

                    <a
                      href={`/go/flights?origin=${origin}&dest=${dest.iata}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      View flights →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
