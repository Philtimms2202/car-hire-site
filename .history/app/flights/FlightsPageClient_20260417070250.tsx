'use client'

import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'
import airports from '@/data/airports.json'

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
  country: string
  iata: string
  emoji: string
  tagline: string
}

// -----------------------------
// DATA
// -----------------------------
const allAirports: Airport[] = (airports as Airport[])
  .filter(a => a.iata_code)
  .sort((a, b) => a.city.localeCompare(b.city))

const featuredDestinations: Destination[] = [
  { city: 'London',    country: 'United Kingdom', iata: 'LON', emoji: '🏙️', tagline: 'World-class culture & history' },
  { city: 'Barcelona', country: 'Spain',           iata: 'BCN', emoji: '⛪', tagline: 'Architecture, beaches & tapas' },
  { city: 'New York',  country: 'United States',   iata: 'JFK', emoji: '🗽', tagline: 'The city that never sleeps' },
  { city: 'Paris',     country: 'France',           iata: 'PAR', emoji: '🗼', tagline: 'Romance, art & cuisine' },
  { city: 'Dubai',     country: 'UAE',              iata: 'DXB', emoji: '🌆', tagline: 'Luxury in the desert' },
  { city: 'Orlando',   country: 'United States',    iata: 'MCO', emoji: '🎢', tagline: 'Family fun & theme parks' },
]

const seasonalBlocks = [
  {
    season: 'Spring',
    emoji: '🌸',
    months: 'March – May',
    description: 'Mild temperatures, blooming landscapes and fewer crowds make spring ideal for exploring European cities without the summer price premium.',
    items: [
      { city: 'Amsterdam', country: 'Netherlands', iata: 'AMS', temp: '12–18°C', rain: 'Moderate', sun: '6 hrs', highlight: 'Tulip season in full bloom' },
      { city: 'Rome',      country: 'Italy',       iata: 'ROM', temp: '15–22°C', rain: 'Low',      sun: '8 hrs', highlight: 'Comfortable sightseeing weather' },
      { city: 'Lisbon',    country: 'Portugal',    iata: 'LIS', temp: '16–23°C', rain: 'Low',      sun: '9 hrs', highlight: 'Perfect coastal city weather' },
    ],
  },
  {
    season: 'Summer',
    emoji: '☀️',
    months: 'June – August',
    description: 'Sun-drenched beaches, long evenings and vibrant nightlife await across the Mediterranean — the UK\'s favourite summer flight destinations.',
    items: [
      { city: 'Barcelona', country: 'Spain',  iata: 'BCN', temp: '26–32°C', rain: 'Low',      sun: '10 hrs', highlight: 'Beach clubs & Gaudí landmarks' },
      { city: 'Ibiza',     country: 'Spain',  iata: 'IBZ', temp: '28–33°C', rain: 'Very Low', sun: '11 hrs', highlight: 'World-famous nightlife & secluded coves' },
      { city: 'Antalya',   country: 'Turkey', iata: 'AYT', temp: '30–36°C', rain: 'Very Low', sun: '12 hrs', highlight: 'Turquoise coast & ancient ruins' },
    ],
  },
  {
    season: 'Autumn',
    emoji: '🍂',
    months: 'September – November',
    description: 'Golden foliage, harvest festivals and quieter attractions make autumn an underrated time to fly — often with lower fares than peak summer.',
    items: [
      { city: 'Paris',    country: 'France',  iata: 'PAR', temp: '12–18°C', rain: 'Moderate', sun: '5 hrs', highlight: 'Fashion week & harvest season' },
      { city: 'Prague',   country: 'Czechia', iata: 'PRG', temp: '10–16°C', rain: 'Low',      sun: '5 hrs', highlight: 'Cobblestone charm in autumn colour' },
      { city: 'Budapest', country: 'Hungary', iata: 'BUD', temp: '12–18°C', rain: 'Low',      sun: '6 hrs', highlight: 'Thermal baths & ruin bars' },
    ],
  },
  {
    season: 'Winter',
    emoji: '❄️',
    months: 'December – February',
    description: 'Escape the British cold with winter sun, or embrace festive markets closer to home. Long-haul destinations come into their own in winter.',
    items: [
      { city: 'Dubai',      country: 'UAE',        iata: 'DXB', temp: '22–28°C', rain: 'Very Low', sun: '8 hrs', highlight: 'Peak season — warm & vibrant' },
      { city: 'Tenerife',   country: 'Spain',      iata: 'TFS', temp: '18–24°C', rain: 'Low',      sun: '7 hrs', highlight: 'Year-round sunshine island' },
      { city: 'Cape Verde', country: 'Cape Verde', iata: 'SID', temp: '24–28°C', rain: 'Low',      sun: '7 hrs', highlight: 'Tropical Atlantic escape' },
    ],
  },
]

