'use client'

import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'

import airports from '@/data/airports.json'

// ---------------------------------------------
// TYPES
// ---------------------------------------------
type Hotel = {
  name: string
  type: string
  area?: string
  description?: string
  city: string
  country?: string
  expediaUrl: string
}

type CityOption = {
  city: string
  country: string
}

type AirportRecord = {
  city: string
  country: string
}

// ---------------------------------------------
// AFFILIATE CONSTANTS
// ---------------------------------------------
const BASE_URL = 'https://www.expedia.co.uk'
const AFFILIATE_ID = 'UK.DIRECT.PHG.1011l428377'

const buildHotelUrl = (city: string, country?: string) => {
  const params = new URLSearchParams()
  params.set('affcid', AFFILIATE_ID)
  params.set('destination', country ? `${city}, ${country}` : city)
  return `${BASE_URL}/Hotel-Search?${params.toString()}`
}

// ---------------------------------------------
// CURATED HOTELS
// ---------------------------------------------
const curatedHotels: Record<string, Hotel[]> = {
  London: [
    {
      name: 'The Ritz London',
      type: 'Luxury',
      area: 'Mayfair',
      description: 'Iconic five star hotel overlooking Green Park.',
      city: 'London',
      country: 'United Kingdom',
      expediaUrl: buildHotelUrl('The Ritz London', 'United Kingdom'),
    },
  ],
  Manchester: [
    {
      name: 'Hotel Gotham',
      type: 'Boutique',
      area: 'City Centre',
      description: 'Art deco boutique stay with real character.',
      city: 'Manchester',
      country: 'United Kingdom',
      expediaUrl: buildHotelUrl('Hotel Gotham', 'United Kingdom'),
    },
  ],
}

// ---------------------------------------------
// AUTO GENERATED HOTELS
// ---------------------------------------------
const namePatterns = [
  (city: string) => `The ${city} Grand Hotel`,
  (city: string) => `The ${city} Palace`,
  (city: string) => `${city} Central Inn`,
]

function generateHotels(city: string, country?: string): Hotel[] {
  return namePatterns.map(pattern => ({
    name: pattern(city),
    type: 'Hotel',
    description: 'A comfortable stay in a great location.',
    city,
    country,
    expediaUrl: buildHotelUrl(city, country),
  }))
}

// ---------------------------------------------
// CITY OPTIONS
// ---------------------------------------------
function useCityOptions(): CityOption[] {
  return React.useMemo(() => {
    const seen = new Map<string, string>()

    ;(airports as AirportRecord[]).forEach(a => {
      if (!seen.has(a.city)) {
        seen.set(a.city, a.country)
      }
    })

    return Array.from(seen, ([city, country]) => ({ city, country }))
  }, [])
}

// ---------------------------------------------
// CITY SEARCH
// ---------------------------------------------
function CitySearch({ onSelect }: { onSelect: (city: CityOption) => void }) {
  const cityOptions = useCityOptions()
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const matches = React.useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()

    return cityOptions
      .filter(c => `${c.city}, ${c.country}`.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query, cityOptions])

  return (
    <div className="relative max-w-xl mx-auto">
      <input
        value={query}
        onChange={e => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search cities..."
        className="w-full border rounded-full px-5 py-3 text-sm"
      />

      {open && matches.length > 0 && (
        <div className="absolute z-30 w-full bg-white border rounded-xl mt-2 shadow-lg">
          {matches.map(option => (
            <button
              key={option.city}
              className="w-full text-left px-4 py-2 hover:bg-gray-50"
              onClick={() => {
                onSelect(option)
                setQuery(`${option.city}, ${option.country}`)
                setOpen(false)
              }}
            >
              {option.city}, {option.country}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function HotelsPageClient() {
  const [selectedCity, setSelectedCity] = React.useState<CityOption>({
    city: 'London',
    country: 'United Kingdom',
  })

  const [activeTab, setActiveTab] = React.useState<
    'flights' | 'hotels' | 'experiences' | 'cars'
  >('hotels')

  const hotels =
    curatedHotels[selectedCity.city] ??
    generateHotels(selectedCity.city, selectedCity.country)

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Perfect Stay
        </h1>

        <p className="text-gray-300 mb-8">
          Search hotels in any city worldwide
        </p>

        {/* SEARCH BOX */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">

          {/* TABS (FIXED HERE) */}
          <div className="flex justify-center gap-6 mb-6">
            {['flights', 'hotels', 'experiences', 'cars'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-[#232e4e] text-[#232e4e]'
                    : 'text-gray-400'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* SEARCH AREA */}
          {activeTab === 'flights' && <FlightSearch />}
          {activeTab === 'hotels' && <HotelSearch />}
          {activeTab === 'experiences' && <ExperienceSearch />}
          {activeTab === 'cars' && <CarSearch />}
        </div>
      </section>

      {/* CITY SEARCH + RESULTS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <CitySearch onSelect={setSelectedCity} />

          <h2 className="text-3xl font-bold text-center mt-10 mb-8">
            Hotels in {selectedCity.city}
          </h2>

          <div className="space-y-3">
            {hotels.map(hotel => (
              <div
                key={hotel.name}
                className="border rounded-xl p-4 bg-white"
              >
                <div className="font-semibold">{hotel.name}</div>
                <div className="text-sm text-gray-500">
                  {hotel.city}, {hotel.country}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}