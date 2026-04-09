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
  { city: 'New York',  iata: 'NYC', emoji: '🗽' },
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
      { city: 'Paris',   iata: 'PAR', temp: '12–18°C', rain: 'Moderate', sun: '5 hrs' },
      { city: 'Prague',  iata: 'PRG', temp: '10–16°C', rain: 'Low',      sun: '5 hrs' },
      { city: 'Budapest',iata: 'BUD', temp: '12–18°C', rain: 'Low',      sun: '6 hrs' },
    ],
  },
  {
    season: 'Winter',
    emoji: '❄️',
    items: [
      { city: 'Dubai',     iata: 'DXB', temp: '22–28°C', rain: 'Very Low', sun: '8 hrs' },
      { city: 'Tenerife',  iata: 'TCI', temp: '18–24°C', rain: 'Low',      sun: '7 hrs' },
      { city: 'Cape Verde',iata: 'SID', temp: '24–28°C', rain: 'Low',      sun: '7 hrs' },
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
    if (d < bestDist) {
      bestDist = d
      best = a
    }
  }

  return best
}

// -----------------------------
// KIWI HELPERS
// -----------------------------
const fetchKiwiSlug = async (iata: string) => {
  const res = await fetch(
    `https://api.skypicker.com/locations?term=${encodeURIComponent(
      iata
    )}&locale=en-US&location_types=airport&limit=1`
  )
  const data = await res.json()
  return data.locations?.[0]?.slug || null
}

const buildKiwiUrl = async (origin: string, dest: string, affil: string) => {
  const [oSlug, dSlug] = await Promise.all([
    fetchKiwiSlug(origin),
    fetchKiwiSlug(dest),
  ])

  if (!oSlug || !dSlug) return ''

  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')

  const depart = `${yyyy}-${mm}-${dd}`

  const url = new URL(
    `https://www.kiwi.com/en/search/results/${oSlug}/${dSlug}/${depart}`
  )

  url.searchParams.set('affilid', affil)
  url.searchParams.set('adults', '1')
  url.searchParams.set('children', '0')
  url.searchParams.set('infants', '0')
  url.searchParams.set('cabinClass', 'economy')

  return url.toString()
}

const AFFIL_ID =
  'travelpayoutsdeeplink_timmstravel.com_6bc7301798224d1cad7e3f320-714930'

// -----------------------------
// PAGE
// -----------------------------
export default function FlightsPage() {
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
    if (!navigator.geolocation) {
      setGeoError('Location not supported.')
      return
    }
    setGeoLoading(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        const nearest = findNearestAirport(latitude, longitude)
        setGeoLoading(false)
        if (nearest) {
          setOriginAirport(nearest)
          setOriginInput(`${nearest.city} (${nearest.iata_code})`)
          setOpen(false)
        } else {
          setGeoError('No nearby airport found.')
        }
      },
      () => {
        setGeoLoading(false)
        setGeoError('Unable to access location.')
      }
    )
  }

  const openRoute = async (destIata: string) => {
    if (!originAirport) {
      alert('Choose a departure airport first.')
      return
    }
    const url = await buildKiwiUrl(originAirport.iata_code, destIata, AFFIL_ID)
    if (!url) {
      alert('Could not build Kiwi link.')
      return
    }
    window.open(url, '_blank')
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-24 px-6 text-center"
      >

        <h1 className="text-5xl font-bold mb-4">
          Find Your Perfect Flight ✈️
        </h1>

        <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Compare hundreds of airlines instantly — real prices, no hidden fees.
        </p>

        {/* TAB MENU — MATCHES HOMEPAGE */}
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

        {/* SEARCH AREA — MATCHES HOMEPAGE */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          {activeTab === 'flights' && <FlightSearch />}
          {activeTab === 'hotels' && <HotelSearch />}
          {activeTab === 'experiences' && <ExperienceSearch />}
          {activeTab === 'cars' && <CarSearch />}
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">

          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Featured Destinations
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Choose your departure airport to see live Kiwi.com results
          </p>

          {/* DEPARTURE AIRPORT SELECTOR */}
          <div className="max-w-md mx-auto mb-10 text-left">
            <label className="block text-sm text-gray-700 mb-2">
              Departure airport
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="Enter airport or use my location"
                className="px-4 py-2 w-full rounded-lg border border-gray-300 shadow-sm text-black bg-white"
                value={originInput}
                onChange={(e) => {
                  setOriginInput(e.target.value)
                  setOpen(true)
                }}
                onFocus={() => setOpen(true)}
              />

              {open && (
                <div className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 max-h-80 overflow-y-auto w-full text-black">

                  {/* Use my location */}
                  <button
                    type="button"
                    onClick={useMyLocation}
                    className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 flex items-center justify-between"
                  >
                    <span className="font-semibold">
                      {geoLoading ? 'Detecting your nearest airport…' : 'Use my location'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {geoError ? geoError : 'Find the closest airport to you'}
                    </span>
                  </button>

                  {/* Airport list */}
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
              <div
                key={dest.iata}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{dest.emoji}</span>
                  <div>
                    <p
                      className="font-bold text-lg"
                      style={{ color: '#232e4e' }}
                    >
                      {dest.city}
                    </p>
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
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Destinations by Season
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Find the perfect place to fly depending on the time of year.
          </p>

          {seasonalBlocks.map(({ season, emoji, items }) => (
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
                    key={dest.iata}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                  >
                    <p
                      className="font-bold text-xl mb-2"
                      style={{ color: '#232e4e' }}
                    >
                      {dest.city}
                    </p>

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