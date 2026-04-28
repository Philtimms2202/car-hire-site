'use client'

// app/locations/[continent]/[country]/[city]/CityPageClient.tsx

import { Suspense, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import { PortableText } from '@portabletext/react'
import FlightSearch from '@/app/components/Search/FlightSearch'
import HotelSearch from '@/app/components/Search/HotelSearch'
import ExperienceSearch from '@/app/components/Search/ExperienceSearch'
import CarSearch from '@/app/components/Search/CarSearch'
import CityHighlights from '@/app/components/city/CityHighlights'

// ─── Types ────────────────────────────────────────────────────────────────────

type HighlightCard = { title: string; description: string }

type Props = {
  cityId: string
  cityName: string
  citySlug: string
  countryName: string
  countrySlug: string
  continentName: string
  continentSlug: string
  emoji?: string
  airport?: string
  heroDescription?: string
  mainContent?: any
  aiIntro?: string | null
  aiHighlightsIntro?: string | null
  aiHighlightCards?: HighlightCard[]
  aiAboutFallback?: string | null
}

// ─── Internal link pills ──────────────────────────────────────────────────────

function LinkPill({
  href,
  children,
  external = false,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
}) {
  const cls =
    'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition hover:opacity-80'
  const style = { borderColor: '#03989e', color: '#03989e' }
  if (external)
    return (
      
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        style={style}
      >
        {children}
      </a>
    )
  return (
    <Link href={href} className={cls} style={style}>
      {children}
    </Link>
  )
}

// ─── Quick link card ──────────────────────────────────────────────────────────

function QuickLinkCard({
  href,
  emoji,
  title,
  description,
  external = false,
}: {
  href: string
  emoji: string
  title: string
  description: string
  external?: boolean
}) {
  const inner = (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2 h-full">
      <span className="text-2xl">{emoji}</span>
      <span className="font-semibold text-sm" style={{ color: '#022135' }}>
        {title}
      </span>
      <span className="text-xs text-gray-500 leading-relaxed flex-1">
        {description}
      </span>
      <span
        className="text-xs font-semibold mt-auto pt-1"
        style={{ color: '#03989e' }}
      >
        {title} →
      </span>
    </div>
  )

  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  return <Link href={href}>{inner}</Link>
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CityPageClient(props: Props) {
  const {
    cityId,
    cityName,
    citySlug,
    countryName,
    countrySlug,
    continentName,
    continentSlug,
    emoji,
    heroDescription,
    mainContent,
    aiIntro,
    aiHighlightsIntro,
    aiHighlightCards,
    aiAboutFallback,
  } = props

  const [activeTab, setActiveTab] = useState<'flights' | 'hotels' | 'experiences' | 'cars'>('flights')

  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupDate, setPickupDate]         = useState('')
  const [dropoffDate, setDropoffDate]       = useState('')
  const [loading]                           = useState(false)

  const handleCarSearch = () => {
    if (!pickupLocation || !pickupDate || !dropoffDate) return
    window.open(
      `https://www.rentalcars.com/?affiliateCode=YOURAFFILIATETOKEN&preflocation=${encodeURIComponent(pickupLocation)}&puDay=${pickupDate}&doDay=${dropoffDate}`,
      '_blank'
    )
  }

  const heroText =
    heroDescription ||
    aiIntro ||
    `Discover the best things to do in ${cityName}, ${countryName} — tours, activities, local tips and more.`

  const aboutText =
    aiAboutFallback ||
    `${cityName} is a destination in ${countryName} with a rich culture, history and a range of experiences for every kind of traveller.`

  const thingsToDoHref = `/locations/${continentSlug}/${countrySlug}/${citySlug}/things-to-do`
  const hotelsHref     = `/hotels/${citySlug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: cityName,
    description: heroText,
    containedInPlace: { '@type': 'Country', name: countryName },
  }

  return (
    <main className="min-h-screen bg-white">
      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id="P7B7GRH"
        strategy="afterInteractive"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        className="text-white py-20 px-6 text-center"
        style={{
          background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          {emoji && <div className="text-6xl mb-4">{emoji}</div>}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Things to do in {cityName}
          </h1>
          <p className="text-base md:text-lg text-teal-50 max-w-2xl mx-auto mb-10 leading-relaxed">
            {heroText}
          </p>

          {/* Tabbed search — identical pattern to experiences page */}
          <nav className="flex justify-center gap-1 mb-6 bg-white/10 rounded-2xl p-1 max-w-sm mx-auto">
            {(
              ['flights', 'hotels', 'experiences', 'cars'] as const
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-white text-[#022135] shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto shadow-xl text-black">
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

          <p className="text-xs text-teal-200 mt-5">
            Timms Travel may earn a commission on bookings made via these links
            at no extra cost to you.
          </p>
        </div>
      </section>

      {/* ── HIGHLIGHTS ────────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <CityHighlights
          documentId={cityId}
          cityName={cityName}
          countryName={countryName}
          continentName={continentName}
          cachedHighlightsIntro={aiHighlightsIntro}
          cachedHighlightCards={aiHighlightCards}
        />
      </Suspense>

      {/* ── QUICK LINKS ───────────────────────────────────────────────── */}
      <section className="py-10 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase tracking-[0.18em] text-[11px] font-medium mb-4"
            style={{ color: '#03989e' }}
          >
            Plan your trip
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickLinkCard
              href={thingsToDoHref}
              emoji="🗺️"
              title="Things to do"
              description={`Browse tours, activities and day trips in ${cityName}.`}
            />
            <QuickLinkCard
              href={hotelsHref}
              emoji="🏨"
              title="Hotels"
              description={`Find the best areas and hotels to stay in ${cityName}.`}
            />
            <QuickLinkCard
              href="/flights"
              emoji="✈️"
              title="Flights"
              description={`Search and compare flights to ${cityName}.`}
            />
            <QuickLinkCard
              href="/other-services/airport-transfers"
              emoji="🚐"
              title="Airport transfers"
              description={`Pre-book your transfer from the airport to ${cityName}.`}
            />
          </div>
        </div>
      </section>

      {/* ── GYG WIDGET (secondary) ────────────────────────────────────── */}
      <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase tracking-[0.18em] text-[11px] font-medium mb-2"
            style={{ color: '#03989e' }}
          >
            Activities
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: '#022135' }}
          >
            Top experiences in {cityName}
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Hand-picked tours and activities available to book instantly.
          </p>
          <div
            data-gyg-widget="activities"
            data-gyg-partner-id="P7B7GRH"
            data-gyg-q={cityName}
            data-gyg-number-of-items="4"
          />
          <div className="mt-6">
            <Link
              href={thingsToDoHref}
              className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-75 transition"
              style={{ color: '#03989e' }}
            >
              See all things to do in {cityName} →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────── */}
      <section className="py-14 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p
            className="uppercase tracking-[0.18em] text-[11px] font-medium mb-2"
            style={{ color: '#03989e' }}
          >
            About
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ color: '#022135' }}
          >
            About {cityName}
          </h2>
          {mainContent ? (
            <div className="prose max-w-none">
              <PortableText value={mainContent} />
            </div>
          ) : (
            <p className="text-gray-600 leading-relaxed">{aboutText}</p>
          )}
        </div>
      </section>

      {/* ── ALSO USEFUL ───────────────────────────────────────────────── */}
      <section className="py-10 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
            Also useful for your trip
          </p>
          <div className="flex flex-wrap gap-2">
            <LinkPill href={thingsToDoHref}>
              Things to do in {cityName}
            </LinkPill>
            <LinkPill href={hotelsHref}>Hotels in {cityName}</LinkPill>
            <LinkPill href="/flights">Search flights</LinkPill>
            <LinkPill href="/other-services/travel-insurance">
              Travel insurance
            </LinkPill>
            <LinkPill href="/other-services/airport-transfers">
              Airport transfers
            </LinkPill>
            <LinkPill href="/other-services/esims">eSIMs</LinkPill>
            <LinkPill href="/other-services">All travel services</LinkPill>
            <LinkPill
              href={`/locations/${continentSlug}/${countrySlug}`}
            >
              More in {countryName}
            </LinkPill>
          </div>
        </div>
      </section>

      {/* ── BREADCRUMBS ───────────────────────────────────────────────── */}
      <section className="py-8 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link
              href="/locations"
              className="hover:opacity-75 transition"
              style={{ color: '#03989e' }}
            >
              All destinations
            </Link>
            <span className="text-gray-300">→</span>
            <Link
              href={`/locations/${continentSlug}`}
              className="hover:opacity-75 transition capitalize"
              style={{ color: '#03989e' }}
            >
              {continentName || continentSlug}
            </Link>
            <span className="text-gray-300">→</span>
            <Link
              href={`/locations/${continentSlug}/${countrySlug}`}
              className="hover:opacity-75 transition capitalize"
              style={{ color: '#03989e' }}
            >
              {countryName}
            </Link>
            <span className="text-gray-300">→</span>
            <span className="font-semibold" style={{ color: '#022135' }}>
              {cityName}
            </span>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  )
}