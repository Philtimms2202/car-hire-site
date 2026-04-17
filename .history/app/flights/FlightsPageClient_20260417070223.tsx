'use client'

import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'
import airports from '@/data/airports.json'

/* ---------------- TYPES ---------------- */
type Airport = {
  name: string
  city: string
  country: string
  iata_code: string
  _geoloc?: { lat: number; lng: number }
}

type Destination = {
  city: string
  country: string
  iata: string
  emoji: string
  tagline: string
}

/* ---------------- DATA ---------------- */
const allAirports: Airport[] = (airports as Airport[])
  .filter(a => a.iata_code)
  .sort((a, b) => a.city.localeCompare(b.city))

const featuredDestinations: Destination[] = [
  { city: 'London', country: 'United Kingdom', iata: 'LON', emoji: '🏙️', tagline: 'World-class culture & history' },
  { city: 'Barcelona', country: 'Spain', iata: 'BCN', emoji: '⛪', tagline: 'Architecture, beaches & tapas' },
  { city: 'New York', country: 'United States', iata: 'JFK', emoji: '🗽', tagline: 'The city that never sleeps' },
  { city: 'Paris', country: 'France', iata: 'PAR', emoji: '🗼', tagline: 'Romance, art & cuisine' },
  { city: 'Dubai', country: 'UAE', iata: 'DXB', emoji: '🌆', tagline: 'Luxury in the desert' },
  { city: 'Orlando', country: 'United States', iata: 'MCO', emoji: '🎢', tagline: 'Family fun & theme parks' },
]

const popularRoutes = [
  { from: 'Manchester', fromCode: 'MAN', to: 'Alicante', toCode: 'ALC', flag: '🇪🇸', duration: '2h 40m' },
  { from: 'London', fromCode: 'LGW', to: 'Amsterdam', toCode: 'AMS', flag: '🇳🇱', duration: '1h 20m' },
  { from: 'Manchester', fromCode: 'MAN', to: 'Dubai', toCode: 'DXB', flag: '🇦🇪', duration: '6h 50m' },
]

/* ---------------- HELPERS ---------------- */
const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* ---------------- COMPONENT ---------------- */
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

  const openRoute = (destIata: string) => {
    if (!originAirport) return
    const url = `https://www.kiwi.com/deep?from=${originAirport.iata_code}&to=${destIata}&departure=${todayStr()}`
    window.open(url, '_blank')
  }

  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* HERO */}
      <section className="bg-brand.dark text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Find Cheap Flights
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Compare flights from hundreds of airlines and find the best deals worldwide.
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {(['flights', 'hotels', 'experiences', 'cars'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-white text-brand.dark'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-xl p-6 max-w-3xl mx-auto shadow-xl text-left">
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
      </section>

      {/* ROUTES */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#1E293B' }}>
            Popular Routes
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {popularRoutes.map((r, i) => (
              <button
                key={i}
                onClick={() => openRoute(r.toCode)}
                className="p-4 border rounded-lg hover:shadow-lg transition text-left"
              >
                <div className="text-xl">{r.flag}</div>
                <div className="font-semibold mt-2">
                  {r.from} → {r.to}
                </div>
                <div className="text-sm text-gray-500">
                  {r.duration}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#1E293B' }}>
            Popular Destinations
          </h2>

          {/* Airport input */}
          <div className="max-w-md mx-auto mb-10 text-left">
            <input
              type="text"
              value={originInput}
              onChange={e => {
                setOriginInput(e.target.value)
                setOpen(true)
              }}
              placeholder="Search airport..."
              className="w-full border rounded-lg p-3"
            />

            {open && (
              <div className="border rounded-lg mt-2 bg-white max-h-60 overflow-y-auto">
                {filteredAirports.map(a => (
                  <div
                    key={a.iata_code}
                    onClick={() => {
                      setOriginAirport(a)
                      setOriginInput(`${a.city} (${a.iata_code})`)
                      setOpen(false)
                    }}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {a.city} ({a.iata_code})
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredDestinations.map(dest => (
              <div
                key={dest.iata}
                className="p-6 border rounded-lg hover:shadow-xl transition text-left"
              >
                <div className="text-3xl">{dest.emoji}</div>
                <h3 className="font-bold text-xl mt-2">
                  {dest.city}
                </h3>
                <p className="text-gray-500 text-sm">{dest.country}</p>
                <p className="text-gray-600 mt-2">{dest.tagline}</p>

                <button
                  onClick={() => openRoute(dest.iata)}
                  disabled={!originAirport}
                  className="mt-4 text-brand.primary font-semibold hover:underline"
                >
                  View Flights →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}