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

const expediaTypeUrl = (propertyType: string, starRating?: string) => {
  const params = new URLSearchParams()
  params.set('affcid', EXPEDIA_AFFILIATE_ID)
  params.set('propertyType', propertyType)
  if (starRating) params.set('star', starRating)
  return `${EXPEDIA_BASE}/Hotel-Search?${params.toString()}`
}

const expediaBrowseAll = () => {
  const params = new URLSearchParams()
  params.set('affcid', EXPEDIA_AFFILIATE_ID)
  return `${EXPEDIA_BASE}/Hotel-Search?${params.toString()}`
}

// -------------------------------
// CURATED LANDING PAGES
// -------------------------------
const curatedUrls = {
  Luxury: `${EXPEDIA_BASE}/lp/t/hotels/Luxury-Hotel?affcid=${EXPEDIA_AFFILIATE_ID}`,
  Boutique: `${EXPEDIA_BASE}/lp/t/hotels/Boutique-Hotel?affcid=${EXPEDIA_AFFILIATE_ID}`,
  Budget: `${EXPEDIA_BASE}/lp/t/hotels/Budget-Hotels?affcid=${EXPEDIA_AFFILIATE_ID}`,
  Apartments: `${EXPEDIA_BASE}/aa/Apartments?affcid=${EXPEDIA_AFFILIATE_ID}`,
}

// -------------------------------
// AUTOMATED HOTEL SEARCH URL
// -------------------------------
const expediaSearchUrl = (city: string, params: Record<string, string> = {}) => {
  const search = new URLSearchParams()
  search.set('destination', city)
  search.set('affcid', EXPEDIA_AFFILIATE_ID)

  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value)
  })

  return `${EXPEDIA_BASE}/Hotel-Search?${search.toString()}`
}

// -------------------------------
// AUTOMATED FEATURED HOTELS
// -------------------------------
const hotelCategories = [
  { label: "Top Hotels", params: { sort: "RECOMMENDED" }, image: "/images/hotels/top.jpg" },
  { label: "Luxury Hotels", params: { star: "5" }, image: "/images/hotels/luxury.jpg" },
  { label: "Boutique Hotels", params: { propertyType: "BED_AND_BREAKFAST" }, image: "/images/hotels/boutique.jpg" },
  { label: "Budget Hotels", params: { star: "3" }, image: "/images/hotels/budget.jpg" },
  { label: "Apartments", params: { propertyType: "APART_HOTEL" }, image: "/images/hotels/apartments.jpg" },
  { label: "Family Hotels", params: { amenities: "FAMILY_FRIENDLY" }, image: "/images/hotels/family.jpg" },
]

