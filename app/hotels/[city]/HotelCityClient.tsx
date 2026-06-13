'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

// ─── Booking.com Affiliate Links ────────────────────────────────────────────

const BOOKING_AID = '818288' 
const BOOKING_LABEL = 'affnetcj-11916287_pub-5108952_site-101749590'

/**
 * Generates a resilient Booking.com deep link using state-forcing parameters
 * from a verified, successful search structure.
 */
function buildBookingDeepLink(city: string, country: string): string {
  const cleanCity = city.trim();
  const cleanCountry = country.trim();
  
  // Construct a clean display string (e.g., "Barcelona, Spain")
  const fullDestination = `${cleanCity}, ${cleanCountry}`;
  const encodedDestination = encodeURIComponent(fullDestination);
  
  let url = `https://www.booking.com/searchresults.en-gb.html`;
  
  // 1. Core Affiliate Tracking
  url += `?aid=${BOOKING_AID}`;
  url += `&label=${BOOKING_LABEL}`;
  url += `&lang=en-gb`;
  
  // 2. Behavioral Flags (Tells the SPA engine a search was submitted & selected)
  url += `&sb=1`;
  url += `&sb_lp=1`;
  url += `&src=index`;
  url += `&src_elem=sb`;
  url += `&from_sf=1`;
  url += `&search_selected=true`;
  
  // 3. Destination Inputs (Mapping both the formal title and raw string inputs)
  url += `&ss=${encodedDestination}`;
  url += `&ss_raw=${encodeURIComponent(cleanCity.toLowerCase())}`;
  url += `&dest_type=city`;
  
  // 4. Fallback Default Parameters to lock the container structure
  url += `&group_adults=2`;
  url += `&group_children=0`;
  url += `&no_rooms=1`;
  url += `&flex_window=0`;
  
  return url;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type FAQ           = { question: string; answer: string }
type Neighbourhood = { name: string; description: string }
type HighlightCard = { title: string; description: string }

type Props = {
  cityName: string
  countryName: string
  emoji?: string
  heroDescription?: string
  citySlug: string
  countrySlug?: string
  continentSlug?: string

  aiIntro?: string | null
  aiNeighbourhoods?: Neighbourhood[]
  aiFirstTimers?: string | null
  aiBudget?: string | null
  aiCouples?: string | null
  aiFamilies?: string | null
  aiWhenToVisit?: string | null
  aiNightlife?: string | null
  aiFood?: string | null
  aiSafety?: string | null
  aiTransport?: string | null
  aiLocalTips?: string | null
  aiHowManyDays?: string | null
  aiDigitalNomads?: string | null
  aiAreasToAvoid?: string | null
  aiFaqs?: FAQ[]

  aiHighlightsIntro?: string | null
  aiHighlightCards?: HighlightCard[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function splitIntoParagraphs(text: string): string[] {
  if (!text) return []
  const sentences = text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean)
  const out: string[] = []
  let current: string[] = []
  sentences.forEach(s => {
    current.push(s)
    if (current.length >= 3) { out.push(current.join(' ')); current = [] }
  })
  if (current.length) out.push(current.join(' '))
  return out
}

// ─── Primitives ──────────────────────────────────────────────────────────────

function ParagraphBlock({ text }: { text: string }) {
  return (
    <div className="space-y-4 text-gray-600 leading-relaxed text-[15px]">
      {splitIntoParagraphs(text).map((p, i) => (
        <p key={i} className="tracking-normal text-left">{p}</p>
      ))}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="uppercase tracking-[0.18em] text-[11px] font-bold mb-2 flex items-center gap-2"
       style={{ color: '#03989e' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#03989e' }}></span>
      {children}
    </p>
  )
}

// ─── Refactored Headers & Layouts ───────────────────────────────────────────

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3.5xl font-extrabold mb-3 leading-tight tracking-tight"
        style={{ color: '#022135' }}>
      {children}
    </h2>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-base text-gray-500 mb-8 max-w-3xl leading-relaxed">{children}</p>
}

function InlineCTA({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-2 mt-6 text-sm font-bold transition-all duration-200 hover:opacity-75 hover:translate-x-0.5"
       style={{ color: '#03989e' }}>
      <span>{label}</span>
      <span className="text-base font-normal">→</span>
    </a>
  )
}

function LinkPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 hover:shadow-sm hover:bg-gray-50"
          style={{ borderColor: '#03989e', color: '#03989e', backgroundColor: 'transparent' }}>
      {children}
    </Link>
  )
}

// ─── UI Components ───────────────────────────────────────────────────────────

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = React.useState(index === 0)
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-200 hover:border-gray-300">
      <button onClick={() => setOpen(o => !o)}
              className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <span className="font-bold text-sm md:text-base pr-4" style={{ color: '#022135' }}>
          {faq.question}
        </span>
        <span className="text-xl text-gray-400 flex-shrink-0 font-light w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 bg-white border-t border-gray-50 pt-3">
          <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

function NeighbourhoodCard({ n, index }: { n: Neighbourhood; index: number }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg md:text-xl group-hover:text-[#03989e] transition-colors" style={{ color: '#022135' }}>
            {n.name}
          </h3>
          <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-gray-100 text-gray-500">
            Area 0{index + 1}
          </span>
        </div>
        <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed mb-4">{n.description}</p>
      </div>
      <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Great for walking
        </span>
        <span className="font-medium" style={{ color: '#03989e' }}>Scroll to map</span>
      </div>
    </article>
  )
}

function HighlightCardBox({ card, index }: { card: HighlightCard; index: number }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: index % 2 === 0 ? '#022135' : '#03989e' }}></div>
      <div>
        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-xs mb-3" style={{ color: '#03989e' }}>
          {index + 1}
        </div>
        <h3 className="font-bold text-sm md:text-base mb-2" style={{ color: '#022135' }}>{card.title}</h3>
        <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{card.description}</p>
      </div>
    </article>
  )
}