const faqs = [
  {
    q: 'When is the cheapest time to book flights from the UK?',
    a: 'Generally speaking, the cheapest time to book flights from the UK is six to eight weeks before departure for short-haul European routes, and three to six months ahead for long-haul destinations. Midweek flights — particularly on Tuesdays and Wednesdays — tend to be cheaper than weekend departures. Avoid booking during school holiday windows such as half-term, Easter and the summer holidays if you want the lowest fares.',
  },
  {
    q: 'Which UK airports offer the most flight routes?',
    a: 'London Heathrow (LHR) is the UK\'s busiest airport and offers the widest range of long-haul and international routes. London Gatwick (LGW), Manchester (MAN) and Edinburgh (EDI) are also major hubs with strong European and transatlantic connections. For budget carriers and package holiday routes, Birmingham (BHX), Bristol (BRS) and Leeds Bradford (LBA) all provide a solid selection of popular destinations.',
  },
  {
    q: 'What is the difference between a direct and a non-stop flight?',
    a: 'A non-stop flight travels directly from your departure airport to your destination without landing anywhere else. A direct flight follows the same route but may make one or more stops en route — even if you do not change planes. Connecting flights require you to change aircraft at an intermediate airport. Non-stop flights are typically the quickest and most convenient option, though connecting flights can sometimes offer significant savings.',
  },
  {
    q: 'Do I need travel insurance when booking flights?',
    a: 'While travel insurance is not a legal requirement, it is strongly recommended for all trips abroad. A good policy will cover flight cancellation, delays, lost baggage, medical emergencies and repatriation. Look for a policy that includes cover for any activities you plan to do at your destination. If you travel frequently, an annual multi-trip policy often represents better value than insuring each trip individually.',
  },
  {
    q: 'What documents do I need to fly from the UK?',
    a: 'For international travel, UK residents require a valid passport. Many destinations also require a visa — either obtained in advance or on arrival. Since Brexit, British passport holders now need at least six months\' validity on their passport for most destinations. Some countries such as the USA require an ESTA (Electronic System for Travel Authorisation) completed before departure. Always check the FCDO travel guidance for your specific destination before booking.',
  },
  {
    q: 'How do I find the cheapest flights from the UK?',
    a: 'Our search tool compares prices across hundreds of airlines in real time, making it one of the most effective ways to find cheap flights from the UK. To get the best deal, try to be flexible with your travel dates and destination, book well in advance for peak periods, consider flying from alternative nearby airports, and always check what is included in the fare — budget airlines often charge extra for hold luggage and seat selection.',
  },
  {
    q: 'Can I change or cancel my flight after booking?',
    a: 'This depends entirely on the fare type and airline. Flexible or fully-flexible fares allow changes and cancellations, often with no fee or a small admin charge. Budget fares — particularly those from low-cost carriers — are frequently non-refundable and non-changeable. Always read the fare conditions before booking, and consider travel insurance that includes cancellation cover if your plans are subject to change.',
  },
  {
    q: 'What are the baggage allowances for flights from the UK?',
    a: 'Baggage allowances vary significantly between airlines and fare classes. Most full-service carriers include a hold bag in their standard fare, while budget airlines such as Ryanair and easyJet typically charge extra for hold luggage and may have strict limits on cabin bag sizes and weights. Always check your specific airline\'s baggage policy before packing, and weigh your bags at home to avoid costly excess baggage fees at the airport.',
  },
]

