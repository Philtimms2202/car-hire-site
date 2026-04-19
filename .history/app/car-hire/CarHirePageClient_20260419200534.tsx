'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CarSearch from '@/app/components/Search/CarSearch'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import NextImage from 'next/image'

// -----------------------------
// CAR CATEGORIES
// carType values from Trip.com's filter param:
// Economy=1, Compact=2, Intermediate=3, Standard=4, Fullsize=5,
// Premium=6, Luxury=7, Minivan=8, SUV=9
// -----------------------------
const AFFILIATE = 'Allianceid=8052073&SID=304662590&trip_sub1=&trip_sub3=D15170094'
const CHANNEL = '235728'

// Default pick-up: Manchester Airport (MAN) - matches CarSearch default
const MAN = {
  pcity: 722, scountry: 109, iata: 'MAN',
  lat: 53.3537, lon: -2.275, timezone: 0,
  airportName: 'Manchester Airport',
}

const buildCarTypeUrl = (carType: number) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const weekLater = new Date()
  weekLater.setDate(weekLater.getDate() + 8)
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  const fmtTrip = (date: string, time: string) => `${date.replace(/-/g, '/')} ${time}`
  const pu = fmt(tomorrow)
  const dr = fmt(weekLater)
  const params = new URLSearchParams({
    pcity: String(MAN.pcity),
    pcityName: MAN.airportName,
    pcityname: MAN.airportName,
    pcode: MAN.iata,
    ptype: '1',
    plat: String(MAN.lat),
    plon: String(MAN.lon),
    paddress: `${MAN.airportName} (${MAN.iata})`,
    ptimezone: String(MAN.timezone),
    rcity: String(MAN.pcity),
    rcityName: MAN.airportName,
    rcityname: MAN.airportName,
    rcode: MAN.iata,
    rtype: '1',
    rlat: String(MAN.lat),
    rlon: String(MAN.lon),
    raddress: `${MAN.airportName} (${MAN.iata})`,
    rtimezone: String(MAN.timezone),
    ptime: fmtTrip(pu, '10:00'),
    rtime: fmtTrip(dr, '10:00'),
    scountry: String(MAN.scountry),
    age: '30-60',
    channelid: CHANNEL,
    locale: 'en-XX',
    carType: String(carType),
  })
  return `https://www.trip.com/carhire/online/list?${params.toString()}&${AFFILIATE}`
}

const carCategories = [
  {
    emoji: '🚗',
    label: 'Small',
    examples: 'VW Polo, Ford Fiesta, Renault Clio',
    best: 'City breaks, solo or couple travel, tight parking',
    seats: '4–5',
    luggage: '1–2 bags',
    carType: 1,
    accent: '#3b82f6',
  },
  {
    emoji: '🚙',
    label: 'Medium',
    examples: 'VW Golf, Toyota Corolla, Ford Focus',
    best: 'Family holidays, airport transfers, flexible touring',
    seats: '5',
    luggage: '2–3 bags',
    carType: 3,
    accent: '#8b5cf6',
  },
  {
    emoji: '🚐',
    label: 'Large',
    examples: 'Ford Mondeo, Skoda Octavia, Vauxhall Insignia',
    best: 'Groups, long road trips, lots of luggage',
    seats: '5',
    luggage: '3–4 bags',
    carType: 5,
    accent: '#f59e0b',
  },
  {
    emoji: '🚌',
    label: 'People Carrier',
    examples: 'Ford Galaxy, VW Sharan, Renault Espace',
    best: 'Large families or groups, airport runs with lots of bags',
    seats: '7',
    luggage: '4–5 bags',
    carType: 8,
    accent: '#10b981',
  },
  {
    emoji: '🛻',
    label: 'SUV / 4x4',
    examples: 'Nissan Qashqai, Toyota RAV4, Jeep Renegade',
    best: 'Mountainous terrain, rural roads, winter destinations',
    seats: '5',
    luggage: '3–4 bags',
    carType: 9,
    accent: '#ef4444',
  },
  {
    emoji: '✨',
    label: 'Luxury',
    examples: 'BMW 5 Series, Mercedes E-Class, Audi A6',
    best: 'Business travel, special occasions, premium comfort',
    seats: '5',
    luggage: '3 bags',
    carType: 7,
    accent: '#232e4e',
  },
]

