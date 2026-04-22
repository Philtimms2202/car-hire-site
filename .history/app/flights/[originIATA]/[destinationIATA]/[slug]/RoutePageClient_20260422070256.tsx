'use client'

import { useState, useMemo } from 'react'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type City = {
  name: string
  slug: { current: string }
  country: {
    name: string
    slug: { current: string }
  }
  heroDescription?: string | null
  metaDescription?: string | null
  primaryIATA?: string | null
  alternateIATAs?: string[] | null
  emoji?: string | null
  latitude?: number | null
  longitude?: number | null
}

type Props = {
  originIATA: string
  destinationIATA: string
  slug: string
  origin: any
  destination: any
  sanityCities: any[]
  flightInfo: {
    distanceKm: number
    timeHours: number
    durationLabel: string
  } | null
}

// ─────────────────────────────────────────────
// IATA → City name lookup
// ─────────────────────────────────────────────
const IATA_CITIES: Record<string, { city: string; country: string }> = {
  // UK & Ireland
  LHR: { city: 'London', country: 'United Kingdom' },
  LGW: { city: 'London', country: 'United Kingdom' },
  STN: { city: 'London', country: 'United Kingdom' },
  LTN: { city: 'London', country: 'United Kingdom' },
  MAN: { city: 'Manchester', country: 'United Kingdom' },
  EDI: { city: 'Edinburgh', country: 'United Kingdom' },
  BHX: { city: 'Birmingham', country: 'United Kingdom' },
  GLA: { city: 'Glasgow', country: 'United Kingdom' },
  BRS: { city: 'Bristol', country: 'United Kingdom' },
  LBA: { city: 'Leeds', country: 'United Kingdom' },
  NCL: { city: 'Newcastle', country: 'United Kingdom' },
  DUB: { city: 'Dublin', country: 'Ireland' },
  // Europe
  CDG: { city: 'Paris', country: 'France' },
  ORY: { city: 'Paris', country: 'France' },
  AMS: { city: 'Amsterdam', country: 'Netherlands' },
  BCN: { city: 'Barcelona', country: 'Spain' },
  MAD: { city: 'Madrid', country: 'Spain' },
  PMI: { city: 'Mallorca', country: 'Spain' },
  IBZ: { city: 'Ibiza', country: 'Spain' },
  AGP: { city: 'Málaga', country: 'Spain' },
  ALC: { city: 'Alicante', country: 'Spain' },
  FCO: { city: 'Rome', country: 'Italy' },
  MXP: { city: 'Milan', country: 'Italy' },
  VCE: { city: 'Venice', country: 'Italy' },
  NAP: { city: 'Naples', country: 'Italy' },
  FRA: { city: 'Frankfurt', country: 'Germany' },
  MUC: { city: 'Munich', country: 'Germany' },
  BER: { city: 'Berlin', country: 'Germany' },
  VIE: { city: 'Vienna', country: 'Austria' },
  ZRH: { city: 'Zurich', country: 'Switzerland' },
  GVA: { city: 'Geneva', country: 'Switzerland' },
  BRU: { city: 'Brussels', country: 'Belgium' },
  CPH: { city: 'Copenhagen', country: 'Denmark' },
  OSL: { city: 'Oslo', country: 'Norway' },
  ARN: { city: 'Stockholm', country: 'Sweden' },
  HEL: { city: 'Helsinki', country: 'Finland' },
  LIS: { city: 'Lisbon', country: 'Portugal' },
  OPO: { city: 'Porto', country: 'Portugal' },
  FAO: { city: 'Faro', country: 'Portugal' },
  ATH: { city: 'Athens', country: 'Greece' },
  HER: { city: 'Heraklion', country: 'Greece' },
  RHO: { city: 'Rhodes', country: 'Greece' },
  PRG: { city: 'Prague', country: 'Czech Republic' },
  BUD: { city: 'Budapest', country: 'Hungary' },
  WAW: { city: 'Warsaw', country: 'Poland' },
  KRK: { city: 'Krakow', country: 'Poland' },
  AYT: { city: 'Antalya', country: 'Turkey' },
  IST: { city: 'Istanbul', country: 'Turkey' },
  SAW: { city: 'Istanbul', country: 'Turkey' },
  TFS: { city: 'Tenerife', country: 'Spain' },
  // Middle East & Africa
  DXB: { city: 'Dubai', country: 'UAE' },
  AUH: { city: 'Abu Dhabi', country: 'UAE' },
  DOH: { city: 'Doha', country: 'Qatar' },
  AMM: { city: 'Amman', country: 'Jordan' },
  CAI: { city: 'Cairo', country: 'Egypt' },
  HRG: { city: 'Hurghada', country: 'Egypt' },
  SSH: { city: 'Sharm el-Sheikh', country: 'Egypt' },
  CMN: { city: 'Casablanca', country: 'Morocco' },
  RAK: { city: 'Marrakech', country: 'Morocco' },
  CPT: { city: 'Cape Town', country: 'South Africa' },
  JNB: { city: 'Johannesburg', country: 'South Africa' },
  SID: { city: 'Cape Verde', country: 'Cape Verde' },
  // Americas
  JFK: { city: 'New York', country: 'USA' },
  EWR: { city: 'New York', country: 'USA' },
  LAX: { city: 'Los Angeles', country: 'USA' },
  MCO: { city: 'Orlando', country: 'USA' },
  MIA: { city: 'Miami', country: 'USA' },
  ORD: { city: 'Chicago', country: 'USA' },
  SFO: { city: 'San Francisco', country: 'USA' },
  LAS: { city: 'Las Vegas', country: 'USA' },
  BOS: { city: 'Boston', country: 'USA' },
  YYZ: { city: 'Toronto', country: 'Canada' },
  YVR: { city: 'Vancouver', country: 'Canada' },
  CUN: { city: 'Cancún', country: 'Mexico' },
  GRU: { city: 'São Paulo', country: 'Brazil' },
  GIG: { city: 'Rio de Janeiro', country: 'Brazil' },
  EZE: { city: 'Buenos Aires', country: 'Argentina' },
  // Asia & Pacific
  BKK: { city: 'Bangkok', country: 'Thailand' },
  HKT: { city: 'Phuket', country: 'Thailand' },
  CNX: { city: 'Chiang Mai', country: 'Thailand' },
  SIN: { city: 'Singapore', country: 'Singapore' },
  KUL: { city: 'Kuala Lumpur', country: 'Malaysia' },
  HKG: { city: 'Hong Kong', country: 'Hong Kong' },
  NRT: { city: 'Tokyo', country: 'Japan' },
  HND: { city: 'Tokyo', country: 'Japan' },
  OSA: { city: 'Osaka', country: 'Japan' },
  ICN: { city: 'Seoul', country: 'South Korea' },
  DEL: { city: 'Delhi', country: 'India' },
  BOM: { city: 'Mumbai', country: 'India' },
  MAA: { city: 'Chennai', country: 'India' },
  COK: { city: 'Kochi', country: 'India' },
  CGK: { city: 'Jakarta', country: 'Indonesia' },
  DPS: { city: 'Bali', country: 'Indonesia' },
  MNL: { city: 'Manila', country: 'Philippines' },
  SGN: { city: 'Ho Chi Minh City', country: 'Vietnam' },
  HAN: { city: 'Hanoi', country: 'Vietnam' },
  PNH: { city: 'Phnom Penh', country: 'Cambodia' },
  REP: { city: 'Siem Reap', country: 'Cambodia' },
  SYD: { city: 'Sydney', country: 'Australia' },
  MEL: { city: 'Melbourne', country: 'Australia' },
  BNE: { city: 'Brisbane', country: 'Australia' },
  AKL: { city: 'Auckland', country: 'New Zealand' },
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function resolveCityName(iata: string, sanityCity: City | null): string {
  if (sanityCity?.name) return sanityCity.name
  return IATA_CITIES[iata.toUpperCase()]?.city ?? iata.toUpperCase()
}

function resolveCountryName(iata: string, sanityCity: City | null): string | undefined {
  if (sanityCity?.country?.name) return sanityCity.country.name
  return IATA_CITIES[iata.toUpperCase()]?.country
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0
  }
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const x = Math.sin(h + i) * 10000
    const r = Math.floor((x - Math.floor(x)) * (i + 1))
    ;[arr[i], arr[r]] = [arr[r], arr[i]]
  }
  return arr
}

