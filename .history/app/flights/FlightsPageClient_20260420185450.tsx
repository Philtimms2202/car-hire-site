'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Script from 'next/script'
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
  slug: string
  description: string
}

type HaulDestination = {
  city: string
  country: string
  iata: string
  flightTime: string
  priceFrom: string
  emoji: string
  slug: string
}

type PopularRoute = {
  from: string
  fromIata: string
  to: string
  toIata: string
  emoji: string
  flightTime: string
  priceFrom: string
  internalSlug: string
  description: string
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
  { city: 'London',    iata: 'LON', emoji: '🏙️', slug: 'london',    description: 'Cheap flights to London from UK airports'    },
  { city: 'Barcelona', iata: 'BCN', emoji: '⛪',  slug: 'barcelona', description: 'Cheap flights to Barcelona, Spain'           },
  { city: 'New York',  iata: 'JFK', emoji: '🗽',  slug: 'new-york',  description: 'Cheap flights to New York, USA'             },
  { city: 'Paris',     iata: 'PAR', emoji: '🗼',  slug: 'paris',     description: 'Cheap flights to Paris, France'             },
  { city: 'Dubai',     iata: 'DXB', emoji: '🌆',  slug: 'dubai',     description: 'Cheap flights to Dubai, UAE'                },
  { city: 'Orlando',   iata: 'MCO', emoji: '🎢',  slug: 'orlando',   description: 'Cheap flights to Orlando, Florida'          },
]

const seasonalBlocks = [
  {
    season: 'Spring',
    emoji: '🌸',
    items: [
      { city: 'Amsterdam', iata: 'AMS', temp: '12–18°C', rain: 'Moderate', sun: '6 hrs', slug: 'amsterdam' },
      { city: 'Rome',      iata: 'ROM', temp: '15–22°C', rain: 'Low',      sun: '8 hrs', slug: 'rome'      },
      { city: 'Lisbon',    iata: 'LIS', temp: '16–23°C', rain: 'Low',      sun: '9 hrs', slug: 'lisbon'    },
    ],
  },
  {
    season: 'Summer',
    emoji: '☀️',
    items: [
      { city: 'Barcelona', iata: 'BCN', temp: '26–32°C', rain: 'Low',      sun: '10 hrs', slug: 'barcelona' },
      { city: 'Ibiza',     iata: 'IBZ', temp: '28–33°C', rain: 'Very Low', sun: '11 hrs', slug: 'ibiza'     },
      { city: 'Antalya',   iata: 'AYT', temp: '30–36°C', rain: 'Very Low', sun: '12 hrs', slug: 'antalya'   },
    ],
  },
  {
    season: 'Autumn',
    emoji: '🍂',
    items: [
      { city: 'Paris',    iata: 'PAR', temp: '12–18°C', rain: 'Moderate', sun: '5 hrs', slug: 'paris'    },
      { city: 'Prague',   iata: 'PRG', temp: '10–16°C', rain: 'Low',      sun: '5 hrs', slug: 'prague'   },
      { city: 'Budapest', iata: 'BUD', temp: '12–18°C', rain: 'Low',      sun: '6 hrs', slug: 'budapest' },
    ],
  },
  {
    season: 'Winter',
    emoji: '❄️',
    items: [
      { city: 'Dubai',      iata: 'DXB', temp: '22–28°C', rain: 'Very Low', sun: '8 hrs', slug: 'dubai'      },
      { city: 'Tenerife',   iata: 'TFS', temp: '18–24°C', rain: 'Low',      sun: '7 hrs', slug: 'tenerife'   },
      { city: 'Cape Verde', iata: 'SID', temp: '24–28°C', rain: 'Low',      sun: '7 hrs', slug: 'cape-verde' },
    ],
  },
]

