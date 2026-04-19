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
import { client } from '@/sanity/lib/client'
import NextImage from 'next/image'

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
// AFFILIATE HELPERS
// ---------------------------------------------
const EXPEDIA_AFFILIATE_FALLBACK = 'https://expedia.com/affiliate/KohMBZ5'
const EXPEDIA_CAMREF = '1110lCmpb'
const EXPEDIA_CREATIVEREF = '1011l87747'
const EXPEDIA_ADREF = 'PZZ928vica'

// Region IDs for known cities (extend as needed)
const REGION_IDS: Record<string, string> = {
  London: '2114',
  Manchester: '2430',
  Paris: '179088',
  'New York': '178293',
  Dubai: '602958',
  Tokyo: '179900',
  Barcelona: '181703',
  Amsterdam: '178285',
  Rome: '179917',
  Lisbon: '179141',
  Edinburgh: '55568',
  Dublin: '180495',
  Prague: '179976',
  Vienna: '179922',
  Berlin: '179886',
}

function buildExpediaDeepLink(city: string, country: string): string {
  const regionId = REGION_IDS[city]
  const destination = country
    ? `${city}, ${country}`
    : city

  const landingPageParams = new URLSearchParams({
    destination,
    ...(regionId ? { regionId } : {}),
    sort: 'RECOMMENDED',
    categorySearch: 'any_option',
    useRewards: 'false',
  })

  const landingPage = `https://www.expedia.co.uk/Hotel-Search?${landingPageParams.toString()}`

  const affiliateParams = new URLSearchParams({
    siteid: '1',
    landingPage,
    camref: EXPEDIA_CAMREF,
    creativeref: EXPEDIA_CREATIVEREF,
    adref: EXPEDIA_ADREF,
  })

  return `https://expedia.com/affiliate?${affiliateParams.toString()}`
}

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
  const href = hotel.country
    ? buildExpediaDeepLink(hotel.city, hotel.country)
    : EXPEDIA_AFFILIATE_FALLBACK

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
            <span className="text-xs text-gray-400">{hotel.area}</span>
          )}
        </div>
        <p className="font-semibold text-base text-slate-900 truncate">{hotel.name}</p>
        {hotel.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{hotel.description}</p>
        )}
      </div>
      <a
        href={href}
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
          className="absolute left-0 z-50 mt-2 w-64 rounded-2xl shadow-xl bg-white border border-gray-100 py-2 overflow-y-auto"
          style={{ maxHeight: '320px', scrollbarWidth: 'thin' }}
        >
          {cities.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">Loading…</p>
          ) : (
            cities.map(city => (
              <Link
                key={city.slug}
                href={`/hotels/${city.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#03989e] transition-colors group"
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
// FEATURED DESTINATION SPOTLIGHT
// ---------------------------------------------
type SpotlightDest = {
  city: string
  country: string
  tagline: string
  why: string
  bestFor: string
  tip: string
  emoji: string
  affiliateCity: string // clean city name for deep link
}

const SPOTLIGHT_DESTINATIONS: SpotlightDest[] = [
  {
    city: 'Lisbon',
    country: 'Portugal',
    tagline: 'Golden light, tiled streets and Atlantic soul.',
    why: 'Lisbon has become one of Europe\'s most beloved city break destinations - and for good reason. The Portuguese capital mixes centuries of Moorish and maritime history with a buzzing contemporary food scene, rooftop bars and a nightlife culture that genuinely comes alive after midnight. Wandering the steep cobbled lanes of Alfama at sunset, with fado drifting from an open doorway, is one of travel\'s genuinely unforgettable moments.',
    bestFor: 'Culture lovers, foodies, city breakers',
    tip: 'Stay in Chiado or Príncipe Real for walkable access to the best restaurants and viewpoints.',
    emoji: '🇵🇹',
    affiliateCity: 'Lisbon',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    tagline: 'Neon, silence, ramen and ancient ritual - all at once.',
    why: 'Tokyo is a city of infinite layers. From the serene cedar groves of Meiji Shrine to the sensory overload of Shinjuku at midnight, nowhere on earth offers contrasts quite like it. The food alone - whether you\'re eating yakitori under the train tracks in Yurakucho or a twelve-course kaiseki in a hushed Ginza restaurant - justifies the flight. Every neighbourhood feels like a different city entirely.',
    bestFor: 'First timers, food lovers, culture seekers',
    tip: 'Shinjuku and Shibuya are great bases for transport links; Yanaka offers a slower, more traditional Tokyo.',
    emoji: '🇯🇵',
    affiliateCity: 'Tokyo',
  },
  {
    city: 'Amsterdam',
    country: 'Netherlands',
    tagline: 'Canals, culture and the world\'s best cycling city.',
    why: 'Amsterdam punches far above its size. The canal ring - a UNESCO World Heritage Site - is genuinely beautiful at any time of year, and the density of world-class museums (Rijksmuseum, Van Gogh, Anne Frank House) within walking distance of each other is almost unfair. The city rewards slow travel: rent a bike, pick a neighbourhood, find a brown café and settle in.',
    bestFor: 'Art lovers, couples, weekend breakers',
    tip: 'Stay in the Jordaan or De Pijp for the most characterful base - avoid tourist-heavy areas around Centraal Station.',
    emoji: '🇳🇱',
    affiliateCity: 'Amsterdam',
  },
  {
    city: 'Edinburgh',
    country: 'United Kingdom',
    tagline: 'Dramatic skylines, whisky and wild festival energy.',
    why: 'Edinburgh is one of Britain\'s most dramatic cities - the volcanic Castle Rock, the medieval Royal Mile and the Georgian New Town form a backdrop unlike anywhere else in the UK. August transforms it into the world\'s largest arts festival, but the city is equally rewarding in winter, when the Christmas markets glow beneath the castle and the pubs are warm and full of conversation.',
    bestFor: 'History buffs, whisky enthusiasts, festival-goers',
    tip: 'The Old Town puts you inside history; the New Town is quieter and easier for walking to restaurants.',
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    affiliateCity: 'Edinburgh',
  },
]

function FeaturedSpotlight() {
  const [index, setIndex] = useState(0)
  const dest = SPOTLIGHT_DESTINATIONS[index]
  const href = buildExpediaDeepLink(dest.affiliateCity, dest.country)

  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Destination Spotlight</p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              Where to go next
            </h2>
          </div>
          <div className="flex gap-2">
            {SPOTLIGHT_DESTINATIONS.map((d, i) => (
              <button
                key={d.city}
                onClick={() => setIndex(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  i === index
                    ? 'text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                style={i === index ? { backgroundColor: '#232e4e' } : {}}
              >
                {d.emoji} {d.city}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-4xl">{dest.emoji}</span>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: '#232e4e' }}>
                  {dest.city}, {dest.country}
                </h3>
                <p className="text-teal-600 font-medium mt-0.5">{dest.tagline}</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">{dest.why}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Best for</p>
                <p className="text-sm font-semibold text-slate-800">{dest.bestFor}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Insider tip</p>
                <p className="text-sm font-semibold text-slate-800">{dest.tip}</p>
              </div>
            </div>

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
              style={{ backgroundColor: '#03989e' }}
            >
              Find hotels in {dest.city} →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// HOTEL TYPES EXPLAINER
// ---------------------------------------------
const HOTEL_TYPES = [
  {
    type: 'Luxury',
    emoji: '⭐️',
    color: '#b8860b',
    bg: '#b8860b15',
    headline: 'Five-star from the moment you arrive.',
    body: 'Luxury hotels are defined by impeccable service, premium locations and facilities that go far beyond the basics. Think white-glove concierge, spa access, fine dining restaurants and rooms designed down to the last detail. These are hotels that become part of the trip itself, not just a place to sleep. Expect to pay a premium, but expect to feel every penny of it.',
    examples: 'The Ritz, Four Seasons, Mandarin Oriental, Aman',
    idealFor: 'Honeymoons, milestone celebrations, business travel on expenses',
  },
  {
    type: 'Boutique',
    emoji: '🛎️',
    color: '#03989e',
    bg: '#03989e15',
    headline: 'Character, craft and a genuine sense of place.',
    body: 'Boutique hotels are typically independently owned, with fewer rooms and a much stronger design identity than chain hotels. The personality of the owner often seeps into every corner - you might find a rooftop bar curated by a local artist, a lobby filled with vintage finds or a breakfast menu sourced entirely from the surrounding neighbourhood. Boutique stays tend to feel like a discovery rather than a booking.',
    examples: 'The Ned, The Hoxton, Ace Hotels, The Pig',
    idealFor: 'Design lovers, solo travellers, city breakers who want personality',
  },
  {
    type: 'Modern',
    emoji: '🏢',
    color: '#232e4e',
    bg: '#232e4e15',
    headline: 'Clean, consistent and built for the way we travel now.',
    body: 'Modern hotels - often from newer international chains or lifestyle brands - prioritise seamless experiences. Fast Wi-Fi, co-working lobbies, mobile check-in, well-equipped gyms and rooms that are genuinely practical rather than quirky. They sit between boutique and budget: you get real quality without the boutique price tag, and genuine style without the sterility of an older chain.',
    examples: 'citizenM, Moxy, Andaz, Nobu Hotel',
    idealFor: 'Business travellers, frequent flyers, people who value efficiency',
  },
  {
    type: 'Budget',
    emoji: '💸',
    color: '#5a7a52',
    bg: '#5a7a5215',
    headline: 'Smart spending without compromising on comfort.',
    body: 'Budget hotels have changed dramatically. The best options today - particularly from Premier Inn, ibis Styles, Travelodge and Motel One - offer genuinely comfortable beds, clean rooms and great locations for a fraction of the cost of their luxury neighbours. The money you save goes back into your trip: better restaurants, more experiences, longer stays. Budget doesn\'t mean basic - it means prioritising.',
    examples: 'Premier Inn, ibis Styles, Motel One, Travelodge',
    idealFor: 'Solo trips, longer stays, families stretching a holiday budget',
  },
]

function HotelTypesSection() {
  const [active, setActive] = useState(0)
  const t = HOTEL_TYPES[active]

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Know before you book</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Which type of hotel is right for you?
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            Understanding the difference between hotel types saves money and avoids disappointment. Here's the honest breakdown.
          </p>
        </div>

        {/* Tab row */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {HOTEL_TYPES.map((h, i) => (
            <button
              key={h.type}
              onClick={() => setActive(i)}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border"
              style={
                i === active
                  ? { backgroundColor: h.color, color: '#fff', borderColor: h.color }
                  : { backgroundColor: `${h.color}10`, color: h.color, borderColor: `${h.color}30` }
              }
            >
              {h.emoji} {h.type}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{t.emoji}</span>
            <div>
              <span
                className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ backgroundColor: t.bg, color: t.color }}
              >
                {t.type}
              </span>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3" style={{ color: '#232e4e' }}>{t.headline}</h3>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6">{t.body}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl px-5 py-4 border border-gray-100" style={{ backgroundColor: t.bg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: t.color }}>Examples</p>
              <p className="text-sm font-medium text-slate-700">{t.examples}</p>
            </div>
            <div className="rounded-2xl px-5 py-4 border border-gray-100" style={{ backgroundColor: t.bg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: t.color }}>Ideal for</p>
              <p className="text-sm font-medium text-slate-700">{t.idealFor}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// BEST TIME TO VISIT
// ---------------------------------------------
type MonthRating = 'great' | 'good' | 'avoid' | 'ok'

type DestinationSeason = {
  city: string
  country: string
  emoji: string
  summary: string
  months: { month: string; rating: MonthRating; note: string }[]
  bestWindow: string
  avoidWindow: string
}

const SEASON_DATA: DestinationSeason[] = [
  {
    city: 'London',
    country: 'United Kingdom',
    emoji: '🏙️',
    summary: 'London is a year-round destination, but June to September offers the best combination of warm weather, long days and a packed events calendar.',
    bestWindow: 'June – September',
    avoidWindow: 'November – January',
    months: [
      { month: 'Jan', rating: 'avoid', note: 'Cold and grey, but cheap' },
      { month: 'Feb', rating: 'avoid', note: 'Still quiet, low prices' },
      { month: 'Mar', rating: 'ok', note: 'Spring begins, pleasant walks' },
      { month: 'Apr', rating: 'good', note: 'Easter crowds, blossom season' },
      { month: 'May', rating: 'good', note: 'Warm and lively' },
      { month: 'Jun', rating: 'great', note: 'Wimbledon, festivals begin' },
      { month: 'Jul', rating: 'great', note: 'Peak summer, long days' },
      { month: 'Aug', rating: 'great', note: 'Warm, busy, Notting Hill Carnival' },
      { month: 'Sep', rating: 'great', note: 'Shoulder season, still warm' },
      { month: 'Oct', rating: 'ok', note: 'Autumn colour, quieter' },
      { month: 'Nov', rating: 'avoid', note: 'Rainy and dark' },
      { month: 'Dec', rating: 'good', note: 'Christmas markets and lights' },
    ],
  },
  {
    city: 'Paris',
    country: 'France',
    emoji: '🗼',
    summary: 'Paris is beautiful all year, but spring (April–June) and early autumn (September–October) offer the best weather with manageable crowds.',
    bestWindow: 'April – June & September',
    avoidWindow: 'July – August (crowded)',
    months: [
      { month: 'Jan', rating: 'ok', note: 'Quiet, cold, cheap' },
      { month: 'Feb', rating: 'ok', note: 'Low season, romantic' },
      { month: 'Mar', rating: 'good', note: 'Warming up, fewer tourists' },
      { month: 'Apr', rating: 'great', note: 'Blossom, perfect temperatures' },
      { month: 'May', rating: 'great', note: 'Ideal - warm and green' },
      { month: 'Jun', rating: 'great', note: 'Long evenings, terraces full' },
      { month: 'Jul', rating: 'good', note: 'Hot and very busy' },
      { month: 'Aug', rating: 'avoid', note: 'Locals leave, tourist crowds peak' },
      { month: 'Sep', rating: 'great', note: 'Fashion Week, beautiful light' },
      { month: 'Oct', rating: 'great', note: 'Autumn colour, quieter streets' },
      { month: 'Nov', rating: 'ok', note: 'Cool and atmospheric' },
      { month: 'Dec', rating: 'good', note: 'Festive and magical' },
    ],
  },
  {
    city: 'Dubai',
    country: 'United Arab Emirates',
    emoji: '⭐',
    summary: 'Dubai\'s winters (October–April) are near perfect. Summers are brutally hot and best avoided unless you plan to spend most of your time indoors.',
    bestWindow: 'October – April',
    avoidWindow: 'June – August',
    months: [
      { month: 'Jan', rating: 'great', note: 'Perfect beach weather, ~24°C' },
      { month: 'Feb', rating: 'great', note: 'Ideal conditions, Shopping Festival' },
      { month: 'Mar', rating: 'great', note: 'Warm and sunny' },
      { month: 'Apr', rating: 'good', note: 'Heating up but pleasant' },
      { month: 'May', rating: 'ok', note: 'Getting hot (35°C+)' },
      { month: 'Jun', rating: 'avoid', note: 'Extreme heat, 40°C+' },
      { month: 'Jul', rating: 'avoid', note: 'Hottest month, very humid' },
      { month: 'Aug', rating: 'avoid', note: 'Unbearable outdoors' },
      { month: 'Sep', rating: 'ok', note: 'Still very hot' },
      { month: 'Oct', rating: 'good', note: 'Cooling down, great deals' },
      { month: 'Nov', rating: 'great', note: 'Back to ideal temperatures' },
      { month: 'Dec', rating: 'great', note: 'Peak season, Christmas events' },
    ],
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    emoji: '✈️',
    summary: 'Cherry blossom season (late March–April) is magical but crowded. Autumn (October–November) offers stunning foliage with slightly fewer tourists.',
    bestWindow: 'March–April & October–November',
    avoidWindow: 'June–July (rainy season)',
    months: [
      { month: 'Jan', rating: 'ok', note: 'Cold but clear and crisp' },
      { month: 'Feb', rating: 'ok', note: 'Still cool, fewer crowds' },
      { month: 'Mar', rating: 'great', note: 'Cherry blossom begins' },
      { month: 'Apr', rating: 'great', note: 'Peak sakura, iconic' },
      { month: 'May', rating: 'great', note: 'Warm, green, comfortable' },
      { month: 'Jun', rating: 'avoid', note: 'Rainy season begins' },
      { month: 'Jul', rating: 'avoid', note: 'Hot, humid, heavy rain' },
      { month: 'Aug', rating: 'ok', note: 'Matsuri festivals, very hot' },
      { month: 'Sep', rating: 'ok', note: 'Typhoon risk, easing off' },
      { month: 'Oct', rating: 'great', note: 'Autumn colour, ideal temps' },
      { month: 'Nov', rating: 'great', note: 'Stunning foliage, crisp air' },
      { month: 'Dec', rating: 'good', note: 'Festive illuminations, cold' },
    ],
  },
]

const ratingColors: Record<MonthRating, { bg: string; text: string; label: string }> = {
  great: { bg: '#03989e', text: '#fff', label: 'Great' },
  good: { bg: '#5a7a52', text: '#fff', label: 'Good' },
  ok: { bg: '#e5e7eb', text: '#374151', label: 'OK' },
  avoid: { bg: '#fee2e2', text: '#dc2626', label: 'Avoid' },
}

function BestTimeSection() {
  const [activeCity, setActiveCity] = useState('London')
  const dest = SEASON_DATA.find(d => d.city === activeCity) ?? SEASON_DATA[0]
  const href = buildExpediaDeepLink(dest.city, dest.country)

  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Plan ahead</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Best time to visit
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            Timing your trip right makes a real difference. Here's an honest month-by-month breakdown for our most popular destinations.
          </p>
        </div>

        {/* City selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {SEASON_DATA.map(d => (
            <button
              key={d.city}
              onClick={() => setActiveCity(d.city)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all border"
              style={
                d.city === activeCity
                  ? { backgroundColor: '#232e4e', color: '#fff', borderColor: '#232e4e' }
                  : { backgroundColor: '#fff', color: '#232e4e', borderColor: '#e5e7eb' }
              }
            >
              {d.emoji} {d.city}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 md:p-10">
          <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6">{dest.summary}</p>

          {/* Month grid */}
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-8">
            {dest.months.map(m => {
              const r = ratingColors[m.rating]
              return (
                <div key={m.month} className="group relative flex flex-col items-center">
                  <div
                    className="w-full rounded-xl py-3 text-center cursor-default"
                    style={{ backgroundColor: r.bg }}
                  >
                    <span className="text-xs font-bold" style={{ color: r.text }}>{m.month}</span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 bg-slate-800 text-white text-xs rounded-xl px-2 py-1.5 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <strong>{r.label}</strong>
                    <br />{m.note}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-6">
            {(Object.entries(ratingColors) as [MonthRating, typeof ratingColors[MonthRating]][]).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: val.bg, border: key === 'ok' ? '1px solid #d1d5db' : 'none' }} />
                <span className="text-xs text-gray-500">{val.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-1">Best window</p>
              <p className="text-sm font-semibold text-slate-800">{dest.bestWindow}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">Consider avoiding</p>
              <p className="text-sm font-semibold text-slate-800">{dest.avoidWindow}</p>
            </div>
          </div>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: '#03989e' }}
          >
            Search hotels in {dest.city} →
          </a>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// PACKING CHECKLIST
// ---------------------------------------------
const PACKING_CATEGORIES = [
  {
    label: 'Documents & Money',
    emoji: '📄',
    items: [
      'Passport (valid for 6+ months beyond your return date)',
      'Travel insurance documents - digital and printed copy',
      'Hotel confirmation emails downloaded offline',
      'Flight e-tickets and boarding passes',
      'Debit/credit cards (notify your bank before you travel)',
      'Some local currency for arrival',
      'Emergency contact numbers written down',
    ],
  },
  {
    label: 'Clothing Essentials',
    emoji: '👕',
    items: [
      'Enough underwear and socks (one per day, plus two spare)',
      'A versatile mid-layer - a lightweight fleece or cardigan',
      'One smart outfit for nicer restaurants',
      'Comfortable walking shoes (broken in before you go)',
      'Compact rain jacket or packable umbrella',
      'Swimwear if there is a pool or beach',
      'Flip-flops for hotel showers and pool areas',
    ],
  },
  {
    label: 'Tech & Charging',
    emoji: '🔌',
    items: [
      'Universal travel adaptor',
      'Portable power bank (fully charged)',
      'Phone and laptop charging cables',
      'Headphones for flights and long transfers',
      'Download offline maps before you depart',
      'E-reader or downloaded films for travel days',
    ],
  },
  {
    label: 'Health & Toiletries',
    emoji: '💊',
    items: [
      'Any prescription medication - more than you need',
      'Basic first aid: plasters, ibuprofen, antihistamine',
      'Sunscreen (SPF 30+ even for city trips)',
      'Hand sanitiser and a small pack of tissues',
      'Reusable water bottle',
      'Travel-sized toiletries if flying carry-on only',
      'Lip balm and moisturiser for air-conditioned flights',
    ],
  },
  {
    label: 'In Your Hand Luggage',
    emoji: '🎒',
    items: [
      'Everything listed in Documents & Money',
      'Snacks for the journey - airports are expensive',
      'Change of clothes in case checked bags are delayed',
      'Neck pillow for long-haul flights',
      'Eye mask and earplugs',
      'Any liquids in a clear 100ml-max bag (for EU/UK flights)',
    ],
  },
]

function PackingSection() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const cat = PACKING_CATEGORIES[activeCategory]

  const toggle = (key: string) =>
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))

  const doneCount = cat.items.filter((_, i) => checked[`${activeCategory}-${i}`]).length

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Travel smarter</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            The Timms Travel packing checklist
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            Tick off as you pack. We've stripped out the fluff and kept only what actually matters.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {PACKING_CATEGORIES.map((c, i) => (
            <button
              key={c.label}
              onClick={() => setActiveCategory(i)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all border"
              style={
                i === activeCategory
                  ? { backgroundColor: '#232e4e', color: '#fff', borderColor: '#232e4e' }
                  : { backgroundColor: '#fff', color: '#232e4e', borderColor: '#e5e7eb' }
              }
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold" style={{ color: '#232e4e' }}>
              {cat.emoji} {cat.label}
            </h3>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              {doneCount}/{cat.items.length} packed
            </span>
          </div>

          <div className="space-y-3">
            {cat.items.map((item, i) => {
              const key = `${activeCategory}-${i}`
              const done = !!checked[key]
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className="w-full flex items-start gap-3 text-left group"
                >
                  <span
                    className="mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                    style={
                      done
                        ? { backgroundColor: '#03989e', borderColor: '#03989e' }
                        : { backgroundColor: '#fff', borderColor: '#d1d5db' }
                    }
                  >
                    {done && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-sm leading-relaxed transition-colors ${
                      done ? 'text-gray-300 line-through' : 'text-gray-700 group-hover:text-slate-900'
                    }`}
                  >
                    {item}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

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

  const cityDeepLink = buildExpediaDeepLink(selectedCity.city, selectedCity.country)

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden text-white py-24 px-6 text-center"
        style={{ backgroundColor: '#232e4e' }}
      >
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

          <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
            <div className="flex-1 w-full">
              <CitySearch onSelect={setSelectedCity} />
            </div>
            <PopularDestinationsDropdown />
          </div>

          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
                Hotels in {selectedCity.city}
                {selectedCity.country ? `, ${selectedCity.country}` : ''}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Curated where available - click any hotel to search on Expedia.
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
              href={cityDeepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
              style={{ backgroundColor: '#03989e' }}
            >
              View All Hotels in {selectedCity.city} on Expedia →
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
            {TOP_DESTINATIONS.map(dest => {
              const cleanCity = dest.city.replace(/\s[\p{Emoji}]+/gu, '').trim()
              const href = buildExpediaDeepLink(cleanCity, dest.country)
              return (
                <a
                  key={`${dest.city}-${dest.country}`}
                  href={href}
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
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED DESTINATION SPOTLIGHT ── */}
      <FeaturedSpotlight />

      {/* ── HOTEL TYPES EXPLAINER ── */}
      <HotelTypesSection />

      {/* ── BEST TIME TO VISIT ── */}
      <BestTimeSection />

      {/* ── PACKING CHECKLIST ── */}
      <PackingSection />

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
              Finding the right hotel should feel simple. Timms Travel is designed to help you cut through the noise and discover places to stay that genuinely suit your trip - whether you are planning a weekend break, a family holiday or a long haul adventure.
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