// ─────────────────────────────────────────────
// WHITELABEL DEEP LINK BUILDER
// Sends users directly to flights.timmstravel.com
// with pre-filled route and tracking marker
// ─────────────────────────────────────────────

const MARKER = '714930'
const WHITELABEL_BASE = 'https://flights.timmstravel.com'

function buildWhitelabelUrl({
  from,
  to,
  depart,
  returnDate,
  adults = 1,
  children = 0,
  infants = 0,
  cabin = 0, // 0=economy, 1=business, 2=first
}: {
  from: string
  to: string
  depart: string
  returnDate?: string
  adults?: number
  children?: number
  infants?: number
  cabin?: number
}): string {
  const url = new URL(`${WHITELABEL_BASE}/flights/`)
  
  // Tracking — must come first
  url.searchParams.set('marker', MARKER)
  
  // Route
  url.searchParams.set('origin_iata', from)
  url.searchParams.set('destination_iata', to)
  
  // Dates
  url.searchParams.set('depart_date', depart)
  if (returnDate) url.searchParams.set('return_date', returnDate)
  
  // Passengers
  url.searchParams.set('adults', adults.toString())
  if (children > 0) url.searchParams.set('children', children.toString())
  if (infants > 0) url.searchParams.set('infants', infants.toString())
  
  // Cabin class (0=economy, 1=business, 2=first)
  url.searchParams.set('trip_class', cabin.toString())

  return url.toString()
}

