'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ---------------------------------------------
// TYPES
// ---------------------------------------------
type Service = {
  id: string
  title: string
  tagline: string
  description: string
  emoji: string
  color: string
  bg: string
  href: string
  cta: string
  badge?: string
  features: string[]
}

type FaqItem = {
  q: string
  a: string
}

// ---------------------------------------------
// SERVICES DATA
// ---------------------------------------------
const SERVICES: Service[] = [
  {
    id: 'esims',
    title: 'eSIMs',
    tagline: 'Stay connected the moment you land.',
    description:
      'Never hunt for a local SIM card again. With Saily eSIMs, you can activate a local data plan before you even board your flight. Choose from over 150+ destinations worldwide and get fast, reliable mobile data without swapping physical SIMs or paying eye-watering roaming charges.',
    emoji: '📱',
    color: '#03989e',
    bg: '#03989e15',
    href: '/other-services/esims',
    cta: 'Browse eSIM Plans',
    badge: 'Powered by Saily',
    features: [
      '150+ countries covered',
      'Activate before you fly',
      'No physical SIM needed',
      'Competitive data rates',
      'Keep your existing number',
      'Top up on the go',
    ],
  },
  {
    id: 'insurance',
    title: 'Travel Insurance',
    tagline: 'Travel with confidence, covered for the unexpected.',
    description:
      'A great trip can unravel fast - a cancelled flight, a lost bag, a sudden illness abroad. Our travel insurance partners offer comprehensive cover for medical emergencies, trip cancellations, baggage loss and more. Get a quote in minutes and travel knowing you are protected.',
    emoji: '🛡️',
    color: '#232e4e',
    bg: '#232e4e15',
    href: '/other-services/travel-insurance',
    cta: 'Get a Quote',
    features: [
      'Medical emergency cover',
      'Trip cancellation protection',
      'Baggage and personal effects',
      'Flight delay compensation',
      'Single trip & annual options',
      '24/7 emergency helpline',
    ],
  },
  {
    id: 'airport-transfers',
    title: 'Airport Transfers',
    tagline: 'Transfers, rides, and more, available worldwide.',
    description:
      'Pre-book a private airport transfer and arrive stress free. There are no hidden surprises with fixed pricing, flight tracking, and a driver who greets you in arrivals. Available in over 100 countries worldwide.',
    emoji: '🚖',
    color: '#cb6ce6',
    bg: '#b8860b15',
    href: '/other-services/airport-transfers',
    cta: 'Get a Quote',
    features: [
      'Fixed Price',
      'Flight Tracking',
      'Available in over 100 Countries',
      'Premium Vehicle Options',
      'Professional Drivers',
      'Up to 60 Minutes of Free Waiting',
    ],
  },
  {
    id: 'hotels',
    title: 'Hotels',
    tagline: 'From budget stays to five-star luxury.',
    description:
      'Search and compare hotels in thousands of destinations worldwide. Whether you need a practical city base or a landmark stay, Timms Travel surfaces curated picks alongside the full market - with live prices and no booking fees.',
    emoji: '🏨',
    color: '#b8860b',
    bg: '#b8860b15',
    href: '/hotels',
    cta: 'Search Hotels',
    features: [
      '500,000+ properties worldwide',
      'Curated picks for top cities',
      'Live prices and availability',
      'No hidden booking fees',
      'All hotel types covered',
      'Free cancellation on most rooms',
    ],
  },
  {
    id: 'flights',
    title: 'Flights',
    tagline: 'Compare fares across hundreds of airlines.',
    description:
      'Find the best flight deals for any route. Search direct and connecting flights across hundreds of airlines and see real-time fares in seconds. Whether you are booking weeks ahead or looking for a last-minute deal, Timms Travel makes it fast.',
    emoji: '✈️',
    color: '#5a7a52',
    bg: '#5a7a5215',
    href: '/flights',
    cta: 'Search Flights',
    features: [
      'Hundreds of airlines compared',
      'Direct and connecting routes',
      'Real-time fare data',
      'Flexible date search',
      'One-way and return options',
      'Multi-city itineraries',
    ],
  },
  {
    id: 'experiences',
    title: 'Experiences',
    tagline: 'Tours, activities and things to do worldwide.',
    description:
      'Turn a good trip into a great one. Browse thousands of guided tours, day trips, cultural experiences and activities in destinations around the world. Book in advance or find something last-minute - all in one place.',
    emoji: '🎭',
    color: '#7c3aed',
    bg: '#7c3aed15',
    href: '/experiences',
    cta: 'Explore Experiences',
    features: [
      'Thousands of activities worldwide',
      'Guided tours and day trips',
      'Cultural and food experiences',
      'Skip-the-line tickets',
      'Instant and advance booking',
      'Flexible cancellation options',
    ],
  },
  {
    id: 'cars',
    title: 'Car Hire',
    tagline: 'Freedom to explore on your own terms.',
    description:
      'Pick up a car at the airport or in the city and travel at your own pace. Compare hire options from leading providers worldwide, with transparent pricing and no surprise fees at the counter.',
    emoji: '🚗',
    color: '#dc6b19',
    bg: '#dc6b1915',
    href: '/car-hire',
    cta: 'Compare Car Hire',
    features: [
      'Airports and city locations',
      'All vehicle classes',
      'Transparent pricing upfront',
      'Leading hire brands compared',
      'Free cancellation on most bookings',
      'Additional driver options',
    ],
  },
]

