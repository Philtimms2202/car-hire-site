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

// Correct Trip.com city IDs
const cityMap = {
  london: 'london-301',
  paris: 'paris-192',
  barcelona: 'barcelona-381',
  dubai: 'dubai-220',
  newyork: 'new-york-318',
  rome: 'rome-360',
}

const buildCityUrl = (cityKey: keyof typeof cityMap) =>
  `https://uk.trip.com/hotels/${cityMap[cityKey]}/${TRIP_AFFIL_SLUG}`

// -----------------------------
// FEATURED HOTELS (NO IMAGES YET)
// -----------------------------
const featuredHotels = [
  {
    name: 'The Tower Hotel',
    city: 'London',
    stars: 4,
    neighbourhood: 'Tower Bridge',
    hotelId: '1055033',
  },
  {
    name: 'W Barcelona',
    city: 'Barcelona',
    stars: 5,
    neighbourhood: 'Barceloneta Beach',
    hotelId: '1749017',
  },
  {
    name: 'Atlantis The Palm',
    city: 'Dubai',
    stars: 5,
    neighbourhood: 'Palm Jumeirah',
    hotelId: '436005',
  },
  {
    name: 'The Standard, High Line',
    city: 'New York',
    stars: 4,
    neighbourhood: 'Meatpacking District',
    hotelId: '2388898',
  },
  {
    name: 'Hotel Lutetia',
    city: 'Paris',
    stars: 5,
    neighbourhood: 'Saint‑Germain‑des‑Prés',
    hotelId: '1055032',
  },
  {
    name: 'Rome Cavalieri, Waldorf Astoria',
    city: 'Rome',
    stars: 5,
    neighbourhood: 'Monte Mario',
    hotelId: '1055031',
  },
]

const buildHotelUrl = (id: string) =>
  `https://uk.trip.com/hotels/detail/?hotelId=${id}${TRIP_AFFIL_SLUG}`

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
        className="py-28 px-6 text-center text-white"
        style={{
          background: 'linear-gradient(135deg, #1e2a47 0%, #3b4a6b 100%)',
        }}
      >
        <h1 className="text-5xl font-bold mb-4">Find Your Perfect Stay 🏨</h1>

        <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
          Discover luxury escapes, boutique gems, and budget‑friendly stays around the world.
        </p>

        {/* TABS */}
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

      {/* FEATURED HOTELS */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Featured Hotels
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Hand‑picked luxury and iconic stays.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.map((hotel) => (
              <div
                key={hotel.hotelId}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
              >
                {/* Placeholder image */}
                <div className="w-full h-40 bg-gray-200 rounded-xl mb-4 flex items-center justify-center text-gray-500">
                  Image coming soon
                </div>

                <h3 className="text-xl font-bold mb-1" style={{ color: '#232e4e' }}>
                  {hotel.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {hotel.city} • {hotel.neighbourhood}
                </p>

                <p className="text-yellow-500 mb-4">
                  {'★'.repeat(hotel.stars)}{' '}
                  <span className="text-gray-400">{'★'.repeat(5 - hotel.stars)}</span>
                </p>

                <button
                  onClick={() => window.open(buildHotelUrl(hotel.hotelId), '_blank')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  View Deal →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP AREAS TO STAY */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Top Areas to Stay
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Explore the best neighbourhoods for every type of traveller.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { area: 'Shinjuku, Tokyo', vibe: 'Shopping, nightlife, food' },
              { area: 'Manhattan, NYC', vibe: 'Iconic landmarks & culture' },
              { area: 'Deira, Dubai', vibe: 'Affordable & central' },
              { area: 'Montmartre, Paris', vibe: 'Romantic & artistic' },
              { area: 'Gothic Quarter, Barcelona', vibe: 'Historic & vibrant' },
              { area: 'Westminster, London', vibe: 'Royal landmarks' },
            ].map((a) => (
              <div key={a.area} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#232e4e' }}>
                  {a.area}
                </h3>
                <p className="text-gray-600">{a.vibe}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