// Get today's date in YYYY-MM-DD
function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ─────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────

const ROUTE_FACTS: {
  icon: string
  label: string
  getValue: (o: string, d: string) => string
}[] = [
  { icon: '✈️', label: 'Typical flight time',  getValue: () => 'Varies by airline & route' },
  { icon: '💺', label: 'Cabin classes',         getValue: () => 'Economy · Business · First' },
  { icon: '🤝', label: 'Booking partner',       getValue: () => 'Compare From All Trusted Partners' },
  { icon: '🔁', label: 'Trip types',            getValue: () => 'One-way · Return · Multi-city' },
]

const TRAVEL_TIPS = [
  {
    icon: '📅',
    title: 'Book early for best prices',
    body: 'Flights typically get cheaper 6–8 weeks before departure. For peak summer routes, book 3–4 months ahead.',
  },
  {
    icon: '🧳',
    title: 'Check baggage allowances',
    body: "Budget airlines often charge extra for hold luggage. Always check what's included before you book.",
  },
  {
    icon: '🔔',
    title: 'Set a price alert',
    body: 'Prices fluctuate daily. Use Kiwi.com price alerts to get notified when fares drop on this route.',
  },
  {
    icon: '🛂',
    title: 'Check visa requirements',
    body: "Entry rules vary by nationality. Always verify requirements with your destination country's embassy.",
  },
]

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function SearchBox({
  originIATA,
  destinationIATA,
  originName,
  destinationName,
}: {
  originIATA: string
  destinationIATA: string
  originName: string
  destinationName: string
}) {
  // Whitelabel Search
const handleSearch = () => {
  const url = buildWhitelabelUrl({
    from: originIATA,
    to: destinationIATA,
    depart: daysFromToday(30),
    adults: 1,
    cabin: 'economy',
  })
  window.open(url, '_blank')
}

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
            From
          </label>
          <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-semibold text-lg">
            {originName}
            <span className="ml-2 text-sm font-mono text-gray-400">{originIATA}</span>
          </div>
        </div>

        <div className="text-2xl text-gray-400 mt-4 sm:mt-0 select-none">⇄</div>

        <div className="flex-1 w-full">
          <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
            To
          </label>
          <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-semibold text-lg">
            {destinationName}
            <span className="ml-2 text-sm font-mono text-gray-400">{destinationIATA}</span>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col gap-2 shrink-0">
          <button
            onClick={handleSearch}
            className="px-8 py-3 rounded-xl text-white font-bold text-lg transition hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: '#03989e' }}
          >
            Search Flights →
          </button>
          <a
            href="/flights"
            className="px-8 py-2 rounded-xl font-semibold text-sm text-center transition border whitespace-nowrap hover:bg-gray-50"
            style={{ borderColor: '#03989e', color: '#03989e' }}
          >
            Search a different route
          </a>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        · Prices updated in real time · No hidden fees
      </p>
    </div>
  )
}

function RouteInfoStrip({
  originIATA,
  destinationIATA,
}: {
  originIATA: string
  destinationIATA: string
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
      {ROUTE_FACTS.map(({ icon, label, getValue }) => (
        <div
          key={label}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center"
        >
          <div className="text-3xl mb-2">{icon}</div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{label}</p>
          <p className="font-semibold text-gray-800 text-sm">
            {getValue(originIATA, destinationIATA)}
          </p>
        </div>
      ))}
    </div>
  )
}

