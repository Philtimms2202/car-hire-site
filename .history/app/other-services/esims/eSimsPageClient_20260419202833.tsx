'use client'

import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import NextImage from 'next/image'

// ---------------------------------------------
// AFFILIATE LINK
// ---------------------------------------------
const SAILY_AFFILIATE_URL = 'https://saily.tpm.li/SoKxdWUl'

// ---------------------------------------------
// TYPES
// ---------------------------------------------
type Region = {
  id: string
  name: string
  emoji: string
  countries: string[]
  highlights: string
  note: string
}

type FaqItem = {
  q: string
  a: string
}

type ComparisonRow = {
  feature: string
  esim: string
  roaming: string
  localSim: string
  esimWins: boolean
}

type Testimonial = {
  name: string
  location: string
  quote: string
  initials: string
  color: string
}

// ---------------------------------------------
// REGIONS DATA
// ---------------------------------------------
const REGIONS: Region[] = [
  {
    id: 'europe',
    name: 'Europe',
    emoji: '🇪🇺',
    highlights: 'Pan-European plans available',
    note: 'One eSIM can cover 30+ European countries — no switching plans as you cross borders.',
    countries: [
      'United Kingdom', 'France', 'Germany', 'Spain', 'Italy', 'Portugal',
      'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway',
      'Denmark', 'Finland', 'Poland', 'Greece', 'Croatia', 'Czech Republic',
      'Hungary', 'Romania', 'Ireland', 'Scotland', 'Iceland', 'Malta', 'Cyprus',
    ],
  },
  {
    id: 'asia',
    name: 'Asia Pacific',
    emoji: '🌏',
    highlights: 'Country-specific & regional plans',
    note: 'Coverage across East Asia, Southeast Asia and the Pacific — including Japan, Thailand and Australia.',
    countries: [
      'Japan', 'South Korea', 'Thailand', 'Singapore', 'Malaysia', 'Indonesia',
      'Vietnam', 'Philippines', 'Hong Kong', 'Taiwan', 'Australia', 'New Zealand',
      'India', 'Sri Lanka', 'Cambodia', 'Myanmar', 'Laos', 'Nepal', 'Bangladesh',
      'Pakistan', 'Maldives', 'Fiji', 'Papua New Guinea',
    ],
  },
  {
    id: 'americas',
    name: 'Americas',
    emoji: '🌎',
    highlights: 'All major US networks included',
    note: 'Full US coverage across all major networks. Canada, Mexico and Latin America plans also available.',
    countries: [
      'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Colombia',
      'Chile', 'Peru', 'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay',
      'Costa Rica', 'Panama', 'Guatemala', 'Honduras', 'El Salvador',
      'Dominican Republic', 'Jamaica', 'Cuba', 'Trinidad & Tobago', 'Barbados',
    ],
  },
  {
    id: 'middleeast',
    name: 'Middle East & Africa',
    emoji: '🌍',
    highlights: 'Growing destination coverage',
    note: 'Strong coverage across the Gulf states and key African destinations, with more being added regularly.',
    countries: [
      'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
      'Turkey', 'Israel', 'Jordan', 'Egypt', 'Morocco', 'Tunisia',
      'South Africa', 'Kenya', 'Nigeria', 'Ghana', 'Tanzania', 'Ethiopia',
      'Rwanda', 'Uganda', 'Senegal', 'Ivory Coast', 'Cameroon',
    ],
  },
]

