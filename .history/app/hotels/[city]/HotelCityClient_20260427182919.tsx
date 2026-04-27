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

type FAQ = { question: string; answer: string }

type Neighbourhood = { name: string; description: string }

type AIContent = {
  intro: string | null
  neighbourhoods: Neighbourhood[]
  firstTimers?: string | null
  budget?: string | null
  couples?: string | null
  families?: string | null
  whenToVisit?: string | null
  faqs?: FAQ[]
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

function SectionText({ text }: { text: string }) {
  return (
    <p className="text-gray-600 text-base leading-relaxed max-w-3xl">
      {text}
    </p>
  )
}

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

function HotelTypeCard({
  label, emoji, description, href,
}: {
  label: string; emoji: string; description: string; href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2"
    >
      <span className="text-2xl">{emoji}</span>
      <span className="font-bold text-sm" style={{ color: '#232e4e' }}>{label}</span>
      <span className="text-xs text-gray-500">{description}</span>
      <span className="text-xs font-semibold mt-auto pt-2" style={{ color: '#03989e' }}>
        Search {label.toLowerCase()} hotels →
      </span>
    </a>
  )
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = React.useState(index === 0)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-sm pr-4" style={{ color: '#232e4e' }}>
          {faq.question}
        </span>
        <span className="text-lg text-gray-400 flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white">
          <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

export default function HotelCityClient(props: Props) {
  const {
    cityName, country, emoji, heroDescription,
    citySlug, continentSlug, countrySlug, aiContent,
  } = props

  const cityExpediaUrl = buildExpediaDeepLink(cityName, country)

  const needsAI =
    !aiContent?.intro ||
    !aiContent?.neighbourhoods?.length ||
    !aiContent?.firstTimers ||
    !aiContent?.budget ||
    !aiContent?.couples ||
    !aiContent?.families

  useEffect(() => {
    if (needsAI) {
      fetch(`/api/generate-ai?city=${citySlug}`, { method: 'POST' })
        .then(async (res) => {
          const data = await res.json()
          if (data.status === 'created') window.location.reload()
        })
        .catch((err) => console.error('AI GENERATION ERROR:', err))
    }
  }, [])

  const introText =
    aiContent.intro ||
    `A guide to the best areas and hotels in ${cityName}, ${country} — for every budget and travel style.`

  const neighbourhoods =
    aiContent.neighbourhoods?.length
      ? aiContent.neighbourhoods
      : [
          { name: `Central ${cityName}`, description: `A convenient base close to major attractions, restaurants and transport.` },
          { name: `Historic Quarter`,    description: `Full of culture, museums and traditional architecture — ideal for exploring on foot.` },
          { name: `Waterfront District`, description: `Scenic and lively, with restaurants, cafés and easy evening strolls.` },
          { name: `Residential Suburbs`, description: `Quiet, spacious and well suited to families or longer stays.` },
        ]

  // FAQ JSON-LD schema
  const faqSchema = aiContent.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: aiContent.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null

  return (
    <main className="min-h-screen bg-white">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

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
        
        <a
          href={cityExpediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
          style={{ backgroundColor: '#03989e' }}
        >
          Search hotels in {cityName} →
        </a>
      </section>

      {/* ── INTRO ── */}
      {aiContent.intro && (
        <section className="py-12 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <SectionText text={aiContent.intro} />
          </div>
        </section>
      )}

      {/* ── NEIGHBOURHOODS ── */}
      <section className="py-14 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
            Best areas to stay in {cityName}
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            A breakdown of the key neighbourhoods — where they are, what they're like, and who they suit.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {neighbourhoods.map((n) => (
              <NeighbourhoodCard key={n.name} neighbourhood={n} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FIRST TIMERS ── */}
      {aiContent.firstTimers && (
        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
              Where to stay in {cityName} for first-time visitors
            </h2>
            <SectionText text={aiContent.firstTimers} />
            
            <a
              href={cityExpediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold transition hover:opacity-75"
              style={{ color: '#03989e' }}
            >
              Search hotels in {cityName} →
            </a>
          </div>
        </section>
      )}

      {/* ── HOTEL TYPES ── */}
      <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
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

      {/* ── BUDGET ── */}
      {aiContent.budget && (
        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
              Best areas to stay in {cityName} on a budget
            </h2>
            <SectionText text={aiContent.budget} />
            
            <a
              href={cityExpediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold transition hover:opacity-75"
              style={{ color: '#03989e' }}
            >
              Search budget hotels in {cityName} →
            </a>
          </div>
        </section>
      )}

      {/* ── COUPLES ── */}
      {aiContent.couples && (
        <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
              Where to stay in {cityName} for couples
            </h2>
            <SectionText text={aiContent.couples} />
            
            <a
              href={cityExpediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold transition hover:opacity-75"
              style={{ color: '#03989e' }}
            >
              Search romantic hotels in {cityName} →
            </a>
          </div>
        </section>
      )}

      {/* ── FAMILIES ── */}
      {aiContent.families && (
        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
              Best family-friendly areas in {cityName}
            </h2>
            <SectionText text={aiContent.families} />
            
            <a
              href={cityExpediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold transition hover:opacity-75"
              style={{ color: '#03989e' }}
            >
              Search family hotels in {cityName} →
            </a>
          </div>
        </section>
      )}

      {/* ── WHEN TO VISIT ── */}
      {aiContent.whenToVisit && (
        <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
              When to visit {cityName}
            </h2>
            <SectionText text={aiContent.whenToVisit} />
          </div>
        </section>
      )}

      {/* ── FAQS ── */}
      {aiContent.faqs && aiContent.faqs.length > 0 && (
        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: '#232e4e' }}>
              Frequently asked questions about staying in {cityName}
            </h2>
            <div className="flex flex-col gap-3">
              {aiContent.faqs.map((faq, i) => (
                <FAQItem key={faq.question} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
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

      {/* ── BREADCRUMBS + INTERNAL LINKS ── */}
      <section className="py-10 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link href="/hotels" className="hover:opacity-75 transition" style={{ color: '#2f797c' }}>
              Hotels
            </Link>
            {typeof countrySlug === 'string' && (
              <>
                <span className="text-gray-400">→</span>
                <Link
                  href={`/hotels/${countrySlug}`}
                  className="hover:opacity-75 transition"
                  style={{ color: '#2f797c' }}
                >
                  {country}
                </Link>
              </>
            )}
            <span className="text-gray-400">→</span>
            <span style={{ color: '#232e4e' }} className="font-semibold">{cityName}</span>
          </nav>

          <div className="flex flex-wrap gap-4 text-sm">
            {typeof continentSlug === 'string' &&
             typeof countrySlug === 'string' &&
             typeof citySlug === 'string' && (
              <Link
                href={`/locations/${continentSlug}/${countrySlug}/${citySlug}`}
                className="font-semibold hover:opacity-75 transition"
                style={{ color: '#2f797c' }}
              >
                Explore more in {cityName} →
              </Link>
            )}
            {typeof countrySlug === 'string' && (
              <Link
                href={`/flights/${countrySlug}`}
                className="font-semibold hover:opacity-75 transition"
                style={{ color: '#2f797c' }}
              >
                Flights to {country} →
              </Link>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}