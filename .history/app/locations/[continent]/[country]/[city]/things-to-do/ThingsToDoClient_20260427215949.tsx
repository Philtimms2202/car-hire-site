'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

// ─── GetYourGuide ────────────────────────────────────────────────────────────

const GYG_PARTNER_ID = 'P7B7GRH'

function gygUrl(city: string, query: string) {
  return `https://www.getyourguide.com/s/?q=${encodeURIComponent(`${city} ${query}`)}&partner_id=${GYG_PARTNER_ID}`
}

// ─── Types ────────────────────────────────────────────────────────────────────

type HighlightCard = { title: string; description: string }
type AreaCard      = { name: string; description: string }
type FAQ           = { question: string; answer: string }

type Props = {
  _id: string
  city: string
  country: string
  emoji?: string
  citySlug: string
  countrySlug: string
  continentSlug: string
  ttdIntro?: string | null
  ttdHighlights?: HighlightCard[]
  ttdNeighbourhoods?: AreaCard[]
  ttdWithKids?: string | null
  ttdOnABudget?: string | null
  ttdForCouples?: string | null
  ttdDayTrips?: string | null
  ttdWhenToGo?: string | null
  ttdLocalTips?: string | null
  ttdFaqs?: FAQ[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Primitives ───────────────────────────────────────────────────────────────

function ParagraphBlock({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-gray-600 leading-relaxed text-[15px]">
      {splitIntoParagraphs(text).map((p, i) => <p key={i}>{p}</p>)}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="uppercase tracking-[0.18em] text-[11px] font-medium mb-2"
       style={{ color: '#03989e' }}>
      {children}
    </p>
  )
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight"
        style={{ color: '#022135' }}>
      {children}
    </h2>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-500 mb-6 max-w-2xl">{children}</p>
}

function InlineCTA({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold transition hover:opacity-75"
       style={{ color: '#03989e' }}>
      {label} →
    </a>
  )
}

function LinkPill({ href, children, external = false }: {
  href: string; children: React.ReactNode; external?: boolean
}) {
  const cls = "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition hover:opacity-80"
  const style = { borderColor: '#03989e', color: '#03989e' }
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{children}</a>
  }
  return <Link href={href} className={cls} style={style}>{children}</Link>
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = React.useState(index === 0)
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <button onClick={() => setOpen(o => !o)}
              className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-sm pr-4" style={{ color: '#022135' }}>
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

// ─── Activity category cards ──────────────────────────────────────────────────

const CATEGORIES = [
  {
    label: 'City tours',
    emoji: '🚌',
    description: 'Walking tours, hop-on hop-off buses and guided sightseeing routes that cover the highlights efficiently.',
    query: 'city tours',
  },
  {
    label: 'Food & drink',
    emoji: '🍽️',
    description: 'Food tours, street food walks, wine tastings, cooking classes and market visits with local guides.',
    query: 'food tours',
  },
  {
    label: 'Culture & history',
    emoji: '🏛️',
    description: 'Museum visits, historical walking tours, art galleries and guided experiences of the city\'s heritage.',
    query: 'culture history tours',
  },
  {
    label: 'Adventure & outdoors',
    emoji: '🗻',
    description: 'Boat trips, cycling tours, hiking, kayaking and any activity that gets you out of the city centre.',
    query: 'outdoor activities',
  },
  {
    label: 'Day trips',
    emoji: '🚆',
    description: 'Guided and self-guided excursions to nearby towns, beaches, national parks and landmarks.',
    query: 'day trips excursions',
  },
  {
    label: 'Nightlife & entertainment',
    emoji: '🎭',
    description: 'Evening tours, shows, flamenco nights, pub crawls and any experience worth staying up for.',
    query: 'nightlife entertainment',
  },
]

function CategoryCard({ label, emoji, description, href }: {
  label: string; emoji: string; description: string; href: string
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="flex gap-4 items-start rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow group">
      <span className="text-3xl flex-shrink-0">{emoji}</span>
      <div className="flex flex-col gap-1">
        <span className="font-semibold text-sm group-hover:underline" style={{ color: '#022135' }}>
          {label}
        </span>
        <span className="text-xs text-gray-500 leading-relaxed">{description}</span>
        <span className="text-xs font-semibold mt-1" style={{ color: '#03989e' }}>
          Browse {label.toLowerCase()} →
        </span>
      </div>
    </a>
  )
}

// ─── Area card ────────────────────────────────────────────────────────────────

function AreaCard({ area }: { area: AreaCard }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-base mb-1.5" style={{ color: '#022135' }}>{area.name}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{area.description}</p>
    </article>
  )
}

// ─── Sticky quick-nav ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'categories', label: 'Categories'  },
  { id: 'areas',      label: 'Areas'       },
  { id: 'families',   label: 'Families'    },
  { id: 'budget',     label: 'Budget'      },
  { id: 'couples',    label: 'Couples'     },
  { id: 'day-trips',  label: 'Day trips'   },
  { id: 'when',       label: 'When to go'  },
  { id: 'faqs',       label: 'FAQs'        },
]

