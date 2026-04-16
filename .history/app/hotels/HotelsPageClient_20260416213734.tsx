'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HotelSearch from '@/app/components/Search/HotelSearch'
import airports from '@/data/airports.json'
import FlightSearch from '@/app/components/Search/FlightSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'
import { client } from '@/sanity/lib/client' // adjust to your Sanity client path

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
}

type CityOption = {
  city: string
  country: string
}

type AirportRecord = {
  city: string
  country: string
}

type SanityCity = {
  name: string
  slug: string
}

// ---------------------------------------------
// AFFILIATE CONSTANT
// ---------------------------------------------
const EXPEDIA_AFFILIATE_URL = 'https://expedia.com/affiliate/KohMBZ5'

// ---------------------------------------------
// SANITY QUERY
// ---------------------------------------------
const CITIES_QUERY = `*[_type == "city"] | order(name asc) {
  name,
  "slug": slug.current
}`

// ---------------------------------------------
// CURATED HOTELS
// ---------------------------------------------
const curatedHotels: Record<string, Hotel[]> = {
  London: [
    {
      name: 'The Ritz London ⭐️',
      type: 'Luxury',
      area: 'Mayfair',
      description: 'Iconic five star hotel overlooking Green Park.',
      city: 'London',
      country: 'United Kingdom',
    },
    {
      name: 'The Ned 🛎️',
      type: 'Boutique',
      area: 'City of London',
      description: 'Stylish members club hotel in a former bank.',
      city: 'London',
      country: 'United Kingdom',
    },
    {
      name: 'The Hoxton, Shoreditch 🛎️',
      type: 'Boutique',
      area: 'Shoreditch',
      description: 'Creative hub with relaxed, design led rooms.',
      city: 'London',
      country: 'United Kingdom',
    },
    {
      name: 'Premier Inn London City 💸',
      type: 'Budget',
      area: 'Tower Hill',
      description: 'Reliable comfort a short walk from the Tower.',
      city: 'London',
      country: 'United Kingdom',
    },
  ],
  Manchester: [
    {
      name: 'The Edwardian Manchester ⭐️',
      type: 'Luxury',
      area: 'City Centre',
      description: 'Modern five star hotel in a historic building.',
      city: 'Manchester',
      country: 'United Kingdom',
    },
    {
      name: 'Hotel Gotham 🛎️',
      type: 'Boutique',
      area: 'King Street',
      description: 'Art deco boutique stay with real character.',
      city: 'Manchester',
      country: 'United Kingdom',
    },
    {
      name: 'Motel One Manchester Royal Exchange 💸',
      type: 'Budget',
      area: 'Royal Exchange',
      description: 'Design led budget option in the heart of the city.',
      city: 'Manchester',
      country: 'United Kingdom',
    },
  ],
  Paris: [
    {
      name: 'Hotel Plaza Athenee ⭐️',
      type: 'Luxury',
      area: 'Avenue Montaigne',
      description: 'Haute couture address with Eiffel Tower views.',
      city: 'Paris',
      country: 'France',
    },
    {
      name: 'Hotel des Grands Boulevards 🛎️',
      type: 'Boutique',
      area: '2nd arrondissement',
      description: 'Chic hideaway with a peaceful courtyard.',
      city: 'Paris',
      country: 'France',
    },
  ],
}

// ---------------------------------------------
// AUTO GENERATED HOTELS
// ---------------------------------------------
const namePatterns = [
  (city: string) => `The ${city} Grand Hotel`,
  (city: string) => `The ${city} Palace`,
  (city: string) => `${city} Boutique House`,
  (city: string) => `${city} Central Inn`,
  (city: string) => `${city} Riverside Hotel`,
  (city: string) => `The ${city} Collective`,
]

const hotelTypes = ['Luxury', 'Boutique', 'Modern', 'Budget']

const descriptions = [
  'A stylish stay in the heart of the city.',
  'Perfect for exploring local culture and cuisine.',
  'Comfortable rooms with excellent transport links.',
  'A modern base for business or leisure.',
  'A peaceful retreat close to major attractions.',
]