function FeaturedHotels({ city }: { city: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
      {hotelCategories.map(cat => {
        const url = expediaSearchUrl(city, cat.params)

        return (
          <a
            key={cat.label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
          >
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg" style={{ color: '#232e4e' }}>
                {cat.label} in {city}
              </h3>
              <p className="text-sm text-gray-500 mt-1">Browse deals and top stays</p>
              <span className="inline-block mt-3 text-sm font-medium text-teal-600 group-hover:underline">
                Browse →
              </span>
            </div>
          </a>
        )
      })}
    </div>
  )
}

// -------------------------------
// CITY SEARCH BAR
// -------------------------------
function CitySearch({ onSelect }: { onSelect: (city: string) => void }) {
  const [value, setValue] = React.useState("")
  const [results, setResults] = React.useState<any[]>([])
  const [show, setShow] = React.useState(false)

  // Debounced search
  React.useEffect(() => {
    if (!value) {
      setResults([])
      return
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/hotel-cities?query=${value}`)
      const data = await res.json()
      setResults(data)
      setShow(true)
    }, 250)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <div className="relative max-w-md mx-auto mt-10">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search a city…"
        className="w-full border rounded-lg px-4 py-3"
        onFocus={() => value && setShow(true)}
      />

      {show && results.length > 0 && (
        <div className="absolute left-0 right-0 bg-white border rounded-lg shadow-lg mt-2 z-20 max-h-60 overflow-y-auto">
          {results.map((city: any) => (
            <div
              key={city.name}
              onClick={() => {
                onSelect(city.name)
                setValue(city.name)
                setShow(false)
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {city.name}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => onSelect(value)}
        className="mt-3 w-full bg-teal-600 text-white py-2 rounded-lg"
      >
        Search Hotels
      </button>
    </div>
  )
}

// -------------------------------
// DESTINATIONS
// -------------------------------
const destinations = [
  { city: 'London', country: 'United Kingdom', emoji: '🏙️', description: 'Historic charm meets modern luxury', image: '#1a2a4a' },
  { city: 'Manchester', country: 'United Kingdom', emoji: '🐝', description: 'Vibrant culture in the North', image: '#1e3a5f' },
  { city: 'Edinburgh', country: 'United Kingdom', emoji: '🏰', description: "Scotland's stunning capital", image: '#2a1a4a' },
  { city: 'Barcelona', country: 'Spain', emoji: '⛪', description: 'Sun, architecture & gastronomy', image: '#4a2a1a' },
  { city: 'New Delhi', country: 'India', emoji: '🕌', description: 'Ancient history, vibrant streets', image: '#3a2a1a' },
  { city: 'New York', country: 'United States', emoji: '🗽', description: 'The city that never sleeps', image: '#1a3a4a' },
  { city: 'Orlando', country: 'United States', emoji: '🎢', description: 'Theme parks & family fun', image: '#2a4a1a' },
  { city: 'Paris', country: 'France', emoji: '🗼', description: 'Romance, art & haute cuisine', image: '#3a1a2a' },
]

// -------------------------------
// HOTEL TYPES
// -------------------------------
const hotelTypes = [
  { label: 'Luxury', icon: '✦', desc: '5-star properties & resorts', propertyType: 'HOTEL', starRating: '5' },
  { label: 'Boutique', icon: '◈', desc: 'Unique, character-rich stays', propertyType: 'BED_AND_BREAKFAST', starRating: undefined },
  { label: 'Budget', icon: '◇', desc: 'Great value, no compromises', propertyType: 'HOSTEL', starRating: undefined },
  { label: 'Apartments', icon: '⬡', desc: 'Home comforts, longer stays', propertyType: 'APART_HOTEL', starRating: undefined },
]

// -------------------------------
// PERKS
// -------------------------------
const perks = [
  { icon: '🔓', title: 'Free cancellation', text: 'Flexible plans, no stress' },
  { icon: '💳', title: 'No booking fees', text: 'The price you see is what you pay' },
  { icon: '🌐', title: '500,000+ hotels', text: 'Every destination, every budget' },
  { icon: '⭐', title: 'Verified reviews', text: 'Real guests, honest opinions' },
]

// -------------------------------
// DESTINATION CARD
// -------------------------------
function DestinationCard({ dest }: { dest: typeof destinations[0] }) {
  return (
    <a
      href={expediaCityUrl(dest.city, dest.country)}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-2xl overflow-hidden cursor-pointer block"
      style={{ minHeight: '200px' }}
    >
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundColor: dest.image }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)',
        }}
      />
      <div className="absolute top-4 right-4 text-4xl opacity-30 group-hover:opacity-50 transition-opacity duration-300">
        {dest.emoji}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white font-bold text-lg leading-tight">{dest.city}</p>
        <p className="text-gray-300 text-xs mt-0.5 mb-2">{dest.country}</p>
        <p className="text-gray-400 text-xs leading-relaxed">
          {dest.description}
        </p>
        <span
          className="inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 group-hover:px-4"
          style={{ backgroundColor: '#2f797c', color: 'white' }}
        >
          Browse hotels →
        </span>
      </div>
    </a>
  )
}

// -------------------------------
// HOTEL TYPE CARD
// -------------------------------
function HotelTypeCard({ type }: { type: typeof hotelTypes[0] }) {
  const url = curatedUrls[type.label]
    ? curatedUrls[type.label]
    : expediaTypeUrl(type.propertyType, type.starRating)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-xl p-5 text-center border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-200 group block"
    >
      <div
        className="text-2xl mb-2 transition-transform duration-200 group-hover:scale-110"
        style={{ color: '#2f797c' }}
      >
        {type.icon}
      </div>

      <p className="font-semibold text-sm mb-1" style={{ color: '#232e4e' }}>
        {type.label}
      </p>

      <p className="text-xs text-gray-400 mb-3">{type.desc}</p>

      <span
        className="inline-block text-xs font-medium px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ backgroundColor: '#2f797c', color: 'white' }}
      >
        Browse →
      </span>
    </a>
  )
}

// -------------------------------
// PAGE
// -------------------------------
export default function HotelsPage() {
  const [city, setCity] = React.useState("London")

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Find Your Perfect Stay!</h1>
        <p className="text-xl mb-10 text-gray-300 max-w-xl mx-auto">
          Compare hundreds of thousands of hotels worldwide — from cosy B&Bs to 5‑star luxury resorts.
        </p>
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          <HotelSearch />
        </div>
        <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300 flex-wrap">
          <span>Free cancellation available</span>
          <span>No hidden fees</span>
          <span>500,000+ hotels worldwide</span>
        </div>
      </section>

      {/* HOTEL TYPES */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Every type of stay
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm">Whatever you need, we have it</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hotelTypes.map((type) => (
              <HotelTypeCard key={type.label} type={type} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED HOTELS (AUTOMATED) */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Featured Hotels
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Search a city and explore top hotel categories instantly
          </p>

          <CitySearch onSelect={setCity} />
          <FeaturedHotels city={city} />
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Popular Destinations
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Hand‑picked hotels in our most searched cities
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((dest) => (
              <DestinationCard key={dest.city} dest={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {perks.map(({ icon, title, text }) => (
            <div key={title}>
              <div className="text-3xl mb-3">{icon}</div>
              <p className="font-semibold text-white text-sm mb-1">{title}</p>
              <p className="text-gray-400 text-xs">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            How it works
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Booking your perfect hotel takes just minutes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: 1, title: 'Search', text: 'Enter your destination, dates and number of guests to see available hotels instantly.' },
              { n: 2, title: 'Compare', text: 'Filter by price, rating, amenities and location. Read verified guest reviews.' },
              { n: 3, title: 'Book', text: 'Secure your stay directly with no hidden fees, and free cancellation on most rooms.' },
            ].map(({ n, title, text }) => (
              <div key={n} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4"
                  style={{ backgroundColor: '#2f797c' }}
                >
                  {n}
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-gray-500 leading-7 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '500K+', label: 'Hotels worldwide' },
            { stat: '100+', label: 'Countries covered' },
            { stat: '4.5★', label: 'Average guest rating' },
            { stat: '24/7', label: 'Customer support' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>{stat}</p>
              <p className="text-gray-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 px-6">
        <div
          className="max-w-4xl mx-auto rounded-2xl p-10 text-center text-white"
          style={{ backgroundColor: '#2f797c' }}
        >
          <h2 className="text-3xl font-bold mb-3">Not sure where to stay?</h2>

          <p className="text-teal-100 mb-6 text-sm max-w-md mx-auto">
            Browse our full hotel catalogue from our trusted partner and discover deals across every destination.
          </p>

          <a
            href={expediaBrowseAll()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white font-semibold px-8 py-3 rounded-full text-sm transition-opacity hover:opacity-90"
            style={{ color: '#2f797c' }}
          >
            Be Inspired, Browse Hotels
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