// ---------------------------------------------
// COMPARISON TABLE DATA
// ---------------------------------------------
const COMPARISON: ComparisonRow[] = [
  {
    feature: 'Setup time',
    esim: 'Minutes — before you fly',
    roaming: 'Automatic — but costly',
    localSim: '30–60 mins at the airport',
    esimWins: true,
  },
  {
    feature: 'Cost',
    esim: 'Transparent, competitive rates',
    roaming: 'Can be very expensive',
    localSim: 'Often cheap, but variable',
    esimWins: true,
  },
  {
    feature: 'Keep your number',
    esim: 'Yes — dual SIM support',
    roaming: 'Yes',
    localSim: 'No — you get a new number',
    esimWins: true,
  },
  {
    feature: 'Physical SIM needed',
    esim: 'No — fully digital',
    roaming: 'No',
    localSim: 'Yes — must find a store',
    esimWins: true,
  },
  {
    feature: 'Works in multiple countries',
    esim: 'Yes — regional plans available',
    roaming: 'Yes — but at high cost',
    localSim: 'Rarely — single country only',
    esimWins: true,
  },
  {
    feature: 'Activate before you travel',
    esim: 'Yes — scan QR from home',
    roaming: 'Not applicable',
    localSim: 'No — must be in country',
    esimWins: true,
  },
  {
    feature: 'Top up remotely',
    esim: 'Yes — via app or website',
    roaming: 'Not needed',
    localSim: 'Often difficult abroad',
    esimWins: true,
  },
]

// ---------------------------------------------
// TESTIMONIALS
// ---------------------------------------------
const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah M.',
    location: 'Manchester, UK',
    quote: 'I used a Saily eSIM for my Japan trip and it worked perfectly from the moment I landed. No queuing for a SIM card, no fuss — just data.',
    initials: 'SM',
    color: '#03989e',
  },
  {
    name: 'James T.',
    location: 'London, UK',
    quote: 'Travelling across six European countries in two weeks. One eSIM covered the lot. Genuinely the smartest travel purchase I made.',
    initials: 'JT',
    color: '#232e4e',
  },
  {
    name: 'Priya K.',
    location: 'Birmingham, UK',
    quote: 'Setup took less than five minutes. I was connected before I even got on the plane. Absolutely no issues in Dubai or Bangkok.',
    initials: 'PK',
    color: '#b8860b',
  },
]

// ---------------------------------------------
// FAQS
// ---------------------------------------------
const FAQS: FaqItem[] = [
  {
    q: 'What is an eSIM?',
    a: 'An eSIM (embedded SIM) is a digital SIM card built directly into your phone. Instead of inserting a physical SIM card, you activate a data plan by scanning a QR code. Your regular phone number and existing SIM stay active — the eSIM simply adds a second data connection for your destination.',
  },
  {
    q: 'Is my phone compatible with eSIM?',
    a: 'Most modern smartphones support eSIM. Compatible devices include iPhone XS and later, Google Pixel 3 and later, Samsung Galaxy S20 and later, and most flagship Android phones from 2020 onwards. Some budget and older devices may not support eSIM — check your phone settings under "Mobile Data" or "SIM & Network" to confirm.',
  },
  {
    q: 'How do I set up a Saily eSIM?',
    a: 'Once you purchase a plan through Saily, you will receive a QR code by email. Simply open your phone\'s camera, scan the QR code, follow the on-screen prompts, and the eSIM will install in seconds. You can do this at home before you travel, then enable mobile data when you land.',
  },
  {
    q: 'Can I keep my regular phone number with an eSIM?',
    a: 'Yes. eSIMs work in dual SIM mode alongside your existing physical SIM. Your regular number stays active for calls and texts, while the eSIM provides local data in your destination. You get the best of both.',
  },
  {
    q: 'How does eSIM compare to international roaming?',
    a: 'International roaming through your UK provider can be very expensive — particularly outside the EU — and rates vary widely by destination. A Saily eSIM typically costs a fraction of roaming charges, with transparent pricing you choose in advance. There are no bill shock surprises.',
  },
  {
    q: 'Can one eSIM cover multiple countries?',
    a: 'Yes. Saily offers regional plans that cover multiple countries under a single purchase. Their Europe plan, for example, covers 30+ countries — ideal if you are crossing borders on a multi-country trip.',
  },
  {
    q: 'What happens if I run out of data?',
    a: 'You can top up your Saily eSIM remotely at any time via the Saily app or website — no need to find a local store or buy a new SIM card. Additional data is available to purchase instantly.',
  },
  {
    q: 'Is there a limit to how many eSIMs I can have?',
    a: 'Most eSIM-compatible phones can store multiple eSIM profiles, though typically only one can be active at a time. This means you can purchase eSIMs for future trips in advance and switch between them as needed.',
  },
  {
    q: 'Does an eSIM work for calls and texts?',
    a: 'Saily eSIM plans are data-only. For calls and texts, your regular physical SIM remains active. If you need to make calls while abroad, you can use data-based services like WhatsApp, FaceTime or Google Meet over your eSIM data connection.',
  },
  {
    q: 'What is Saily and why does Timms Travel use them?',
    a: 'Saily is a leading global eSIM provider with coverage in 150+ countries. They offer transparent pricing, easy setup and reliable connections. Timms Travel partners with Saily because they consistently provide the best combination of coverage, price and ease of use for UK travellers.',
  },
]