const tips = [
  {
    icon: '📅',
    title: 'Book on the Right Day',
    body: 'Research consistently shows that Tuesdays and Wednesdays tend to offer lower average fares. Avoid searching on Fridays and Sundays, when prices often peak due to high demand from leisure travellers.',
  },
  {
    icon: '🔔',
    title: 'Set a Price Alert',
    body: 'If you have a destination in mind but are not ready to commit, set up a price alert. You will be notified when fares drop, allowing you to book at the right moment without constantly checking.',
  },
  {
    icon: '✈️',
    title: 'Consider Nearby Airports',
    body: 'Flying from an alternative airport can save you a considerable sum. For example, Manchester travellers may find better fares from Leeds Bradford or Liverpool John Lennon for certain routes.',
  },
  {
    icon: '🧳',
    title: 'Travel Light if You Can',
    body: 'Budget airlines charge handsomely for hold luggage. If you can manage with a cabin bag for shorter trips, you can often save £30–£80 per person each way — a significant saving on a family booking.',
  },
  {
    icon: '🗓️',
    title: 'Avoid Peak School Holidays',
    body: 'Flight prices during UK school holidays — particularly summer, Easter and half-term — can be two to three times higher than shoulder-season equivalents. Travelling just before or after these windows consistently delivers better value.',
  },
  {
    icon: '💳',
    title: 'Use a Fee-Free Travel Card',
    body: 'When booking in foreign currencies, using a travel-friendly card from providers such as Starling, Monzo or Chase avoids foreign transaction fees. Always pay in the local currency when given the option.',
  },
]

const popularRoutes = [
  { from: 'Manchester', fromCode: 'MAN', to: 'Alicante',  toCode: 'ALC', flag: '🇪🇸', duration: '2h 40m' },
  { from: 'London',     fromCode: 'LGW', to: 'Amsterdam', toCode: 'AMS', flag: '🇳🇱', duration: '1h 20m' },
  { from: 'Manchester', fromCode: 'MAN', to: 'Dubai',     toCode: 'DXB', flag: '🇦🇪', duration: '6h 50m' },
  { from: 'London',     fromCode: 'LHR', to: 'New York',  toCode: 'JFK', flag: '🇺🇸', duration: '8h 10m' },
  { from: 'Edinburgh',  fromCode: 'EDI', to: 'Barcelona', toCode: 'BCN', flag: '🇪🇸', duration: '2h 45m' },
  { from: 'Bristol',    fromCode: 'BRS', to: 'Faro',      toCode: 'FAO', flag: '🇵🇹', duration: '2h 15m' },
  { from: 'Birmingham', fromCode: 'BHX', to: 'Malaga',    toCode: 'AGP', flag: '🇪🇸', duration: '2h 50m' },
  { from: 'London',     fromCode: 'LHR', to: 'Bangkok',   toCode: 'BKK', flag: '🇹🇭', duration: '11h 30m' },
]