// ─── Navigation ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'overview',       label: 'Overview'      },
  { id: 'areas',          label: 'Where to Stay' },
  { id: 'first-timers',   label: 'First-Timers'  },
  { id: 'budget',         label: 'Budget Tips'   },
  { id: 'couples',        label: 'For Couples'   },
  { id: 'families',       label: 'For Families'  },
  { id: 'when',           label: 'When to Go'    },
  { id: 'practicalities', label: 'Safety & Transit'},
  { id: 'faqs',           label: 'FAQs'          },
]

function QuickNav() {
  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm overflow-x-auto scrollbar-none">
      <div className="max-w-5xl mx-auto flex gap-1 px-4 py-3 min-w-max items-center">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-2 border-r border-gray-200 pr-3">Guide Menu</span>
        {NAV_ITEMS.map(item => (
          <a key={item.id} href={`#${item.id}`}
             className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-[#022135] hover:bg-gray-50 transition-all whitespace-nowrap">
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function HotelCityClient(props: Props) {
  const {
    cityName, countryName, emoji, heroDescription,
    citySlug, countrySlug, continentSlug,
    aiIntro, aiNeighbourhoods,
    aiFirstTimers, aiBudget, aiCouples, aiFamilies,
    aiWhenToVisit, aiNightlife, aiFood,
    aiSafety, aiTransport, aiLocalTips,
    aiHowManyDays, aiDigitalNomads, aiAreasToAvoid,
    aiFaqs, aiHighlightsIntro, aiHighlightCards,
  } = props

  const bookingUrl = buildBookingDeepLink(cityName, countryName)

  const needsAI =
    !aiIntro || !aiNeighbourhoods?.length || !aiFirstTimers ||
    !aiBudget || !aiCouples || !aiFamilies || !aiWhenToVisit ||
    !aiNightlife || !aiFood || !aiSafety || !aiTransport ||
    !aiLocalTips || !aiHowManyDays || !aiDigitalNomads ||
    !aiAreasToAvoid || !aiFaqs?.length

  useEffect(() => {
    if (!needsAI) return
    fetch(`/api/generate-ai?city=${citySlug}`, { method: 'POST' })
      .then(r => r.json())
      .then(d => { if (d.status === 'created') window.location.reload() })
      .catch(err => console.error('Error generating guide data:', err))
  }, [needsAI, citySlug])

  const neighbourhoods: Neighbourhood[] = aiNeighbourhoods?.length
    ? aiNeighbourhoods
    : [
        { name: `Downtown ${cityName}`, description: 'The absolute heart of the action. Perfect if you want to walk out of your lobby right into shopping avenues, great restaurants, and main transit hubs.' },
        { name: 'The Old Town / Historic Quarter', description: 'Charming cobblestone streets, locally-owned boutique hotels, small family-run cafes, and historic architecture right around every corner.' },
      ]

  const faqSchema = aiFaqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: aiFaqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  const thingsToDoHref = continentSlug && countrySlug
    ? `/locations/${continentSlug}/${countrySlug}/${citySlug}/things-to-do`
    : null
  const locationHref = continentSlug && countrySlug
    ? `/locations/${continentSlug}/${countrySlug}/${citySlug}`
    : null
  const countryHotelsHref = countrySlug ? `/hotels/${countrySlug}` : null

  // Clean, URL-encoded string for the dynamic Google Maps iframe destination
  const encodedMapLocation = encodeURIComponent(`${cityName}, ${countryName}`)

  return (
    <main className="min-h-screen bg-white selection:bg-[#03989e]/10">

      {faqSchema && (
        <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="text-white py-24 md:py-32 px-6 text-center relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          {emoji && <div className="text-6xl md:text-7xl mb-6 animate-bounce duration-1000">{emoji}</div>}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-none">
            Where to Stay in {cityName}
          </h1>
          <p className="text-base md:text-xl text-teal-50 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            {heroDescription || aiIntro || `An honest, neighborhood-by-neighborhood look at where to base yourself in ${cityName}, broken down by travel style, budget, and real experiences.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
               className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-95 hover:scale-[1.01] shadow-xl text-white"
               style={{ backgroundColor: '#03989e' }}>
              Find Hotels in {cityName} →
            </a>
            {thingsToDoHref && (
              <Link href={thingsToDoHref}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm border border-white/30 text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                Top Things to See & Do
              </Link>
            )}
          </div>
          <p className="text-xs text-teal-200/80 mt-6 max-w-md mx-auto italic">
            We want to be upfront: Timms Travel uses affiliate links. If you book a place through our links, we might earn a small commission at completely zero extra cost to you.
          </p>
        </div>
      </section>

      {/* ── QUICK NAV ────────────────────────────────────────────────── */}
      <QuickNav />

      {/* ── OVERVIEW INTRODUCTION ─────────────────────────────────────── */}
      <section id="overview" className="py-16 px-6 bg-white border-b border-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 items-start">
            <div className="md:col-span-2 space-y-4">
              <SectionLabel>Getting Your Bearings</SectionLabel>
              <H2>Finding your perfect base</H2>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                Choosing where to base yourself in {cityName} can make or break your trip. It helps to look past the cheapest hotel rates and think about how you actually want to spend your days. The vibe changes completely depending on whether you choose a central city street or a quiet residential neighborhood.
              </p>
              {aiIntro && <ParagraphBlock text={aiIntro} />}
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4 mt-6 md:mt-0">
              <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: '#022135' }}>Quick Trip Snapshot</h4>
              <div className="space-y-3 divide-y divide-gray-200/60 text-xs">
                <div className="pt-2 flex justify-between"><span className="text-gray-500">Location:</span><span className="font-bold text-gray-800">{cityName}, {countryName}</span></div>
                <div className="pt-3 flex justify-between"><span className="text-gray-500">Getting Around:</span><span className="font-bold text-emerald-600">Great trains, buses & walkability</span></div>
                <div className="pt-3 flex justify-between"><span className="text-gray-500">Accommodation Types:</span><span className="font-bold text-gray-800">Boutiques, chain hotels & apartments</span></div>
                <div className="pt-3 flex justify-between"><span className="text-gray-500">Recommended Stay:</span><span className="font-bold text-gray-800">3 to 5 full days</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ────────────────────────────────────────────────── */}
      {aiHighlightCards?.length ? (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <SectionLabel>Local Highlights</SectionLabel>
            <H2>What makes {cityName} special</H2>
            {aiHighlightsIntro && <Kicker>{aiHighlightsIntro}</Kicker>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-6">
              {aiHighlightCards.map((card, i) => (
                <HighlightCardBox key={i} card={card} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── NEIGHBOURHOODS ────────────────────────────────────────────── */}
      <section id="areas" className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Neighborhood Guide</SectionLabel>
          <H2>The best neighborhoods to stay in</H2>
          <Kicker>Here is a breakdown of the distinct parts of town travelers usually choose, depending on the kind of experience they want to have.</Kicker>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {neighbourhoods.map((n, i) => <NeighbourhoodCard key={i} n={n} index={i} />)}
          </div>

          {/* ── QUICK SNAPSHOT TABLE ── */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm mt-8">
            <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: '#022135' }}>
              <h4 className="text-white font-bold text-sm">Neighborhood Breakdown at a Glance</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                    <th className="p-4">Area / Neighborhood</th>
                    <th className="p-4">The Vibe</th>
                    <th className="p-4">Public Transport</th>
                    <th className="p-4 text-right">Best Suited For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-bold text-gray-800">Downtown / City Center</td>
                    <td className="p-4">Busy, fast-paced, steps from everywhere</td>
                    <td className="p-4 text-emerald-600 font-medium">Excellent links right outside</td>
                    <td className="p-4 text-right">First-time visitors</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-bold text-gray-800">Old Town / Historic Quarter</td>
                    <td className="p-4">Beautiful, historic, charming</td>
                    <td className="p-4 text-amber-600 font-medium">Mostly walking & local trams</td>
                    <td className="p-4 text-right">Couples & history buffs</td>
                  </tr>
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-bold text-gray-800">Arts District / Creative Suburbs</td>
                    <td className="p-4">Local, trendy, great cafes</td>
                    <td className="p-4 text-gray-500">Quick bus or train away</td>
                    <td className="p-4 text-right">Foodies & budget travelers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── EMBEDDED GOOGLE MAPS COMPONENT (API-KEY-FREE) ── */}
          <div className="mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-lg" style={{ color: '#022135' }}>Explore the City Layout</h3>
                <p className="text-xs text-gray-500">Use this live map to check distances to transit stops, major landmarks, and sights.</p>
              </div>
              {/* Clean outbound link for users who want to jump straight to the Google Maps App */}
              <a href={`https://maps.google.com/?q=${encodedMapLocation}`} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-xs font-bold underline flex items-center gap-1" 
                 style={{ color: '#03989e' }}>
                Open in Google Maps app ↗
              </a>
            </div>
            
            {/* The Iframe Container */}
            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
              <iframe
                title={`Google Map of ${cityName}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                /* This public URL structure works flawlessly without an API key */
                src={`https://maps.google.com/maps?q=${encodedMapLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-10 pt-4 border-t border-gray-100">
            <InlineCTA href={bookingUrl} label={`Check live prices for hotels in ${cityName}`} />
            {thingsToDoHref && (
              <Link href={thingsToDoHref}
                    className="inline-flex items-center gap-1.5 mt-6 text-sm font-bold text-gray-400 hover:text-[#022135] transition-all">
                See our full {cityName} itinerary guide →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── FIRST-TIMERS ──────────────────────────────────────────────── */}
      {aiFirstTimers && (
        <section id="first-timers" className="py-16 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-12 items-start">
            <div className="space-y-4">
              <SectionLabel>First-Time Visitors</SectionLabel>
              <H2>Where to base yourself for your very first visit</H2>
              <div className="mt-4"><ParagraphBlock text={aiFirstTimers} /></div>
              <InlineCTA href={bookingUrl} label={`See central hotels close to the sights`} />
            </div>
            <aside className="rounded-2xl border p-6 text-sm leading-relaxed space-y-4 shadow-sm"
                   style={{ borderColor: '#03989e', backgroundColor: 'rgba(3,152,158,0.03)' }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#03989e' }}></span>
                <p className="font-bold text-xs uppercase tracking-widest" style={{ color: '#03989e' }}>
                  A Good Rule of Thumb
                </p>
              </div>
              <p className="text-gray-600">
                If it is your first time here, save yourself the stress and stay central. Spending a few extra dollars to be within walking distance of things is usually better than wasting half your morning on buses.
              </p>
              <div className="text-xs space-y-2 border-y border-gray-200/60 py-3 my-2 text-gray-500 font-medium">
                <div className="flex items-center gap-2">✓ Within a 5-minute walk of a main train line</div>
                <div className="flex items-center gap-2">✓ Plenty of nearby cafes and open dinner spots</div>
                <div className="flex items-center gap-2">✓ Well-lit, highly walkable streets</div>
              </div>
              <p className="text-gray-600 text-xs">
                Choosing a spot near central transport means you can drop off your bags quickly and start exploring without missing a beat.
              </p>
              {locationHref && (
                <Link href={locationHref}
                      className="block pt-2 text-xs font-bold uppercase tracking-wider hover:opacity-75 transition-all"
                      style={{ color: '#03989e' }}>
                  Explore Area Guide Details →
                </Link>
              )}
            </aside>
          </div>
        </section>
      )}

      {/* ── BUDGET ────────────────────────────────────────────────────── */}
      {aiBudget && (
        <section id="budget" className="py-16 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-12 items-start">
            <div className="space-y-4">
              <SectionLabel>Budgeting Tips</SectionLabel>
              <H2>Affordable neighborhoods that won't break the bank</H2>
              <div className="mt-4"><ParagraphBlock text={aiBudget} /></div>
              <InlineCTA href={bookingUrl} label={`Show budget-friendly hotels`} />
            </div>
            <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm space-y-4 shadow-inner">
              <p className="font-bold text-xs uppercase tracking-widest text-gray-400">Saving Money Without Hassle</p>
              <p className="text-gray-600">
                You don't have to stay far out in the suburbs to save money. Booking a place just two or three transit stops away from the absolute center can cut your accommodation costs significantly.
              </p>
              <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2 text-xs">
                <span className="font-bold text-gray-700 block mb-1">Our Favorite Hack:</span>
                <p className="text-gray-500 leading-normal">Look out for properties that focus on business travelers—they often lower their rates significantly on weekends and during holiday seasons when business slows down.</p>
              </div>
              <Link href="/other-services/travel-insurance"
                    className="block pt-1 text-xs font-bold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Get a quick travel insurance quote →
              </Link>
            </aside>
          </div>
        </section>
      )}

      {/* ── COUPLES ───────────────────────────────────────────────────── */}
      {aiCouples && (
        <section id="couples" className="py-16 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-12 items-start">
            <div className="space-y-4">
              <SectionLabel>For Couples</SectionLabel>
              <H2>Great neighborhoods for a romantic trip away</H2>
              <div className="mt-4"><ParagraphBlock text={aiCouples} /></div>
              <InlineCTA href={bookingUrl} label={`Browse charming boutique hotels`} />
            </div>
            <aside className="rounded-2xl border border-gray-200 bg-white p-6 text-sm space-y-4 shadow-sm">
              <p className="font-bold text-xs uppercase tracking-widest text-gray-400">Finding the Right Atmosphere</p>
              <p className="text-gray-600">
                Smaller, independently-owned boutique hotels tucked down historical side streets tend to have a lot more charm than the big corporate hotel chains.
              </p>
              <blockquote className="border-l-4 border-teal-500 pl-4 py-1 my-2 text-xs text-gray-500 italic bg-gray-50 pr-2 rounded-r-lg">
                “If you can, ask for a room that looks out over an interior courtyard. It keeps things nice and quiet, even if you are staying near a lively nightlife street.”
              </blockquote>
              <Link href="/other-services/travel-insurance"
                    className="block pt-1 text-xs font-bold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Look into travel protection options →
              </Link>
            </aside>
          </div>
        </section>
      )}

      {/* ── FAMILIES ──────────────────────────────────────────────────── */}
      {aiFamilies && (
        <section id="families" className="py-16 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-12 items-start">
            <div className="space-y-4">
              <SectionLabel>For Families</SectionLabel>
              <H2>Relaxed, family-friendly neighborhoods</H2>
              <div className="mt-4"><ParagraphBlock text={aiFamilies} /></div>
              <InlineCTA href={bookingUrl} label={`Show family-friendly apartments and suites`} />
            </div>
            <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-sm space-y-4 shadow-sm">
              <p className="font-bold text-xs uppercase tracking-widest text-gray-400">Family Comfort Guide</p>
              <p className="text-gray-600">
                Booking a residential aparthotel or a full apartment can save your sanity when traveling with family. It gives everyone a bit more room to stretch out.
              </p>
              <div className="p-3 bg-amber-50 text-amber-900 border border-amber-100 rounded-xl text-xs space-y-1">
                <p className="font-bold">Things to look for before booking:</p>
                <p className="text-amber-800">Working elevators if you have a stroller, close parks or green spaces, a small grocery store nearby, and laundry facilities inside the room.</p>
              </div>
              <Link href="/other-services/travel-insurance"
                    className="block pt-1 text-xs font-bold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Check out family travel protection packages →
              </Link>
            </aside>
          </div>
        </section>
      )}

      {/* ── WHEN TO VISIT ─────────────────────────────────────────────── */}
      {aiWhenToVisit && (
        <section id="when" className="py-16 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-12 items-start">
            <div className="space-y-4">
              <SectionLabel>Timing Your Visit</SectionLabel>
              <H2>The best time of year to visit {cityName}</H2>
              <div className="mt-4"><ParagraphBlock text={aiWhenToVisit} /></div>
              <Link href="/flights"
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold hover:opacity-75 transition-all"
                    style={{ color: '#03989e' }}>
                Compare seasonal flight prices →
              </Link>
            </div>

            {/* RIGHT COLUMN — SEASON QUICK LOOK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {[
                { season: 'Springtime', note: "Perfect walking weather, fewer crowds, and hotels haven't jacked up their summer prices yet." },
                { season: 'Summer Peak',   note: 'The city is completely alive and days are long, but prices are at their highest and sights get busy.' },
                { season: 'Autumn Months',   note: 'A wonderful sweet spot. Crisp air, beautiful seasonal leaves, and the peak crowds have gone home.' },
                { season: 'Winter Escape',   note: 'The absolute cheapest time to book hotels, though keep in mind it gets dark earlier and some spots close early.' },
              ].map(({ season, note }) => (
                <div key={season} className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2 shadow-sm hover:border-gray-300 transition-all">
                  <p className="font-bold text-sm" style={{ color: '#022135' }}>{season}</p>
                  <p className="text-gray-500 leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NIGHTLIFE + FOOD ──────────────────────────────────────────── */}
      {/* ... continuation of component layout */}
    </main>
  )
}