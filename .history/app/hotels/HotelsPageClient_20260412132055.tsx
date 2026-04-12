'use client'

import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HotelSearch from '@/app/components/Search/HotelSearch'

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
type Hotel = {
  name: string
  type: string
  area?: string
  description?: string
  city: string
  country: string
  expediaUrl: string
}

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

function generateHotels(city: string): Hotel[] {
  const selected = hotelNamePatterns
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)

  return selected.map(pattern => {
    const name = pattern(city)
    return {
      name,
      type: hotelTypes[Math.floor(Math.random() * hotelTypes.length)],
      description: hotelDescriptions[Math.floor(Math.random() * hotelDescriptions.length)],
      city,
      country: '',
      expediaUrl: expediaCityUrl(city),
    }
  })
}

// ---------------------------------------------
// PILL‑STYLE HOTEL CARD
// ---------------------------------------------
function HotelPill({ hotel }: { hotel: Hotel }) {
  return (
    <div className="w-full rounded-full border border-gray-200 bg-white px-5 py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 shadow-sm hover:shadow-md transition-shadow">
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
        View on Expedia →
      </a>
    </div>
  )
}

// ---------------------------------------------
// CITY SEARCH (ANY CITY WORLDWIDE)
// ---------------------------------------------
function CitySearch({
  selectedCity,
  onChange,
}: {
  selectedCity: string
  onChange: (city: string) => void
}) {
  const [value, setValue] = React.useState(selectedCity)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    onChange(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search any city worldwide…"
        className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      />
      <button
        type="submit"
        className="rounded-full bg-teal-600 text-white text-sm font-semibold px-6 py-2.5 hover:bg-teal-700 transition-colors"
      >
        Search hotels
      </button>
    </form>
  )
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function HotelsPageClient() {
  const [city, setCity] = React.useState<string>('London')

  const hotels =
    curatedHotels[city] ??
    generateHotels(city)

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
          Search hotels in any city worldwide — curated or automatically generated, always bookable via Expedia.
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
            Hotels in {city}
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Curated where available — automatically generated everywhere else.
          </p>

          <CitySearch selectedCity={city} onChange={setCity} />

          <div className="mt-10 space-y-3">
            {hotels.map(hotel => (
              <HotelPill key={hotel.name} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* CURATED CITY SHORTCUTS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-6"
            style={{ color: '#232e4e' }}
          >
            Popular curated cities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(curatedHotels).map(cityName => (
              <button
                key={cityName}
                onClick={() => setCity(cityName)}
                className="w-full rounded-xl border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>
                  Hotels in {cityName}
                </h3>
                <p className="text-gray-500 text-sm">
                  {curatedHotels[cityName].length} curated stays
                </p>
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
            Explore the full hotel catalogue from our trusted partner.
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