// ---------------------------------------------
// NEW COLLAPSIBLE LOGIC
// ---------------------------------------------
const VISIBLE_SERVICES = SERVICES.slice(0, 6)   // Up to Experiences
const HIDDEN_SERVICES = SERVICES.slice(6)       // Car Hire


// ---------------------------------------------
// FAQS
// ---------------------------------------------
const FAQS: FaqItem[] = [
  {
    q: 'What is an eSIM and how does it work?',
    a: 'An eSIM is a digital SIM card built into your phone. Instead of swapping a physical SIM, you scan a QR code or follow a simple setup process to activate a local data plan in your destination. You can do this before you travel and switch on your data the moment you land.',
  },
  {
    q: 'Which phones are compatible with eSIMs?',
    a: 'Most modern smartphones support eSIMs, including iPhone XS and later, Google Pixel 3 and later, and a wide range of Samsung Galaxy and other Android devices. You can check compatibility on the Saily eSIM page before purchasing.',
  },
  {
    q: 'Do I need travel insurance if I already have cover through my bank?',
    a: 'Bank-provided travel insurance often has significant gaps - low medical cover limits, exclusions for pre-existing conditions, or limited baggage protection. It is worth reviewing your existing policy carefully before you travel and topping up where needed.',
  },
  {
    q: 'Can I get travel insurance for a single trip or do I need an annual policy?',
    a: 'Both options are available. If you travel two or more times a year, an annual multi-trip policy usually works out better value. For a one-off trip, a single trip policy is typically the more cost-effective choice.',
  },
  {
    q: 'Are all of these services bookable through Timms Travel?',
    a: 'Yes. Hotels, flights, car hire and experiences can all be searched and booked through Timms Travel. For eSIMs, you will be directed to our partner Saily to complete your purchase. Travel insurance quotes are provided by our trusted insurance partners.',
  },
  {
    q: 'Is Timms Travel free to use?',
    a: 'Yes. Timms Travel is completely free to use. We never add booking fees on top of the prices shown, and you will always see the same price you would find by going direct.',
  },
  {
    q: 'Can I use an eSIM and keep my regular phone number?',
    a: 'Yes. eSIMs work alongside your existing physical SIM in dual SIM mode. Your regular number stays active for calls and texts, while the eSIM provides affordable local data in your destination.',
  },
  {
    q: 'What does travel insurance typically not cover?',
    a: 'Standard policies usually exclude pre-existing medical conditions unless declared and accepted, self-inflicted injury, travel to destinations under a government advisory warning, and losses caused by reckless or illegal behaviour. Always read the policy wording before you travel.',
  },
]

