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
          Search hotels in {cityName} on Expedia →
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

      {/* BREADCRUMBS + LINK TO CITY PAGE */}
      <section className="py-10 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link href="/hotels" className="hover:opacity-75 transition" style={{ color: '#2f797c' }}>
              Hotels
            </Link>
            <span className="text-gray-400">→</span>
            <span style={{ color: '#232e4e' }} className="font-semibold">
              {cityName}
            </span>
          </nav>

          {/* Link to city guide if it exists in locations */}
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