// -----------------------------
// TRANSMISSION TYPES
// -----------------------------
const transmissions = [
  {
    type: 'Manual',
    icon: '⚙️',
    tagline: 'The traveller\'s classic',
    desc: 'The most widely available option worldwide. Lower hire cost, better fuel efficiency, and standard across most of Europe. Best if you are a confident manual driver.',
    pros: ['Usually cheaper to hire', 'More widely available', 'Better fuel economy'],
    cons: ['Not ideal if unused to driving abroad', 'Can be tiring in heavy traffic'],
    bg: '#232e4e',
    highlight: '#3b82f6',
  },
  {
    type: 'Automatic',
    icon: '🤖',
    tagline: 'Effortless on any road',
    desc: 'Increasingly common, especially in the USA, Canada and UAE. Easier to drive in busy cities or on unfamiliar roads. Worth specifying when you search if this is your preference.',
    pros: ['Easier to drive in traffic', 'Ideal for unfamiliar roads', 'Standard in USA & UAE'],
    cons: ['Can be slightly more expensive', 'Less available in some European countries'],
    bg: '#f8fafc',
    highlight: '#10b981',
  },
]

// -----------------------------
// FAQ
// -----------------------------
const faqs = [
  {
    q: 'What documents do I need to hire a car?',
    a: 'You will typically need a full valid driving licence, your passport or ID, and the credit or debit card used to make the booking. Some countries require an International Driving Permit (IDP) in addition to your licence - check the requirements for your destination before you travel.',
  },
  {
    q: 'What age do I need to be to hire a car?',
    a: 'Most hire companies require drivers to be at least 21 years old, though some set the minimum at 25. Drivers under 25 often pay a "young driver surcharge". At the other end, some suppliers have a maximum age of 70–75. Always check the age policy when booking.',
  },
  {
    q: 'What is included in the hire price?',
    a: 'Standard hire usually includes third-party liability insurance, a set mileage allowance (or unlimited mileage), and basic collision damage waiver (CDW). Extras like full insurance excess protection, roadside assistance, additional drivers, and child seats are usually charged separately.',
  },
  {
    q: 'Should I take out excess insurance?',
    a: 'We strongly recommend it. Even with CDW included, you are typically liable for an excess of £500–£2,000 if the car is damaged. You can reduce this to zero by purchasing excess insurance either through the hire company or via a specialist provider before you travel - the latter is often cheaper.',
  },
  {
    q: 'Can I pick up and drop off at different locations?',
    a: 'Yes - most hire companies allow one-way rentals, though a drop-off fee may apply, particularly for cross-border or long-distance returns. Use the "drop off at a different location" option in the search above.',
  },
  {
    q: 'What fuel policy should I look for?',
    a: 'The most common policies are "full to full" (you collect with a full tank and return it full - fairest option) and "full to empty" (you pay for a full tank upfront and return it empty). Always check the fuel policy before you book to avoid unexpected charges.',
  },
  {
    q: 'Do I need a credit card to hire a car?',
    a: 'Most hire companies require a credit card for the security deposit, even if you paid for the hire with a debit card. The deposit is usually pre-authorised (not charged) and released when you return the car undamaged. Check the deposit amount before you travel.',
  },
  {
    q: 'Can I take the hire car to another country?',
    a: 'It depends on your supplier and the countries involved. Cross-border travel is often permitted within the EU but may require advance notice and an additional fee. Travel to some countries (e.g. Eastern Europe, North Africa) may be restricted entirely. Always declare your plans when booking.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition"
      >
        <span>{q}</span>
        <span className="text-xl text-gray-400 ml-4 shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {a}
        </div>
      )}
    </div>
  )
}

