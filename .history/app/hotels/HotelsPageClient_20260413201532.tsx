'use client'

import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HotelSearch from '@/app/components/Search/HotelSearch'
import airports from '@/data/airports.json'
import FlightSearch from '@/app/components/Search/FlightSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'

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

// ---------------------------------------------
// AFFILIATE CONSTANT
// All hotel links go through the Expedia affiliate short link.
// This is the only tracked format supported by the Travel Creator Program.
// ---------------------------------------------
const EXPEDIA_AFFILIATE_URL = 'https://expedia.com/affiliate/KohMBZ5'

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
    },
    {
      name: 'The Ned',
      type: 'Boutique',
      area: 'City of London',
      description: 'Stylish members club hotel in a former bank.',
      city: 'London',
      country: 'United Kingdom',
    },
    {
      name: 'The Hoxton, Shoreditch',
      type: 'Boutique',
      area: 'Shoreditch',
      description: 'Creative hub with relaxed, design led rooms.',
      city: 'London',
      country: 'United Kingdom',
    },
    {
      name: 'Premier Inn London City',
      type: 'Budget',
      area: 'Tower Hill',
      description: 'Reliable comfort a short walk from the Tower.',
      city: 'London',
      country: 'United Kingdom',
    },
  ],
  Manchester: [
    {
      name: 'The Edwardian Manchester',
      type: 'Luxury',
      area: 'City Centre',
      description: 'Modern five star hotel in a historic building.',
      city: 'Manchester',
      country: 'United Kingdom',
    },
    {
      name: 'Hotel Gotham',
      type: 'Boutique',
      area: 'King Street',
      description: 'Art deco boutique stay with real character.',
      city: 'Manchester',
      country: 'United Kingdom',
    },
    {
      name: 'Motel One Manchester Royal Exchange',
      type: 'Budget',
      area: 'Royal Exchange',
      description: 'Design led budget option in the heart of the city.',
      city: 'Manchester',
      country: 'United Kingdom',
    },
  ],
  Paris: [
    {
      name: 'Hotel Plaza Athenee',
      type: 'Luxury',
      area: 'Avenue Montaigne',
      description: 'Haute couture address with Eiffel Tower views.',
      city: 'Paris',
      country: 'France',
    },
    {
      name: 'Hotel des Grands Boulevards',
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
// HOTEL PILL
// ---------------------------------------------
function HotelPill({ hotel }: { hotel: Hotel }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
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

      {/* All hotel pills link to the tracked affiliate URL */}
      <a
        href={EXPEDIA_AFFILIATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full border border-teal-600 px-4 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-colors whitespace-nowrap"
      >
        View hotel
      </a>
    </div>
  )
}

// ---------------------------------------------
// SEARCH BAR WITH AUTOCOMPLETE
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
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Start typing a city or country…"
          className="w-full border border-gray-200 rounded-full pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {open && matches.length > 0 && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-auto">
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
  )
}

// ---------------------------------------------
// TOP DESTINATIONS
// ---------------------------------------------
const TOP_DESTINATIONS: CityOption[] = [
  { city: 'London',    country: 'United Kingdom' },
  { city: 'Paris',     country: 'France' },
  { city: 'New York',  country: 'United States' },
  { city: 'Dubai',     country: 'United Arab Emirates' },
  { city: 'Tokyo',     country: 'Japan' },
  { city: 'Barcelona', country: 'Spain' },
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

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find Your Perfect Stay
        </h1>
        <p className="text-base md:text-lg mb-8 text-gray-300 max-w-xl mx-auto">
          Search hotels in any city worldwide. Get started with your search today.
        </p>

        <div className="flex justify-center gap-6 mb-8">
          {(['flights', 'hotels', 'experiences', 'cars'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          {activeTab === 'flights'     && <FlightSearch />}
          {activeTab === 'hotels'      && <HotelSearch />}
          {activeTab === 'experiences' && <ExperienceSearch />}
          {activeTab === 'cars'        && <CarSearch />}
        </div>
      </section>

      {/* SEARCH + RESULTS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <CitySearch onSelect={setSelectedCity} />

          <h2
            className="text-2xl md:text-3xl font-bold text-center mt-10 mb-2"
            style={{ color: '#232e4e' }}
          >
            Hotels in {selectedCity.city}
            {selectedCity.country ? `, ${selectedCity.country}` : ''}
          </h2>

          <p className="text-center text-gray-500 mb-8 text-sm">
            Curated where available — click any hotel to search on Expedia.
          </p>

          <div className="space-y-3">
            {hotels.map(hotel => (
              <HotelPill key={hotel.name} hotel={hotel} />
            ))}
          </div>

          {/* Browse all CTA below results */}
          <div className="mt-8 text-center">
            <a
              href={EXPEDIA_AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
              style={{ backgroundColor: '#03989e' }}
            >
              Browse all hotels on Expedia →
            </a>
          </div>
        </div>
      </section>

      {/* TOP DESTINATIONS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Top destinations this month
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Explore some of the most searched cities right now.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {TOP_DESTINATIONS.map(dest => (
              <a
                key={`${dest.city}-${dest.country}`}
                href={EXPEDIA_AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>
                  {dest.city}
                </h3>
                <p className="text-gray-500 text-sm">{dest.country}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-6 text-slate-800 leading-relaxed">
          <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#232e4e' }}>
            Why book your hotel with Timms Travel
          </h2>
          <p>
            Finding the right hotel should feel simple. Timms Travel is designed to help you cut through the noise and discover places to stay that genuinely suit your trip. Whether you are planning a weekend break, a family holiday or a long haul adventure, our platform gives you a clear and enjoyable way to explore your options.
          </p>
          <p>
            We focus on making hotel search feel effortless. Start typing any city or country and you will instantly see real destinations from around the world. There are no confusing filters or cluttered layouts. Just fast and accurate results that help you get where you want to go.
          </p>
          <p>
            For major destinations, we highlight a selection of hotels that travellers consistently love. These curated suggestions save you time and give you a head start when choosing where to stay. If you are heading somewhere less familiar, you can still search globally and find hotels in thousands of locations. From small coastal towns to busy capitals, Timms Travel helps you explore the world with confidence.
          </p>
          <p>
            When you click through to book, you will see live availability, up to date prices, room options and guest reviews from trusted travel providers. This means you can compare offers in one place and choose the deal that works best for you. There are no hidden fees or unexpected surprises at checkout.
          </p>
          <p>
            Timms Travel is built for speed and clarity. Pages load quickly, search results appear instantly and every hotel link takes you directly to a secure booking page. There are no pop ups or distractions. Just a smooth and reliable experience from start to finish.
          </p>
          <p>
            Whether you are planning ahead or booking something last minute, Timms Travel adapts to your style. Search globally, browse curated cities, explore trending destinations or jump straight into our most popular hotel categories.
          </p>
          <p>
            Timms Travel is proudly built in the United Kingdom and created with travellers in mind. We focus on transparency, simplicity and genuine value. Our goal is to help you make confident decisions every time you book a hotel.
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#232e4e' }}>
            Frequently asked questions
          </h2>

          <div className="space-y-4 text-slate-800 leading-relaxed">
            {[
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
            ].map(({ q, a }) => (
              <details key={q} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <summary className="font-semibold text-lg cursor-pointer">{q}</summary>
                <p className="mt-3 text-sm">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}