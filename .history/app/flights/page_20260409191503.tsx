'use client'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlightSearch from '@/app/components/Search/FlightSearch'
import Script from 'next/script'
import { useEffect, useRef } from 'react'

// Aviasales Popular Routes Widget per destination
function AviasalesWidget({ destination, destinationName }: { destination: string; destinationName: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const script = document.createElement('script')
    script.src = `//www.travelpayouts.com/weedle/widget.js?marker=714930&host=hydra.aviasales.com&locale=en&currency=gbp&destination=${destination}&destination_name=${encodeURIComponent(destinationName)}`
    script.async = true
    script.charSet = 'utf-8'
    ref.current.appendChild(script)
    return () => {
      if (ref.current) ref.current.innerHTML = ''
    }
  }, [destination, destinationName])

  return <div ref={ref} className="w-full" />
}

// Aviasales Calendar Widget — cheapest dates from Manchester
function AviasalesCalendar() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const script = document.createElement('script')
    script.src = `//www.travelpayouts.com/calendar_widget/iframe.js?marker=714930&origin=MAN&currency=gbp&searchUrl=hydra.aviasales.com&one_way=false&only_direct=false&locale=en&period=year&range=7,14&powered_by=false&width=800`
    script.async = true
    script.charSet = 'utf-8'
    ref.current.appendChild(script)
    return () => {
      if (ref.current) ref.current.innerHTML = ''
    }
  }, [])

  return <div ref={ref} className="w-full overflow-x-auto" />
}

const destinations = [
  { city: 'London',    iata: 'LON', emoji: '🏙️' },
  { city: 'Barcelona', iata: 'BCN', emoji: '⛪' },
  { city: 'New York',  iata: 'NYC', emoji: '🗽' },
  { city: 'Paris',     iata: 'PAR', emoji: '🗼' },
  { city: 'Dubai',     iata: 'DXB', emoji: '🌆' },
  { city: 'Orlando',   iata: 'MCO', emoji: '🎢' },
]

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
          Compare hundreds of airlines instantly — real prices, no hidden fees, the best deal every time.
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

        {/* SEARCH WIDGET */}
        <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
          <FlightSearch />
        </div>

        {/* Trust bar */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-gray-300">
          <span>✓ Hundreds of airlines compared</span>
          <span>✓ No hidden fees</span>
          <span>✓ Best price guarantee</span>
        </div>
      </section>

      {/* LIVE DEAL CARDS — Aviasales Popular Routes Widgets */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Live Flight Deals
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Real-time prices from hundreds of airlines — updated daily
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.iata}
                className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{dest.emoji}</span>
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#232e4e' }}>{dest.city}</p>
                    <p className="text-xs text-gray-400">Live prices · via Aviasales</p>
                  </div>
                </div>
                <AviasalesWidget destination={dest.iata} destinationName={dest.city} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALENDAR WIDGET — cheapest dates */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            Cheapest Dates to Fly
          </h2>
          <p className="text-center text-gray-500 mb-10">
            See the lowest fares across the whole year — find your perfect window to travel
          </p>
          <div className="bg-white rounded-2xl shadow-md p-4 overflow-hidden">
            <AviasalesCalendar />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#232e4e' }}>
            How It Works
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Finding your perfect flight has never been easier.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: 1, title: 'Search', text: 'Enter your departure city, destination, and travel dates to instantly search hundreds of airlines and travel sites.' },
              { n: 2, title: 'Compare', text: "Browse live results from the world's leading flight comparison engine, powered by Aviasales." },
              { n: 3, title: 'Book', text: 'Choose your perfect flight and book securely. Add hotels and experiences to complete your trip.' },
            ].map(({ n, title, text }) => (
              <div key={n} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4"
                  style={{ backgroundColor: '#2f797c' }}
                >
                  {n}
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-gray-500 leading-7">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '500+', label: 'Airlines Compared' },
            { stat: '100+', label: 'Countries Covered' },
            { stat: '1000+', label: 'Routes Available' },
            { stat: '24/7', label: 'Customer Support' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>{stat}</p>
              <p className="text-gray-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { emoji: '✈️', title: 'Hundreds of Airlines', text: 'We compare all major carriers and budget airlines in one search' },
            { emoji: '💰', title: 'Best Price Guarantee', text: "We search all major providers so you don't have to" },
            { emoji: '🛡️', title: 'Flexible Bookings', text: 'Plans change — we get it. Easy amendments available' },
          ].map(({ emoji, title, text }) => (
            <div key={title}>
              <div className="text-4xl mb-3">{emoji}</div>
              <h3 className="font-bold text-lg mb-1" style={{ color: '#232e4e' }}>{title}</h3>
              <p className="text-gray-500 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />

    </main>
  )
}
