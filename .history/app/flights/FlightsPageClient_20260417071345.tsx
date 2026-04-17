'use client'

import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'
import airports from '@/data/airports.json'

// -----------------------------
// TYPES
// -----------------------------
type Airport = {
  name: string
  city: string
  country: string
  iata_code: string
  _geoloc?: { lat: number; lng: number }
}

type Destination = {
  city: string
  iata: string
  emoji?: string
  description?: string
}

// -----------------------------
// DATA
// -----------------------------
const allAirports: Airport[] = (airports as Airport[])
  .filter(a => a.iata_code)
  .sort((a, b) => a.city.localeCompare(b.city))

const featuredDestinations: Destination[] = [
  { city: 'London', iata: 'LON', emoji: '🏙️', description: 'World-class culture, theatre, and history.' },
  { city: 'Barcelona', iata: 'BCN', emoji: '⛪', description: 'Sun, beaches, and stunning architecture.' },
  { city: 'New York', iata: 'JFK', emoji: '🗽', description: 'The city that never sleeps.' },
  { city: 'Paris', iata: 'PAR', emoji: '🗼', description: 'Romantic streets and iconic landmarks.' },
  { city: 'Dubai', iata: 'DXB', emoji: '🌆', description: 'Luxury, shopping, and futuristic skyline.' },
  { city: 'Orlando', iata: 'MCO', emoji: '🎢', description: 'Theme parks and family adventures.' },
  { city: 'Tokyo', iata: 'HND', emoji: '🗾', description: 'A blend of tradition and cutting-edge tech.' },
  { city: 'Sydney', iata: 'SYD', emoji: '🌊', description: 'Beaches, sunshine, and laid-back vibes.' },
  { city: 'Cape Town', iata: 'CPT', emoji: '⛰️', description: 'Mountains, coastlines, and vineyards.' },
]

const seasonalBlocks = [
  {
    season: 'Spring',
    emoji: '🌸',
    items: [
      { city: 'Amsterdam', iata: 'AMS', temp: '12–18°C', rain: 'Moderate', sun: '6 hrs' },
      { city: 'Rome', iata: 'ROM', temp: '15–22°C', rain: 'Low', sun: '8 hrs' },
      { city: 'Lisbon', iata: 'LIS', temp: '16–23°C', rain: 'Low', sun: '9 hrs' },
      { city: 'Vienna', iata: 'VIE', temp: '13–20°C', rain: 'Moderate', sun: '7 hrs' },
      { city: 'Prague', iata: 'PRG', temp: '10–18°C', rain: 'Low', sun: '6 hrs' },
    ],
  },
  {
    season: 'Summer',
    emoji: '☀️',
    items: [
      { city: 'Barcelona', iata: 'BCN', temp: '26–32°C', rain: 'Low', sun: '10 hrs' },
      { city: 'Ibiza', iata: 'IBZ', temp: '28–33°C', rain: 'Very Low', sun: '11 hrs' },
      { city: 'Antalya', iata: 'AYT', temp: '30–36°C', rain: 'Very Low', sun: '12 hrs' },
      { city: 'Athens', iata: 'ATH', temp: '28–35°C', rain: 'Very Low', sun: '11 hrs' },
      { city: 'Dubrovnik', iata: 'DBV', temp: '27–33°C', rain: 'Low', sun: '11 hrs' },
    ],
  },
  {
    season: 'Autumn',
    emoji: '🍂',
    items: [
      { city: 'Paris', iata: 'PAR', temp: '12–18°C', rain: 'Moderate', sun: '5 hrs' },
      { city: 'Budapest', iata: 'BUD', temp: '12–18°C', rain: 'Low', sun: '6 hrs' },
      { city: 'Munich', iata: 'MUC', temp: '10–16°C', rain: 'Moderate', sun: '5 hrs' },
      { city: 'Krakow', iata: 'KRK', temp: '9–15°C', rain: 'Low', sun: '5 hrs' },
    ],
  },
  {
    season: 'Winter',
    emoji: '❄️',
    items: [
      { city: 'Dubai', iata: 'DXB', temp: '22–28°C', rain: 'Very Low', sun: '8 hrs' },
      { city: 'Tenerife', iata: 'TFS', temp: '18–24°C', rain: 'Low', sun: '7 hrs' },
      { city: 'Cape Verde', iata: 'SID', temp: '24–28°C', rain: 'Low', sun: '7 hrs' },
      { city: 'Bangkok', iata: 'BKK', temp: '28–34°C', rain: 'Low', sun: '8 hrs' },
    ],
  },
]

