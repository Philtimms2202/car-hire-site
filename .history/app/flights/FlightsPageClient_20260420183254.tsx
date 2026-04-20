'use client'

import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'
import airports from '@/data/airports.json'
import NextImage from 'next/image'

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

type HaulDestination = {
  city: string
  country: string
  iata: string
  flightTime: string
  priceFrom: string
  emoji: string
}

type PopularRoute = {
  from: string
  fromIata: string
  to: string
  toIata: string
  emoji: string
  flightTime: string
  priceFrom: string
  internalSlug?: string // if set → /popular-routes/[slug], else → Kiwi tracked link
}

type FlightTip = {
  icon: string
  title: string
  body: string
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
  { city: 'New York',  iata: 'JFK', emoji: '🗽' },
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
      { city: 'Barcelona', iata: 'BCN', temp: '26–32°C', rain: 'Low',      sun: '10 hrs' },
      { city: 'Ibiza',     iata: 'IBZ', temp: '28–33°C', rain: 'Very Low', sun: '11 hrs' },
      { city: 'Antalya',   iata: 'AYT', temp: '30–36°C', rain: 'Very Low', sun: '12 hrs' },
    ],
  },
  {
    season: 'Autumn',
    emoji: '🍂',
    items: [
      { city: 'Paris',    iata: 'PAR', temp: '12–18°C', rain: 'Moderate', sun: '5 hrs' },
      { city: 'Prague',   iata: 'PRG', temp: '10–16°C', rain: 'Low',      sun: '5 hrs' },
      { city: 'Budapest', iata: 'BUD', temp: '12–18°C', rain: 'Low',      sun: '6 hrs' },
    ],
  },
  {
    season: 'Winter',
    emoji: '❄️',
    items: [
      { city: 'Dubai',      iata: 'DXB', temp: '22–28°C', rain: 'Very Low', sun: '8 hrs' },
      { city: 'Tenerife',   iata: 'TFS', temp: '18–24°C', rain: 'Low',      sun: '7 hrs' },
      { city: 'Cape Verde', iata: 'SID', temp: '24–28°C', rain: 'Low',      sun: '7 hrs' },
    ],
  },
]

// ── Haul data ────────────────────────────────────────────────────────────────
const shortHaul: HaulDestination[] = [
  { city: 'Amsterdam', country: 'Netherlands', iata: 'AMS', flightTime: '~1h 45m', priceFrom: 'From £39',  emoji: '🌷' },
  { city: 'Paris',     country: 'France',       iata: 'CDG', flightTime: '~1h 45m', priceFrom: 'From £45',  emoji: '🗼' },
  { city: 'Dublin',    country: 'Ireland',       iata: 'DUB', flightTime: '~1h 20m', priceFrom: 'From £29',  emoji: '🍀' },
  { city: 'Barcelona', country: 'Spain',         iata: 'BCN', flightTime: '~2h 15m', priceFrom: 'From £49',  emoji: '⛪' },
  { city: 'Lisbon',    country: 'Portugal',      iata: 'LIS', flightTime: '~2h 30m', priceFrom: 'From £55',  emoji: '🌊' },
  { city: 'Rome',      country: 'Italy',         iata: 'FCO', flightTime: '~2h 45m', priceFrom: 'From £59',  emoji: '🏛️' },
]

const midHaul: HaulDestination[] = [
  { city: 'Dubai',     country: 'UAE',     iata: 'DXB', flightTime: '~7h',     priceFrom: 'From £299', emoji: '🌆' },
  { city: 'New York',  country: 'USA',     iata: 'JFK', flightTime: '~8h',     priceFrom: 'From £349', emoji: '🗽' },
  { city: 'Marrakech', country: 'Morocco', iata: 'RAK', flightTime: '~3h 30m', priceFrom: 'From £89',  emoji: '🕌' },
  { city: 'Cairo',     country: 'Egypt',   iata: 'CAI', flightTime: '~5h',     priceFrom: 'From £199', emoji: '🐫' },
  { city: 'Istanbul',  country: 'Turkey',  iata: 'IST', flightTime: '~4h',     priceFrom: 'From £129', emoji: '🕍' },
  { city: 'Tenerife',  country: 'Spain',   iata: 'TFS', flightTime: '~4h 30m', priceFrom: 'From £149', emoji: '🌋' },
]