const shortHaul: HaulDestination[] = [
  { city: 'Amsterdam', country: 'Netherlands', iata: 'AMS', flightTime: '~1h 45m', priceFrom: 'From £39', emoji: '🌷', slug: 'amsterdam' },
  { city: 'Paris',     country: 'France',      iata: 'CDG', flightTime: '~1h 45m', priceFrom: 'From £45', emoji: '🗼', slug: 'paris'     },
  { city: 'Dublin',    country: 'Ireland',     iata: 'DUB', flightTime: '~1h 20m', priceFrom: 'From £29', emoji: '🍀', slug: 'dublin'    },
  { city: 'Barcelona', country: 'Spain',       iata: 'BCN', flightTime: '~2h 15m', priceFrom: 'From £49', emoji: '⛪', slug: 'barcelona' },
  { city: 'Lisbon',    country: 'Portugal',    iata: 'LIS', flightTime: '~2h 30m', priceFrom: 'From £55', emoji: '🌊', slug: 'lisbon'    },
  { city: 'Rome',      country: 'Italy',       iata: 'FCO', flightTime: '~2h 45m', priceFrom: 'From £59', emoji: '🏛️', slug: 'rome'     },
]

const midHaul: HaulDestination[] = [
  { city: 'Dubai',     country: 'UAE',     iata: 'DXB', flightTime: '~7h',     priceFrom: 'From £299', emoji: '🌆', slug: 'dubai'     },
  { city: 'New York',  country: 'USA',     iata: 'JFK', flightTime: '~8h',     priceFrom: 'From £349', emoji: '🗽', slug: 'new-york'  },
  { city: 'Marrakech', country: 'Morocco', iata: 'RAK', flightTime: '~3h 30m', priceFrom: 'From £89',  emoji: '🕌', slug: 'marrakech' },
  { city: 'Cairo',     country: 'Egypt',   iata: 'CAI', flightTime: '~5h',     priceFrom: 'From £199', emoji: '🐫', slug: 'cairo'     },
  { city: 'Istanbul',  country: 'Turkey',  iata: 'IST', flightTime: '~4h',     priceFrom: 'From £129', emoji: '🕍', slug: 'istanbul'  },
  { city: 'Tenerife',  country: 'Spain',   iata: 'TFS', flightTime: '~4h 30m', priceFrom: 'From £149', emoji: '🌋', slug: 'tenerife'  },
]

const longHaul: HaulDestination[] = [
  { city: 'Bangkok',     country: 'Thailand',      iata: 'BKK', flightTime: '~11h', priceFrom: 'From £499', emoji: '🛕', slug: 'bangkok'     },
  { city: 'Singapore',   country: 'Singapore',     iata: 'SIN', flightTime: '~13h', priceFrom: 'From £549', emoji: '🦁', slug: 'singapore'   },
  { city: 'Los Angeles', country: 'USA',           iata: 'LAX', flightTime: '~11h', priceFrom: 'From £499', emoji: '🎬', slug: 'los-angeles' },
  { city: 'Tokyo',       country: 'Japan',         iata: 'NRT', flightTime: '~12h', priceFrom: 'From £599', emoji: '🗾', slug: 'tokyo'       },
  { city: 'Sydney',      country: 'Australia',     iata: 'SYD', flightTime: '~22h', priceFrom: 'From £799', emoji: '🦘', slug: 'sydney'      },
  { city: 'Cape Town',   country: 'South Africa',  iata: 'CPT', flightTime: '~11h', priceFrom: 'From £549', emoji: '🌍', slug: 'cape-town'   },
]