// ---------------------------------------------
// HOW IT WORKS STEPS
// ---------------------------------------------
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose your plan',
    body: 'Select your destination or region and pick the data amount that suits your trip. Day plans, week plans and monthly options are available.',
    emoji: '🗺️',
  },
  {
    step: '02',
    title: 'Purchase instantly',
    body: 'Complete your purchase through Saily in minutes. Your eSIM QR code arrives by email immediately — no waiting, no delivery.',
    emoji: '💳',
  },
  {
    step: '03',
    title: 'Scan and install',
    body: 'Open your phone camera, scan the QR code and follow the on-screen steps. The eSIM installs in seconds. You can do this at home before you fly.',
    emoji: '📲',
  },
  {
    step: '04',
    title: 'Enable when you land',
    body: 'Switch on your eSIM data when you arrive. You are connected instantly — no airport queues, no hunting for a local SIM card shop.',
    emoji: '✅',
  },
]

// ---------------------------------------------
// COMPATIBLE DEVICES
// ---------------------------------------------
const COMPATIBLE_DEVICES = [
  { brand: 'Apple', models: 'iPhone XS, XR and all later models (iPhone 11 through 16 series)' },
  { brand: 'Samsung', models: 'Galaxy S20, S21, S22, S23, S24, Z Fold and Z Flip series' },
  { brand: 'Google', models: 'Pixel 3, 4, 5, 6, 7, 8 and all later Pixel models' },
  { brand: 'OnePlus', models: 'OnePlus 12 and selected recent flagship models' },
  { brand: 'Motorola', models: 'Razr series and selected Moto Edge models' },
  { brand: 'Huawei', models: 'P40, Mate 40 and selected models (limited support)' },
]

