'use client'

import React from 'react'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

// ---------------------------------------------
// AFFILIATE LINK
// ---------------------------------------------
const EXPEDIA_AFFILIATE_URL = 'https://expedia.com/affiliate/KohMBZ5'

// ---------------------------------------------
// TYPES
// ---------------------------------------------
type Neighbourhood = {
  name: string
  description: string
}

type AIContent = {
  intro: string
  neighbourhoods: Neighbourhood[]
}

type Props = {
  cityName: string
  country: string
  emoji?: string
  heroDescription?: string
  citySlug: string
  continentSlug?: string
  countrySlug?: string
  aiContent: AIContent
}

// ---------------------------------------------
// HOTEL TYPE PILLS
// ---------------------------------------------
const hotelTypes = [
  {
    label: 'Luxury',
    emoji: '⭐️',
    description: 'Five-star stays and iconic hotels',
  },
  {
    label: 'Boutique',
    emoji: '🛎️',
    description: 'Characterful, design-led properties',
  },
  {
    label: 'Family',
    emoji: '👨‍👩‍👧',
    description: 'Spacious rooms and family amenities',
  },
  {
    label: 'Budget',
    emoji: '💸',
    description: 'Great value without compromise',
  },
]

// ---------------------------------------------
// NEIGHBOURHOOD CARD
// ---------------------------------------------
function NeighbourhoodCard({ neighbourhood }: { neighbourhood: Neighbourhood }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-bold text-base mb-1" style={{ color: '#232e4e' }}>
        {neighbourhood.name}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">{neighbourhood.description}</p>
    </div>
  )
}

// ---------------------------------------------
// HOTEL TYPE CARD
// ---------------------------------------------
function HotelTypeCard({
  label,
  emoji,
  description,
}: {
  label: string
  emoji: string
  description: string
}) {
  return (
    <a
      href={EXPEDIA_AFFILIATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2"
    >
      <span className="text-2xl">{emoji}</span>
      <span className="font-bold text-sm" style={{ color: '#232e4e' }}>
        {label}
      </span>
      <span className="text-xs text-gray-500">{description}</span>
      <span
        className="text-xs font-semibold mt-auto pt-2"
        style={{ color: '#03989e' }}
      >
        Search {label.toLowerCase()} hotels →
      </span>
    </a>
  )
}

// ---------------------------------------------
// CLIENT PAGE
// ---------------------------------------------
export default function HotelCityClient({
  cityName,
  country,
  emoji,
  heroDescription,
  citySlug,
  continentSlug,
  countrySlug,
  aiContent,
}: Props) {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        {emoji && <div className="text-6xl mb-4">{emoji}</div>}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Where to Stay in {cityName}
        </h1>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          {heroDescription ||
            `The best neighbourhoods, areas and hotels in ${cityName}, ${country} — for every budget and travel style.`}
        </p>
        <a
          href={EXPEDIA_AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
          style={{ backgroundColor: '#03989e' }}
        >
          Search hotels in {cityName} →
        </a>
      </section>

      {/* INTRO */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Finding the right area in {cityName}
          </h2>
          <p className="text-gray-600 leading-relaxed text-base">{aiContent.intro}</p>
        </div>
      </section>

      {/* NEIGHBOURHOODS */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
            Best areas to stay in {cityName}
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            A guide to the key neighbourhoods and what each one suits.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aiContent.neighbourhoods.map(n => (
              <NeighbourhoodCard key={n.name} neighbourhood={n} />
            ))}
          </div>
        </div>
      </section>

      {/* HOTEL TYPES */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
            What kind of hotel are you looking for?
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Browse by hotel type — all links open on Expedia with live availability.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hotelTypes.map(type => (
              <HotelTypeCard key={type.label} {...type} />
            ))}
          </div>
        </div>
      </section>

      {/* TOP PICKS */}
      <section className="py-14 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Top hotel picks in {cityName}
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            A quick shortlist of standout hotels across different budgets and styles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                name: `Best Luxury Hotel in ${cityName}`,
                desc: `A five‑star stay offering exceptional service, refined rooms and a prime location.`,
              },
              {
                name: `Best Boutique Hotel in ${cityName}`,
                desc: `A stylish, design‑led property with character and a strong sense of place.`,
              },
              {
                name: `Best Budget Hotel in ${cityName}`,
                desc: `A clean, comfortable and great‑value option close to transport and key sights.`,
              },
            ].map(hotel => (
              <a
                key={hotel.name}
                href={EXPEDIA_AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <h3 className="font-bold text-base mb-1" style={{ color: '#232e4e' }}>
                  {hotel.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{hotel.desc}</p>
                <span className="text-xs font-semibold mt-auto pt-2" style={{ color: '#03989e' }}>
                  View hotel →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* BEST FOR SELECTOR */}
      <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Best areas in {cityName} for…
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Nightlife', emoji: '🍸' },
              { label: 'Families', emoji: '👨‍👩‍👧' },
              { label: 'First‑timers', emoji: '📍' },
              { label: 'Food lovers', emoji: '🍽️' },
              { label: 'Culture', emoji: '🎭' },
              { label: 'Budget travellers', emoji: '💸' },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="font-semibold text-sm" style={{ color: '#232e4e' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHEN TO VISIT */}
      <section className="py-14 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            When to visit {cityName}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="font-bold mb-2" style={{ color: '#232e4e' }}>Peak season</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The busiest (and most expensive) months, ideal for festivals, events and warm weather.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="font-bold mb-2" style={{ color: '#232e4e' }}>Shoulder season</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A sweet spot with pleasant weather, fewer crowds and better hotel rates.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <h3 className="font-bold mb-2" style={{ color: '#232e4e' }}>Low season</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Quiet, great value and perfect for travellers who prefer a slower pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPEDIA CTA BANNER */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#232e4e' }}>
            Ready to book your stay in {cityName}?
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Search live prices, availability and guest reviews on Expedia.
          </p>
          <a
            href={EXPEDIA_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: '#03989e' }}
          >
            Browse all hotels in {cityName} →
          </a>
          <p className="text-xs text-gray-400 mt-4">
            Timms Travel may earn a commission on bookings made via this link at no extra cost to you.
          </p>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <section className="py-10 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link href="/hotels" className="hover:opacity-75 transition" style={{ color: '#2f797c' }}>
              Hotels
            </Link>
            <span className="text-gray-400">→</span>
            <span style={{ color: '#232e4e' }} className="font-semibold">
              {cityName}
            </span>
          </nav>

          {continentSlug && countrySlug && (
            <Link
              href={`/locations/${continentSlug}/${countrySlug}/${citySlug}`}
              className="text-sm font-semibold hover:opacity-75 transition"
              style={{ color: '#2f797c' }}
            >
              View full {cityName} travel guide →
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
