'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HotelSearch from '@/app/components/Search/HotelSearch'

// -----------------------------
// TRIP.COM AFFILIATE
// -----------------------------
const TRIP_AFFIL_SLUG =
  '?Allianceid=8052073&SID=304662590&trip_sub1=&trip_sub3=D15350393'

// Build a Trip.com city hotel URL
const buildTripCityUrl = (citySlug: string) => {
  return `https://uk.trip.com/hotels/${citySlug}/${TRIP_AFFIL_SLUG}`
}

// Build a Trip.com hotel detail URL
const buildTripHotelDetailUrl = (hotelId: string) => {
  return `https://uk.trip.com/hotels/detail/?hotelId=${hotelId}${TRIP_AFFIL_SLUG}`
}

// -----------------------------
// FEATURED HOTEL DESTINATIONS
// -----------------------------
const featuredHotelCities = [
  { city: 'London', slug: 'london', emoji: '🏙️' },
  { city: 'Paris', slug: 'paris', emoji: '🗼' },
  { city: 'Barcelona', slug: 'barcelona', emoji: '⛪' },
  { city: 'Dubai', slug: 'dubai', emoji: '🌆' },
  { city: 'New York', slug: 'new-york', emoji: '🗽' },
  { city: 'Rome', slug: 'rome', emoji: '🏛️' },
]

// -----------------------------
// SEASONAL HOTEL PICKS
// -----------------------------
const seasonalHotelBlocks = [
  {
    season: 'Spring',
    emoji: '🌸',
    items: [
      { city: 'Amsterdam', slug: 'amsterdam', temp: '12–18°C', vibe: 'Canals & Flowers' },
      { city: 'Lisbon', slug: 'lisbon', temp: '16–23°C', vibe: 'Sunny City Break' },
      { city: 'Rome', slug: 'rome', temp: '15–22°C', vibe: 'Warm & Cultural' },
    ],
  },
  {
    season: 'Summer',
    emoji: '☀️',
    items: [
      { city: 'Ibiza', slug: 'ibiza', temp: '28–33°C', vibe: 'Beaches & Nightlife' },
      { city: 'Antalya', slug: 'antalya', temp: '30–36°C', vibe: 'Resorts & Pools' },
      { city: 'Barcelona', slug: 'barcelona', temp: '26–32°C', vibe: 'Beach + City' },
    ],
  },
  {
    season: 'Autumn',
    emoji: '🍂',
    items: [
      { city: 'Prague', slug: 'prague', temp: '10–16°C', vibe: 'Cosy & Scenic' },
      { city: 'Budapest', slug: 'budapest', temp: '12–18°C', vibe: 'Thermal Baths' },
      { city: 'Paris', slug: 'paris', temp: '12–18°C', vibe: 'Romantic Break' },
    ],
  },
  {
    season: 'Winter',
    emoji: '❄️',
    items: [
      { city: 'Dubai', slug: 'dubai', temp: '22–28°C', vibe: 'Winter Sun' },
      { city: 'Tenerife', slug: 'tenerife', temp: '18–24°C', vibe: 'Warm Beaches' },
      { city: 'Cape Verde', slug: 'cape-verde', temp: '24–28°C', vibe: 'Tropical Escape' },
    ],
  },
]

// -----------------------------
// PAGE
// -----------------------------
export default function HotelsPage() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'experiences' | 'cars'>('hotels')

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-24 px-6 text-center"
      >
        <h1 className="text-5xl font-bold mb-4">
          Find Your Perfect Hotel 🏨
        </h1>

        <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Compare thousands of hotels worldwide — real reviews, real deals.
        </p>

        {/* TAB MENU */}
        <div className="flex justify-center gap-6 mb-8">
          {['flights', 'hotels', 'experiences', 'cars'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-lg font-medium ${
                activeTab === tab ? 'border-b-2 border-white' : 'text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          {activeTab === 'hotels' && <HotelSearch />}
        </div>
      </section>

      {/* FEATURED HOTEL DESTINATIONS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">

          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Featured Hotel Destinations
          </h2>

          <p className="text-center text-gray-500 mb-10">
            Explore top cities with the best hotel deals.
          </p>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHotelCities.map((dest) => (
              <div
                key={dest.slug}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{dest.emoji}</span>
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#232e4e' }}>
                      {dest.city}
                    </p>
                    <p className="text-xs text-gray-400">Top hotel deals</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => window.open(buildTripCityUrl(dest.slug), '_blank')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  View hotels →
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SEASONAL HOTEL PICKS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Hotels by Season
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Find the perfect stay depending on the time of year.
          </p>

          {seasonalHotelBlocks.map(({ season, emoji, items }) => (
            <div key={season} className="mb-14">
              <h3
                className="text-2xl font-semibold mb-4 flex items-center gap-2"
                style={{ color: '#232e4e' }}
              >
                <span>{emoji}</span> {season}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((dest) => (
                  <div
                    key={dest.slug}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                  >
                    <p className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>
                      {dest.city}
                    </p>

                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p><strong>Avg Temp:</strong> {dest.temp}</p>
                      <p><strong>Why go:</strong> {dest.vibe}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => window.open(buildTripCityUrl(dest.slug), '_blank')}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      View hotels →
                    </button>
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