const popularRoutes: PopularRoute[] = [
  {
    from: 'Manchester', fromIata: 'MAN',
    to: 'Dubai',        toIata: 'DXB',
    emoji: '✈️', flightTime: '~7h', priceFrom: 'From £299',
    internalSlug: '/flights/man/dxb/manchester-to-dubai',
    description: 'Compare cheap flights from Manchester to Dubai. Direct and connecting routes from MAN to DXB.',
  },
  {
    from: 'Manchester', fromIata: 'MAN',
    to: 'New York',     toIata: 'JFK',
    emoji: '✈️', flightTime: '~8h', priceFrom: 'From £349',
    internalSlug: '/flights/man/jfk/manchester-to-new-york',
    description: 'Find cheap flights from Manchester to New York. Compare all airlines on MAN to JFK routes.',
  },
  {
    from: 'Tenerife',   fromIata: 'TFS',
    to: 'Manchester',   toIata: 'MAN',
    emoji: '✈️', flightTime: '~4h 30m', priceFrom: 'From £149',
    internalSlug: '/flights/tfs/man/tenerife-to-manchester',
    description: 'Return flights from Tenerife to Manchester. Compare TFS to MAN prices across all airlines.',
  },
  {
    from: 'London',     fromIata: 'LHR',
    to: 'Bangkok',      toIata: 'BKK',
    emoji: '✈️', flightTime: '~11h', priceFrom: 'From £499',
    internalSlug: '/flights/lhr/bkk/london-to-bangkok',
    description: 'Cheap long-haul flights from London Heathrow to Bangkok. Compare LHR to BKK deals.',
  },
  {
    from: 'London',     fromIata: 'LHR',
    to: 'Barcelona',    toIata: 'BCN',
    emoji: '✈️', flightTime: '~2h 15m', priceFrom: 'From £49',
    internalSlug: '/flights/lhr/bcn/london-to-barcelona',
    description: 'Cheap flights from London to Barcelona. Compare LHR to BCN across budget and full-service airlines.',
  },
  {
    from: 'London',     fromIata: 'LHR',
    to: 'Paris',        toIata: 'CDG',
    emoji: '✈️', flightTime: '~1h', priceFrom: 'From £44',
    internalSlug: '/flights/lhr/cdg/london-to-paris',
    description: 'Find the cheapest flights from London to Paris. Compare LHR to CDG fares instantly.',
  },
]

const flightTips: FlightTip[] = [
  {
    icon: '📅',
    title: 'Best Time to Book',
    body: 'For European flights, aim to book 6–8 weeks in advance. For long-haul, 3–6 months ahead usually gets you the best fares. Tuesday and Wednesday departures are typically cheaper.',
  },
  {
    icon: '🧳',
    title: 'Baggage Know-How',
    body: "Always check your airline's baggage allowance before you fly. Budget carriers charge extra for hold luggage — adding it at booking is almost always cheaper than paying at the airport.",
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
    body: 'Low headline prices can mask seat selection fees, card surcharges, and priority boarding costs. Always check the total before committing — our search shows final prices upfront.',
  },
]

// Quick-link route index shown at the bottom of Popular Routes — fully crawlable <a> tags
const allRoutesIndex = [
  { label: 'Manchester to Dubai',      href: '/flights/man/dxb/manchester-to-dubai'      },
  { label: 'Manchester to New York',   href: '/flights/man/jfk/manchester-to-new-york'   },
  { label: 'Manchester to Barcelona',  href: '/flights/man/bcn/manchester-to-barcelona'  },
  { label: 'Manchester to Tenerife',   href: '/flights/man/tfs/manchester-to-tenerife'   },
  { label: 'Manchester to Ibiza',      href: '/flights/man/ibz/manchester-to-ibiza'      },
  { label: 'Manchester to Amsterdam',  href: '/flights/man/ams/manchester-to-amsterdam'  },
  { label: 'Manchester to Lanzarote',  href: '/flights/man/ace/manchester-to-lanzarote'  },
  { label: 'Manchester to Malaga',     href: '/flights/man/agp/manchester-to-malaga'     },
  { label: 'London to Barcelona',      href: '/flights/lhr/bcn/london-to-barcelona'      },
  { label: 'London to Paris',          href: '/flights/lhr/cdg/london-to-paris'          },
  { label: 'London to Bangkok',        href: '/flights/lhr/bkk/london-to-bangkok'        },
  { label: 'London to New York',       href: '/flights/lhr/jfk/london-to-new-york'       },
  { label: 'London to Dubai',          href: '/flights/lhr/dxb/london-to-dubai'          },
  { label: 'London to Tokyo',          href: '/flights/lhr/nrt/london-to-tokyo'          },
  { label: 'Tenerife to Manchester',   href: '/flights/tfs/man/tenerife-to-manchester'   },
  { label: 'Dublin to Manchester',     href: '/flights/dub/man/dublin-to-manchester'     },
]