// ---------------------------------------------
// WHY TIMMS TRAVEL
// ---------------------------------------------
const WHY_POINTS = [
  {
    emoji: '🌍',
    title: 'Everything in one place',
    body: 'Flights, hotels, cars, experiences, eSIMs and travel insurance - all under one roof. No more juggling a dozen tabs across different websites.',
  },
  {
    emoji: '💸',
    title: 'No hidden fees',
    body: 'What you see is what you pay. Timms Travel never adds extra charges on top of prices shown by our travel partners.',
  },
  {
    emoji: '⚡',
    title: 'Fast and simple',
    body: 'Designed to get you from search to booked as quickly as possible - without dark patterns, unnecessary upsells or confusing steps.',
  },
  {
    emoji: '🇬🇧',
    title: 'Built in the UK',
    body: 'Timms Travel is proudly UK based and built with British travellers in mind - though our coverage is truly global.',
  },
]

// ---------------------------------------------
// SERVICE CARD (NOW ONLY HANDLES VIEW MORE)
// ---------------------------------------------
function ServiceCardList({
  visible,
  hidden,
  showMore,
  setShowMore,
}: {
  visible: Service[]
  hidden: Service[]
  showMore: boolean
  setShowMore: (v: boolean) => void
}) {
  return (
    <div className="space-y-6">

      {/* Always visible services */}
      {visible.map(service => (
        <div
          key={service.id}
          className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: service.bg }}
            >
              {service.emoji}
            </div>
            {service.badge && (
              <span
                className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ backgroundColor: service.bg, color: service.color }}
              >
                {service.badge}
              </span>
            )}
          </div>

          {/* Title & tagline */}
          <h3 className="text-xl font-bold mb-1" style={{ color: '#232e4e' }}>
            {service.title}
          </h3>
          <p className="text-sm font-medium mb-3" style={{ color: service.color }}>
            {service.tagline}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
            {service.description}
          </p>

          {/* Feature list */}
          <ul className="space-y-2 mb-8">
            {service.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <span
                  className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: service.bg }}
                >
                  <svg
                    className="w-2.5 h-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: service.color }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* View More button */}
      {!showMore && hidden.length > 0 && (
        <button
          onClick={() => setShowMore(true)}
          className="text-blue-600 underline font-medium mt-2"
        >
          View More
        </button>
      )}

      {/* Hidden services */}
      {showMore && (
        <div className="space-y-6 mt-4">
          {hidden.map(service => (
            <div
              key={service.id}
              className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: service.bg }}
                >
                  {service.emoji}
                </div>
                {service.badge && (
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: service.bg, color: service.color }}
                  >
                    {service.badge}
                  </span>
                )}
              </div>

              {/* Title & tagline */}
              <h3 className="text-xl font-bold mb-1" style={{ color: '#232e4e' }}>
                {service.title}
              </h3>
              <p className="text-sm font-medium mb-3" style={{ color: service.color }}>
                {service.tagline}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                {service.description}
              </p>

              {/* Feature list */}
              <ul className="space-y-2 mb-8">
                {service.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span
                      className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: service.bg }}
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ color: service.color }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            onClick={() => setShowMore(false)}
            className="text-blue-600 underline font-medium mt-2"
          >
            View Less
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------
// ESIM SPOTLIGHT (Saily)
// ---------------------------------------------
const ESIM_REGIONS = [
  {
    region: 'Europe',
    emoji: '🇪🇺',
    countries: 'UK, France, Germany, Spain, Italy, Portugal, Netherlands and 30+ more',
    note: 'Single plan covers multiple EU countries',
  },
  {
    region: 'Asia Pacific',
    emoji: '🌏',
    countries: 'Japan, South Korea, Thailand, Singapore, Australia, New Zealand and more',
    note: 'Country-specific and regional plans available',
  },
  {
    region: 'Americas',
    emoji: '🌎',
    countries: 'USA, Canada, Mexico, Brazil, Colombia, Argentina and more',
    note: 'US plans include all major networks',
  },
  {
    region: 'Middle East & Africa',
    emoji: '🌍',
    countries: 'UAE, Saudi Arabia, Turkey, Egypt, South Africa, Kenya and more',
    note: 'Growing destination coverage',
  },
]