// -----------------------------
// AFFILIATE CONFIG - also used in CarSearch
// -----------------------------

type CarDest = {
  city: string
  country: string
  emoji?: string
  tagline?: string
  drive?: string
  highlights?: string
  pcity: number
  scountry: number
  iata: string
  lat: number
  lon: number
  timezone: number
  airportName: string
}

// -----------------------------
// DEEP LINK BUILDER
// Mirrors the logic in your CarSearch handleSearch
// -----------------------------
const buildDestUrl = (dest: CarDest) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const weekLater = new Date()
  weekLater.setDate(weekLater.getDate() + 8)

  const fmt = (d: Date) => d.toISOString().split('T')[0]
  const fmtTrip = (date: string, time: string) => `${date.replace(/-/g, '/')} ${time}`

  const pu = fmt(tomorrow)
  const dr = fmt(weekLater)

  const params = new URLSearchParams({
    pcity: String(dest.pcity),
    pcityName: dest.airportName,
    pcityname: dest.airportName,
    pcode: dest.iata,
    ptype: '1',
    plat: String(dest.lat),
    plon: String(dest.lon),
    paddress: `${dest.airportName} (${dest.iata})`,
    ptimezone: String(dest.timezone),
    rcity: String(dest.pcity),
    rcityName: dest.airportName,
    rcityname: dest.airportName,
    rcode: dest.iata,
    rtype: '1',
    rlat: String(dest.lat),
    rlon: String(dest.lon),
    raddress: `${dest.airportName} (${dest.iata})`,
    rtimezone: String(dest.timezone),
    ptime: fmtTrip(pu, '10:00'),
    rtime: fmtTrip(dr, '10:00'),
    scountry: String(dest.scountry),
    age: '30-60',
    channelid: CHANNEL,
    locale: 'en-XX',
  })

  return `https://www.trip.com/carhire/online/list?${params.toString()}&${AFFILIATE}`
}

// -----------------------------
// DATA - pcity/scountry/iata match your CarSearch TRIP_AIRPORTS
// -----------------------------
const featuredDestinations: CarDest[] = [
  {
    city: 'Malaga', country: 'Spain', emoji: '🌞',
    tagline: 'Gateway to the Costa del Sol',
    pcity: 271, scountry: 182, iata: 'AGP',
    lat: 36.6749, lon: -4.4991, timezone: 1,
    airportName: 'Malaga Airport',
  },
  {
    city: 'Palma', country: 'Spain', emoji: '🏖️',
    tagline: 'Island roads and mountain passes',
    pcity: 280, scountry: 182, iata: 'PMI',
    lat: 39.5517, lon: 2.7388, timezone: 1,
    airportName: 'Palma de Mallorca Airport',
  },
  {
    city: 'Barcelona', country: 'Spain', emoji: '⛪',
    tagline: 'City, coast and Catalunya beyond',
    pcity: 235, scountry: 182, iata: 'BCN',
    lat: 41.2974, lon: 2.0833, timezone: 1,
    airportName: 'El Prat Airport',
  },
  {
    city: 'Orlando', country: 'USA', emoji: '🎢',
    tagline: 'Theme parks, beaches and the Keys',
    pcity: 413, scountry: 66, iata: 'MCO',
    lat: 28.4312, lon: -81.3081, timezone: -5,
    airportName: 'Orlando Intl Airport',
  },
  {
    city: 'Dubai', country: 'UAE', emoji: '🌆',
    tagline: 'Desert highways and coastal drives',
    pcity: 381, scountry: 207, iata: 'DXB',
    lat: 25.2532, lon: 55.3657, timezone: 4,
    airportName: 'Dubai Intl Airport',
  },
  {
    city: 'Lisbon', country: 'Portugal', emoji: '🏰',
    tagline: 'Atlantic coast and hidden hilltowns',
    pcity: 259, scountry: 167, iata: 'LIS',
    lat: 38.7813, lon: -9.1359, timezone: 0,
    airportName: 'Lisbon Airport',
  },
]

