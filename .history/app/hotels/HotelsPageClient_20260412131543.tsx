'use client'

import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HotelSearch from '@/app/components/Search/HotelSearch'

// -------------------------------
// EXPEDIA AFFILIATE CONSTANTS
// -------------------------------
const EXPEDIA_BASE = 'https://www.expedia.co.uk'
const EXPEDIA_AFFILIATE_ID = 'UK.DIRECT.PHG.1011l428377'

const expediaCityUrl = (city: string, country: string) => {
  const params = new URLSearchParams()
  params.set('affcid', EXPEDIA_AFFILIATE_ID)
  params.set('destination', `${city}, ${country}`)
  return `${EXPEDIA_BASE}/Hotel-Search?${params.toString()}`
}

const expediaBrowseAll = () => {
  const params = new URLSearchParams()
  params.set('affcid', EXPEDIA_AFFILIATE_ID)
  return `${EXPEDIA_BASE}/Hotel-Search?${params.toString()}`
}

// -------------------------------
// CURATED HOTELS (EXAMPLES)
// -------------------------------
type Hotel = {
  name: string
  stars: number
  type: string
  area?: string
  description?: string
  city: string
  country: string
  expediaUrl: string
}

const hotelsByCity: Record<string, Hotel[]> = {
  London: [
    {
      name: 'The Ritz London',
      stars: 5,
      type: 'Luxury',
      area: 'Mayfair',
      description: 'Iconic 5‑star hotel overlooking Green Park.',
      city: 'London',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('The Ritz London', 'United Kingdom'),
    },
    {
      name: 'The Ned',
      stars: 5,
      type: 'Boutique',
      area: 'City of London',
      description: 'Stylish members‑club hotel in a former bank.',
      city: 'London',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('The Ned', 'United Kingdom'),
    },
    {
      name: 'The Hoxton, Shoreditch',
      stars: 4,
      type: 'Boutique',
      area: 'Shoreditch',
      description: 'Creative hub with relaxed, design‑led rooms.',
      city: 'London',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('The Hoxton Shoreditch', 'United Kingdom'),
    },
    {
      name: 'Premier Inn London City',
      stars: 3,
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
      stars: 5,
      type: 'Luxury',
      area: 'City Centre',
      description: 'Modern 5‑star hotel in a historic building.',
      city: 'Manchester',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('The Edwardian Manchester', 'United Kingdom'),
    },
    {
      name: 'Hotel Gotham',
      stars: 5,
      type: 'Boutique',
      area: 'King Street',
      description: 'Art‑deco boutique stay with serious character.',
      city: 'Manchester',
      country: 'United Kingdom',
      expediaUrl: expediaCityUrl('Hotel Gotham', 'United Kingdom'),
    },
    {
      name: 'Motel One Manchester‑Royal Exchange',
      stars: 3,
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
      stars: 5,
      type: 'Luxury',
      area: 'Avenue Montaigne',
      description: 'Haute couture address with Eiffel Tower views.',
      city: 'Paris',
      country: 'France',
      expediaUrl: expediaCityUrl('Hotel Plaza Athenee', 'France'),
    },
    {
      name: 'Hôtel des Grands Boulevards',
      stars: 4,
      type: 'Boutique',
      area: '2nd arrondissement',
      description: 'Chic hideaway with a secret‑garden courtyard.',
      city: 'Paris',
      country: 'France',
      expediaUrl: expediaCityUrl('Hotel des Grands Boulevards', 'France'),
    },
  ],
}

// -------------------------------
// UTILS
// -------------------------------
const renderStars = (count: number) => '★'.repeat(count) + '☆'.repeat(Math.max(0, 5 - count))

// -------------------------------
// PILL‑STYLE HOTEL CARD
// -------------------------------
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
            {hotel.city}, {hotel.country}
            {hotel.area ? ` • ${hotel.area}` : ''}
          </span>
        </div>

        <p className="mt-1 font-semibold text-sm md:text-base text-slate-900 truncate">
          {hotel.name}
        </p>

        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <span className="font-mono text-amber-500">{renderStars(hotel.stars)}</span>
          <span>•</span>
          <span>{hotel.stars}-star stay</span>
        </div>

        {hotel.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {hotel.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 md:gap-4">
        <a
          href={hotel.expediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-teal-600 px-4 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-colors whitespace-nowrap"
        >
          View on Expedia →
        </a>
      </div>
    </div>
  )
}

// -------------------------------
// CITY SELECTOR + SEARCH
// -------------------------------
const popularCities = ['London', 'Manchester', 'Paris']

function CitySelector({
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
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Search a city (e.g. London, Manchester, Paris)…"
          className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <button
          type="submit"
          className="rounded-full bg-teal-600 text-white text-sm font-semibold px-6 py-2.5 hover:bg-teal-700 transition-colors"
        >
          Search hotels
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
        {popularCities.map(city => (
          <button
            key={city}
            type="button"
            onClick={() => {
              setValue(city)
              onChange(city)
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              selectedCity === city
                ? 'bg-teal-600 text-white border-teal-600'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  )
}

// -------------------------------
// PAGE
// -------------------------------
export default function HotelsPageClient() {
  const [city, setCity] = React.useState<string>('London')

  const hotels = hotelsByCity[city] ?? []

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
          Compare hand‑picked hotels in top cities worldwide — from iconic grand
          dames to design‑led boutiques.
        </p>
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          <HotelSearch />
        </div>
        <div className="flex justify-center gap-6 mt-6 text-xs md:text-sm text-gray-300 flex-wrap">
          <span>Free cancellation on many stays</span>
          <span>No hidden booking fees</span>
          <span>Powered by Expedia</span>
        </div>
      </section>

      {/* FEATURED HOTELS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Featured hotels in {city}
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Curated stays styled for comfort, character and location — all bookable via our trusted partner.
          </p>

          <CitySelector selectedCity={city} onChange={setCity} />

          <div className="mt-10 space-y-3">
            {hotels.length === 0 ? (
              <p className="text-center text-sm text-gray-500">
                We don&apos;t have curated hotels for <span className="font-semibold">{city}</span> yet.
                Try London, Manchester or Paris — or use the search above to browse all hotels on Expedia.
              </p>
            ) : (
              hotels.map(hotel => <HotelPill key={hotel.name} hotel={hotel} />)
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            How booking works
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm">
            We help you discover the right hotel — then you complete your booking securely with Expedia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                n: 1,
                title: 'Explore curated stays',
                text: 'Browse our hand‑picked hotels in top cities, filtered for style, location and rating.',
              },
              {
                n: 2,
                title: 'Compare on Expedia',
                text: 'Click through to Expedia to see live prices, photos, reviews and room options.',
              },
              {
                n: 3,
                title: 'Book with confidence',
                text: 'Complete your booking on Expedia with secure payment, support and flexible options.',
              },
            ].map(({ n, title, text }) => (
              <div key={n} className="text-center">
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg md:text-xl font-bold text-white mx-auto mb-4"
                  style={{ backgroundColor: '#2f797c' }}
                >
                  {n}
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: '#232e4e' }}
                >
                  {title}
                </h3>
                <p className="text-gray-500 leading-6 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 px-6">
        <div
          className="max-w-4xl mx-auto rounded-2xl p-10 text-center text-white"
          style={{ backgroundColor: '#2f797c' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Want to see every option?
          </h2>

          <p className="text-teal-100 mb-6 text-sm max-w-md mx-auto">
            Browse the full hotel catalogue from our trusted partner and discover stays in thousands of destinations worldwide.
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
