'use client'

// ============================================================
// app/flights/page.tsx  — Master Flights Page
// ============================================================

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { continents, destinations } from './data/flightData'

// ─── Aviasales Search Form Widget ────────────────────────
function AviasalesSearchForm() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.querySelector('script')) return
    const script = document.createElement('script')
    // Your embed with colours matched to your brand
    script.src = [
      'https://tpemb.com/content?',
      'currency=gbp',
      '&trs=513651',
      '&shmarker=714930',
      '&show_hotels=false',
      '&powered_by=false',
      '&locale=en',
      '&searchUrl=www.aviasales.com%2Fsearch',
      '&primary_override=%232f797c',   // your teal
      '&color_button=%232f797c',
      '&color_icons=%232f797c',
      '&dark=%23232e4e',               // your navy
      '&light=%23FFFFFF',
      '&secondary=%23FFFFFF',
      '&special=%23C4C4C4',
      '&color_focused=%232f797c',
      '&border_radius=8',
      '&plain=false',
      '&promo_id=7879',
      '&campaign_id=100',
    ].join('')
    script.async = true
    script.charSet = 'utf-8'
    ref.current.appendChild(script)
  }, [])

  return <div ref={ref} className="w-full min-h-[80px]" />
}

// Featured destinations — hand-picked for the hero grid
const featured = [
  { slug: 'barcelona', name: 'Barcelona', iata: 'BCN', emoji: '⛪', country: 'Spain', tag: 'City Break' },
  { slug: 'dubai',     name: 'Dubai',     iata: 'DXB', emoji: '🌆', country: 'UAE',   tag: 'Luxury' },
  { slug: 'new-york',  name: 'New York',  iata: 'NYC', emoji: '🗽', country: 'USA',   tag: 'Icon' },
  { slug: 'tokyo',     name: 'Tokyo',     iata: 'TYO', emoji: '🏯', country: 'Japan', tag: 'Adventure' },
  { slug: 'lisbon',    name: 'Lisbon',    iata: 'LIS', emoji: '🚋', country: 'Portugal', tag: 'Trending' },
  { slug: 'bali',      name: 'Bali',      iata: 'DPS', emoji: '🌺', country: 'Indonesia', tag: 'Beach' },
]

export default function FlightsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#232e4e' }} className="text-white pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">

          {/* Page tabs */}
          <div className="flex justify-center gap-6 mb-10">
            {[
              { label: 'Flights',     href: '/flights' },
              { label: 'Hotels',      href: '/hotels' },
              { label: 'Experiences', href: '/experiences' },
              { label: 'Cars',        href: '/hire-cars' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className={`pb-2 text-base font-medium transition ${
                  label === 'Flights'
                    ? 'border-b-2 border-white text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          <p className="text-sm uppercase tracking-widest mb-3 font-medium" style={{ color: '#03989e' }}>
            Powered by Aviasales
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Search Hundreds of Airlines.<br />One Search. Best Price.
          </h1>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Compare flights to anywhere in the world — from budget to business class.
          </p>

          {/* Aviasales search form */}
          <div className="bg-white rounded-2xl p-5 shadow-2xl text-black">
            <AviasalesSearchForm />
          </div>

          {/* Trust bar */}
          <div className="flex flex-wrap justify-center gap-6 mt-7 text-sm text-gray-400">
            <span>✓ 500+ airlines compared</span>
            <span>✓ No booking fees</span>
            <span>✓ 100+ countries</span>
            <span>✓ Best price guarantee</span>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CONTINENT ──────────────────────────── */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#232e4e' }}>Browse by Region</h2>
          <p className="text-gray-500 text-sm mb-8">Where in the world are you headed?</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {continents.map((c) => (
              <a
                key={c.slug}
                href={`/flights/to/${c.slug}`}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition group border border-gray-100 hover:border-teal-200"
              >
                <div className="text-3xl mb-2">{c.emoji}</div>
                <p className="text-xs font-semibold" style={{ color: '#232e4e' }}>{c.name}</p>
                <p className="text-xs mt-1 group-hover:underline" style={{ color: '#2f797c' }}>Explore →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DESTINATIONS ────────────────────────── */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: '#232e4e' }}>Popular Destinations</h2>
              <p className="text-gray-500 text-sm">Hand-picked routes with great deals right now</p>
            </div>
            <a href="/flights/to/europe" className="text-sm font-medium hidden md:block" style={{ color: '#2f797c' }}>
              View all →
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featured.map((dest) => (
              <a
                key={dest.slug}
                href={`/flights/to/${dest.slug}`}
                className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl transition overflow-hidden"
              >
                {/* Tag */}
                <span
                  className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: '#2f797c' }}
                >
                  {dest.tag}
                </span>

                <div className="text-4xl mb-3">{dest.emoji}</div>
                <p className="font-bold text-lg" style={{ color: '#232e4e' }}>{dest.name}</p>
                <p className="text-xs text-gray-400 mb-4">{dest.country}</p>
                <span
                  className="text-xs font-semibold group-hover:underline"
                  style={{ color: '#2f797c' }}
                >
                  Find flights →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR ROUTES (text links — great for SEO) ── */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#232e4e' }}>Popular Routes</h2>
          <p className="text-gray-500 text-sm mb-8">Most searched flight routes from UK airports</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { label: 'Manchester to Barcelona',  href: '/flights/manchester-to-barcelona' },
              { label: 'London to New York',        href: '/flights/london-to-new-york' },
              { label: 'Birmingham to Dubai',       href: '/flights/birmingham-to-dubai' },
              { label: 'Edinburgh to Amsterdam',    href: '/flights/edinburgh-to-amsterdam' },
              { label: 'Manchester to Dubai',       href: '/flights/manchester-to-dubai' },
              { label: 'London to Tokyo',           href: '/flights/london-to-tokyo' },
              { label: 'London to Bali',            href: '/flights/london-to-bali' },
              { label: 'Manchester to Orlando',     href: '/flights/manchester-to-orlando' },
              { label: 'London to Bangkok',         href: '/flights/london-to-bangkok' },
              { label: 'Glasgow to Barcelona',      href: '/flights/glasgow-to-barcelona' },
              { label: 'Leeds to Lisbon',           href: '/flights/leeds-to-lisbon' },
              { label: 'Bristol to Rome',           href: '/flights/bristol-to-rome' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="flex items-center justify-between bg-white rounded-xl px-4 py-3 text-sm font-medium border border-gray-100 hover:border-teal-200 hover:shadow-md transition"
                style={{ color: '#232e4e' }}
              >
                <span>✈ {label}</span>
                <span style={{ color: '#2f797c' }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section style={{ backgroundColor: '#232e4e' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: '500+', label: 'Airlines Compared' },
            { stat: '100+', label: 'Countries Covered' },
            { stat: '10,000+', label: 'Routes Available' },
            { stat: '24/7', label: 'Customer Support' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold mb-1" style={{ color: '#03989e' }}>{stat}</p>
              <p className="text-gray-300 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}