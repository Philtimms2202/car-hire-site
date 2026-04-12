'use client'

import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HotelSearch from '@/app/components/Search/HotelSearch'
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

// airports.json is large; we only care about city + country
type AirportRecord = {
  city: string
  country: string
}

// ---------------------------------------------
// EXPEDIA AFFILIATE CONSTANTS
// ---------------------------------------------
const EXPEDIA_BASE = 'https://www.expedia.co.uk'
const EXPEDIA_AFFILIATE_ID = 'UK.DIRECT.PHG.1011l428377'

const expediaCityUrl = (city: string, country?: string) => {
  const params = new URLSearchParams()
  params.set('affcid', EXPEDIA_AFFILIATE_ID)
  params.set('destination', country ? `${city}, ${country}` : city)
  return `${EXPEDIA_BASE}/Hotel-Search?${params.toString()}`
}

const expediaBrowseAll = () => {
  const params = new URLSearchParams()
  params.set('affcid', EXPEDIA_AFFILIATE_ID)
  return `${EXPEDIA_BASE}/Hotel-Search?${params.toString()}`
}

// ---------------------------------------------
// CURATED HOTELS (REAL CITIES YOU CARE ABOUT)
// ---------------------------------------------
const curatedHotels: Record<string, Hotel[]> = {
  London: [
    {
      name: 'The Ritz London',
      type: 'Luxury',
      area: 'Mayfair',
      description: 'Iconic 5‑star hotel overlooking Green Park.',
      city: 'London',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('The Ritz London', 'United Kingdom'),
    },
    {
      name: 'The Ned',
      type: 'Boutique',
      area: 'City of London',
      description: 'Stylish members‑club hotel in a former bank.',
      city: 'London',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('The Ned', 'United Kingdom'),
    },
    {
      name: 'The Hoxton, Shoreditch',
      type: 'Boutique',
      area: 'Shoreditch',
      description: 'Creative hub with relaxed, design‑led rooms.',
      city: 'London',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('The Hoxton Shoreditch', 'United Kingdom'),
    },
    {
      name: 'Premier Inn London City',
      type: 'Budget',
      area: 'Tower Hill',
      description: 'Reliable comfort a short walk from the Tower.',
      city: 'London',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('Premier Inn London City', 'United Kingdom'),
    },
  ],
  Manchester: [
    {
      name: 'The Edwardian Manchester',
      type: 'Luxury',
      area: 'City Centre',
      description: 'Modern 5‑star hotel in a historic building.',
      city: 'Manchester',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('The Edwardian Manchester', 'United Kingdom'),
    },
    {
      name: 'Hotel Gotham',
      type: 'Boutique',
      area: 'King Street',
      description: 'Art‑deco boutique stay with serious character.',
      city: 'Manchester',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('Hotel Gotham', 'United Kingdom'),
    },
    {
      name: 'Motel One Manchester‑Royal Exchange',
      type: 'Budget',
      area: 'Royal Exchange',
      description: 'Design‑led budget option in the heart of the city.',
      city: 'Manchester',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('Motel One Manchester Royal Exchange', 'United Kingdom'),
    },
  ],
  Paris: [
    {
      name: 'Hôtel Plaza Athénée',
      type: 'Luxury',
      area: 'Avenue Montaigne',
      description: 'Haute couture address with Eiffel Tower views.',
      city: 'Paris',
      country: 'France',
      expediaUrl: expediaCityUrl('Hotel Plaza Athenee', 'France'),
    },
    {
      name: 'Hôtel des Grands Boulevards',
      type: 'Boutique',
      area: '2nd arrondissement',
      description: 'Chic hideaway with a secret‑garden courtyard.',
      city: 'Paris',
      country: 'France',
      expediaUrl: expediaCityUrl('Hotel des Grands Boulevards', 'France'),
    },
  ],
}

// ---------------------------------------------
// AUTO‑GENERATED HOTELS FOR ANY CITY
// ---------------------------------------------
const hotelNamePatterns = [
  (city: string) => `The ${city} Grand Hotel`,
  (city: string) => `The ${city} Palace`,
  (city: string) => `${city} Boutique House`,
  (city: string) => `${city} Central Inn`,
  (city: string) => `${city} Riverside Hotel`,
  (city: string) => `The ${city} Collective`,
]

const hotelTypes = ['Luxury', 'Boutique', 'Modern', 'Budget']

const hotelDescriptions = [
  'A stylish stay in the heart of the city.',
  'Perfect for exploring local culture and cuisine.',
  'Comfortable rooms with excellent transport links.',
  'A modern base for business or leisure.',
  'A peaceful retreat close to major attractions.',
]

function generateHotels(city: string, country?: string): Hotel[] {
  const selected = hotelNamePatterns
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)

  return selected.map(pattern => {
    const name = pattern(city)
    return {
      name,
      type: hotelTypes[Math.floor(Math.random() * hotelTypes.length)],
      description: hotelDescriptions[Math.floor(Math.random() * hotelDescriptions.length)],
      city,
      country,
      expediaUrl: expediaCityUrl(city, country),
    }
  })
}