const longHaul: HaulDestination[] = [
  { city: 'Bangkok',     country: 'Thailand',     iata: 'BKK', flightTime: '~11h', priceFrom: 'From £499', emoji: '🛕' },
  { city: 'Singapore',   country: 'Singapore',    iata: 'SIN', flightTime: '~13h', priceFrom: 'From £549', emoji: '🦁' },
  { city: 'Los Angeles', country: 'USA',          iata: 'LAX', flightTime: '~11h', priceFrom: 'From £499', emoji: '🎬' },
  { city: 'Tokyo',       country: 'Japan',        iata: 'NRT', flightTime: '~12h', priceFrom: 'From £599', emoji: '🗾' },
  { city: 'Sydney',      country: 'Australia',    iata: 'SYD', flightTime: '~22h', priceFrom: 'From £799', emoji: '🦘' },
  { city: 'Cape Town',   country: 'South Africa', iata: 'CPT', flightTime: '~11h', priceFrom: 'From £549', emoji: '🌍' },
]

// ── Popular Routes ────────────────────────────────────────────────────────────
// internalSlug → /popular-routes/[slug] | no slug → Kiwi tracked link
const popularRoutes: PopularRoute[] = [
  {
    from: 'Manchester', fromIata: 'MAN',
    to: 'Dubai',        toIata: 'DXB',
    emoji: '✈️', flightTime: '~7h', priceFrom: 'From £299',
    internalSlug: '/man/dxb/manchester-to-dubai',
  },
  {
    from: 'Manchester', fromIata: 'MAN',
    to: 'New York',     toIata: 'JFK',
    emoji: '✈️', flightTime: '~8h', priceFrom: 'From £349',
    internalSlug: '/man/jfk/manchester-to-new-york',
  },
  {
    from: 'Tenerife', fromIata: 'TFS',
    to: 'Manchester',     toIata: 'MAN',
    emoji: '✈️', flightTime: '~4h 30m', priceFrom: 'From £149',
    internalSlug: '/tfs/man/tenerife-to-manchester',
  },
  {
    from: 'London', fromIata: 'LHR',
    to: 'Bangkok',  toIata: 'BKK',
    emoji: '✈️', flightTime: '~11h', priceFrom: 'From £499',
    internalSlug: '/lhr/bkk/london-to-bangkok',
  },
  {
    from: 'London',     fromIata: 'LHR',
    to: 'Barcelona',    toIata: 'BCN',
    emoji: '✈️', flightTime: '~2h 15m', priceFrom: 'From £49',
    internalSlug: '/lhr/bcn/london-to-barcelona',
  },
  {
    from: 'London',  fromIata: 'LHR',
    to: 'Paris',   toIata: 'CDG',
    emoji: '✈️', flightTime: '~00h 55m', priceFrom: 'From £449',
    internalSlug: '/lhr/cdg/london-to-paris',
  },
]

