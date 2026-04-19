'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

const EXPEDIA_CAMREF = '1110lCmpb'
const EXPEDIA_CREATIVEREF = '1011l87747'
const EXPEDIA_ADREF = 'PZZ928vica'

function buildExpediaDeepLink(city: string, country: string): string {
  const destination = `${city}, ${country}`
  const landingPageParams = new URLSearchParams({
    destination,
    sort: 'RECOMMENDED',
    categorySearch: 'any_option',
    useRewards: 'false',
  })
  const landingPage = `https://www.expedia.co.uk/Hotel-Search?${landingPageParams.toString()}`
  const affiliateParams = new URLSearchParams({
    siteid: '1',
    landingPage,
    camref: EXPEDIA_CAMREF,
    creativeref: EXPEDIA_CREATIVEREF,
    adref: EXPEDIA_ADREF,
  })
  return `https://expedia.com/affiliate?${affiliateParams.toString()}`
}

type Neighbourhood = {
  name: string
  description: string
}

type AIContent = {
  intro: string | null
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

const hotelTypes = [
  { label: 'Luxury',   emoji: '⭐️', description: 'Five-star stays and iconic hotels' },
  { label: 'Boutique', emoji: '🛎️', description: 'Characterful, design-led properties' },
  { label: 'Family',   emoji: '👨‍👩‍👧', description: 'Spacious rooms and family amenities' },
  { label: 'Budget',   emoji: '💸', description: 'Great value without compromise' },
]

function NeighbourhoodCard(props: { neighbourhood: Neighbourhood }) {
  const { neighbourhood } = props
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-bold text-base mb-1" style={{ color: '#232e4e' }}>
        {neighbourhood.name}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">{neighbourhood.description}</p>
    </div>
  )
}

function HotelTypeCard(props: {
  label: string
  emoji: string
  description: string
  href: string
}) {
  const { label, emoji, description, href } = props
  return (
    <a>
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2"
    
      <span className="text-2xl">{emoji}</span>
      <span className="font-bold text-sm" style={{ color: '#232e4e' }}>{label}</span>
      <span className="text-xs text-gray-500">{description}</span>
      <span className="text-xs font-semibold mt-auto pt-2" style={{ color: '#03989e' }}>
        Search {label.toLowerCase()} hotels →
      </span>
    </a>
  )
}

