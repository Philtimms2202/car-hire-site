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
  origin: City | null
  destination: City | null
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

// simple deterministic seeded shuffle (no extra deps)
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
// STATIC DATA
// ─────────────────────────────────────────────

const POPULAR_ONWARD: Record<
  string,
  { iata: string; city: string; country: string; emoji: string }[]
> = {
  LHR: [
    { iata: 'DXB', city: 'Dubai', country: 'UAE', emoji: '🌆' },
    { iata: 'JFK', city: 'New York', country: 'USA', emoji: '🗽' },
    { iata: 'BCN', city: 'Barcelona', country: 'Spain', emoji: '⛪' },
    { iata: 'BKK', city: 'Bangkok', country: 'Thailand', emoji: '🛕' },
    { iata: 'SYD', city: 'Sydney', country: 'Australia', emoji: '🦘' },
    { iata: 'CDG', city: 'Paris', country: 'France', emoji: '🗼' },
  ],
  MAN: [
    { iata: 'DXB', city: 'Dubai', country: 'UAE', emoji: '🌆' },
    { iata: 'BCN', city: 'Barcelona', country: 'Spain', emoji: '⛪' },
    { iata: 'AYT', city: 'Antalya', country: 'Turkey', emoji: '🏖️' },
    { iata: 'LIS', city: 'Lisbon', country: 'Portugal', emoji: '🏛️' },
    { iata: 'PMI', city: 'Mallorca', country: 'Spain', emoji: '🌴' },
    { iata: 'FAO', city: 'Faro', country: 'Portugal', emoji: '☀️' },
  ],
  DEFAULT: [
    { iata: 'DXB', city: 'Dubai', country: 'UAE', emoji: '🌆' },
    { iata: 'BCN', city: 'Barcelona', country: 'Spain', emoji: '⛪' },
    { iata: 'JFK', city: 'New York', country: 'USA', emoji: '🗽' },
    { iata: 'BKK', city: 'Bangkok', country: 'Thailand', emoji: '🛕' },
    { iata: 'CDG', city: 'Paris', country: 'France', emoji: '🗼' },
    { iata: 'AMS', city: 'Amsterdam', country: 'Netherlands', emoji: '🌷' },
  ],
}

const ROUTE_FACTS: {
  icon: string
  label: string
  getValue: (o: string, d: string) => string
}[] = [
  {
    icon: '✈️',
    label: 'Typical flight time',
    getValue: () => 'Varies by airline & route',
  },
  {
    icon: '💺',
    label: 'Cabin classes',
    getValue: () => 'Economy · Business · First',
  },
  {
    icon: '🤝',
    label: 'Booking partner',
    getValue: () => 'Kiwi.com - compare & book',
  },
  {
    icon: '🔁',
    label: 'Trip types',
    getValue: () => 'One-way · Return · Multi-city',
  },
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
    body: 'Entry rules vary by nationality. Always verify requirements with your destination countries embassy.',
  },
]

// ─────────────────────────────────────────────
// KIWI DEEP LINK BUILDER
// ─────────────────────────────────────────────

const AFFIL_ID =
  'travelpayoutsdeeplink_timmstravel.com_6bc7301798224d1cad7e3f320-714930'

