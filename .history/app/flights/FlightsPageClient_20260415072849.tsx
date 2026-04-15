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
  { city: 'London',    iata: 'LON', emoji: '🏙️' },
  { city: 'Barcelona', iata: 'BCN', emoji: '⛪' },
  { city: 'New York',  iata: 'JFK', emoji: '🗽' },
  { city: 'Paris',     iata: 'PAR', emoji: '🗼' },
  { city: 'Dubai',     iata: 'DXB', emoji: '🌆' },
  { city: 'Orlando',   iata: 'MCO', emoji: '🎢' },
]

const seasonalBlocks = [
  {
    season: 'Spring',
    emoji: '🌸',
    items: [
      { city: 'Amsterdam', iata: 'AMS', temp: '12–18°C', rain: 'Moderate', sun: '6 hrs' },
      { city: 'Rome',      iata: 'ROM', temp: '15–22°C', rain: 'Low',      sun: '8 hrs' },
      { city: 'Lisbon',    iata: 'LIS', temp: '16–23°C', rain: 'Low',      sun: '9 hrs' },
    ],
  },
  {
    season: 'Summer',
    emoji: '☀️',
    items: [
      { city: 'Barcelona', iata: 'BCN', temp: '26–32°C', rain: 'Low',       sun: '10 hrs' },
      { city: 'Ibiza',     iata: 'IBZ', temp: '28–33°C', rain: 'Very Low',  sun: '11 hrs' },
      { city: 'Antalya',   iata: 'AYT', temp: '30–36°C', rain: 'Very Low',  sun: '12 hrs' },
    ],
  },
  {
    season: 'Autumn',
    emoji: '🍂',
    items: [
      { city: 'Paris',    iata: 'PAR', temp: '12–18°C', rain: 'Moderate', sun: '5 hrs' },
      { city: 'Prague',   iata: 'PRG', temp: '10–16°C', rain: 'Low',      sun: '5 hrs' },
      { city: 'Budapest', iata: 'BUD', temp: '12–18°C', rain: 'Low',      sun: '6 hrs' },
    ],
  },
  {
    season: 'Winter',
    emoji: '❄️',
    items: [
      { city: 'Dubai',      iata: 'DXB', temp: '22–28°C', rain: 'Very Low', sun: '8 hrs' },
      { city: 'Tenerife',   iata: 'TFS', temp: '18–24°C', rain: 'Low',      sun: '7 hrs' },
      { city: 'Cape Verde', iata: 'SID', temp: '24–28°C', rain: 'Low',      sun: '7 hrs' },
    ],
  },
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
    if (d < bestDist) { bestDist = d; best = a }
  }
  return best
}

// -----------------------------
// KIWI TRACKING HELPER
// ✅ Routes through c111.travelpayouts.com so session tokens are injected
// ✅ Uses kiwi.com/deep with IATA codes — no slug fetching needed
// -----------------------------
const MARKER = '714930' // Your Travelpayouts partner ID

/**
 * Builds a tracked Kiwi.com deep link via the Travelpayouts redirect.
 * All bookings made through this link will appear in your TP dashboard.
 *
 * @param from      Origin IATA code (e.g. "MAN")
 * @param to        Destination IATA code (e.g. "BCN")
 * @param depart    Departure date in YYYY-MM-DD format
 * @param returnDate  Return date in YYYY-MM-DD (omit for one-way)
 * @param adults    Number of adults (default 1)
 * @param children  Number of children (default 0)
 * @param infants   Number of infants (default 0)
 * @param cabin     Cabin class (default "economy")
 * @param currency  Currency code (default "GBP")
 */
export const buildTrackedKiwiUrl = ({
  from,
  to,
  depart,
  returnDate,
  adults = 1,
  children = 0,
  infants = 0,
  cabin = 'economy',
  currency = 'GBP',
}: {
  from: string
  to: string
  depart: string
  returnDate?: string
  adults?: number
  children?: number
  infants?: number
  cabin?: string
  currency?: string
}): string => {
  // 1. Build the inner kiwi.com/deep link
  const kiwiDeep = new URL('https://www.kiwi.com/deep')
  kiwiDeep.searchParams.set('from', from)
  kiwiDeep.searchParams.set('to', to)
  kiwiDeep.searchParams.set('departure', depart)
  if (returnDate) kiwiDeep.searchParams.set('return', returnDate)
  kiwiDeep.searchParams.set('adults', adults.toString())
  kiwiDeep.searchParams.set('children', children.toString())
  kiwiDeep.searchParams.set('infants', infants.toString())
  kiwiDeep.searchParams.set('cabinClass', cabin)
  kiwiDeep.searchParams.set('currency', currency)
  kiwiDeep.searchParams.set('lang', 'en')

  // 2. Wrap in Travelpayouts tracking redirect
  //    This injects deeplink_uuid, session_identifier and other
  //    tokens required for conversions to be attributed to your account.
  const tracked = new URL('https://c111.travelpayouts.com/click')
  tracked.searchParams.set('shmarker', MARKER)
  tracked.searchParams.set('promo_id', '3791')
  tracked.searchParams.set('source_type', 'customlink')
  tracked.searchParams.set('type', 'click')
  tracked.searchParams.set('custom_url', kiwiDeep.toString())

  return tracked.toString()
}