function PopularRoutesGrid({
  originIATA,
  destinationName,
  sanityCities,
}: {
  originIATA: string
  destinationName: string
  sanityCities: any[]
}) {
  const seed = `${originIATA}-${destinationName}`

  const routes = useMemo(() => {
    const baseRoutes = sanityCities
      .filter((c) => c.primaryIATA !== originIATA)
      .map((c) => ({
        city: c.cityName,
        country: c.countryName,
        iata: c.primaryIATA,
        emoji: c.emoji ?? '✈️',
      }))
    return seededShuffle(baseRoutes, seed).slice(0, 6)
  }, [sanityCities, originIATA, seed])

  // Now synchronous — open directly, no async needed
  const handleClick = (destIata: string) => {
    const url = buildTrackedKiwiUrl({
      from: originIATA,
      to: destIata,
      depart: todayStr(),
      adults: 1,
      currency: 'GBP',
    })
    window.open(url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {routes.map((route) => (
        <div
          key={route.iata}
          className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-shadow border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{route.emoji}</span>
            <div>
              <p className="font-bold text-lg" style={{ color: '#232e4e' }}>{route.city}</p>
              <p className="text-xs text-gray-400">{route.country}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{originIATA}</span>
            <span>→</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{route.iata}</span>
          </div>

          <button
            onClick={() => handleClick(route.iata)}
            className="w-full py-2 rounded-xl text-white font-semibold text-sm transition hover:opacity-90"
            style={{ backgroundColor: '#232e4e' }}
          >
            Search flights from {originIATA} →
          </button>
        </div>
      ))}
    </div>
  )
}

function TravelTips() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {TRAVEL_TIPS.map((tip) => (
        <div
          key={tip.title}
          className="flex gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <span className="text-3xl shrink-0">{tip.icon}</span>
          <div>
            <p className="font-bold text-gray-800 mb-1">{tip.title}</p>
            <p className="text-sm text-gray-500 leading-relaxed">{tip.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function SeoTextBlock({
  originName,
  destinationName,
  originCountry,
  destinationCountry,
  destinationDescription,
}: {
  originName: string
  destinationName: string
  originCountry?: string
  destinationCountry?: string
  destinationDescription?: string | null
}) {
  return (
    <div className="max-w-3xl mx-auto text-gray-600 leading-relaxed space-y-4">
      {destinationDescription ? (
        <p>{destinationDescription}</p>
      ) : (
        <p>
          Looking for cheap flights from {originName} to {destinationName}? You're
          in the right place. Timms Travel compares hundreds of airlines and booking
          options to find you the best prices on flights from {originName}
          {originCountry ? `, ${originCountry}` : ''} to {destinationName}
          {destinationCountry ? `, ${destinationCountry}` : ''} with no hidden fees
          and no price mark-ups.
        </p>
      )}
      <p>
        Whether you're travelling for a weekend break, a long-haul adventure, or a
        business trip, our search pulls together real-time fares so you can compare
        and book in minutes. We partner with Kiwi.com to bring you flexible ticket
        options including one-way, return, and multi-city routes on this popular
        flight corridor.
      </p>
      <p>
        Prices on the {originName} to {destinationName} route vary throughout the
        year. To find the best deal, try adjusting your travel dates by a day or
        two — even small changes can significantly lower the fare. Use the search
        above to explore all available options.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function RoutePageClient({
  originIATA,
  destinationIATA,
  slug,
  origin,
  destination,
  sanityCities,
  flightInfo={flightInfo}
}: Props) {
  const originName = resolveCityName(originIATA, origin)
  const destinationName = resolveCityName(destinationIATA, destination)
  const originCountry = resolveCountryName(originIATA, origin)
  const destinationCountry = resolveCountryName(destinationIATA, destination)
  const routeLabel = `${originName} → ${destinationName}`

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        <nav className="flex justify-center gap-2 text-sm mb-6 text-gray-400">
          <a href="/" className="hover:text-white transition">Home</a>
          <span>/</span>
          <a href="/flights" className="hover:text-white transition">Flights</a>
          <span>/</span>
          <span className="text-white">{routeLabel}</span>
        </nav>

        <p className="text-sm uppercase tracking-widest mb-3 font-semibold" style={{ color: '#03989e' }}>
          Cheap Flights
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          Cheap Flights from {originName} to {destinationName}
        </h1>

        {originCountry && destinationCountry && (
          <p className="text-lg text-gray-300 mb-2">
            {originCountry} → {destinationCountry}
          </p>
        )}

        <p className="text-gray-400 mb-10 max-w-xl mx-auto">
          Compare airlines, dates and prices in seconds. Book securely with Kiwi.com.
        </p>

        <SearchBox
          originIATA={originIATA}
          destinationIATA={destinationIATA}
          originName={originName}
          destinationName={destinationName}
        />
      </section>

    
           {/* FLIGHT TIMES */}
<section className="py-16 px-6 bg-gray-50">
  <div className="max-w-5xl mx-auto">
    <h2
      className="text-3xl font-bold text-center mb-2"
      style={{ color: '#232e4e' }}
    >
      Flight Time from {originName} to {destinationName}
    </h2>

    <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
      Here’s a quick look at the key details for your journey from {originName} to {destinationName}. 
      These estimates are based on typical commercial jet speeds and great‑circle routing.
    </p>

    {/* VISUAL CARD */}
    <div className="bg-white shadow-md rounded-xl p-8 flex flex-col md:flex-row items-center gap-10">
      
      {/* ICON / VISUAL */}
      <div className="flex-shrink-0">
        <div className="w-28 h-28 bg-[#232e4e] rounded-full flex items-center justify-center">
          <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 16l20-5-20-5 5 5-5 5z"
          />
        </svg>

        </div>
      </div>

      {/* TEXTUAL FACTS */}
      <div className="flex-1">
        <ul className="space-y-4 text-lg text-gray-700">
          <li>
            <strong className="font-semibold text-[#232e4e]">Distance:</strong>{' '}
            {Math.round(flightInfo?.distanceKm || 0).toLocaleString()} km
          </li>
          <li>
            <strong className="font-semibold text-[#232e4e]">Typical Flight Time:</strong>{' '}
            {flightInfo?.durationLabel}
          </li>
          <li>
            <strong className="font-semibold text-[#232e4e]">Route Type:</strong>{' '}
            {flightInfo?.distanceKm && flightInfo.distanceKm > 3500
              ? 'Long‑haul'
              : flightInfo?.distanceKm && flightInfo.distanceKm > 1500
              ? 'Medium‑haul'
              : 'Short‑haul'}
          </li>
        </ul>

        <p className="mt-6 text-gray-600 leading-relaxed">
          These figures are based on direct, great‑circle routing, the shortest path between two 
          points on the globe. Actual flight times may vary depending on winds, aircraft type, and 
          air‑traffic conditions, but this gives you a reliable benchmark for planning your trip.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* SEO CONTENT */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#232e4e' }}>
            Flights from {originName} to {destinationName}
          </h2>
          <SeoTextBlock
            originName={originName}
            destinationName={destinationName}
            originCountry={originCountry}
            destinationCountry={destinationCountry}
            destinationDescription={destination?.heroDescription}
          />
        </div>
      </section>

      {/* POPULAR ROUTES FROM ORIGIN */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            More Popular Flights from {originName}
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Explore other top routes departing from {originName}
          </p>
          <PopularRoutesGrid
            originIATA={originIATA}
            destinationName={destinationName}
            sanityCities={sanityCities}
          />
        </div>
      </section>

      {/* TRAVEL TIPS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Travel Tips for This Route
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Make the most of your {originName} to {destinationName} flight
          </p>
          <TravelTips />
        </div>
      </section>

{/* ROUTE INFO STRIP */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#232e4e' }}>
            About This Route
          </h2>
          <RouteInfoStrip originIATA={originIATA} destinationIATA={destinationIATA} />
        </div>
      </section>

       {/* FINAL CTA */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="py-16 px-6 text-center text-white"
      >
        <p className="text-sm uppercase tracking-widest mb-3 font-semibold" style={{ color: '#03989e' }}>
          Ready to fly?
        </p>
        <h2 className="text-3xl font-bold mb-4">
          Find the Best Price on This Route Today
        </h2>
        <p className="text-gray-300 mb-8 max-w-lg mx-auto">
          Hundreds of airlines compared instantly. No mark-ups, no hidden fees.
        </p>
        <SearchBox
          originIATA={originIATA}
          destinationIATA={destinationIATA}
          originName={originName}
          destinationName={destinationName}
        />
      </section>

      <Footer />
    </main>
  )
}