const fetchKiwiSlug = async (iata: string): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://api.skypicker.com/locations?term=${encodeURIComponent(
        iata
      )}&locale=en-US&location_types=airport&limit=1`
    )
    const data = await res.json()
    return data.locations?.[0]?.slug || null
  } catch {
    return null
  }
}

const buildKiwiUrl = async (origin: string, dest: string): Promise<string> => {
  const [oSlug, dSlug] = await Promise.all([
    fetchKiwiSlug(origin),
    fetchKiwiSlug(dest),
  ])
  if (!oSlug || !dSlug)
    return `https://www.kiwi.com/en/search/results/${origin}/${dest}?affilid=${AFFIL_ID}`

  const today = new Date()
  const depart = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const url = new URL(
    `https://www.kiwi.com/en/search/results/${oSlug}/${dSlug}/${depart}`
  )
  url.searchParams.set('affilid', AFFIL_ID)
  url.searchParams.set('adults', '1')
  url.searchParams.set('cabinClass', 'economy')
  return url.toString()
}

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
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    const url = await buildKiwiUrl(originIATA, destinationIATA)
    setLoading(false)
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
            <span className="ml-2 text-sm font-mono text-gray-400">
              {originIATA}
            </span>
          </div>
        </div>

        <div className="text-2xl text-gray-400 mt-4 sm:mt-0 select-none">
          ⇄
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">
            To
          </label>
          <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-semibold text-lg">
            {destinationName}
            <span className="ml-2 text-sm font-mono text-gray-400">
              {destinationIATA}
            </span>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-col gap-2 shrink-0">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-3 rounded-xl text-white font-bold text-lg transition hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
            style={{ backgroundColor: '#03989e' }}
          >
            {loading ? 'Loading…' : 'Search Flights →'}
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
        Powered by Kiwi.com · Prices updated in real time · No hidden fees
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
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
            {label}
          </p>
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
}: {
  originIATA: string
  destinationName: string
}) {
  const [loadingIata, setLoadingIata] = useState<string | null>(null)

  const baseRoutes = POPULAR_ONWARD[originIATA] ?? POPULAR_ONWARD.DEFAULT

  const routes = useMemo(
    () => seededShuffle(baseRoutes, `${originIATA}-${destinationName}`),
    [baseRoutes, originIATA, destinationName]
  )

  const handleClick = async (destIata: string) => {
    setLoadingIata(destIata)
    const url = await buildKiwiUrl(originIATA, destIata)
    setLoadingIata(null)
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
              <p
                className="font-bold text-lg"
                style={{ color: '#232e4e' }}
              >
                {route.city}
              </p>
              <p className="text-xs text-gray-400">{route.country}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {originIATA}
            </span>
            <span>→</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {route.iata}
            </span>
          </div>

          <button
            onClick={() => handleClick(route.iata)}
            disabled={loadingIata === route.iata}
            className="w-full py-2 rounded-xl text-white font-semibold text-sm transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: '#232e4e' }}
          >
            {loadingIata === route.iata
              ? 'Loading…'
              : `Search flights from ${originIATA} →`}
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
            <p className="text-sm text-gray-500 leading-relaxed">
              {tip.body}
            </p>
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
          in the right place. Timms Travel compares hundreds of airlines and
          booking options to find you the best prices on flights from {originName}
          {originCountry ? `, ${originCountry}` : ''} to {destinationName}
          {destinationCountry ? `, ${destinationCountry}` : ''} with no hidden
          fees and no price mark-ups.
        </p>
      )}
      <p>
        Whether you're travelling for a weekend break, a long-haul adventure, or
        a business trip, our search pulls together real-time fares so you can
        compare and book in minutes. We partner with Kiwi.com to bring you
        flexible ticket options including one-way, return, and multi-city routes
        on this popular flight corridor.
      </p>
      <p>
        Prices on the {originName} to {destinationName} route vary throughout the
        year. To find the best deal, try adjusting your travel dates by a day or
        two - even small changes can significantly lower the fare. Use the search
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
          <a href="/" className="hover:text-white transition">
            Home
          </a>
          <span>/</span>
          <a href="/flights" className="hover:text-white transition">
            Flights
          </a>
          <span>/</span>
          <span className="text-white">{routeLabel}</span>
        </nav>

        <p
          className="text-sm uppercase tracking-widest mb-3 font-semibold"
          style={{ color: '#03989e' }}
        >
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
          Compare airlines, dates and prices in seconds. Book securely with
          Kiwi.com.
        </p>

        <SearchBox
          originIATA={originIATA}
          destinationIATA={destinationIATA}
          originName={originName}
          destinationName={destinationName}
        />
      </section>

      {/* ROUTE INFO STRIP */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl font-bold text-center mb-8"
            style={{ color: '#232e4e' }}
          >
            About This Route
          </h2>
          <RouteInfoStrip
            originIATA={originIATA}
            destinationIATA={destinationIATA}
          />
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-6"
            style={{ color: '#232e4e' }}
          >
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
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            More Popular Flights from {originName}
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Explore other top routes departing from {originName}
          </p>
          <PopularRoutesGrid
            originIATA={originIATA}
            destinationName={destinationName}
          />
        </div>
      </section>

      {/* TRAVEL TIPS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-2"
            style={{ color: '#232e4e' }}
          >
            Travel Tips for This Route
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Make the most of your {originName} to {destinationName} flight
          </p>
          <TravelTips />
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="py-16 px-6 text-center text-white"
      >
        <p
          className="text-sm uppercase tracking-widest mb-3 font-semibold"
          style={{ color: '#03989e' }}
        >
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