function EsimSpotlight() {
  const [activeRegion, setActiveRegion] = useState(0)
  const r = ESIM_REGIONS[activeRegion]

  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">
              Powered by Saily
            </p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              eSIM coverage worldwide
            </h2>
          </div>
          <Link
            href="/other-services/esims"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#03989e' }}
          >
            Browse all plans →
          </Link>
        </div>

        {/* Region tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ESIM_REGIONS.map((reg, i) => (
            <button
              key={reg.region}
              onClick={() => setActiveRegion(i)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all border"
              style={
                i === activeRegion
                  ? { backgroundColor: '#03989e', color: '#fff', borderColor: '#03989e' }
                  : { backgroundColor: '#fff', color: '#03989e', borderColor: '#03989e30' }
              }
            >
              {reg.emoji} {reg.region}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{r.emoji}</span>
            <h3 className="text-xl font-bold" style={{ color: '#232e4e' }}>
              {r.region}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Countries included</p>
              <p className="text-sm font-semibold text-slate-800">{r.countries}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Good to know</p>
              <p className="text-sm font-semibold text-slate-800">{r.note}</p>
            </div>
          </div>

          {/* How it works steps */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">How it works</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { step: '1', label: 'Choose your destination and data plan' },
                { step: '2', label: 'Purchase and receive your QR code instantly' },
                { step: '3', label: 'Scan the QR code to install the eSIM' },
                { step: '4', label: 'Enable mobile data when you land' },
              ].map(({ step, label }) => (
                <div
                  key={step}
                  className="flex items-start gap-3 bg-white rounded-2xl border border-gray-100 px-4 py-4"
                >
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: '#03989e' }}
                  >
                    {step}
                  </span>
                  <span className="text-sm text-slate-700">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/other-services/esims"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: '#03989e' }}
          >
            Get your eSIM for {r.region} →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// INSURANCE SPOTLIGHT
// ---------------------------------------------
const INSURANCE_TIERS = [
  {
    name: 'Single Trip',
    emoji: '🎒',
    color: '#232e4e',
    bg: '#232e4e15',
    tagline: 'For one-off trips and holidays.',
    bestFor: 'One holiday a year, short city breaks, backpacking trips',
    includes: [
      'Medical expenses up to £10m',
      'Cancellation cover up to £5,000',
      'Baggage cover up to £2,000',
      'Personal liability included',
      'Flight delay cover',
      '24/7 emergency helpline',
    ],
  },
  {
    name: 'Annual Multi-Trip',
    emoji: '🌍',
    color: '#03989e',
    bg: '#03989e15',
    tagline: 'Better value if you travel twice or more a year.',
    bestFor: 'Frequent travellers, business trips, multiple holidays per year',
    includes: [
      'Unlimited trips per year',
      'Medical expenses up to £10m per trip',
      'Cancellation cover up to £5,000 per trip',
      'Baggage cover up to £2,000 per trip',
      'Winter sports add-on available',
      '24/7 emergency helpline',
    ],
  },
  {
    name: 'Family Cover',
    emoji: '👨‍👩‍👧‍👦',
    color: '#5a7a52',
    bg: '#5a7a5215',
    tagline: 'Cover the whole family under one policy.',
    bestFor: 'Families travelling together, holidays with children',
    includes: [
      'Up to 2 adults and 4 children',
      'Medical expenses up to £10m per person',
      'Cancellation cover for the whole group',
      'Baggage cover per person',
      'Kids covered free under 18',
      '24/7 emergency helpline',
    ],
  },
]

function InsuranceSpotlight() {
  const [active, setActive] = useState(1)
  const tier = INSURANCE_TIERS[active]

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">
            Travel protected
          </p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Which travel insurance is right for you?
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            The right policy depends on how often you travel and who is coming with you.
          </p>
        </div>

        {/* Tier tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {INSURANCE_TIERS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border"
              style={
                i === active
                  ? { backgroundColor: t.color, color: '#fff', borderColor: t.color }
                  : { backgroundColor: `${t.color}10`, color: t.color, borderColor: `${t.color}30` }
              }
            >
              {t.emoji} {t.name}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{tier.emoji}</span>
            <div>
              <span
                className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ backgroundColor: tier.bg, color: tier.color }}
              >
                {tier.name}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-1" style={{ color: '#232e4e' }}>
            {tier.tagline}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="rounded-2xl px-5 py-4 border border-gray-100" style={{ backgroundColor: tier.bg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: tier.color }}>
                Best for
              </p>
              <p className="text-sm font-medium text-slate-700">{tier.bestFor}</p>
            </div>
            <div className="rounded-2xl px-5 py-4 border border-gray-100" style={{ backgroundColor: tier.bg }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: tier.color }}>
                What's included
              </p>
              <ul className="space-y-1">
                {tier.includes.map(item => (
                  <li key={item} className="text-sm font-medium text-slate-700 flex items-start gap-2">
                    <svg
                      className="w-3.5 h-3.5 mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: tier.color }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/other-services/travel-insurance"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: tier.color }}
          >
            Get a {tier.name} quote →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// TRAVEL TIPS STRIP
// ---------------------------------------------
const TRAVEL_TIPS = [
  {
    emoji: '📱',
    tip: 'Set up your eSIM before you fly - not in the airport queue.',
  },
  {
    emoji: '🛡️',
    tip: 'Buy travel insurance as soon as you book, not the night before.',
  },
  {
    emoji: '💳',
    tip: 'Notify your bank before you travel to avoid blocked cards abroad.',
  },
  {
    emoji: '📄',
    tip: 'Store copies of all travel documents in your email drafts.',
  },
  {
    emoji: '🔋',
    tip: 'Carry a power bank on travel days - airports drain batteries fast.',
  },
  {
    emoji: '🧳',
    tip: 'Put a luggage tag inside your bag, not just on the outside handle.',
  },
]

function TravelTipsStrip() {
  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Quick wins</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Smart travel tips
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            Small habits that make a real difference before and during any trip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRAVEL_TIPS.map(({ emoji, tip }) => (
            <div
              key={tip}
              className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-5"
            >
              <span className="text-2xl shrink-0">{emoji}</span>
              <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// FAQ SECTION
// ---------------------------------------------
function FaqSection() {
  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Help</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group border border-gray-100 rounded-2xl bg-white px-5 py-4 cursor-pointer"
            >
              <summary
                className="font-semibold text-sm list-none flex items-center justify-between gap-4"
                style={{ color: '#232e4e' }}
              >
                {q}
                <span className="shrink-0 text-gray-400 group-open:rotate-45 transition-transform duration-200 text-lg leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function OtherServicesPageClient() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden text-white py-24 px-6 text-center"
        style={{ backgroundColor: '#232e4e' }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
            Timms Travel · Other Services
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Everything your trip needs
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            From eSIMs and travel insurance to flights, hotels, experiences and car hire - all the services you need to travel smarter, in one place.
          </p>

          {/* Quick jump links */}
          <div className="flex flex-wrap justify-center gap-2">
            {SERVICES.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10"
              >
                {s.emoji} {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALL SERVICES GRID ── */}
      <section className="py-16 px-6 bg-gray-50" id="services">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">What we offer</p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              All travel services
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
              Everything you need before, during and after your trip - from one trusted platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(service => (
              <div key={service.id} id={service.id}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ESIM SPOTLIGHT ── */}
      <EsimSpotlight />

      {/* ── INSURANCE SPOTLIGHT ── */}
      <InsuranceSpotlight />

      {/* ── TRAVEL TIPS ── */}
      <TravelTipsStrip />

      {/* ── WHY TIMMS TRAVEL ── */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Why us</p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              Why choose Timms Travel
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {WHY_POINTS.map(({ emoji, title, body }) => (
              <div key={title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold mb-2" style={{ color: '#232e4e' }}>
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-slate-700 leading-relaxed text-sm">
            <p>
              Timms Travel was built on a simple idea: that booking a trip should feel as exciting as taking one. We have pulled together the most important services a traveller needs - and made each one as fast and friction-free as possible.
            </p>
            <p>
              Whether you are a seasoned traveller who books everything separately or someone planning their first big trip abroad, Timms Travel is built to work for you. Our eSIM partnership with Saily means you can sort your connectivity in minutes. Our insurance partners offer straightforward, comprehensive cover without the jargon. And our flight, hotel, car and experience search tools give you the full picture, fast.
            </p>
            <p>
              Timms Travel is proudly built in the United Kingdom. We focus on transparency, simplicity and genuine value - always.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection />

      <Footer />
    </main>
  )
}