// ── Flight Tips ───────────────────────────────────────────────────────────────
const flightTips: FlightTip[] = [
  {
    icon: '📅',
    title: 'Best Time to Book',
    body: 'For European flights, aim to book 6–8 weeks in advance. For long-haul, 3–6 months ahead usually gets you the best fares. Tuesday and Wednesday departures are typically cheaper.',
  },
  {
    icon: '🧳',
    title: 'Baggage Know-How',
    body: "Always check your airline's baggage allowance before you fly. Budget carriers charge extra for hold luggage - adding it at booking is almost always cheaper than paying at the airport.",
  },
  {
    icon: '⏰',
    title: 'Arrive Early',
    body: 'UK airports recommend arriving 2 hours before a short-haul flight and 3 hours before long-haul. During peak summer periods, add an extra 30 minutes for security queues.',
  },
  {
    icon: '📱',
    title: 'Go Digital',
    body: "Download your airline's app and check in online 24–48 hours before departure. Mobile boarding passes are accepted at most airports and save you time at bag drop.",
  },
  {
    icon: '🛡️',
    title: 'Travel Insurance',
    body: 'Never fly without travel insurance. Look for policies covering cancellation, delays, medical emergencies, and lost luggage. Buy it the same day you book your flights.',
  },
  {
    icon: '💷',
    title: 'Watch for Hidden Fees',
    body: 'Low headline prices can mask seat selection fees, card surcharges, and priority boarding costs. Always check the total before committing - our search shows final prices upfront.',
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
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const findNearestAirport = (lat: number, lng: number): Airport | null => {
  let best: Airport | null = null
  let bestDist = Infinity
  for (const a of allAirports) {
    if (!a._geoloc) continue
    const d = haversine(lat, lng, a._geoloc.lat, a._geoloc.lng)
    if (d < bestDist) { bestDist = d; best = a }
  }
  return best
}

// -----------------------------
// KIWI TRACKING HELPER
// -----------------------------
const MARKER = '714930'

export const buildTrackedKiwiUrl = ({
  from, to, depart, returnDate,
  adults = 1, children = 0, infants = 0,
  cabin = 'economy', currency = 'GBP',
}: {
  from: string; to: string; depart: string; returnDate?: string
  adults?: number; children?: number; infants?: number
  cabin?: string; currency?: string
}): string => {
  const kiwiDeep = new URL('https://www.kiwi.com/deep')
  kiwiDeep.searchParams.set('from', from)
  kiwiDeep.searchParams.set('to', to)
  kiwiDeep.searchParams.set('departure', depart)
  if (returnDate) kiwiDeep.searchParams.set('return', returnDate)
  kiwiDeep.searchParams.set('adults', adults.toString())
  kiwiDeep.searchParams.set('children', children.toString())
  kiwiDeep.searchParams.set('infants', infants.toString())
  kiwiDeep.searchParams.set('cabinClass', cabin)
  kiwiDeep.searchParams.set('currency', currency)
  kiwiDeep.searchParams.set('lang', 'en')

  const tracked = new URL('https://c111.travelpayouts.com/click')
  tracked.searchParams.set('shmarker', MARKER)
  tracked.searchParams.set('promo_id', '3791')
  tracked.searchParams.set('source_type', 'customlink')
  tracked.searchParams.set('type', 'click')
  tracked.searchParams.set('custom_url', kiwiDeep.toString())

  return tracked.toString()
}

const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Haul badge / colour tokens
const haulStyles = {
  short: { badge: 'bg-emerald-100 text-emerald-700', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  mid:   { badge: 'bg-blue-100   text-blue-700',    pill: 'bg-blue-50   text-blue-700   border-blue-200'   },
  long:  { badge: 'bg-purple-100 text-purple-700',  pill: 'bg-purple-50 text-purple-700 border-purple-200' },
}

// -----------------------------
// AIRPORT DROPDOWN (shared)
// -----------------------------
function AirportDropdown({
  originInput, setOriginInput,
  open, setOpen,
  filteredAirports,
  geoLoading, geoError,
  useMyLocation,
  setOriginAirport,
}: {
  originInput: string
  setOriginInput: (v: string) => void
  open: boolean
  setOpen: (v: boolean) => void
  filteredAirports: Airport[]
  geoLoading: boolean
  geoError: string | null
  useMyLocation: () => void
  setOriginAirport: (a: Airport) => void
}) {
  return (
    <div className="max-w-md mx-auto mb-10 text-left">
      <label className="block text-sm text-gray-700 mb-2">Your departure airport</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Enter airport or use my location"
          className="px-4 py-2 w-full rounded-lg border border-gray-300 shadow-sm text-black bg-white"
          value={originInput}
          onChange={e => { setOriginInput(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        {open && (
          <div className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 max-h-80 overflow-y-auto w-full text-black">
            <button
              type="button"
              onClick={useMyLocation}
              className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 flex items-center justify-between"
            >
              <span className="font-semibold">
                {geoLoading ? 'Detecting your nearest airport…' : 'Use my location'}
              </span>
              <span className="text-xs text-gray-500">{geoError ?? 'Find the closest airport to you'}</span>
            </button>
            {filteredAirports.map(a => (
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
                  <span className="font-semibold text-gray-900">{a.city}, {a.country}</span>
                  <span className="text-blue-600 font-bold">{a.iata_code}</span>
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
  )
}

// -----------------------------
// PAGE COMPONENT
// -----------------------------
export default function FlightsPageClient() {
  const [activeTab, setActiveTab]           = useState<'flights' | 'hotels' | 'experiences' | 'cars'>('flights')
  const [originAirport, setOriginAirport]   = useState<Airport | null>(null)
  const [originInput, setOriginInput]       = useState('')
  const [open, setOpen]                     = useState(false)
  const [geoLoading, setGeoLoading]         = useState(false)
  const [geoError, setGeoError]             = useState<string | null>(null)
  const [activeHaul, setActiveHaul]         = useState<'short' | 'mid' | 'long'>('short')

  // Car hire state (passed through to CarSearch)
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate]         = useState('')
  const [dropoffDate, setDropoffDate]       = useState('')
  const [loading, setLoading]               = useState(false)
  const handleCarSearch = () => {}

  // Default origin: MAN
  useEffect(() => {
    const man = allAirports.find(a => a.iata_code === 'MAN')
    if (man) {
      setOriginAirport(man)
      setOriginInput(`${man.city} (${man.iata_code})`)
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
    if (!navigator.geolocation) { setGeoError('Location not supported.'); return }
    setGeoLoading(true)
    setGeoError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const nearest = findNearestAirport(pos.coords.latitude, pos.coords.longitude)
        setGeoLoading(false)
        if (nearest) {
          setOriginAirport(nearest)
          setOriginInput(`${nearest.city} (${nearest.iata_code})`)
          setOpen(false)
        } else {
          setGeoError('No nearby airport found.')
        }
      },
      () => { setGeoLoading(false); setGeoError('Unable to access location.') }
    )
  }

  // Kiwi link for haul/featured/seasonal cards (uses detected origin)
  const openRoute = (destIata: string) => {
    if (!originAirport) { alert('Choose a departure airport first.'); return }
    const url = buildTrackedKiwiUrl({
      from: originAirport.iata_code,
      to: destIata,
      depart: todayStr(),
      adults: 1,
      currency: 'GBP',
    })
    window.open(url, '_blank')
  }

  // Popular routes: internal page OR Kiwi
  const openPopularRoute = (route: PopularRoute) => {
    if (route.internalSlug) {
      window.location.href = `/flights/${route.internalSlug}`
    } else {
      const url = buildTrackedKiwiUrl({
        from: route.fromIata,
        to: route.toIata,
        depart: todayStr(),
        adults: 1,
        currency: 'GBP',
      })
      window.open(url, '_blank')
    }
  }

  const haulData   = activeHaul === 'short' ? shortHaul : activeHaul === 'mid' ? midHaul : longHaul
  const haulColour = haulStyles[activeHaul]

  const dropdownProps = {
    originInput, setOriginInput,
    open, setOpen,
    filteredAirports,
    geoLoading, geoError,
    useMyLocation,
    setOriginAirport,
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

{/* ── HERO ─────────────────────────────────────────────────────────────── */}
<section className="relative overflow-hidden text-white py-24 px-6 text-center">
  {/* Unsplash background image */}
  <NextImage
    src="https://images.unsplash.com/photo-1532364158125-02d75a0f7fb9?q=80&w=1548"
    alt="Airplane wing above the clouds"
    fill
    className="object-cover object-[center_30%]"
    priority
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-[#232e4e]/75 z-0" />

  <div className="relative z-10 max-w-3xl mx-auto">
    <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
      Timms Travel
    </p>
    <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
      Compare Flights Worldwide
    </h1>
    <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-10">
      Choose from hundreds of destinations around the world.
    </p>

    {/* Search tabs */}
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

          {/* Search widget */}
          <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
            {activeTab === 'flights'     && <FlightSearch />}
            {activeTab === 'hotels'      && <HotelSearch />}
            {activeTab === 'experiences' && <ExperienceSearch />}
            {activeTab === 'cars'        && (
              <CarSearch
                pickupLocation={pickupLocation}
                pickupDate={pickupDate}
                dropoffDate={dropoffDate}
                setPickupLocation={setPickupLocation}
                setPickupDate={setPickupDate}
                setDropoffDate={setDropoffDate}
                loading={loading}
                onSearch={handleCarSearch}
              />
            )}
          </div>

          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
            <span>Fully Bespoke Offers</span>
            <span>No hidden fees</span>
            <span>Competitive price guarantee</span>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#1a2540' }} className="py-6 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
          {[
            { label: 'Destinations',       value: '700+' },
            { label: 'Airlines Compared',  value: '500+' },
            { label: 'UK Routes',          value: '1,200+' },
            { label: 'Price Guarantee',    value: '✓' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-teal-400">{stat.value}</p>
              <p className="text-sm text-gray-300 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHORT / MID / LONG HAUL ──────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Find Your Ideal Flight
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Browse by flight duration - from quick European hops to epic long-haul adventures.
          </p>

          {/* Haul toggle */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(['short', 'mid', 'long'] as const).map(h => (
              <button
                key={h}
                onClick={() => setActiveHaul(h)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all border ${
                  activeHaul === h
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
                style={activeHaul === h ? { backgroundColor: '#232e4e' } : {}}
              >
                {h === 'short' ? '🛫 Short-Haul (up to 3h)' : h === 'mid' ? '✈️ Mid-Haul (3–9h)' : '🌍 Long-Haul (9h+)'}
              </button>
            ))}
          </div>

          {/* Haul description */}
          <div className={`rounded-2xl p-4 mb-8 text-sm font-medium text-center border ${haulColour.pill}`}>
            {activeHaul === 'short' && 'Perfect for a quick city break or weekend getaway - no need to pack heavy!'}
            {activeHaul === 'mid'   && 'Long enough to explore somewhere truly different, short enough to skip the jet lag.'}
            {activeHaul === 'long'  && 'Epic adventures await - bucket-list destinations that are absolutely worth the journey.'}
          </div>

          {/* Airport selector */}
          <AirportDropdown {...dropdownProps} />

          {/* Haul destination cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {haulData.map(dest => (
              <div
                key={dest.iata}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{dest.emoji}</span>
                    <div>
                      <p className="font-bold text-lg leading-tight" style={{ color: '#232e4e' }}>{dest.city}</p>
                      <p className="text-xs text-gray-400">{dest.country}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${haulColour.badge}`}>
                    {dest.flightTime}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{dest.priceFrom} per person</p>
                <button
                  type="button"
                  onClick={() => openRoute(dest.iata)}
                  className="text-blue-600 font-semibold hover:underline disabled:opacity-60 text-sm"
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

      {/* ── POPULAR ROUTES ────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Popular Routes
          </h2>
          <p className="text-center text-gray-500 mb-10">
            The routes our travellers love most - with full guides, tips, and live prices.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition group"
              >
                {/* IATA pill headers */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-lg text-white"
                    style={{ backgroundColor: '#232e4e' }}
                  >
                    {route.fromIata}
                  </span>
                  <span className="text-gray-400 text-lg">→</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-lg bg-teal-500 text-white">
                    {route.toIata}
                  </span>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full font-medium
                    bg-gray-100 text-gray-500">
                    {route.internalSlug ? 'Full guide' : 'Live prices'}
                  </span>
                </div>

                <p className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>
                  {route.from} → {route.to}
                </p>
                <div className="flex gap-4 text-sm text-gray-500 mb-5">
                  <span>⏱ {route.flightTime}</span>
                  <span>💷 {route.priceFrom}</span>
                </div>

                <button
                  type="button"
                  onClick={() => openPopularRoute(route)}
                  className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#232e4e' }}
                >
                  {route.internalSlug ? 'View Route Guide →' : 'Search Live Flights →'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DESTINATIONS ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Featured Destinations
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Hand-picked favourites - tap to search live flights from your nearest airport.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map(dest => (
              <div key={dest.iata} className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{dest.emoji}</span>
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#232e4e' }}>{dest.city}</p>
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

      {/* ── DESTINATIONS BY SEASON ───────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Destinations by Season
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Find the perfect place to fly depending on the time of year.
          </p>

          {seasonalBlocks.map(({ season, emoji, items }) => (
            <div key={season} className="mb-14">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#232e4e' }}>
                <span>{emoji}</span> {season}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(dest => (
                  <div
                    key={dest.iata}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                  >
                    <p className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>{dest.city}</p>
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

      {/* ── FLIGHT TIPS ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ backgroundColor: '#f0f4ff' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Flight Tips &amp; Advice
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Everything you need to know before you fly - from booking to boarding.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flightTips.map(tip => (
              <div
                key={tip.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100"
              >
                <div className="text-3xl mb-3">{tip.icon}</div>
                <p className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>{tip.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
      <section
        className="py-16 px-6 text-center text-white"
        style={{ backgroundColor: '#232e4e' }}
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to take off?</h2>
          <p className="text-gray-300 mb-8">
            Use our search above to compare hundreds of airlines and find the best price for your next adventure.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: '#2dd4bf', color: '#232e4e' }}
          >
            Search Flights Now →
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}