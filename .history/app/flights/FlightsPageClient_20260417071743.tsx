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
}

// -----------------------------
// DATA
// -----------------------------
const allAirports: Airport[] = (airports as Airport[])
  .filter(a => a.iata_code)
  .sort((a, b) => a.city.localeCompare(b.city))

const featuredDestinations: Destination[] = [
  { city: 'London', iata: 'LON', emoji: '🏙️' },
  { city: 'Barcelona', iata: 'BCN', emoji: '⛪' },
  { city: 'New York', iata: 'JFK', emoji: '🗽' },
  { city: 'Paris', iata: 'PAR', emoji: '🗼' },
  { city: 'Dubai', iata: 'DXB', emoji: '🌆' },
  { city: 'Orlando', iata: 'MCO', emoji: '🎢' },
]

const inspirationDestinations: Destination[] = [
  { city: 'Tokyo', iata: 'HND', emoji: '🗾' },
  { city: 'Bangkok', iata: 'BKK', emoji: '🌏' },
  { city: 'Sydney', iata: 'SYD', emoji: '🌊' },
  { city: 'Cape Town', iata: 'CPT', emoji: '🏔️' },
  { city: 'Toronto', iata: 'YYZ', emoji: '🍁' },
  { city: 'Los Angeles', iata: 'LAX', emoji: '🎬' },
]

// -----------------------------
// GEO HELPERS
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
    if (d < bestDist) {
      bestDist = d
      best = a
    }
  }
  return best
}

// -----------------------------
// KIWI TRACKING
// -----------------------------
const MARKER = '714930'

export const buildTrackedKiwiUrl = ({
  from,
  to,
  depart,
}: {
  from: string
  to: string
  depart: string
}) => {
  const kiwiDeep = new URL('https://www.kiwi.com/deep')
  kiwiDeep.searchParams.set('from', from)
  kiwiDeep.searchParams.set('to', to)
  kiwiDeep.searchParams.set('departure', depart)

  const tracked = new URL('https://c111.travelpayouts.com/click')
  tracked.searchParams.set('shmarker', MARKER)
  tracked.searchParams.set('custom_url', kiwiDeep.toString())

  return tracked.toString()
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

  const filteredAirports = useMemo(() => {
    if (!originInput) return []
    const q = originInput.toLowerCase()
    return allAirports.filter(a =>
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.iata_code.toLowerCase().includes(q)
    )
  }, [originInput])

  const openRoute = (iata: string) => {
    if (!originAirport) return
    const url = buildTrackedKiwiUrl({
      from: originAirport.iata_code,
      to: iata,
      depart: todayStr(),
    })
    window.open(url, '_blank')
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden text-white py-24 px-6 text-center" style={{ backgroundColor: '#232e4e' }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">Compare Flights Worldwide</h1>
          <p className="text-gray-300 mb-10">
            Search, compare and book flights to hundreds of destinations globally.
          </p>

          <div className="flex justify-center gap-1 mb-6 bg-white/10 rounded-2xl p-1 max-w-sm mx-auto">
            {(['flights', 'hotels', 'experiences', 'cars'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs rounded-xl ${
                  activeTab === tab ? 'bg-white text-[#232e4e]' : 'text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

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
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#232e4e' }}>
            Popular Routes Right Now
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map(dest => (
              <div key={dest.iata} className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
                <p className="text-xl font-bold">{dest.city}</p>
                <button
                  onClick={() => openRoute(dest.iata)}
                  className="text-blue-600 mt-3"
                >
                  View Flights →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSPIRATION */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#232e4e' }}>
            Explore More Destinations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirationDestinations.map(dest => (
              <div key={dest.iata} className="border rounded-2xl p-6 hover:shadow-lg transition">
                <p className="font-bold text-lg">{dest.city}</p>
                <button
                  onClick={() => openRoute(dest.iata)}
                  className="text-blue-600 mt-3"
                >
                  Search Flights →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BOOK */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#232e4e' }}>
            Why Book With Timms Travel?
          </h2>

          <p className="text-gray-600 mb-10">
            We bring together the best flight deals, hotels, and experiences into one seamless platform.
            Whether you're planning a quick city break or a long-haul adventure, we make it simple.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl shadow">Best Price Comparison</div>
            <div className="p-6 bg-white rounded-xl shadow">Trusted Global Partners</div>
            <div className="p-6 bg-white rounded-xl shadow">Flexible Travel Options</div>
          </div>
        </div>
      </section>

      {/* LONG CONTENT (SEO / HUB FEEL) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto space-y-6 text-gray-600">
          <h2 className="text-3xl font-bold text-center" style={{ color: '#232e4e' }}>
            Your Complete Flight Booking Hub
          </h2>

          <p>
            Finding the perfect flight doesn’t need to be complicated. Our platform allows you to
            compare routes, prices, airlines, and travel times across hundreds of providers in seconds.
          </p>

          <p>
            Whether you're flying short-haul across Europe or planning a long-haul journey to Asia,
            North America, or beyond, we bring together the most competitive fares in one place.
          </p>

          <p>
            Use our smart search tools to discover flexible travel dates, alternative airports,
            and hidden deals that traditional booking engines often miss.
          </p>

          <p>
            From budget-friendly escapes to premium cabin experiences, you can tailor every journey
            to suit your travel style.
          </p>

          <p>
            Start exploring today and unlock a world of travel opportunities.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}