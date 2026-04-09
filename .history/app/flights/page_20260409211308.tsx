'use client'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'
import { useEffect, useRef } from 'react'

// -----------------------------
// TOP DEALS WIDGET (WORKING)
// -----------------------------
function AviasalesTopDeals() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    ref.current.innerHTML = ""

    const script = document.createElement("script")
    script.src =
      "https://tpemb.com/content?currency=gbp&trs=513651&shmarker=714930&target_host=www.aviasales.com%2Fsearch&locale=en&limit=6&powered_by=true&primary=%230085FF&promo_id=4044&campaign_id=100"
    script.async = true
    script.charset = "utf-8"

    ref.current.appendChild(script)
  }, [])

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl shadow-md p-6"
    />
  )
}

// -----------------------------
// CALENDAR WIDGET
// -----------------------------
function AviasalesCalendar() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const script = document.createElement('script')
    script.src = `//www.travelpayouts.com/calendar_widget/iframe.js?marker=714930&origin=MAN&currency=gbp&searchUrl=www.aviasales.com&one_way=false&only_direct=false&locale=en&period=year&range=7,14&powered_by=false&width=800`
    script.async = true
    script.charSet = 'utf-8'
    ref.current.appendChild(script)
    return () => {
  if (ref.current) {
    ref.current.innerHTML = ''
  }
}

  }, [])

  return <div ref={ref} className="w-full overflow-x-auto" />
}

// -----------------------------
// FEATURED DESTINATIONS (STATIC CARDS)
// -----------------------------
const destinations = [
  { city: 'London',    emoji: '🏙️' },
  { city: 'Barcelona', emoji: '⛪' },
  { city: 'New York',  emoji: '🗽' },
  { city: 'Paris',     emoji: '🗼' },
  { city: 'Dubai',     emoji: '🌆' },
  { city: 'Orlando',   emoji: '🎢' },
]

// -----------------------------
// PAGE
// -----------------------------
export default function FlightsPage() {
  return (
    <main className="min-h-screen bg-white">

      <Navbar />

      {/* HERO */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white py-24 px-6 text-center">
        <p className="text-sm uppercase tracking-widest text-teal-400 mb-3 font-medium">
          Powered by Aviasales
        </p>

        <h1 className="text-5xl font-bold mb-4">
          Find Your Perfect Flight ✈️
        </h1>

        <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
          Compare hundreds of airlines instantly — real prices, no hidden fees.
        </p>

        {/* PAGE TABS */}
        <div className="flex justify-center gap-6 mb-8">
          {[
            { label: 'Flights',     href: '/flights' },
            { label: 'Hotels',      href: '/hotels' },
            { label: 'Experiences', href: '/experiences' },
            { label: 'Cars',        href: '/hire-cars' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`pb-2 text-lg font-medium transition ${
                label === 'Flights'
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          <FlightSearch />
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Featured Destinations
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Hand‑picked destinations our travellers love
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.city}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{dest.emoji}</span>
                  <p className="font-bold text-lg" style={{ color: '#232e4e' }}>
                    {dest.city}
                  </p>
                </div>
                <p className="text-xs text-gray-400">Popular with UK travellers</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE TOP DEALS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Live Flight Deals
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Real‑time prices from Aviasales — updated constantly
          </p>

          <AviasalesTopDeals />
        </div>
      </section>

      {/* CALENDAR */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Cheapest Dates to Fly
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Explore the lowest fares across the whole year
          </p>

          <div className="bg-white rounded-2xl shadow-md p-4 overflow-hidden">
            <AviasalesCalendar />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