// Quick-link destination index — crawlable links to /destinations/[slug]
const allDestinationsIndex = [
  { label: 'Flights to Amsterdam',   href: '/locations/europe/netherlands/amsterdam' },
  { label: 'Flights to Antalya',     href: '/locations/europe/turkey/antalya' },
  { label: 'Flights to Bangkok',     href: '/locations/asia/thailand/bangkok' },
  { label: 'Flights to Barcelona',   href: '/locations/europe/spain/barcelona' },
  { label: 'Flights to Budapest',    href: '/locations/europe/hungary/budapest' },
  { label: 'Flights to Cairo',       href: '/locations/africa/egypt/cairo' },
  { label: 'Flights to Cape Town',   href: '/locations/africa/south-africa/cape-town' },
  { label: 'Flights to Cape Town',  href: '/locations/africa/south-africa/cape-town' },
  { label: 'Flights to Dubai',       href: '/locations/middle-east/uae/abu-dhabi' },
  { label: 'Flights to Dublin',      href: '/locations/europe/united-kingdom/dublin' },
  { label: 'Flights to Malaga',       href: '/locations/europe/spain/malaga' },
  { label: 'Flights to Istanbul',    href: '/locations/europe/turkey/istanbul' },
  { label: 'Flights to Lisbon',      href: '/locations/europe/portugal/lisbon' },
  { label: 'Flights to London',      href: '/locations/europe/united-kingdom/london' },
  { label: 'Flights to Los Angeles', href: '/locations/north-america/usa/los-angeles' },
  { label: 'Flights to Marrakech',   href: '/locations/africa/morocco/marrakech' },
  { label: 'Flights to New York',    href: '/locations/north-america/usa/new-york' },
  { label: 'Flights to Orlando',     href: '/locations/north-america/usa/orlando' },
  { label: 'Flights to Paris',       href: '/locations/europe/france/paris' },
  { label: 'Flights to Prague',      href: '/locations/europe/czech-republic/prague' },
  { label: 'Flights to Rome',        href: '/locations/europe/italy/rome' },
  { label: 'Flights to Singapore',   href: '/locations/asia/singapore/singapore' },
  { label: 'Flights to Sydney',      href: '/locations/oceania/australia/sydney' },
  { label: 'Flights to Tenerife',    href: '/locations/europe/spain/tenerife' },
  { label: 'Flights to Tokyo',       href: '/locations/asia/japan/tokyo' },
]


// -----------------------------
// JSON-LD SCHEMAS
// -----------------------------
const CANONICAL = 'https://timmstravel.com/flights'

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${CANONICAL}#webpage`,
  url: CANONICAL,
  name: 'Compare Cheap Flights Worldwide | Timms Travel',
  description:
    'Search and compare cheap flights from UK airports to 700+ destinations worldwide. Find the best deals on short-haul, mid-haul and long-haul flights with Timms Travel.',
  inLanguage: 'en-GB',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://timmstravel.com/#website',
    url: 'https://timmstravel.com',
    name: 'Timms Travel',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://timmstravel.com'         },
      { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://timmstravel.com/flights' },
    ],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: flightTips.map(tip => ({
    '@type': 'Question',
    name: tip.title,
    acceptedAnswer: {
      '@type': 'Answer',
      text: tip.body,
    },
  })),
}

const routeListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Popular Flight Routes from the UK',
  url: CANONICAL,
  itemListElement: popularRoutes.map((r, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `${r.from} to ${r.to} (${r.fromIata}–${r.toIata})`,
    description: r.description,
    url: `https://timmstravel.com${r.internalSlug}`,
  })),
}

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
      <label htmlFor="airport-search" className="block text-sm text-gray-700 mb-2">
        Your departure airport
      </label>
      <div className="relative">
        <input
          id="airport-search"
          type="text"
          placeholder="Enter airport or use my location"
          className="px-4 py-2 w-full rounded-lg border border-gray-300 shadow-sm text-black bg-white"
          value={originInput}
          onChange={e => { setOriginInput(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          aria-label="Search for your departure airport"
          aria-expanded={open}
          aria-autocomplete="list"
          role="combobox"
        />
        {open && (
          <div
            className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 max-h-80 overflow-y-auto w-full text-black"
            role="listbox"
            aria-label="Airport suggestions"
          >
            <button
              type="button"
              onClick={useMyLocation}
              className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 flex items-center justify-between"
              aria-label="Use my current location to find nearest airport"
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
                role="option"
                aria-selected={false}
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
              <div className="px-4 py-3 text-sm text-gray-500" role="status">
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

  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate]         = useState('')
  const [dropoffDate, setDropoffDate]       = useState('')
  const [loading, setLoading]               = useState(false)
  const handleCarSearch = () => {}

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

  // Opens Kiwi for haul / featured / seasonal cards
  const openRoute = (destIata: string) => {
    if (!originAirport) { alert('Choose a departure airport first.'); return }
    const url = buildTrackedKiwiUrl({
      from: originAirport.iata_code,
      to: destIata,
      depart: todayStr(),
      adults: 1,
      currency: 'GBP',
    })
    window.open(url, '_blank', 'noopener,noreferrer')
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
    <>
      {/* ── JSON-LD STRUCTURED DATA ── */}
      <Script
        id="schema-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="schema-routes"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(routeListSchema) }}
        strategy="afterInteractive"
      />

      <main className="min-h-screen bg-white" id="main-content">
        <Navbar />

        {/* ── BREADCRUMB ─────────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100 px-6 py-2">
          <ol className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-500" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" className="hover:text-blue-600 transition-colors" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="text-gray-800 font-medium" itemProp="name">Flights</span>
              <meta itemProp="position" content="2" />
              <link itemProp="item" href="https://timmstravel.com/flights" />
            </li>
          </ol>
        </nav>

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden text-white py-24 px-6 text-center"
          aria-labelledby="hero-heading"
        >
          <NextImage
            src="https://images.unsplash.com/photo-1532364158125-02d75a0f7fb9?q=80&w=1548"
            alt="View from an airplane window above the clouds on a clear day"
            fill
            className="object-cover object-[center_30%]"
            priority
          />
          <div className="absolute inset-0 bg-[#232e4e]/75 z-0" aria-hidden="true" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
              Timms Travel
            </p>
            <h1
              id="hero-heading"
              className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight"
            >
              Compare Flights Worldwide
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-10">
              Search hundreds of airlines and find cheap flights to over 700 destinations from UK airports — with no hidden fees.
            </p>

            {/* ── SEARCH TABS ── */}
            <nav aria-label="Search type" className="flex justify-center gap-1 mb-6 bg-white/10 rounded-2xl p-1 max-w-sm mx-auto">
              {(['flights', 'hotels', 'experiences', 'cars'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={activeTab === tab}
                  aria-label={`Search ${tab}`}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-white text-[#232e4e] shadow-sm'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            {/* ── SEARCH WIDGET ── */}
            <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black" role="search" aria-label="Flight and travel search">
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

            <p className="flex justify-center gap-8 mt-8 text-sm text-gray-300" aria-label="Trust signals">
              <span>Fully Bespoke Offers</span>
              <span>No hidden fees</span>
              <span>Competitive price guarantee</span>
            </p>
          </div>
        </section>

        {/* ── STATS STRIP ────────────────────────────────────────────────────── */}
        <section style={{ backgroundColor: '#1a2540' }} className="py-6 px-6" aria-label="Timms Travel at a glance">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
            {[
              { label: 'Destinations',      value: '700+' },
              { label: 'Airlines Compared', value: '500+' },
              { label: 'UK Routes',         value: '1,200+' },
              { label: 'Price Guarantee',   value: '✓' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-teal-400">{stat.value}</p>
                <p className="text-sm text-gray-300 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SHORT / MID / LONG HAUL ────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-gray-50" aria-labelledby="haul-heading" id="haul">
          <div className="max-w-6xl mx-auto">
            <h2 id="haul-heading" className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
              Find Your Ideal Flight
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Browse by flight duration — from quick European hops to epic long-haul adventures.
            </p>

            {/* Haul toggle */}
            <nav aria-label="Flight duration category" className="flex flex-wrap justify-center gap-2 mb-8">
              {(['short', 'mid', 'long'] as const).map(h => (
                <button
                  key={h}
                  onClick={() => setActiveHaul(h)}
                  aria-pressed={activeHaul === h}
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
            </nav>

            <p className={`rounded-2xl p-4 mb-8 text-sm font-medium text-center border ${haulColour.pill}`} role="note">
              {activeHaul === 'short' && 'Perfect for a quick city break or weekend getaway — no need to pack heavy!'}
              {activeHaul === 'mid'   && 'Long enough to explore somewhere truly different, short enough to skip the jet lag.'}
              {activeHaul === 'long'  && 'Epic adventures await — bucket-list destinations that are absolutely worth the journey.'}
            </p>

            <AirportDropdown {...dropdownProps} />

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label={`${activeHaul}-haul flight destinations`}>
              {haulData.map(dest => (
                <li
                  key={dest.iata}
                  className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl" aria-hidden="true">{dest.emoji}</span>
                      <div>
                        {/* Internal destination link */}
                        <Link
                          href={`/destinations/${dest.slug}`}
                          className="font-bold text-lg leading-tight hover:underline"
                          style={{ color: '#232e4e' }}
                          title={`Explore ${dest.city} — flights, hotels & travel guide`}
                        >
                          {dest.city}
                        </Link>
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
                    aria-label={`Search flights from ${originAirport?.iata_code ?? 'your airport'} to ${dest.city}`}
                    className="text-blue-600 font-semibold hover:underline disabled:opacity-60 text-sm"
                    disabled={!originAirport}
                  >
                    {originAirport
                      ? `View flights from ${originAirport.iata_code} →`
                      : 'Choose a departure airport above'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── POPULAR ROUTES ─────────────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-white" aria-labelledby="routes-heading" id="popular-routes">
          <div className="max-w-6xl mx-auto">
            <h2 id="routes-heading" className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
              Popular Flight Routes
            </h2>
            <p className="text-center text-gray-500 mb-10">
              The routes our travellers love most — with full guides, tips, and live prices.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Popular flight routes">
              {popularRoutes.map((route, i) => (
                <li
                  key={i}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition group"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-lg text-white"
                      style={{ backgroundColor: '#232e4e' }}
                    >
                      {route.fromIata}
                    </span>
                    <span className="text-gray-400 text-lg" aria-hidden="true">→</span>
                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-teal-500 text-white">
                      {route.toIata}
                    </span>
                    <span className="ml-auto text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-500">
                      Full guide
                    </span>
                  </div>

                  {/* Crawlable <Link> — primary internal link for this route */}
                  <Link
                    href={route.internalSlug}
                    className="block font-bold text-lg mb-1 hover:underline"
                    style={{ color: '#232e4e' }}
                    title={route.description}
                  >
                    {route.from} → {route.to}
                  </Link>

                  <div className="flex gap-4 text-sm text-gray-500 mb-5">
                    <span>⏱ {route.flightTime}</span>
                    <span>💷 {route.priceFrom}</span>
                  </div>

                  <Link
                    href={route.internalSlug}
                    className="block w-full py-2 rounded-xl text-sm font-semibold text-white text-center transition-all hover:opacity-90"
                    style={{ backgroundColor: '#232e4e' }}
                    aria-label={`View full route guide: ${route.from} to ${route.to}`}
                  >
                    View Route Guide →
                  </Link>
                </li>
              ))}
            </ul>

            {/* ── ALL ROUTES INDEX (crawlable anchor grid) ── */}
            <div className="mt-14 border-t border-gray-100 pt-10">
              <h3 className="text-xl font-bold mb-5 text-center" style={{ color: '#232e4e' }}>
                Browse All Flight Routes from the UK
              </h3>
              <nav aria-label="All UK flight routes directory">
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allRoutesIndex.map(route => (
                    <li key={route.href}>
                      <Link
                        href={route.href}
                        className="block text-sm text-blue-700 hover:text-blue-900 hover:underline py-1 px-2 rounded transition-colors"
                        title={`${route.label} — flight guide & prices`}
                      >
                        {route.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {/* ── FEATURED DESTINATIONS ──────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-gray-50" aria-labelledby="featured-heading" id="featured-destinations">
          <div className="max-w-6xl mx-auto">
            <h2 id="featured-heading" className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
              Featured Destinations
            </h2>
            <p className="text-center text-gray-500 mb-10">
              Hand-picked favourites — explore destination guides or search live flights instantly.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Featured travel destinations">
              {featuredDestinations.map(dest => (
                <li key={dest.iata} className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl" aria-hidden="true">{dest.emoji}</span>
                    <div>
                      {/* Internal destination hub link */}
                      <Link
                      href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`}
                      className="font-bold text-lg block hover:underline"
                      style={{ color: '#232e4e' }}
                      title={dest.description}
                    >
                      {dest.city}
                    </Link>

                      <p className="text-xs text-gray-400">
                        <Link
                        href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`}
                        className="hover:underline text-teal-600 font-medium"
                        title={`${dest.city} travel guide — things to do, hotels & flights`}
                      >
                        Destination guide →
                      </Link>

                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openRoute(dest.iata)}
                    aria-label={`Search live flights to ${dest.city}`}
                    className="text-blue-600 font-semibold hover:underline disabled:opacity-60 text-sm"
                    disabled={!originAirport}
                  >
                    {originAirport
                      ? `View flights from ${originAirport.iata_code} →`
                      : 'Choose a departure airport above'}
                  </button>
                </li>
              ))}
            </ul>

            {/* ── ALL DESTINATIONS INDEX (crawlable) ── */}
            <div className="mt-14 border-t border-gray-100 pt-10">
              <h3 className="text-xl font-bold mb-5 text-center" style={{ color: '#232e4e' }}>
                Browse All Destinations
              </h3>
              <nav aria-label="All flight destinations directory">
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allDestinationsIndex.map(dest => (
                    <li key={dest.href}>
                      <Link
                        href={dest.href}
                        className="block text-sm text-blue-700 hover:text-blue-900 hover:underline py-1 px-2 rounded transition-colors"
                        title={`${dest.label} — travel guide, hotels & best prices`}
                      >
                        {dest.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {/* ── DESTINATIONS BY SEASON ─────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-white" aria-labelledby="seasonal-heading" id="destinations-by-season">
          <div className="max-w-6xl mx-auto">
            <h2 id="seasonal-heading" className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
              Destinations by Season
            </h2>
            <p className="text-center text-gray-500 mb-10">
              Find the perfect place to fly depending on the time of year.
            </p>

            {seasonalBlocks.map(({ season, emoji, items }) => (
              <article key={season} className="mb-14" aria-label={`${season} destinations`}>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#232e4e' }}>
                  <span aria-hidden="true">{emoji}</span> Best Destinations in {season}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map(dest => (
                    <li
                      key={dest.iata}
                      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                    >
                      {/* Internal destination link */}
                      <Link
                        href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`}
                        className="font-bold text-xl mb-2 block hover:underline"
                        style={{ color: '#232e4e' }}
                        title={`${dest.city} in ${season} — travel guide & cheap flights`}
                      >
                        {dest.city}
                      </Link>

                      <div className="text-sm text-gray-600 space-y-1 mb-4">
                        <p><strong>Avg Temp:</strong> {dest.temp}</p>
                        <p><strong>Rainfall:</strong> {dest.rain}</p>
                        <p><strong>Sunshine:</strong> {dest.sun}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => openRoute(dest.iata)}
                          aria-label={`Search flights to ${dest.city} in ${season}`}
                          className="text-blue-600 font-semibold hover:underline disabled:opacity-60 text-sm"
                          disabled={!originAirport}
                        >
                          {originAirport
                            ? `View flights from ${originAirport.iata_code} →`
                            : 'Choose a departure airport above'}
                        </button>
                        <Link
                      href={`/locations/${dest.continent}/${dest.country}/${dest.slug}`}
                      className="text-teal-600 text-sm font-medium hover:underline"
                      title={`${dest.city} ${season} travel guide`}
                    >
                      Read destination guide →
                    </Link>

                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ── FLIGHT TIPS / FAQ ──────────────────────────────────────────────── */}
        <section className="py-16 px-6" style={{ backgroundColor: '#f0f4ff' }} aria-labelledby="tips-heading" id="flight-tips">
          <div className="max-w-6xl mx-auto">
            <h2 id="tips-heading" className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
              Flight Tips &amp; Advice
            </h2>
            <p className="text-center text-gray-500 mb-10">
              Everything you need to know before you fly — from booking to boarding.
            </p>

            {/* Rendered as a list so each tip is semantically distinct — matches FAQPage schema */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Flight tips and frequently asked questions">
              {flightTips.map(tip => (
                <li
                  key={tip.title}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100"
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  <div className="text-3xl mb-3" aria-hidden="true">{tip.icon}</div>
                  <p className="font-bold text-lg mb-2" style={{ color: '#232e4e' }} itemProp="name">{tip.title}</p>
                  <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <p className="text-sm text-gray-600 leading-relaxed" itemProp="text">{tip.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── RELATED PAGES / INTERNAL LINKS HUB ────────────────────────────── */}
        <section className="py-12 px-6 bg-white border-t border-gray-100" aria-labelledby="explore-heading">
          <div className="max-w-6xl mx-auto">
            <h2 id="explore-heading" className="text-2xl font-bold text-center mb-8" style={{ color: '#232e4e' }}>
              Explore More with Timms Travel
            </h2>
            <nav aria-label="Related pages and travel categories">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Hotel Deals',
                    description: 'Compare hotels worldwide alongside your flights for the best package price.',
                    href: '/hotels',
                    icon: '🏨',
                  },
                  {
                    title: 'Car Hire',
                    description: 'Find cheap car rental at your destination airport from trusted suppliers.',
                    href: '/car-hire',
                    icon: '🚗',
                  },
                  {
                    title: 'Experiences',
                    description: 'Book tours, transfers, and activities at your destination.',
                    href: '/experiences',
                    icon: '🎭',
                  },
                  {
                    title: 'Travel Guides',
                    description: 'In-depth destination guides to help you plan every part of your trip.',
                    href: '/locations',
                    icon: '🗺️',
                  },
                ].map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 transition group h-full"
                      title={item.title}
                    >
                      <span className="text-3xl mb-3 block" aria-hidden="true">{item.icon}</span>
                      <p className="font-bold text-base mb-1 group-hover:text-blue-700 transition-colors" style={{ color: '#232e4e' }}>
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
        <section
          className="py-16 px-6 text-center text-white"
          style={{ backgroundColor: '#232e4e' }}
          aria-labelledby="cta-heading"
        >
          <div className="max-w-2xl mx-auto">
            <h2 id="cta-heading" className="text-3xl font-bold mb-4">Ready to take off?</h2>
            <p className="text-gray-300 mb-8">
              Use our search above to compare hundreds of airlines and find the best price for your next adventure.
              No hidden fees. No surprises.
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll back to the flight search form at the top of the page"
              className="px-8 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: '#2dd4bf', color: '#232e4e' }}
            >
              Search Flights Now →
            </button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}