const seasonAccentMap: Record<string, string> = {
  Spring: '#5a8a5e',
  Summer: '#c97d2b',
  Autumn: '#b85c38',
  Winter: '#3a6b9f',
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

// -----------------------------
// PAGE COMPONENT
// -----------------------------
export default function FlightsPageClient() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'experiences' | 'cars'>('flights')
  const [originAirport, setOriginAirport] = useState<Airport | null>(null)
  const [originInput, setOriginInput] = useState('')
  const [open, setOpen] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [dropoffDate, setDropoffDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleCarSearch = () => {}

  useEffect(() => {
    if (!originAirport) {
      const man = allAirports.find(a => a.iata_code === 'MAN')
      if (man) {
        setOriginAirport(man)
        setOriginInput(`${man.city} (${man.iata_code})`)
      }
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

  return (
    <>
      

      <main className="tt min-h-screen" itemScope itemType="https://schema.org/WebPage">
        <Navbar />

        {/* ── HERO ── */}
        <section className="tt-hero" aria-label="Flight search">
          <div className="tt-hero-in">
            <span className="tt-eyebrow">Timms Travel · Compare Cheap Flights</span>
            <h1>
              Find Cheap Flights to<br />
              <em>Hundreds of Destinations</em>
            </h1>
            <p className="tt-hero-sub">
              Search and compare flights from UK airports to destinations across Europe, the Americas,
              Asia, the Middle East and beyond. No hidden fees — just competitive prices and bespoke offers.
            </p>

            <div className="tt-tabs" role="tablist" aria-label="Search type">
              {(['flights', 'hotels', 'experiences', 'cars'] as const).map(tab => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tt-tab${activeTab === tab ? ' on' : ''}`}
                >
                  {tab === 'flights' ? '✈ Flights'
                    : tab === 'hotels' ? '🏨 Hotels'
                    : tab === 'experiences' ? '🎟 Experiences'
                    : '🚗 Cars'}
                </button>
              ))}
            </div>

            <div className="tt-sbox" role="search" aria-label="Search for flights">
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

            <div className="tt-trust" aria-label="Trust signals">
              {['Hundreds of airlines compared','No booking fees','Competitive price guarantee','Bespoke travel offers'].map(t => (
                <div key={t} className="tt-trust-item">
                  <span className="tt-dot" aria-hidden="true" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── POPULAR UK ROUTES ── */}
        <section className="tt-sec tt-cream" aria-labelledby="routes-h">
          <div className="tt-sec-in">
            <p className="tt-label">Top Routes</p>
            <h2 className="tt-h2" id="routes-h">Popular UK Flight Routes</h2>
            <p className="tt-sub">
              From quick European city breaks to long-haul adventures, these are the routes British
              travellers book most often. Click any card to search live fares.
            </p>
            <div className="tt-routes">
              {popularRoutes.map((r, i) => (
                <button
                  key={i}
                  className="tt-route"
                  onClick={() => openRoute(r.toCode)}
                  aria-label={`Search flights from ${r.from} to ${r.to}`}
                >
                  <span className="tt-route-flag" aria-hidden="true">{r.flag}</span>
                  <div className="tt-route-info">
                    <div className="tt-route-path">{r.from} → {r.to}</div>
                    <div className="tt-route-codes">{r.fromCode} – {r.toCode}</div>
                  </div>
                  <div className="tt-route-dur">{r.duration}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED DESTINATIONS ── */}
        <section className="tt-sec" aria-labelledby="featured-h">
          <div className="tt-sec-in">
            <p className="tt-label">Top Picks</p>
            <h2 className="tt-h2" id="featured-h">Popular Flight Destinations from the UK</h2>
            <p className="tt-sub">
              Choose your departure airport below and browse live fares to the world's most popular
              destinations — from short European breaks to long-haul escapes.
            </p>

            {/* Airport selector */}
            <div className="tt-ap-wrap">
              <label htmlFor="ap-input">Your departure airport</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="ap-input"
                  type="text"
                  placeholder="Search city, country or airport code…"
                  className="tt-ap-input"
                  value={originInput}
                  onChange={e => { setOriginInput(e.target.value); setOpen(true) }}
                  onFocus={() => setOpen(true)}
                  aria-autocomplete="list"
                  aria-expanded={open}
                  autoComplete="off"
                />
                {open && (
                  <div className="tt-ap-drop" role="listbox">
                    <button type="button" onClick={useMyLocation} className="tt-ap-geo" aria-label="Use my current location">
                      <span style={{ fontWeight: 600, fontSize: 13 }}>
                        {geoLoading ? 'Detecting your nearest airport…' : '📍 Use my location'}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {geoError ?? 'Find the closest airport'}
                      </span>
                    </button>
                    {filteredAirports.map(a => (
                      <div
                        key={a.iata_code}
                        className="tt-ap-row"
                        role="option"
                        onClick={() => { setOriginAirport(a); setOriginInput(`${a.city} (${a.iata_code})`); setOpen(false) }}
                      >
                        <div className="tt-ap-top">
                          <span className="tt-ap-name">{a.city}, {a.country}</span>
                          <span className="tt-ap-iata">{a.iata_code}</span>
                        </div>
                        <div className="tt-ap-sub">{a.name}</div>
                      </div>
                    ))}
                    {filteredAirports.length === 0 && !geoLoading && (
                      <div style={{ padding: '12px 16px', fontSize: 13, color: 'var(--muted)' }}>
                        Start typing a city, country or airport code.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="tt-dest-grid">
              {featuredDestinations.map(dest => (
                <article key={dest.iata} className="tt-dest-card">
                  <div className="tt-dest-top">
                    <span className="tt-dest-emoji" aria-hidden="true">{dest.emoji}</span>
                    <div>
                      <h3 className="tt-dest-city">{dest.city}</h3>
                      <div className="tt-dest-cty">{dest.country}</div>
                    </div>
                  </div>
                  <p className="tt-dest-tag">{dest.tagline}</p>
                  <button
                    type="button"
                    onClick={() => openRoute(dest.iata)}
                    className="tt-link"
                    disabled={!originAirport}
                    aria-label={`View flights to ${dest.city}`}
                  >
                    {originAirport ? `View flights from ${originAirport.iata_code} →` : 'Choose a departure airport above'}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── DESTINATIONS BY SEASON ── */}
        <section className="tt-sec tt-cream" aria-labelledby="seasonal-h">
          <div className="tt-sec-in">
            <p className="tt-label">When to Fly</p>
            <h2 className="tt-h2" id="seasonal-h">Best Flight Destinations by Season</h2>
            <p className="tt-sub">
              The right destination varies enormously depending on the time of year. Here's where the
              weather, atmosphere and value align — season by season.
            </p>
            {seasonalBlocks.map(({ season, emoji, months, description, items }) => (
              <div key={season} className="tt-season-block">
                <div className="tt-season-hd">
                  <h3 className="tt-season-title">{emoji} {season}</h3>
                  <span className="tt-season-mo">{months}</span>
                </div>
                <p className="tt-season-desc">{description}</p>
                <div className="tt-season-grid">
                  {items.map(dest => (
                    <article
                      key={dest.iata}
                      className="tt-s-card"
                      style={{ '--sc': seasonAccentMap[season] } as React.CSSProperties}
                    >
                      <div className="tt-s-city">{dest.city}</div>
                      <div className="tt-s-country">{dest.country}</div>
                      <div className="tt-s-hl">✦ {dest.highlight}</div>
                      <div className="tt-s-meta" aria-label="Weather data">
                        <div className="tt-meta"><div className="tt-meta-l">Temp</div><div className="tt-meta-v">{dest.temp}</div></div>
                        <div className="tt-meta"><div className="tt-meta-l">Rain</div><div className="tt-meta-v">{dest.rain}</div></div>
                        <div className="tt-meta"><div className="tt-meta-l">Sun</div><div className="tt-meta-v">{dest.sun}</div></div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openRoute(dest.iata)}
                        className="tt-link"
                        disabled={!originAirport}
                        aria-label={`View flights to ${dest.city}`}
                      >
                        {originAirport ? `View flights from ${originAirport.iata_code} →` : 'Choose a departure airport above'}
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIPS ── */}
        <section className="tt-sec" aria-labelledby="tips-h">
          <div className="tt-sec-in">
            <p className="tt-label">Expert Advice</p>
            <h2 className="tt-h2" id="tips-h">Tips for Finding Cheap Flights from the UK</h2>
            <p className="tt-sub">
              Booking cheap flights is part timing, part strategy. Here are six tried-and-tested tips
              that consistently help UK travellers secure the best fares.
            </p>
            <div className="tt-tips">
              {tips.map((tip, i) => (
                <article key={i} className="tt-tip">
                  <div className="tt-tip-icon" aria-hidden="true">{tip.icon}</div>
                  <h3 className="tt-tip-title">{tip.title}</h3>
                  <p className="tt-tip-body">{tip.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY TIMMS TRAVEL ── */}
        <section className="tt-strip" aria-labelledby="why-h">
          <div className="tt-strip-in">
            <div>
              <div className="tt-strip-icon" aria-hidden="true">✈️</div>
              <h3 className="tt-strip-title" id="why-h">Hundreds of Airlines Compared</h3>
              <p className="tt-strip-body">
                Our search pulls live fares from hundreds of airlines and booking platforms simultaneously,
                so you always see the most competitive price without trawling multiple sites.
              </p>
            </div>
            <div>
              <div className="tt-strip-icon" aria-hidden="true">💷</div>
              <h3 className="tt-strip-title">No Hidden Fees</h3>
              <p className="tt-strip-body">
                What you see is what you pay. We never add booking fees or admin charges on top of the
                displayed fare. The price shown is the price you will pay at checkout.
              </p>
            </div>
            <div>
              <div className="tt-strip-icon" aria-hidden="true">🛡️</div>
              <h3 className="tt-strip-title">Competitive Price Guarantee</h3>
              <p className="tt-strip-body">
                We are confident our fares are among the most competitive available. If you find a lower
                price for the same flight elsewhere, let us know and we will do our best to match it.
              </p>
            </div>
            <div>
              <div className="tt-strip-icon" aria-hidden="true">🧭</div>
              <h3 className="tt-strip-title">Bespoke Travel Offers</h3>
              <p className="tt-strip-body">
                Looking for something tailored? Our team specialises in bespoke travel packages — flights,
                hotels and experiences — built around your budget and preferences.
              </p>
            </div>
          </div>
        </section>

        {/* ── EDITORIAL PROSE (SEO) ── */}
        <section className="tt-prose-sec" aria-labelledby="guide-h">
          <div className="tt-prose-in">
            <h2 id="guide-h">Your Complete Guide to Booking Cheap Flights from the UK</h2>
            <p>
              Whether you are planning a long weekend in Europe, a family fortnight in the sun or a once-in-a-lifetime
              long-haul adventure, finding a cheap flight is the foundation of any great trip. At Timms Travel,
              we compare fares from hundreds of airlines in real time, giving you the confidence that you are
              booking at the best possible price.
            </p>
            <p>
              The UK is one of the best-connected countries in the world for air travel. With major international
              hubs at Heathrow, Gatwick and Manchester — plus a strong network of regional airports — British
              travellers have access to more routes and airlines than almost anywhere else. That competition is
              good news for your wallet, and our search tool is designed to help you make the most of it.
            </p>

            <hr className="tt-hr" />

            <h3>How to Get the Best Deal on Flights</h3>
            <p>
              The single most important factor in securing a cheap flight is flexibility. The more open you are
              to adjusting your travel dates, departure airport or even destination, the more likely you are to
              find an exceptional fare. That said, even fixed plans can yield great prices if you know when and
              how to book.
            </p>
            <p>
              For European short-haul routes, fares tend to be lowest when booked six to eight weeks ahead. For
              long-haul destinations — the USA, Asia, the Caribbean and beyond — booking three to six months in
              advance generally delivers the best combination of choice and price. Last-minute deals do exist, but
              they are increasingly rare and unreliable, particularly for families or groups who need multiple seats.
            </p>

            <hr className="tt-hr" />

            <div className="tt-cols">
              <div>
                <h3>Short-Haul Flights from the UK</h3>
                <p>
                  Europe is the UK's playground, and with dozens of budget and full-service carriers operating
                  from regional airports, there is rarely a need to pay over the odds for a short break. Spain
                  remains Britain's most popular overseas destination, with Alicante, Malaga, Palma and Barcelona
                  all served by a wealth of carriers from airports including Manchester, Birmingham, Bristol and
                  London Gatwick.
                </p>
                <p>
                  Portugal — particularly Faro, Lisbon and Porto — is another outstanding-value destination,
                  offering reliable sunshine, excellent food and increasingly direct routes from regional UK
                  airports. Greece, Turkey and Italy round out the most popular short-haul choices, with shoulder-
                  season travel to these destinations often delivering remarkable value.
                </p>
              </div>
              <div>
                <h3>Long-Haul Flights from the UK</h3>
                <p>
                  For long-haul travel, London Heathrow remains the UK's primary gateway, with non-stop
                  connections to virtually every major city on the planet. Manchester has grown considerably as
                  a long-haul hub, with direct routes to the USA, Middle East, Caribbean and Far East operated
                  by carriers including Emirates, American Airlines and TUI.
                </p>
                <p>
                  The UAE — particularly Dubai (DXB) — is consistently one of the most competitively priced
                  long-haul destinations from the UK, both as a holiday in itself and as a connection point
                  for onward flights to Asia and Australia. New York, Bangkok, Cancún and the Maldives are
                  perennial long-haul favourites for British travellers seeking something more ambitious.
                </p>
              </div>
            </div>

            <hr className="tt-hr" />

            <h3>Understanding Flight Pricing</h3>
            <p>
              Flight pricing is dynamic — fares change constantly based on demand, remaining availability and
              competitor pricing. Several key factors influence what you will pay:
            </p>
            <p>
              <strong>Time of booking:</strong> Airlines release seats at various price points, with the cheapest
              fares selling first. Booking early is usually advantageous for peak periods such as summer, Easter
              and Christmas, when demand significantly outstrips supply.
            </p>
            <p>
              <strong>Day and time of departure:</strong> Flights departing on Tuesdays, Wednesdays and Saturdays
              tend to be cheaper than Monday morning or Friday afternoon departures, which are popular with
              business travellers. Early morning and late-night departures also tend to carry lower fares.
            </p>
            <p>
              <strong>Cabin class:</strong> Economy fares represent the best value for short and medium-haul
              routes. For long-haul journeys of ten hours or more, premium economy offers a significant comfort
              upgrade at a fraction of business class prices — worth considering for longer trips.
            </p>
            <p>
              <strong>Baggage and extras:</strong> Always factor in the full cost of travel when comparing fares.
              A headline price from a budget carrier that excludes cabin bags, seat selection and hold luggage
              may ultimately cost more than an all-inclusive fare from a full-service airline.
            </p>

            <hr className="tt-hr" />

            <h3>Flights from Manchester Airport (MAN)</h3>
            <p>
              Manchester Airport is the UK's busiest airport outside London, with direct flights to over 200
              destinations worldwide. It serves as a major hub for long-haul travel in the North of England,
              with non-stop routes to Dubai, New York, Los Angeles, Cancún and beyond. For European travel,
              Manchester is brilliantly connected to Spain, Portugal, Greece, Turkey and across Scandinavia.
              Airlines operating from Manchester include Jet2, TUI, Emirates, American Airlines, easyJet
              and Ryanair.
            </p>

            <h3>Flights from London</h3>
            <p>
              London is served by six airports: Heathrow (LHR), Gatwick (LGW), Stansted (STN), Luton (LTN),
              London City (LCY) and Southend (SEN). Heathrow is the flagship international gateway, home to
              British Airways, Virgin Atlantic and dozens of international carriers. Gatwick is the primary hub
              for budget airlines including easyJet and Norwegian. Stansted and Luton are the main bases for
              Ryanair routes across Europe, often serving secondary airports close to popular city destinations.
            </p>

            <h3>Flights from Birmingham, Bristol and Edinburgh</h3>
            <p>
              Regional airports continue to expand their route networks, making it more convenient than ever
              to fly without the need to travel to London first. Birmingham Airport (BHX) offers a solid
              selection of routes to Spain, Turkey, the USA and beyond. Bristol Airport (BRS) is particularly
              well served for flights to Portugal and the Canary Islands, while Edinburgh Airport (EDI) has
              grown into a significant hub for Scottish travellers, with direct connections to Dubai, New York
              and across Europe.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="tt-faq-sec" aria-labelledby="faq-h">
          <div className="tt-faq-in">
            <p className="tt-label" style={{ textAlign: 'center' }}>Got Questions?</p>
            <h2 className="tt-h2" id="faq-h" style={{ textAlign: 'center', marginBottom: 10 }}>
              Frequently Asked Questions
            </h2>
            <p className="tt-sub" style={{ textAlign: 'center', margin: '0 auto 44px', maxWidth: 520 }}>
              Everything you need to know about booking cheap flights from the UK.
            </p>

            <div itemScope itemType="https://schema.org/FAQPage">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="tt-faq-item"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <button
                    className="tt-faq-btn"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-${i}`}
                  >
                    <span className="tt-faq-q" itemProp="name">{faq.q}</span>
                    <span className={`tt-chev${openFaq === i ? ' open' : ''}`} aria-hidden="true">▾</span>
                  </button>
                  {openFaq === i && (
                    <div
                      id={`faq-${i}`}
                      className="tt-faq-a"
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                    >
                      <span itemProp="text">{faq.a}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="tt-cta" aria-labelledby="cta-h">
          <h2 id="cta-h">Ready to Find Your Next Flight?</h2>
          <p>
            Use our search tool above to compare live fares from hundreds of airlines.
            No hidden charges — just the best prices, simply presented.
          </p>
          <button
            className="tt-cta-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll back to flight search"
          >
            Search Flights Now →
          </button>
        </section>

        <Footer />
      </main>
    </>
  )
}