// ---------------------------------------------
// REGION SELECTOR COMPONENT
// ---------------------------------------------
function RegionSelector() {
  const [activeRegion, setActiveRegion] = useState(0)
  const region = REGIONS[activeRegion]

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Coverage</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Where can I use a Saily eSIM?
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            Saily covers 150+ countries worldwide. Browse by region to see what's available.
          </p>
        </div>

        {/* Region tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {REGIONS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setActiveRegion(i)}
              className="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border"
              style={
                i === activeRegion
                  ? { backgroundColor: '#232e4e', color: '#fff', borderColor: '#232e4e' }
                  : { backgroundColor: '#fff', color: '#232e4e', borderColor: '#e5e7eb' }
              }
            >
              {r.emoji} {r.name}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-10 shadow-sm">
          {/* Region header */}
          <div className="flex items-start gap-4 mb-6">
            <span className="text-4xl">{region.emoji}</span>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#232e4e' }}>
                {region.name}
              </h3>
              <span
                className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mt-1"
                style={{ backgroundColor: '#03989e15', color: '#03989e' }}
              >
                {region.highlights}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-6">{region.note}</p>

          {/* Country pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {region.countries.map(c => (
              <span
                key={c}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border"
                style={{ backgroundColor: '#f9fafb', color: '#374151', borderColor: '#e5e7eb' }}
              >
                {c}
              </span>
            ))}
          </div>

          <a
            href={SAILY_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: '#03989e' }}
          >
            Browse {region.name} eSIM plans →
          </a>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// HOW IT WORKS SECTION
// ---------------------------------------------
function HowItWorksSection() {
  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Simple setup</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Up and running in minutes
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            From purchase to connected — the whole process takes less time than checking in for your flight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {HOW_IT_WORKS.map(({ step, title, body, emoji }, i) => (
            <div key={step} className="relative">
              {/* Connector line (hidden on last) */}
              {i < HOW_IT_WORKS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-full w-full h-px z-0"
                  style={{ backgroundColor: '#03989e30' }}
                />
              )}
              <div className="relative z-10 rounded-2xl border border-gray-100 bg-gray-50 p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: '#03989e' }}
                  >
                    {step}
                  </span>
                  <span className="text-xl">{emoji}</span>
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#232e4e' }}>
                  {title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={SAILY_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
            style={{ backgroundColor: '#03989e' }}
          >
            Get started with Saily →
          </a>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// COMPARISON SECTION
// ---------------------------------------------
function ComparisonSection() {
  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Why eSIM</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            eSIM vs roaming vs local SIM
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            The honest comparison — so you can make the right call for your trip.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-0 border-b border-gray-100">
            <div className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Feature
            </div>
            <div
              className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-center text-white rounded-t-none"
              style={{ backgroundColor: '#03989e' }}
            >
              eSIM (Saily)
            </div>
            <div className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-center text-gray-500 bg-gray-50">
              Roaming
            </div>
            <div className="px-5 py-4 text-xs font-bold uppercase tracking-widest text-center text-gray-500 bg-gray-50">
              Local SIM
            </div>
          </div>

          {/* Table rows */}
          {COMPARISON.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-4 gap-0 border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              <div className="px-5 py-4 text-xs font-semibold text-gray-600 flex items-center">
                {row.feature}
              </div>
              <div
                className="px-5 py-4 text-xs font-semibold text-center flex items-center justify-center"
                style={{ backgroundColor: '#03989e08', color: '#03989e' }}
              >
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  {row.esim}
                </span>
              </div>
              <div className="px-5 py-4 text-xs text-center text-gray-500 flex items-center justify-center">
                {row.roaming}
              </div>
              <div className="px-5 py-4 text-xs text-center text-gray-500 flex items-center justify-center">
                {row.localSim}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// COMPATIBLE DEVICES SECTION
// ---------------------------------------------
function CompatibleDevicesSection() {
  return (
    <section className="py-16 px-6 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Check compatibility</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            Is my phone eSIM compatible?
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            Most modern smartphones support eSIM. Here is a quick guide to the most common compatible devices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {COMPATIBLE_DEVICES.map(({ brand, models }) => (
            <div
              key={brand}
              className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-5"
            >
              <span
                className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: '#232e4e' }}
              >
                {brand[0]}
              </span>
              <div>
                <p className="font-bold text-sm mb-0.5" style={{ color: '#232e4e' }}>
                  {brand}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">{models}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl border px-6 py-5 flex items-start gap-4"
          style={{ backgroundColor: '#03989e10', borderColor: '#03989e30' }}
        >
          <span className="text-xl shrink-0">💡</span>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#232e4e' }}>
              Not sure if your phone is compatible?
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              On iPhone: go to Settings → General → About and look for "Available SIM" or "Digital SIM". On Android: go to Settings → Network & Internet → SIM cards. If you see an eSIM option, your device is compatible. Saily also provides a compatibility checker on their website.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------
// TESTIMONIALS SECTION
// ---------------------------------------------
function TestimonialsSection() {
  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Traveller stories</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
            What our travellers say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, location, quote, initials, color }) => (
            <div
              key={name}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="#f59e0b" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5 italic">
                &ldquo;{quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#232e4e' }}>
                    {name}
                  </p>
                  <p className="text-xs text-gray-400">{location}</p>
                </div>
              </div>
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
    <section className="py-16 px-6 bg-white border-t border-gray-100">
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
              className="group border border-gray-100 rounded-2xl bg-gray-50 px-5 py-4 cursor-pointer"
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
// CTA BANNER
// ---------------------------------------------
function CtaBanner() {
  return (
    <section className="py-16 px-6 border-t border-gray-100" style={{ backgroundColor: '#232e4e' }}>
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-4xl mb-4 block">📱</span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Ready to travel without roaming charges?
        </h2>
        <p className="text-gray-300 text-sm md:text-base mb-8 max-w-xl mx-auto">
          Join millions of travellers using Saily eSIMs. Browse plans for 150+ countries and get connected in minutes — no physical SIM, no airport queues, no bill shock.
        </p>
        <a
          href={SAILY_AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
          style={{ backgroundColor: '#03989e', color: '#fff' }}
        >
          Browse Saily eSIM Plans →
        </a>
        <p className="text-gray-500 text-xs mt-4">
          Powered by Saily · 150+ countries · Instant digital delivery
        </p>
      </div>
    </section>
  )
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function EsimsPageClient() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden text-white py-24 px-6 text-center">
        <NextImage
          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1740"
          alt="Person using phone while travelling"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[#232e4e]/80 z-0" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-teal-400 mb-4">
            Timms Travel · eSIMs
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Stay connected wherever you go
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Saily eSIMs give you fast, affordable mobile data in 150+ countries — activated in minutes, before you even board your flight.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { emoji: '🌍', label: '150+ countries' },
              { emoji: '⚡', label: 'Instant activation' },
              { emoji: '💸', label: 'No roaming charges' },
              { emoji: '📱', label: 'No physical SIM' },
            ].map(({ emoji, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20"
              >
                {emoji} {label}
              </span>
            ))}
          </div>

          <a
            href={SAILY_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
            style={{ backgroundColor: '#03989e', color: '#fff' }}
          >
            Browse eSIM Plans on Saily →
          </a>
          <p className="text-gray-400 text-xs mt-3">Powered by Saily · Trusted by millions of travellers</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorksSection />

      {/* ── REGION COVERAGE ── */}
      <RegionSelector />

      {/* ── COMPARISON ── */}
      <ComparisonSection />

      {/* ── COMPATIBLE DEVICES ── */}
      <CompatibleDevicesSection />

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />

      {/* ── WHY SAILY ── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Our partner</p>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
              Why we partner with Saily
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                emoji: '🌍',
                title: '150+ countries covered',
                body: 'Saily\'s global network means you are covered whether you are heading to Tokyo, Toronto or Tenerife. Their coverage continues to expand.',
              },
              {
                emoji: '💸',
                title: 'Transparent, competitive pricing',
                body: 'No hidden fees, no bill shock. You choose your plan and data amount upfront — what you pay is what you get.',
              },
              {
                emoji: '⚡',
                title: 'Instant digital delivery',
                body: 'Your eSIM QR code arrives by email the moment you purchase. Set it up at home, on the sofa, before you pack a single thing.',
              },
            ].map(({ emoji, title, body }) => (
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
              We chose Saily as our eSIM partner because they offer exactly what travellers need: straightforward plans, honest pricing and a setup process that genuinely works. There are plenty of eSIM providers out there, but Saily consistently delivers on coverage, reliability and customer experience.
            </p>
            <p>
              When you click through to Saily from Timms Travel, you will find plans for every type of trip — from a short weekend break to a months-long backpacking adventure. Country-specific plans, regional plans and global plans are all available, so you only pay for what you actually need.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── CTA BANNER ── */}
      <CtaBanner />

      <Footer />
    </main>
  )
}