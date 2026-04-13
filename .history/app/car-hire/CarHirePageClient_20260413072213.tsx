'use client'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CarSearch from '@/app/components/Search/CarSearch'

// -----------------------------
// AFFILIATE CONFIG
// -----------------------------
const AFFILIATE = 'Allianceid=8052073&SID=304662590&trip_sub1=&trip_sub3=D15170094'
const CHANNEL = '235728'

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
// DATA — pcity/scountry/iata match your CarSearch TRIP_AIRPORTS
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
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-24 px-6 text-center"
      >
        <h1 className="text-5xl font-bold mb-4">
          Find Your Perfect Hire Car!
        </h1>
        <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Compare hundreds of car hire deals instantly — great prices, no hidden fees.
        </p>

        <div className="max-w-2xl mx-auto">
          <CarSearch />
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
              { emoji: '💰', title: 'Great Value Deals', desc: "We search Trip.com's full inventory so you always get a competitive rate." },
              { emoji: '🚗', title: 'Huge Choice of Cars', desc: 'Economy runabouts to premium SUVs — find the right car for your trip.' },
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
            Click any destination to see live availability on Trip.com
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

      <Footer />
    </main>
  )
}