const roadTripSeasons: { season: string; emoji: string; items: CarDest[] }[] = [
  {
    season: 'Spring', emoji: '🌸',
    items: [
      {
        city: 'Lisbon', country: 'Portugal',
        drive: 'Atlantic coast highways',
        highlights: 'Sintra, Cascais & Setúbal Peninsula',
        pcity: 259, scountry: 167, iata: 'LIS',
        lat: 38.7813, lon: -9.1359, timezone: 0,
        airportName: 'Lisbon Airport',
      },
      {
        city: 'Rome', country: 'Italy',
        drive: 'Amalfi & Tuscan hill roads',
        highlights: 'Pompeii, Siena & Chianti vineyards',
        pcity: 130, scountry: 110, iata: 'FCO',
        lat: 41.8003, lon: 12.2389, timezone: 1,
        airportName: 'Fiumicino Airport',
      },
      {
        city: 'Malaga', country: 'Spain',
        drive: 'Costa del Sol & White Villages',
        highlights: 'Marbella, Ronda & Gibraltar',
        pcity: 271, scountry: 182, iata: 'AGP',
        lat: 36.6749, lon: -4.4991, timezone: 1,
        airportName: 'Malaga Airport',
      },
    ],
  },
  {
    season: 'Summer', emoji: '☀️',
    items: [
      {
        city: 'Palma', country: 'Spain',
        drive: 'Tramuntana mountain road',
        highlights: 'Valldemossa, Sóller & Cap Formentor',
        pcity: 280, scountry: 182, iata: 'PMI',
        lat: 39.5517, lon: 2.7388, timezone: 1,
        airportName: 'Palma de Mallorca Airport',
      },
      {
        city: 'Athens', country: 'Greece',
        drive: 'Peloponnese & island ferries',
        highlights: 'Nafplio, Olympia & Monemvasia',
        pcity: 17, scountry: 85, iata: 'ATH',
        lat: 37.9364, lon: 23.9445, timezone: 2,
        airportName: 'Athens Intl Airport',
      },
      {
        city: 'Miami', country: 'USA',
        drive: 'Florida Keys Overseas Highway',
        highlights: 'Key Largo, Marathon & Key West',
        pcity: 359, scountry: 66, iata: 'MIA',
        lat: 25.7959, lon: -80.2870, timezone: -5,
        airportName: 'Miami Intl Airport',
      },
    ],
  },
  {
    season: 'Autumn', emoji: '🍂',
    items: [
      {
        city: 'Barcelona', country: 'Spain',
        drive: 'Catalunya scenic routes',
        highlights: 'Montserrat, Costa Brava & Pyrenees',
        pcity: 235, scountry: 182, iata: 'BCN',
        lat: 41.2974, lon: 2.0833, timezone: 1,
        airportName: 'El Prat Airport',
      },
      {
        city: 'Milan', country: 'Italy',
        drive: 'Italian Lakes & Dolomites',
        highlights: 'Lake Como, Lago Maggiore & Bolzano',
        pcity: 122, scountry: 110, iata: 'MXP',
        lat: 45.6306, lon: 8.7281, timezone: 1,
        airportName: 'Malpensa Airport',
      },
      {
        city: 'Las Vegas', country: 'USA',
        drive: 'American Southwest road trip',
        highlights: 'Grand Canyon, Zion & Bryce Canyon',
        pcity: 340, scountry: 66, iata: 'LAS',
        lat: 36.0840, lon: -115.1537, timezone: -8,
        airportName: 'Harry Reid Intl Airport',
      },
    ],
  },
  {
    season: 'Winter', emoji: '❄️',
    items: [
      {
        city: 'Dubai', country: 'UAE',
        drive: 'Desert & coastal highways',
        highlights: 'Abu Dhabi, Al Ain & Hatta mountains',
        pcity: 381, scountry: 207, iata: 'DXB',
        lat: 25.2532, lon: 55.3657, timezone: 4,
        airportName: 'Dubai Intl Airport',
      },
      {
        city: 'Cape Town', country: 'South Africa',
        drive: 'Garden Route & Cape Peninsula',
        highlights: 'Hermanus, Knysna & Storms River',
        pcity: 39, scountry: 178, iata: 'CPT',
        lat: -33.9648, lon: 18.6017, timezone: 2,
        airportName: 'Cape Town Intl Airport',
      },
      {
        city: 'Bangkok', country: 'Thailand',
        drive: 'Northern Thailand loop',
        highlights: 'Chiang Mai, Pai & Mae Hong Son',
        pcity: 30, scountry: 193, iata: 'BKK',
        lat: 13.6900, lon: 100.7501, timezone: 7,
        airportName: 'Suvarnabhumi Airport',
      },
    ],
  },
]