function QuickNav() {
  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm overflow-x-auto">
      <div className="max-w-5xl mx-auto flex gap-1 px-4 py-2 min-w-max">
        {NAV_ITEMS.map(item => (
          <a key={item.id} href={`#${item.id}`}
             className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-[#022135] hover:bg-gray-100 transition-colors whitespace-nowrap">
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ThingsToDoClient(props: Props) {
  const {
    city, country, emoji,
    citySlug, countrySlug, continentSlug,
    ttdIntro, ttdHighlights, ttdNeighbourhoods,
    ttdWithKids, ttdOnABudget, ttdForCouples,
    ttdDayTrips, ttdWhenToGo, ttdLocalTips, ttdFaqs,
  } = props

  const needsAI =
    !ttdIntro || !ttdHighlights?.length || !ttdNeighbourhoods?.length ||
    !ttdWithKids || !ttdOnABudget || !ttdForCouples ||
    !ttdDayTrips || !ttdWhenToGo || !ttdLocalTips || !ttdFaqs?.length

  useEffect(() => {
    if (!needsAI) return
    fetch(
      `/api/generate-ttd?city=${citySlug}&continent=${continentSlug}&country=${countrySlug}`,
      { method: 'POST' }
    )
      .then(r => r.json())
      .then(d => { if (d.status === 'created') window.location.reload() })
      .catch(err => console.error('TTD GENERATION ERROR:', err))
  }, [needsAI, citySlug, continentSlug, countrySlug])

  const faqSchema = ttdFaqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ttdFaqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  const hotelsHref   = `/hotels/${countrySlug}`
  const locationHref = `/locations/${continentSlug}/${countrySlug}/${citySlug}`

  return (
    <main className="min-h-screen bg-white">

      {faqSchema && (
        <script type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="text-white py-20 px-6 text-center"
               style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}>
        <div className="max-w-3xl mx-auto">
          {emoji && <div className="text-6xl mb-4">{emoji}</div>}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Things to do in {city}
          </h1>
          <p className="text-base md:text-lg text-teal-50 max-w-2xl mx-auto mb-8 leading-relaxed">
            {ttdIntro || `Discover the best tours, activities and experiences in ${city}, ${country}.`}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={gygUrl(city, 'tours')} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
               style={{ backgroundColor: '#03989e' }}>
              Browse all activities in {city} →
            </a>
            <Link href={hotelsHref}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all">
              Hotels in {country}
            </Link>
          </div>
          <p className="text-xs text-teal-200 mt-5">
            Timms Travel may earn a commission on bookings made via these links at no extra cost to you.
          </p>
        </div>
      </section>

      <QuickNav />

      {/* ── HIGHLIGHTS ────────────────────────────────────────────────── */}
      {ttdHighlights?.length ? (
        <section className="py-14 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <SectionLabel>Why {city}</SectionLabel>
            <H2>What makes {city} worth visiting</H2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {ttdHighlights.map((card, i) => (
                <article key={i}
                         className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#022135' }}>{card.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── ACTIVITY CATEGORIES ───────────────────────────────────────── */}
      <section id="categories" className="py-14 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Browse by type</SectionLabel>
          <H2>Top activity categories in {city}</H2>
          <Kicker>All links open on GetYourGuide with live availability and instant booking.</Kicker>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {CATEGORIES.map(cat => (
              <CategoryCard
                key={cat.label}
                label={cat.label}
                emoji={cat.emoji}
                description={cat.description}
                href={gygUrl(city, cat.query)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── AREAS ─────────────────────────────────────────────────────── */}
      {ttdNeighbourhoods?.length ? (
        <section id="areas" className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <SectionLabel>Neighbourhoods</SectionLabel>
            <H2>Best areas for activities in {city}</H2>
            <Kicker>Different parts of {city} suit different kinds of experiences — here's how they break down.</Kicker>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              {ttdNeighbourhoods.map((area, i) => <AreaCard key={i} area={area} />)}
            </div>
            <InlineCTA href={gygUrl(city, 'tours')} label={`Browse all tours in ${city}`} />
          </div>
        </section>
      ) : null}

      {/* ── FAMILIES ──────────────────────────────────────────────────── */}
      {ttdWithKids && (
        <section id="families" className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            <div>
              <SectionLabel>Families</SectionLabel>
              <H2>Things to do in {city} with kids</H2>
              <div className="mt-4"><ParagraphBlock text={ttdWithKids} /></div>
              <InlineCTA href={gygUrl(city, 'family activities kids')} label={`Browse family activities in ${city}`} />
            </div>
            <aside className="rounded-2xl border p-5 text-sm leading-relaxed space-y-3"
                   style={{ borderColor: '#03989e', backgroundColor: 'rgba(3,152,158,0.04)' }}>
              <p className="font-semibold text-xs uppercase tracking-widest" style={{ color: '#03989e' }}>
                Family travel tip
              </p>
              <p className="text-gray-600">
                Book key attractions in advance — popular museums and tours in busy cities sell out days ahead,
                especially in summer. Most GetYourGuide bookings offer free cancellation too.
              </p>
              <Link href="/other-services/travel-insurance"
                    className="block pt-1 text-xs font-semibold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Family travel insurance →
              </Link>
            </aside>
          </div>
        </section>
      )}

      {/* ── BUDGET ────────────────────────────────────────────────────── */}
      {ttdOnABudget && (
        <section id="budget" className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            <div>
              <SectionLabel>Budget travel</SectionLabel>
              <H2>Free and cheap things to do in {city}</H2>
              <div className="mt-4"><ParagraphBlock text={ttdOnABudget} /></div>
              <InlineCTA href={gygUrl(city, 'free tours walking')} label={`Browse free tours in ${city}`} />
            </div>
            <aside className="rounded-2xl border border-gray-200 bg-white p-5 text-sm space-y-3">
              <p className="font-semibold text-xs uppercase tracking-widest text-gray-400">Worth knowing</p>
              <p className="text-gray-600">
                Many city walking tours operate on a pay-what-you-want basis. They're often the best way to
                get your bearings on the first day without committing to a fixed cost.
              </p>
              <Link href="/other-services/travel-insurance"
                    className="block pt-1 text-xs font-semibold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Travel insurance for your trip →
              </Link>
            </aside>
          </div>
        </section>
      )}

      {/* ── COUPLES ───────────────────────────────────────────────────── */}
      {ttdForCouples && (
        <section id="couples" className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            <div>
              <SectionLabel>Couples</SectionLabel>
              <H2>Things to do in {city} for couples</H2>
              <div className="mt-4"><ParagraphBlock text={ttdForCouples} /></div>
              <InlineCTA href={gygUrl(city, 'romantic couples experiences')} label={`Browse romantic experiences in ${city}`} />
            </div>
            <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm space-y-3">
              <p className="font-semibold text-xs uppercase tracking-widest text-gray-400">Also consider</p>
              <p className="text-gray-600">
                Private tours are often worth the extra cost for couples — you get a far more flexible
                experience and the guide's full attention without a large group dynamic.
              </p>
              <Link href="/other-services/travel-insurance"
                    className="block pt-1 text-xs font-semibold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Holiday travel insurance →
              </Link>
            </aside>
          </div>
        </section>
      )}

      {/* ── DAY TRIPS ─────────────────────────────────────────────────── */}
      {ttdDayTrips && (
        <section id="day-trips" className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            <div>
              <SectionLabel>Day trips</SectionLabel>
              <H2>Best day trips from {city}</H2>
              <div className="mt-4"><ParagraphBlock text={ttdDayTrips} /></div>
              <InlineCTA href={gygUrl(city, 'day trips excursions')} label={`Browse day trips from ${city}`} />
            </div>
            <aside className="rounded-2xl border p-5 text-sm leading-relaxed space-y-3"
                   style={{ borderColor: '#03989e', backgroundColor: 'rgba(3,152,158,0.04)' }}>
              <p className="font-semibold text-xs uppercase tracking-widest" style={{ color: '#03989e' }}>
                Getting there
              </p>
              <p className="text-gray-600">
                Guided day trips often work out easier and similarly priced to doing it independently once
                you factor in transport and entrance fees.
              </p>
              <Link href="/other-services/airport-transfers"
                    className="block pt-1 text-xs font-semibold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Airport transfers →
              </Link>
              <Link href="/flights"
                    className="block text-xs font-semibold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Search flights →
              </Link>
            </aside>
          </div>
        </section>
      )}

      {/* ── WHEN TO GO ────────────────────────────────────────────────── */}
      {ttdWhenToGo && (
        <section id="when" className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            <div>
              <SectionLabel>Timing your trip</SectionLabel>
              <H2>Best time to visit {city} for activities</H2>
              <div className="mt-4"><ParagraphBlock text={ttdWhenToGo} /></div>
              <Link href="/flights"
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Search flights to {country} →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { season: 'Spring', note: 'Often good for outdoor activities before peak crowds arrive.' },
                { season: 'Summer', note: 'Most tours running, longest days, but busiest queues and highest prices.' },
                { season: 'Autumn', note: 'Quieter, cooler and often better value with most attractions still open.' },
                { season: 'Winter', note: 'Some outdoor activities limited but indoor culture and Christmas markets can be excellent.' },
              ].map(({ season, note }) => (
                <div key={season} className="rounded-2xl border border-gray-200 bg-gray-50 p-3 space-y-1">
                  <p className="font-semibold" style={{ color: '#022135' }}>{season}</p>
                  <p className="text-gray-500">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LOCAL TIPS ────────────────────────────────────────────────── */}
      {ttdLocalTips && (
        <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            <div>
              <SectionLabel>On the ground</SectionLabel>
              <H2>Local tips for visiting {city}</H2>
              <div className="mt-4"><ParagraphBlock text={ttdLocalTips} /></div>
            </div>
            <aside className="rounded-2xl border border-gray-200 bg-white p-5 text-sm space-y-3">
              <p className="font-semibold text-xs uppercase tracking-widest text-gray-400">Also useful</p>
              <Link href="/other-services/esims"
                    className="block text-xs font-semibold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                eSIMs for {country} →
              </Link>
              <Link href="/other-services/airport-transfers"
                    className="block text-xs font-semibold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Airport transfers for {city} →
              </Link>
              <Link href="/other-services/travel-insurance"
                    className="block text-xs font-semibold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Travel insurance →
              </Link>
            </aside>
          </div>
        </section>
      )}

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      {ttdFaqs?.length ? (
        <section id="faqs" className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <SectionLabel>Questions</SectionLabel>
            <H2>Frequently asked questions about {city}</H2>
            <Kicker>Quick answers to the most common questions about visiting {city}.</Kicker>
            <div className="flex flex-col gap-3 mt-2">
              {ttdFaqs.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── RELATED SERVICES ──────────────────────────────────────────── */}
      <section className="py-10 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Also useful for your trip</p>
          <div className="flex flex-wrap gap-2">
            <LinkPill href="/other-services/travel-insurance">Travel insurance</LinkPill>
            <LinkPill href="/other-services/airport-transfers">Airport transfers</LinkPill>
            <LinkPill href="/other-services/esims">eSIMs</LinkPill>
            <LinkPill href="/other-services">All travel services</LinkPill>
            <LinkPill href="/flights">Search flights</LinkPill>
            <LinkPill href={hotelsHref}>Hotels in {country}</LinkPill>
            <LinkPill href={locationHref}>Explore {city}</LinkPill>
            <LinkPill href={gygUrl(city, 'tours')} external>All activities on GetYourGuide</LinkPill>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-14 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center rounded-3xl px-6 py-10 text-white shadow-lg"
             style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to book activities in {city}?
          </h2>
          <p className="text-sm text-teal-100 mb-6 max-w-xl mx-auto">
            Browse hundreds of tours, experiences and day trips with live availability and free cancellation on most bookings.
          </p>
          <a href={gygUrl(city, 'tours activities')} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-white hover:bg-teal-50 hover:scale-[1.02] transition-all shadow-md"
             style={{ color: '#022135' }}>
            Browse all activities in {city} →
          </a>
          <p className="text-[11px] text-teal-200 mt-4">
            Timms Travel may earn a commission on bookings made via this link at no extra cost to you.
          </p>
        </div>
      </section>

      {/* ── BREADCRUMBS ───────────────────────────────────────────────── */}
      <section className="py-8 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link href="/locations" className="hover:opacity-75 transition" style={{ color: '#03989e' }}>
              Destinations
            </Link>
            <span className="text-gray-300">→</span>
            <Link href={`/locations/${continentSlug}`}
                  className="hover:opacity-75 transition capitalize" style={{ color: '#03989e' }}>
              {continentSlug}
            </Link>
            <span className="text-gray-300">→</span>
            <Link href={`/locations/${continentSlug}/${countrySlug}`}
                  className="hover:opacity-75 transition capitalize" style={{ color: '#03989e' }}>
              {country}
            </Link>
            <span className="text-gray-300">→</span>
            <Link href={locationHref} className="hover:opacity-75 transition" style={{ color: '#03989e' }}>
              {city}
            </Link>
            <span className="text-gray-300">→</span>
            <span className="font-semibold" style={{ color: '#022135' }}>Things to do</span>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  )
}