// -----------------------------
// HELPERS
// -----------------------------
const toRad = (v: number) => (v * Math.PI) / 180

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const findNearestAirport = (lat: number, lng: number): Airport | null => {
  let best: Airport | null = null
  let bestDist = Infinity
  for (const a of allAirports) {
    if (!a._geoloc) continue
    const d = haversine(lat, lng, a._geoloc.lat, a._geoloc.lng)
    if (d < bestDist) { bestDist = d; best = a }
  }
  return best
}

const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// -----------------------------
// PAGE
// -----------------------------
export default function FlightsPageClient() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'experiences' | 'cars'>('flights')
  const [originAirport, setOriginAirport] = useState<Airport | null>(null)
  const [originInput, setOriginInput] = useState('')
  const [open, setOpen] = useState(false)

  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const man = allAirports.find(a => a.iata_code === 'MAN')
    if (man) {
      setOriginAirport(man)
      setOriginInput(`${man.city} (${man.iata_code})`)
    }
  }, [])

  const openRoute = (destIata: string) => {
    alert(`Search flights from ${originAirport?.iata_code} to ${destIata}`)
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden text-white py-24 px-6 text-center" style={{ backgroundColor: '#232e4e' }}>
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
            Timms Travel
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Compare Flights Worldwide
          </h1>

          <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-10">
            Discover incredible destinations, compare prices instantly, and book your perfect trip with confidence.
          </p>

          {/* TABS */}
          <div className="flex justify-center gap-1 mb-6 bg-white/10 rounded-2xl p-1 max-w-sm mx-auto">
            {(['flights', 'hotels', 'experiences', 'cars'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-white text-[#232e4e] shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* SEARCH */}
          <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
            {activeTab === 'flights' && <FlightSearch />}
            {activeTab === 'hotels' && <HotelSearch />}
            {activeTab === 'experiences' && <ExperienceSearch />}
            {activeTab === 'cars' && (
              <CarSearch
                pickupLocation={pickupLocation}
                pickupDate={pickupDate}
                dropoffDate={dropoffDate}
                setPickupLocation={setPickupLocation}
                setPickupDate={setPickupDate}
                setDropoffDate={setDropoffDate}
                loading={loading}
                onSearch={() => {}}
              />
            )}
          </div>

          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
            <span>Fully Bespoke Offers</span>
            <span>No hidden fees</span>
            <span>Best price guarantee</span>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#232e4e' }}>
            Featured Destinations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map(dest => (
              <div key={dest.iata} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{dest.emoji}</span>
                  <p className="font-bold text-lg" style={{ color: '#232e4e' }}>
                    {dest.city}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {dest.description}
                </p>
                <button
                  onClick={() => openRoute(dest.iata)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  View flights →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXTRA CONTENT SECTION */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#232e4e' }}>
            Why Book With Us?
          </h2>

          <p className="text-gray-600 mb-6">
            We bring together flights, hotels, experiences, and car hire into one seamless platform.
            Whether you're planning a quick city break or a long-haul adventure, our tools help you
            compare options quickly and confidently.
          </p>

          <p className="text-gray-600 mb-6">
            Our search technology scans hundreds of providers, ensuring you always get competitive
            pricing and flexible options tailored to your needs.
          </p>

          <p className="text-gray-600">
            From inspiration to booking, everything is designed to make travel planning simple,
            transparent, and enjoyable.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}