export default function HotelCityClient(props: Props) {
  const {
    cityName,
    country,
    emoji,
    heroDescription,
    citySlug,
    continentSlug,
    countrySlug,
    aiContent,
  } = props

  const cityExpediaUrl = buildExpediaDeepLink(cityName, country)

  useEffect(() => {
    const needsAI =
      !aiContent?.intro ||
      !aiContent?.neighbourhoods ||
      aiContent.neighbourhoods.length === 0

    if (needsAI) {
      fetch(`/api/generate-ai?city=${citySlug}`, { method: 'POST' })
        .then(async (res) => {
          const data = await res.json()
          if (data.status === 'created') {
            window.location.reload()
          }
        })
        .catch((err) => {
          console.error('AI GENERATION ERROR:', err)
        })
    }
  }, [])

  const introText =
    aiContent.intro ||
    `The best neighbourhoods, areas and hotels in ${cityName}, ${country} — for every budget and travel style.`

  const neighbourhoods =
    aiContent.neighbourhoods && aiContent.neighbourhoods.length > 0
      ? aiContent.neighbourhoods
      : [
          { name: `Central ${cityName}`,  description: `A convenient base close to major attractions, restaurants and transport.` },
          { name: `Historic Quarter`,      description: `Full of culture, museums and traditional architecture — ideal for exploring on foot.` },
          { name: `Waterfront District`,   description: `Scenic, lively and packed with restaurants, cafés and evening strolls.` },
          { name: `Residential Suburbs`,   description: `Quiet, spacious and great for families or longer stays.` },
        ]

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{ backgroundColor: '#232e4e' }}
        className="text-white py-20 px-6 text-center"
      >
        {emoji && <div className="text-6xl mb-4">{emoji}</div>}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Where to Stay in {cityName}
        </h1>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          {heroDescription || introText}
        </p>
        
        <a>
          href={cityExpediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
          style={{ backgroundColor: '#03989e' }}
        
          View hotels in {cityName} →
        </a>
      </section>

      {/* ── NEIGHBOURHOODS ── */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
            Best areas to stay in {cityName}
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            A guide to the key neighbourhoods and what each one suits.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {neighbourhoods.map((n) => (
              <NeighbourhoodCard key={n.name} neighbourhood={n} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOTEL TYPES ── */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
            What kind of hotel are you looking for?
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Browse by hotel type — all links open on Expedia with live availability.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hotelTypes.map((type) => (
              <HotelTypeCard
                key={type.label}
                label={type.label}
                emoji={type.emoji}
                description={type.description}
                href={cityExpediaUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP PICKS ── */}
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
              { name: `Best Luxury Hotel in ${cityName}`,   desc: `A five‑star stay offering exceptional service, refined rooms and a prime location.` },
              { name: `Best Boutique Hotel in ${cityName}`, desc: `A stylish, design‑led property with character and a strong sense of place.` },
              { name: `Best Budget Hotel in ${cityName}`,   desc: `A clean, comfortable and great‑value option close to transport and key sights.` },
            ].map((hotel) => (
              
              <a>
                key={hotel.name}
                href={cityExpediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              
                <h3 className="font-bold text-base mb-1" style={{ color: '#232e4e' }}>{hotel.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{hotel.desc}</p>
                <span className="text-xs font-semibold mt-auto pt-2" style={{ color: '#03989e' }}>
                  View hotels in {cityName} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST FOR ── */}
      <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Best areas in {cityName} for…
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Nightlife',         emoji: '🍸' },
              { label: 'Families',          emoji: '👨‍👩‍👧' },
              { label: 'First‑timers',      emoji: '📍' },
              { label: 'Food lovers',       emoji: '🍽️' },
              { label: 'Culture',           emoji: '🎭' },
              { label: 'Budget travellers', emoji: '💸' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="font-semibold text-sm" style={{ color: '#232e4e' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHEN TO VISIT ── */}
      <section className="py-14 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            When to visit {cityName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Peak season',     body: 'The busiest (and most expensive) months, ideal for festivals, events and warm weather.' },
              { title: 'Shoulder season', body: 'A sweet spot with pleasant weather, fewer crowds and better hotel rates.' },
              { title: 'Low season',      body: 'Quiet, great value and perfect for travellers who prefer a slower pace.' },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="font-bold mb-2" style={{ color: '#232e4e' }}>{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#232e4e' }}>
            Ready to book your stay in {cityName}?
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Search live prices, availability and guest reviews on Expedia.
          </p>
          
          <a>
            href={cityExpediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: '#03989e' }}
          
            View all hotels in {cityName} →
          </a>
          <p className="text-xs text-gray-400 mt-4">
            Timms Travel may earn a commission on bookings made via this link at no extra cost to you.
          </p>
        </div>
      </section>

      {/* ── BREADCRUMBS ── */}
      <section className="py-10 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link href="/hotels" className="hover:opacity-75 transition" style={{ color: '#2f797c' }}>
              Hotels
            </Link>
            <span className="text-gray-400">→</span>
            <span style={{ color: '#232e4e' }} className="font-semibold">{cityName}</span>
          </nav>

          {typeof continentSlug === 'string' &&
           typeof countrySlug === 'string' &&
           typeof citySlug === 'string' && (
            <Link
              href={`/locations/${continentSlug}/${countrySlug}/${citySlug}`}
              className="text-sm font-semibold hover:opacity-75 transition"
              style={{ color: '#2f797c' }}
            >
              Explore more in {cityName}
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}