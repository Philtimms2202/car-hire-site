'use client'

import React, { useEffect, useRef } from 'react'
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
  { label: 'Luxury', emoji: '⭐️', description: 'Five-star stays and iconic hotels' },
  { label: 'Boutique', emoji: '🛎️', description: 'Characterful, design-led properties' },
  { label: 'Family', emoji: '👨‍👩‍👧', description: 'Spacious rooms and family amenities' },
  { label: 'Budget', emoji: '💸', description: 'Great value without compromise' },
]

function NeighbourhoodCard({ neighbourhood }: { neighbourhood: Neighbourhood }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-bold text-base mb-1" style={{ color: '#232e4e' }}>
        {neighbourhood.name}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        {neighbourhood.description}
      </p>
    </div>
  )
}

function HotelTypeCard({
  label,
  emoji,
  description,
  href,
}: {
  label: string
  emoji: string
  description: string
  href: string
}) {
  return (
    <a
      href={href}
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

  const hasTriggeredRef = useRef(false)

  const cityExpediaUrl = buildExpediaDeepLink(cityName, country)

  useEffect(() => {
    const needsAI =
      !aiContent?.intro ||
      !aiContent?.neighbourhoods ||
      aiContent.neighbourhoods.length === 0

    if (!needsAI || hasTriggeredRef.current) return

    hasTriggeredRef.current = true

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
  }, [citySlug, aiContent])

  const introText =
    aiContent.intro ||
    `The best neighbourhoods, areas and hotels in ${cityName}, ${country} — for every budget and travel style.`

  const neighbourhoods =
    aiContent.neighbourhoods && aiContent.neighbourhoods.length > 0
      ? aiContent.neighbourhoods
      : [
          {
            name: `Central ${cityName}`,
            description: `A convenient base close to major attractions, restaurants and transport.`,
          },
          {
            name: `Historic Quarter`,
            description: `Full of culture, museums and traditional architecture — ideal for exploring on foot.`,
          },
          {
            name: `Waterfront District`,
            description: `Scenic, lively and packed with restaurants, cafés and evening strolls.`,
          },
          {
            name: `Residential Suburbs`,
            description: `Quiet, spacious and great for families or longer stays.`,
          },
        ]

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
          Where to Stay in {cityName}, {country}
        </h1>

        <div className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8 space-y-4">
          <p>{heroDescription || introText}</p>

          {aiContent.intro && (
            <p className="text-gray-400">{aiContent.intro}</p>
          )}
        </div>

        <a
          href={cityExpediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
          style={{ backgroundColor: '#03989e' }}
        >
          View hotels in {cityName} →
        </a>
      </section>

      {/* NEIGHBOURHOODS */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: '#232e4e' }}
          >
            Best areas to stay in {cityName}, {country}
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

      {/* HOTEL TYPES */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: '#232e4e' }}
          >
            What kind of hotel are you looking for in {cityName}?
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

      {/* TOP PICKS */}
      <section className="py-14 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: '#232e4e' }}
          >
            Top hotel picks in {cityName}, {country}
          </h2>

          <p className="text-gray-500 text-sm mb-8">
            A quick shortlist of standout hotels across different budgets and styles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                name: `Best Luxury Hotel in ${cityName}`,
                desc: `A five-star stay offering exceptional service, refined rooms and a prime location.`,
              },
              {
                name: `Best Boutique Hotel in ${cityName}`,
                desc: `A stylish, design-led property with character and a strong sense of place.`,
              },
              {
                name: `Best Budget Hotel in ${cityName}`,
                desc: `A clean, comfortable and great-value option close to transport and key sights.`,
              },
            ].map((hotel) => (
              <a
                key={hotel.name}
                href={cityExpediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <h3
                  className="font-bold text-base mb-1"
                  style={{ color: '#232e4e' }}
                >
                  {hotel.name}
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  {hotel.desc}
                </p>

                <span
                  className="text-xs font-semibold mt-auto pt-2"
                  style={{ color: '#03989e' }}
                >
                  View hotels in {cityName} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNAL LINKS */}
      {continentSlug && countrySlug && (
        <section className="py-12 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-lg font-bold mb-4" style={{ color: '#232e4e' }}>
              Explore more destinations
            </h3>

            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href={`/locations/${continentSlug}`}
                className="hover:opacity-75"
                style={{ color: '#2f797c' }}
              >
                Destinations in {continentSlug}
              </Link>

              <Link
                href={`/locations/${continentSlug}/${countrySlug}`}
                className="hover:opacity-75"
                style={{ color: '#2f797c' }}
              >
                Places in {country}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#232e4e' }}>
            Ready to book your stay in {cityName}?
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Search live prices, availability and guest reviews on Expedia.
          </p>

          <a
            href={cityExpediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: '#03989e' }}
          >
            View all hotels in {cityName} →
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
            <Link href="/hotels" style={{ color: '#2f797c' }}>
              Hotels
            </Link>

            <span className="text-gray-400">→</span>

            {continentSlug && countrySlug && (
              <>
                <Link
                  href={`/locations/${continentSlug}/${countrySlug}`}
                  style={{ color: '#2f797c' }}
                >
                  {country}
                </Link>
                <span className="text-gray-400">→</span>
              </>
            )}

            <span style={{ color: '#232e4e' }} className="font-semibold">
              {cityName}
            </span>
          </nav>

          {continentSlug && countrySlug && (
            <Link
              href={`/locations/${continentSlug}/${countrySlug}/${citySlug}`}
              className="text-sm font-semibold"
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