// Get today's date in YYYY-MM-DD
const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// -----------------------------
// PAGE COMPONENT
// -----------------------------
export default function FlightsPageClient() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'experiences' | 'cars'>('flights')
  const [originAirport, setOriginAirport] = useState<Airport | null>(null)
  const [originInput, setOriginInput] = useState('')
  const [open, setOpen] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  // Default to MAN
  useEffect(() => {
    if (!originAirport) {
      const man = allAirports.find(a => a.iata_code === 'MAN')
      if (man) {
        setOriginAirport(man)
        setOriginInput(`${man.city} (${man.iata_code})`)
      }
    }
  }, [])

  const filteredAirports = useMemo(() => {
    if (!open || !originInput) return []
    const q = originInput.toLowerCase()
    return allAirports.filter(a =>
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.iata_code.toLowerCase().includes(q)
    )
  }, [originInput, open])

  const useMyLocation = () => {
    if (!navigator.geolocation) { setGeoError('Location not supported.'); return }
    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const nearest = findNearestAirport(pos.coords.latitude, pos.coords.longitude)
        setGeoLoading(false)
        if (nearest) {
          setOriginAirport(nearest)
          setOriginInput(`${nearest.city} (${nearest.iata_code})`)
          setOpen(false)
        } else {
          setGeoError('No nearby airport found.')
        }
      },
      () => { setGeoLoading(false); setGeoError('Unable to access location.') }
    )
  }

  // Opens a tracked Kiwi link for a destination card (one-way, 1 adult, today)
  const openRoute = (destIata: string) => {
    if (!originAirport) { alert('Choose a departure airport first.'); return }

    const url = buildTrackedKiwiUrl({
      from: originAirport.iata_code,
      to: destIata,
      depart: todayStr(),
      adults: 1,
      currency: 'GBP',
    })

    window.open(url, '_blank')
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      {/* ──────────────────────────────── */}
      {/* NEW HERO (REPLACES OLD HERO) */}
      {/* ──────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white py-24 px-6 text-center"
        style={{ backgroundColor: '#232e4e' }}
      >
        {/* subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
            Timms Travel
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Create Unforgettable Moments
          </h1>

          <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-10">
            Choose from hundreds of destinations around the world.
          </p>

          {/* SEARCH TABS (kept exactly as your Hotels hero) */}
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

          {/* SEARCH AREA (unchanged) */}
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
                onSearch={handleCarSearch}
              />
            )}
          </div>

          {/* Trust indicators (unchanged) */}
          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
            <span>Fully Bespoke Offers</span>
            <span>No hidden fees</span>
            <span>Competitive price guarantee</span>
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Featured Destinations
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Choose your departure airport to see live Kiwi.com results
          </p>

          {/* DEPARTURE AIRPORT SELECTOR */}
          <div className="max-w-md mx-auto mb-10 text-left">
            <label className="block text-sm text-gray-700 mb-2">Departure airport</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter airport or use my location"
                className="px-4 py-2 w-full rounded-lg border border-gray-300 shadow-sm text-black bg-white"
                value={originInput}
                onChange={(e) => { setOriginInput(e.target.value); setOpen(true) }}
                onFocus={() => setOpen(true)}
              />

              {open && (
                <div className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 max-h-80 overflow-y-auto w-full text-black">
                  <button
                    type="button"
                    onClick={useMyLocation}
                    className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 flex items-center justify-between"
                  >
                    <span className="font-semibold">
                      {geoLoading ? 'Detecting your nearest airport…' : 'Use my location'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {geoError ?? 'Find the closest airport to you'}
                    </span>
                  </button>

                  {filteredAirports.map((a) => (
                    <div
                      key={a.iata_code}
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition"
                      onClick={() => {
                        setOriginAirport(a)
                        setOriginInput(`${a.city} (${a.iata_code})`)
                        setOpen(false)
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">{a.city}, {a.country}</span>
                        <span className="text-blue-600 font-bold">{a.iata_code}</span>
                      </div>
                      <span className="text-gray-500 text-sm">{a.name}</span>
                    </div>
                  ))}

                  {filteredAirports.length === 0 && !geoLoading && (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Start typing a city, country, or airport name.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DESTINATION GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((dest) => (
              <div key={dest.iata} className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{dest.emoji}</span>
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#232e4e' }}>{dest.city}</p>
                    <p className="text-xs text-gray-400">Explore Now</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openRoute(dest.iata)}
                  className="text-blue-600 font-semibold hover:underline disabled:opacity-60"
                  disabled={!originAirport}
                >
                  {originAirport
                    ? `View flights from ${originAirport.iata_code} →`
                    : 'Choose a departure airport above'}
                </button>
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
            Find the perfect place to fly depending on the time of year.
          </p>

          {seasonalBlocks.map(({ season, emoji, items }) => (
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
                    <p className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>{dest.city}</p>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p><strong>Avg Temp:</strong> {dest.temp}</p>
                      <p><strong>Rainfall:</strong> {dest.rain}</p>
                      <p><strong>Sunshine:</strong> {dest.sun}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openRoute(dest.iata)}
                      className="text-blue-600 font-semibold hover:underline disabled:opacity-60"
                      disabled={!originAirport}
                    >
                      {originAirport
                        ? `View flights from ${originAirport.iata_code} →`
                        : 'Choose a departure airport above'}
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