// -----------------------------
// PAGE
// -----------------------------
export default function CarsPageClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'experiences' | 'cars'>('cars')

  const handleTabClick = (tab: 'flights' | 'hotels' | 'experiences' | 'cars') => {
    if (tab === 'flights') router.push('/')
    else if (tab === 'hotels') router.push('/hotels')
    else if (tab === 'experiences') router.push('/experiences')
    else setActiveTab(tab)
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

{/* ── HERO ── */}
<section className="relative overflow-hidden text-white py-24 px-6 text-center">
  {/* Unsplash background image */}
  <NextImage
    src="https://images.unsplash.com/photo-1667926829143-a9b83ce9fb62?q=80"
    alt="Car driving on an open road"
    fill
    className="object-cover object-[center_30%]"
    priority
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-[#232e4e]/75 z-0" />

  <div className="relative z-10 max-w-3xl mx-auto">
    <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
      Timms Travel · Car Hire
    </p>
    <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
      Find Your Perfect Hire Car
    </h1>
    <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto mb-10">
      Compare hundreds of car hire deals instantly - great prices, no hidden fees.
    </p>

    {/* SEARCH TABS */}
    <div className="flex justify-center gap-1 mb-6 bg-white/10 rounded-2xl p-1 max-w-sm mx-auto">
      {(['flights', 'hotels', 'experiences', 'cars'] as const).map(tab => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
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

      {/* WHY HIRE A CAR */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
            Why Hire a Car?
          </h2>
          <p className="text-gray-500 mb-10">More freedom. More adventure. Your holiday, your way.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { emoji: '🗺️', title: 'Explore at Your Pace', desc: 'Skip the tour bus and discover hidden gems on your own schedule.' },
              { emoji: '💰', title: 'Great Value Deals', desc: 'We search hundreds of suppliers so you always get a competitive rate.' },
              { emoji: '🚗', title: 'Huge Choice of Cars', desc: 'Economy runabouts to premium SUVs - find the right car for your trip.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl shadow-md p-6">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Popular Car Hire Destinations
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Click any destination to see live availability and prices
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((dest) => (
              <div
                key={dest.iata}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{dest.emoji}</span>
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#232e4e' }}>{dest.city}</p>
                    <p className="text-xs text-gray-400">{dest.country}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">{dest.tagline}</p>
                <button
                  type="button"
                  onClick={() => window.open(buildDestUrl(dest), '_blank')}
                  className="text-blue-600 font-semibold hover:underline text-sm"
                >
                  View car hire deals →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROAD TRIPS BY SEASON */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Road Trips by Season
          </h2>
          <p className="text-center text-gray-500 mb-10">
            The best driving destinations depending on when you're travelling.
          </p>

          {roadTripSeasons.map(({ season, emoji, items }) => (
            <div key={season} className="mb-14">
              <h3
                className="text-2xl font-semibold mb-4 flex items-center gap-2"
                style={{ color: '#232e4e' }}
              >
                <span>{emoji}</span> {season}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((dest) => (
                  <div
                    key={dest.iata + season}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                  >
                    <p className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>{dest.city}</p>
                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p><strong>Drive:</strong> {dest.drive}</p>
                      <p><strong>Highlights:</strong> {dest.highlights}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open(buildDestUrl(dest), '_blank')}
                      className="text-blue-600 font-semibold hover:underline text-sm"
                    >
                      View car hire deals →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CAR CATEGORIES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Which Car Size Is Right for You?
          </h2>
          <p className="text-center text-gray-500 mb-10">
            From city runabouts to spacious people carriers - choose the right car for your trip.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {carCategories.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => window.open(buildCarTypeUrl(cat.carType), '_blank')}
                className="text-left bg-white border-2 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer"
                style={{ borderColor: cat.accent }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-2xl w-11 h-11 flex items-center justify-center rounded-xl shrink-0"
                    style={{ backgroundColor: cat.accent + '18' }}
                  >
                    {cat.emoji}
                  </span>
                  <h3 className="font-bold text-lg" style={{ color: '#232e4e' }}>{cat.label}</h3>
                </div>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Examples</p>
                <p className="text-sm text-gray-700 mb-3">{cat.examples}</p>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Best for</p>
                <p className="text-sm text-gray-700 mb-4">{cat.best}</p>
                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <span>👥 {cat.seats} seats</span>
                  <span>🧳 {cat.luggage}</span>
                </div>
                <span
                  className="text-sm font-semibold group-hover:underline"
                  style={{ color: cat.accent }}
                >
                  Search {cat.label} cars →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSMISSION TYPES */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Manual or Automatic?
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Understanding the difference could save you money and stress on the road.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {transmissions.map((t) => (
              <div
                key={t.type}
                className="rounded-2xl overflow-hidden shadow-lg"
                style={{ backgroundColor: t.bg }}
              >
                {/* Header */}
                <div className="px-8 pt-8 pb-6" style={{ borderBottom: `1px solid ${t.type === 'Manual' ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}` }}>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-4xl">{t.icon}</span>
                    <div>
                      <p
                        className="text-xs font-semibold uppercase tracking-widest mb-0.5"
                        style={{ color: t.highlight }}
                      >
                        {t.tagline}
                      </p>
                      <h3
                        className="text-2xl font-bold"
                        style={{ color: t.type === 'Manual' ? '#ffffff' : '#232e4e' }}
                      >
                        {t.type}
                      </h3>
                    </div>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: t.type === 'Manual' ? 'rgba(255,255,255,0.7)' : '#6b7280' }}
                  >
                    {t.desc}
                  </p>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-2 gap-0">
                  <div className="px-8 py-6" style={{ borderRight: `1px solid ${t.type === 'Manual' ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}` }}>
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-3"
                      style={{ color: t.highlight }}
                    >
                      Pros
                    </p>
                    <ul className="space-y-2">
                      {t.pros.map(p => (
                        <li key={p} className="flex gap-2 items-start">
                          <span style={{ color: t.highlight }} className="shrink-0 font-bold">✓</span>
                          <span
                            className="text-sm"
                            style={{ color: t.type === 'Manual' ? 'rgba(255,255,255,0.8)' : '#374151' }}
                          >
                            {p}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-8 py-6">
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-3"
                      style={{ color: t.type === 'Manual' ? 'rgba(255,255,255,0.4)' : '#9ca3af' }}
                    >
                      Cons
                    </p>
                    <ul className="space-y-2">
                      {t.cons.map(c => (
                        <li key={c} className="flex gap-2 items-start">
                          <span
                            className="shrink-0 font-bold"
                            style={{ color: t.type === 'Manual' ? 'rgba(255,255,255,0.3)' : '#d1d5db' }}
                          >
                            ✕
                          </span>
                          <span
                            className="text-sm"
                            style={{ color: t.type === 'Manual' ? 'rgba(255,255,255,0.5)' : '#6b7280' }}
                          >
                            {c}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Everything you need to know before hiring a car abroad.
          </p>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}