function generateHotels(city: string, country?: string): Hotel[] {
  return namePatterns
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(pattern => ({
      name: pattern(city),
      type: hotelTypes[Math.floor(Math.random() * hotelTypes.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      city,
      country,
    }))
}

// ---------------------------------------------
// CITY OPTIONS FROM AIRPORTS.JSON
// ---------------------------------------------
function useCityOptions(): CityOption[] {
  return React.useMemo(() => {
    const seen = new Map<string, string>()
    ;(airports as AirportRecord[]).forEach(a => {
      if (!a.city || !a.country) return
      if (!seen.has(a.city)) seen.set(a.city, a.country)
    })
    return Array.from(seen, ([city, country]) => ({ city, country }))
  }, [])
}

// ---------------------------------------------
// HOTEL TYPE BADGE COLOURS
// ---------------------------------------------
const typeBadge: Record<string, string> = {
  Luxury: '#b8860b',
  Boutique: '#03989e',
  Modern: '#232e4e',
  Budget: '#5a7a52',
}

// ---------------------------------------------
// HOTEL PILL
// ---------------------------------------------
function HotelPill({ hotel }: { hotel: Hotel }) {
  const badgeColor = typeBadge[hotel.type] ?? '#03989e'
  return (
    <div className="group w-full rounded-2xl border border-gray-100 bg-white px-6 py-5 flex flex-col md:flex-row md:items-center gap-4 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span
            className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${badgeColor}15`, color: badgeColor }}
          >
            {hotel.type}
          </span>
          {hotel.area && (
            <span className="text-xs text-gray-400">
              {hotel.area}
            </span>
          )}
        </div>
        <p className="font-semibold text-base text-slate-900 truncate">{hotel.name}</p>
        {hotel.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{hotel.description}</p>
        )}
      </div>
      <a
        href={EXPEDIA_AFFILIATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
        style={{ backgroundColor: '#03989e' }}
      >
        View hotel →
      </a>
    </div>
  )
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

  const handleSelect = (option: CityOption) => {
    setQuery(`${option.city}, ${option.country}`)
    onSelect(option)
    setOpen(false)
  }

  return (
    <div className="relative max-w-xl mx-auto">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search any city or country…"
          className="w-full border border-gray-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent shadow-sm"
          style={{ '--tw-ring-color': '#03989e' } as React.CSSProperties}
        />
      </div>
      {open && matches.length > 0 && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl max-h-64 overflow-auto">
          {matches.map(option => (
            <button
              key={`${option.city}-${option.country}`}
              type="button"
              onClick={() => handleSelect(option)}
              className="w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-slate-800">{option.city}</span>
              <span className="text-gray-400 ml-1">{option.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------
// POPULAR DESTINATIONS DROPDOWN (Sanity)
// ---------------------------------------------
function PopularDestinationsDropdown() {
  const [cities, setCities] = useState<SanityCity[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    client.fetch<SanityCity[]>(CITIES_QUERY).then(setCities)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:shadow-md"
        style={{ borderColor: '#232e4e', color: '#232e4e', backgroundColor: 'white' }}
      >
        <span>🌍</span>
        Popular Destinations
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="
            absolute left-0 z-50 mt-2 w-64 rounded-2xl shadow-xl bg-white border border-gray-100 
            py-2 overflow-y-auto
          "
          style={{
            maxHeight: '320px',        // 👈 LIMIT HEIGHT
            scrollbarWidth: 'thin',    // Firefox
          }}
        >
          {cities.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">Loading…</p>
          ) : (
            cities.map(city => (
              <Link
                key={city.slug}
                href={`/hotels/${city.slug}`}
                onClick={() => setOpen(false)}
                className="
                  flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 
                  hover:bg-gray-50 hover:text-[#03989e] transition-colors group
                "
              >
                <span>{city.name}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}


// ---------------------------------------------
// TOP DESTINATIONS
// ---------------------------------------------
const TOP_DESTINATIONS: CityOption[] = [
  { city: 'London 🏙️', country: 'United Kingdom' },
  { city: 'Paris 🗼', country: 'France' },
  { city: 'New York 🗽', country: 'United States' },
  { city: 'Dubai ⭐', country: 'United Arab Emirates' },
  { city: 'Tokyo ✈️', country: 'Japan' },
  { city: 'Barcelona ⛪', country: 'Spain' },
]

// ---------------------------------------------
// FAQ DATA
// ---------------------------------------------
const FAQS = [
  {
    q: 'How does Timms Travel help me find hotels?',
    a: 'Timms Travel gives you a clean and fast way to search for hotels anywhere in the world. Start typing a city or country and you will instantly see real destinations. You can then explore curated suggestions or browse hotels in any location.',
  },
  {
    q: 'Do I need an account to search for hotels?',
    a: 'No. You can search for hotels worldwide without creating an account. Everything is available instantly.',
  },
  {
    q: 'Are the hotel prices live and accurate?',
    a: 'Yes. When you click through to book, you will see live prices, room availability and guest reviews from trusted travel providers.',
  },
  {
    q: 'Can I book hotels directly on Timms Travel?',
    a: 'Timms Travel helps you discover and compare hotels. When you are ready to book, you will be taken to a secure booking page provided by one of our trusted travel partners.',
  },
  {
    q: 'Does Timms Travel charge any fees?',
    a: 'No. You will never pay extra to use Timms Travel. The price you see when you click through to book is the price provided by the travel partner.',
  },
  {
    q: 'Can I search for hotels in smaller or less common destinations?',
    a: 'Yes. Timms Travel supports hotel searches in thousands of destinations around the world. Even small towns and remote locations are included.',
  },
  {
    q: 'Why do some cities have curated hotel lists?',
    a: 'For popular destinations, we highlight a selection of hotels that travellers consistently rate highly. These curated lists save you time and help you discover great places to stay.',
  },
  {
    q: 'What if a city does not have a curated list?',
    a: 'You can still search for any city worldwide. If we do not have a curated list for that location, we will generate a helpful set of hotel suggestions so you can explore your options quickly.',
  },
  {
    q: 'Is Timms Travel suitable for last minute bookings?',
    a: 'Yes. You can search for hotels at any time and click through to see live availability. It is ideal for both planned trips and spontaneous getaways.',
  },
  {
    q: 'Is Timms Travel a UK based platform?',
    a: 'Yes. Timms Travel is built in the United Kingdom and created with a focus on clarity, trust and ease of use.',
  },
]

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function HotelsPageClient() {
  const [activeTab, setActiveTab] = React.useState<'flights' | 'hotels' | 'experiences' | 'cars'>('hotels')
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

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden text-white py-24 px-6 text-center"
        style={{ backgroundColor: '#232e4e' }}
      >
        {/* subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
            Timms Travel · Hotels
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Compare Hotels Worldwide!
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-10">
            Search hotels in any city worldwide. Curated picks, live prices and no booking fees.
          </p>

          {/* SEARCH TABS */}
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

          <div className="bg-white rounded-2xl p-6 shadow-2xl text-black text-left">
            {activeTab === 'flights'     && <FlightSearch />}
            {activeTab === 'hotels'      && <HotelSearch />}
            {activeTab === 'experiences' && <ExperienceSearch />}
            {activeTab === 'cars'        && <CarSearch />}
          </div>
        </div>
      </section>

      {/* ── SEARCH + RESULTS ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">

          {/* Search bar + dropdown row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
            <div className="flex-1 w-full">
              <CitySearch onSelect={setSelectedCity} />
            </div>
            <PopularDestinationsDropdown />
          </div>

          {/* Results header */}
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
                Hotels in {selectedCity.city}
                {selectedCity.country ? `, ${selectedCity.country}` : ''}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Curated where available — click any hotel to search on Expedia.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {hotels.map(hotel => (
              <HotelPill key={hotel.name} hotel={hotel} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={EXPEDIA_AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
              style={{ backgroundColor: '#03989e' }}
            >
              View All Hotels on Expedia →
            </a>
          </div>
        </div>
      </section>

      {/* ── TOP DESTINATIONS ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Explore</p>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
                Top destinations this month
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TOP_DESTINATIONS.map(dest => (
              <a
                key={`${dest.city}-${dest.country}`}
                href={EXPEDIA_AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-teal-200 hover:bg-teal-50/30 transition-all"
              >
                <h3 className="font-bold text-lg mb-0.5 group-hover:text-[#03989e] transition-colors" style={{ color: '#232e4e' }}>
                  {dest.city}
                </h3>
                <p className="text-gray-400 text-sm">{dest.country}</p>
                <span className="mt-3 inline-block text-xs font-semibold text-[#03989e] opacity-0 group-hover:opacity-100 transition-opacity">
                  Search hotels →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TIMMS TRAVEL ── */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Why us</p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              Why book your hotel with Timms Travel
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { emoji: '🌍', title: 'Global coverage', body: 'Search thousands of destinations worldwide, from major capitals to small coastal towns.' },
              { emoji: '💸', title: 'No hidden fees', body: 'You pay the price shown. Timms Travel never adds extra charges on top of your booking.' },
              { emoji: '⚡', title: 'Live availability', body: 'Click through to see real-time prices, room availability and guest reviews instantly.' },
            ].map(({ emoji, title, body }) => (
              <div key={title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
            <p>
              Finding the right hotel should feel simple. Timms Travel is designed to help you cut through the noise and discover places to stay that genuinely suit your trip — whether you are planning a weekend break, a family holiday or a long haul adventure.
            </p>
            <p>
              For major destinations, we highlight a selection of hotels that travellers consistently love. These curated suggestions save you time and give you a head start when choosing where to stay. If you are heading somewhere less familiar, you can still search globally and find hotels in thousands of locations.
            </p>
            <p>
              Timms Travel is proudly built in the United Kingdom and created with travellers in mind. We focus on transparency, simplicity and genuine value.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Help</p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details
                key={q}
                className="group border border-gray-100 rounded-2xl bg-gray-50 px-5 py-4 cursor-pointer"
              >
                <summary className="font-semibold text-sm list-none flex items-center justify-between gap-4" style={{ color: '#232e4e' }}>
                  {q}
                  <span className="shrink-0 text-gray-400 group-open:rotate-45 transition-transform duration-200 text-lg leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}