// ---------------------------------------------
// CITY DATA FROM AIRPORTS.JSON
// ---------------------------------------------
function useCityOptions(): CityOption[] {
  return React.useMemo(() => {
    const seen = new Map<string, string>()
    ;(airports as AirportRecord[]).forEach(a => {
      if (!a.city || !a.country) return
      if (!seen.has(a.city)) {
        seen.set(a.city, a.country)
      }
    })
    return Array.from(seen, ([city, country]) => ({ city, country }))
  }, [])
}

// ---------------------------------------------
// PILL‑STYLE HOTEL CARD (LESS ROUND)
// ---------------------------------------------
function HotelPill({ hotel }: { hotel: Hotel }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            {hotel.type}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">
            {hotel.city}
            {hotel.country ? `, ${hotel.country}` : ''}
            {hotel.area ? ` • ${hotel.area}` : ''}
          </span>
        </div>

        <p className="mt-1 font-semibold text-sm md:text-base text-slate-900 truncate">
          {hotel.name}
        </p>

        {hotel.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {hotel.description}
          </p>
        )}
      </div>

      <a
        href={hotel.expediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full border border-teal-600 px-4 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-colors whitespace-nowrap"
      >
        View More →
      </a>
    </div>
  )
}

// ---------------------------------------------
// CITY SEARCH WITH AUTOCOMPLETE
// ---------------------------------------------
function CitySearch({
  selectedCity,
  onChange,
}: {
  selectedCity: CityOption
  onChange: (city: CityOption) => void
}) {
  const cityOptions = useCityOptions()
  const [query, setQuery] = React.useState(
    `${selectedCity.city}${selectedCity.country ? `, ${selectedCity.country}` : ''}`,
  )
  const [open, setOpen] = React.useState(false)

  const matches = React.useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return cityOptions
      .filter(c => `${c.city}, ${c.country}`.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query, cityOptions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // If user picked from dropdown, onChange already fired.
    // If they just typed, treat whole query as city.
    if (!matches.length) {
      onChange({ city: query.trim(), country: '' })
    }
    setOpen(false)
  }

  const handleSelect = (option: CityOption) => {
    setQuery(`${option.city}, ${option.country}`)
    onChange(option)
    setOpen(false)
  }

  return (
    <div className="relative max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search any city worldwide…"
            className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          {open && matches.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-auto">
              {matches.map(option => (
                <button
                  key={`${option.city}-${option.country}`}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  {option.city}, {option.country}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="rounded-full bg-teal-600 text-white text-sm font-semibold px-6 py-2.5 hover:bg-teal-700 transition-colors"
        >
          Search hotels
        </button>
      </form>
    </div>
  )
}

// ---------------------------------------------
// TOP DESTINATIONS THIS MONTH
// ---------------------------------------------
const TOP_DESTINATIONS: CityOption[] = [
  { city: 'London', country: 'United Kingdom' },
  { city: 'Paris', country: 'France' },
  { city: 'New York', country: 'United States' },
  { city: 'Dubai', country: 'United Arab Emirates' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Barcelona', country: 'Spain' },
]

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function HotelsPageClient() {
  const [selectedCity, setSelectedCity] = React.useState<CityOption>({
    city: 'London',
    country: 'United Kingdom',
  })

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
        <p className="text-base md:text-lg mb-8 text-gray-300 max-w-xl mx-auto">
          Search hotels in any city worldwide — curated where we can, automatically generated everywhere else, always bookable via Expedia.
        </p>
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          <HotelSearch />
        </div>
      </section>

      {/* FEATURED HOTELS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Hotels in {selectedCity.city}
            {selectedCity.country ? `, ${selectedCity.country}` : ''}
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Curated where available — automatically generated everywhere else.
          </p>

          <CitySearch selectedCity={selectedCity} onChange={setSelectedCity} />

          <div className="mt-10 space-y-3">
            {hotels.map(hotel => (
              <HotelPill key={hotel.name} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* TOP DESTINATIONS THIS MONTH */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Top destinations this month
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Jump straight into some of the most searched cities right now.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {TOP_DESTINATIONS.map(dest => (
              <button
                key={`${dest.city}-${dest.country}`}
                onClick={() => setSelectedCity(dest)}
                className="w-full rounded-xl border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>
                  {dest.city}
                </h3>
                <p className="text-gray-500 text-sm">{dest.country}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div
          className="max-w-4xl mx-auto rounded-2xl p-10 text-center text-white"
          style={{ backgroundColor: '#2f797c' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Want to browse everything?
          </h2>

          <p className="text-teal-100 mb-6 text-sm max-w-md mx-auto">
            Explore the full hotel catalogue from our trusted partner and discover stays in thousands of destinations worldwide.
          </p>

          <a
            href={expediaBrowseAll()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white font-semibold px-8 py-3 rounded-full text-sm transition-opacity hover:opacity-90"
            style={{ color: '#2f797c' }}
          >
            Browse all hotels on Expedia
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}