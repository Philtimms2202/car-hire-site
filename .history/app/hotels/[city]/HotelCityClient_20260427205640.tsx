'use client'

import React, { useEffect, useId } from 'react'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

// ─── Expedia ────────────────────────────────────────────────────────────────

const EXPEDIA_CAMREF    = '1110lCmpb'
const EXPEDIA_CREATIVEREF = '1011l87747'
const EXPEDIA_ADREF     = 'PZZ928vica'

function buildExpediaDeepLink(city: string, country: string): string {
  const landingPage = `https://www.expedia.co.uk/Hotel-Search?${new URLSearchParams({
    destination: `${city}, ${country}`,
    sort: 'RECOMMENDED',
    categorySearch: 'any_option',
    useRewards: 'false',
  })}`
  return `https://expedia.com/affiliate?${new URLSearchParams({
    siteid: '1', landingPage,
    camref: EXPEDIA_CAMREF,
    creativeref: EXPEDIA_CREATIVEREF,
    adref: EXPEDIA_ADREF,
  })}`
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

// ─── Affiliate CTA (inline, text-level) ──────────────────────────────────────

function InlineCTA({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold transition hover:opacity-75"
       style={{ color: '#03989e' }}>
      {label} →
    </a>
  )
}

// ─── Internal link pill ───────────────────────────────────────────────────────

function LinkPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition hover:opacity-80"
          style={{ borderColor: '#03989e', color: '#03989e', backgroundColor: 'transparent' }}>
      {children}
    </Link>
  )
}

// ─── FAQ accordion ───────────────────────────────────────────────────────────

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

// ─── Neighbourhood card ───────────────────────────────────────────────────────

function NeighbourhoodCard({ n }: { n: Neighbourhood }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-base mb-1.5" style={{ color: '#022135' }}>{n.name}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{n.description}</p>
    </article>
  )
}

// ─── Highlight card ───────────────────────────────────────────────────────────

function HighlightCardBox({ card }: { card: HighlightCard }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-sm mb-1" style={{ color: '#022135' }}>{card.title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{card.description}</p>
    </article>
  )
}

// ─── Travel-style card (budget / couples / families / first-timers) ───────────

function TravelStyleSection({
  id, eyebrow, heading, text, cta, href,
  bg = 'white',
}: {
  id?: string
  eyebrow: string
  heading: string
  text: string
  cta: string
  href: string
  bg?: 'white' | 'gray'
}) {
  if (!text) return null
  return (
    <section id={id}
             className={`py-14 px-6 border-t border-gray-100 ${bg === 'gray' ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
        <div>
          <SectionLabel>{eyebrow}</SectionLabel>
          <H2>{heading}</H2>
          <div className="mt-4">
            <ParagraphBlock text={text} />
          </div>
          <InlineCTA href={href} label={cta} />
        </div>
      </div>
    </section>
  )
}

// ─── Sticky quick-nav ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'areas',        label: 'Areas'        },
  { id: 'first-timers', label: 'First-timers' },
  { id: 'budget',       label: 'Budget'       },
  { id: 'couples',      label: 'Couples'      },
  { id: 'families',     label: 'Families'     },
  { id: 'when',         label: 'When to go'   },
  { id: 'faqs',         label: 'FAQs'         },
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

// ─── Main component ───────────────────────────────────────────────────────────

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

  const expediaUrl = buildExpediaDeepLink(cityName, countryName)

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
      .catch(err => console.error('AI GENERATION ERROR:', err))
  }, [needsAI, citySlug])

  const neighbourhoods: Neighbourhood[] = aiNeighbourhoods?.length
    ? aiNeighbourhoods
    : [
        { name: `Central ${cityName}`, description: 'A convenient base close to major attractions and transport.' },
        { name: 'Historic quarter',    description: 'Full of character and older streets, with smaller hotels and good cafés.' },
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

  // Internal link helpers
  const thingsToDoHref = continentSlug && countrySlug
    ? `/locations/${continentSlug}/${countrySlug}/${citySlug}/things-to-do`
    : null
  const locationHref = continentSlug && countrySlug
    ? `/locations/${continentSlug}/${countrySlug}/${citySlug}`
    : null
  const countryHotelsHref = countrySlug ? `/hotels/${countrySlug}` : null

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
            Where to stay in {cityName}
          </h1>
          <p className="text-base md:text-lg text-teal-50 max-w-2xl mx-auto mb-8 leading-relaxed">
            {heroDescription || aiIntro || `A neighbourhood guide to hotels in ${cityName} for every budget and travel style.`}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={expediaUrl} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg text-white"
               style={{ backgroundColor: '#03989e' }}>
              Search hotels in {cityName} →
            </a>
            {thingsToDoHref && (
              <Link href={thingsToDoHref}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all">
                Things to do in {cityName}
              </Link>
            )}
          </div>
          <p className="text-xs text-teal-200 mt-5">
            Timms Travel may earn a commission on bookings made via this link at no extra cost to you.
          </p>
        </div>
      </section>

      {/* ── QUICK NAV ────────────────────────────────────────────────── */}
      <QuickNav />

      {/* ── HIGHLIGHTS ────────────────────────────────────────────────── */}
      {aiHighlightCards?.length ? (
        <section className="py-14 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <SectionLabel>Highlights</SectionLabel>
            <H2>Why stay in {cityName}</H2>
            {aiHighlightsIntro && <Kicker>{aiHighlightsIntro}</Kicker>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {aiHighlightCards.map((card, i) => (
                <HighlightCardBox key={i} card={card} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── NEIGHBOURHOODS ────────────────────────────────────────────── */}
      <section id="areas" className="py-14 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <SectionLabel>Neighbourhoods</SectionLabel>
          <H2>Best areas to stay in {cityName}</H2>
          <Kicker>The main parts of the city people use as a base, and what each one suits.</Kicker>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {neighbourhoods.map((n, i) => <NeighbourhoodCard key={i} n={n} />)}
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <InlineCTA href={expediaUrl} label={`Browse all hotels in ${cityName}`} />
            {thingsToDoHref && (
              <Link href={thingsToDoHref}
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-gray-500 hover:text-[#022135] transition">
                Things to do in {cityName} →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── FIRST-TIMERS ──────────────────────────────────────────────── */}
      {aiFirstTimers && (
        <section id="first-timers" className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            <div>
              <SectionLabel>First-time visitors</SectionLabel>
              <H2>Where to stay in {cityName} for first-time visitors</H2>
              <div className="mt-4"><ParagraphBlock text={aiFirstTimers} /></div>
              <InlineCTA href={expediaUrl} label={`Search hotels in ${cityName}`} />
            </div>
            <aside className="rounded-2xl border p-5 text-sm leading-relaxed space-y-3"
                   style={{ borderColor: '#03989e', backgroundColor: 'rgba(3,152,158,0.04)' }}>
              <p className="font-semibold text-xs uppercase tracking-widest" style={{ color: '#03989e' }}>
                Quick tip
              </p>
              <p className="text-gray-600">
                If it's your first visit, prioritise location over price. Being close to transport and the main
                sights makes the trip far easier, especially on the first morning.
              </p>
              <p className="text-gray-600">
                Hotels a short walk from a metro or tram stop are often the sweet spot — not necessarily the
                most central, but genuinely convenient.
              </p>
              {locationHref && (
                <Link href={locationHref}
                      className="block pt-1 text-xs font-semibold hover:opacity-75 transition"
                      style={{ color: '#03989e' }}>
                  Explore {cityName} in full →
                </Link>
              )}
            </aside>
          </div>
        </section>
      )}

      {/* ── BUDGET ────────────────────────────────────────────────────── */}
      {aiBudget && (
        <section id="budget" className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            <div>
              <SectionLabel>Budget travel</SectionLabel>
              <H2>Best areas to stay in {cityName} on a budget</H2>
              <div className="mt-4"><ParagraphBlock text={aiBudget} /></div>
              <InlineCTA href={expediaUrl} label={`Search budget hotels in ${cityName}`} />
            </div>
            <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm space-y-3">
              <p className="font-semibold text-xs uppercase tracking-widest text-gray-400">Worth knowing</p>
              <p className="text-gray-600">
                Staying a stop or two outside the centre on a reliable metro line often halves the nightly rate
                without adding meaningful travel time.
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
      {aiCouples && (
        <section id="couples" className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            <div>
              <SectionLabel>Couples</SectionLabel>
              <H2>Where to stay in {cityName} for couples</H2>
              <div className="mt-4"><ParagraphBlock text={aiCouples} /></div>
              <InlineCTA href={expediaUrl} label={`Search romantic hotels in ${cityName}`} />
            </div>
            <aside className="rounded-2xl border border-gray-200 bg-white p-5 text-sm space-y-3">
              <p className="font-semibold text-xs uppercase tracking-widest text-gray-400">Also consider</p>
              <p className="text-gray-600">
                Boutique hotels in older parts of the city tend to have more character than large chains — worth
                looking for if the atmosphere of the stay matters as much as the room.
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

      {/* ── FAMILIES ──────────────────────────────────────────────────── */}
      {aiFamilies && (
        <section id="families" className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            <div>
              <SectionLabel>Families</SectionLabel>
              <H2>Best family-friendly areas to stay in {cityName}</H2>
              <div className="mt-4"><ParagraphBlock text={aiFamilies} /></div>
              <InlineCTA href={expediaUrl} label={`Search family hotels in ${cityName}`} />
            </div>
            <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm space-y-3">
              <p className="font-semibold text-xs uppercase tracking-widest text-gray-400">Family travel tips</p>
              <p className="text-gray-600">
                Apartment-style hotels and aparthotels often work better for families — more space, a kitchen
                for early mornings and late nights, and usually more flexibility.
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

      {/* ── WHEN TO VISIT ─────────────────────────────────────────────── */}
      {aiWhenToVisit && (
        <section id="when" className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[3fr,2fr] gap-10 items-start">
            <div>
              <SectionLabel>Timing your trip</SectionLabel>
              <H2>When to visit {cityName}</H2>
              <div className="mt-4"><ParagraphBlock text={aiWhenToVisit} /></div>
              <Link href="/flights"
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold hover:opacity-75 transition"
                    style={{ color: '#03989e' }}>
                Search flights →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { season: 'Spring', note: 'Generally milder weather with manageable crowds and prices that haven't peaked yet.' },
                { season: 'Summer', note: 'The busiest and most expensive period, but with the longest days and most going on.' },
                { season: 'Autumn', note: 'Often a sweet spot — cooler temperatures, softer light, and quieter streets.' },
                { season: 'Winter', note: 'The quietest and cheapest time; some sights may run shorter hours.' },
              ].map(({ season, note }) => (
                <div key={season}
                     className="rounded-2xl border border-gray-200 bg-white p-3 space-y-1">
                  <p className="font-semibold" style={{ color: '#022135' }}>{season}</p>
                  <p className="text-gray-500">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NIGHTLIFE + FOOD ──────────────────────────────────────────── */}
      {(aiNightlife || aiFood) && (
        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <SectionLabel>Evenings out</SectionLabel>
            <H2>Nightlife and food in {cityName}</H2>
            <Kicker>Where to head once the sun goes down, whether you're out late or just after a good meal.</Kicker>
            <div className="grid md:grid-cols-2 gap-6 mt-2">
              {aiNightlife && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                  <h3 className="font-semibold text-base mb-3" style={{ color: '#022135' }}>Nightlife</h3>
                  <ParagraphBlock text={aiNightlife} />
                </div>
              )}
              {aiFood && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                  <h3 className="font-semibold text-base mb-3" style={{ color: '#022135' }}>Food & restaurants</h3>
                  <ParagraphBlock text={aiFood} />
                </div>
              )}
            </div>
            {thingsToDoHref && (
              <div className="mt-6">
                <Link href={thingsToDoHref}
                      className="text-sm font-semibold hover:opacity-75 transition"
                      style={{ color: '#03989e' }}>
                  See all things to do in {cityName} →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SAFETY + TRANSPORT ────────────────────────────────────────── */}
      {(aiSafety || aiTransport) && (
        <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <SectionLabel>Practicalities</SectionLabel>
            <H2>Safety and getting around {cityName}</H2>
            <Kicker>A few practical things worth knowing before you arrive.</Kicker>
            <div className="grid md:grid-cols-2 gap-6 mt-2">
              {aiSafety && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="font-semibold text-base mb-3" style={{ color: '#022135' }}>Safety</h3>
                    <ParagraphBlock text={aiSafety} />
                  </div>
                  {aiAreasToAvoid && (
                    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm">
                      <h4 className="font-semibold mb-2 text-amber-900">Areas to be cautious about</h4>
                      <ParagraphBlock text={aiAreasToAvoid} />
                    </div>
                  )}
                  <Link href="/other-services/travel-insurance"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-75 transition"
                        style={{ color: '#03989e' }}>
                    Get travel insurance for this trip →
                  </Link>
                </div>
              )}
              {aiTransport && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h3 className="font-semibold text-base mb-3" style={{ color: '#022135' }}>Getting around</h3>
                    <ParagraphBlock text={aiTransport} />
                  </div>
                  <Link href="/other-services/airport-transfers"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-75 transition"
                        style={{ color: '#03989e' }}>
                    Airport transfers for {cityName} →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── LOCAL TIPS + HOW MANY DAYS + DIGITAL NOMADS ──────────────── */}
      {(aiLocalTips || aiHowManyDays || aiDigitalNomads) && (
        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <SectionLabel>On the ground</SectionLabel>
            <H2>Local tips for staying in {cityName}</H2>
            <Kicker>Small details that make the city easier to settle into once you arrive.</Kicker>
            <div className="grid md:grid-cols-3 gap-8 mt-2">
              {aiLocalTips && (
                <div>
                  <h3 className="font-semibold text-base mb-3" style={{ color: '#022135' }}>Local tips</h3>
                  <ParagraphBlock text={aiLocalTips} />
                </div>
              )}
              {aiHowManyDays && (
                <div>
                  <h3 className="font-semibold text-base mb-3" style={{ color: '#022135' }}>How many days?</h3>
                  <ParagraphBlock text={aiHowManyDays} />
                  <Link href="/flights"
                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold hover:opacity-75 transition"
                        style={{ color: '#03989e' }}>
                    Search flights →
                  </Link>
                </div>
              )}
              {aiDigitalNomads && (
                <div>
                  <h3 className="font-semibold text-base mb-3" style={{ color: '#022135' }}>Digital nomads</h3>
                  <ParagraphBlock text={aiDigitalNomads} />
                  <Link href="/other-services/esims"
                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold hover:opacity-75 transition"
                        style={{ color: '#03989e' }}>
                    eSIMs for {cityName} →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      {aiFaqs?.length ? (
        <section id="faqs" className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <SectionLabel>Questions</SectionLabel>
            <H2>Frequently asked questions about staying in {cityName}</H2>
            <Kicker>Quick answers to the questions people ask most before booking.</Kicker>
            <div className="flex flex-col gap-3 mt-2">
              {aiFaqs.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── RELATED SERVICES ──────────────────────────────────────────── */}
      <section className="py-10 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Also useful for your trip</p>
          <div className="flex flex-wrap gap-2">
            <LinkPill href="/other-services/travel-insurance">Travel insurance</LinkPill>
            <LinkPill href="/other-services/airport-transfers">Airport transfers</LinkPill>
            <LinkPill href="/other-services/esims">eSIMs</LinkPill>
            <LinkPill href="/other-services">All travel services</LinkPill>
            <LinkPill href="/flights">Search flights</LinkPill>
            {countryHotelsHref && (
              <LinkPill href={countryHotelsHref}>Hotels in {countryName}</LinkPill>
            )}
            {thingsToDoHref && (
              <LinkPill href={thingsToDoHref}>Things to do in {cityName}</LinkPill>
            )}
            {locationHref && (
              <LinkPill href={locationHref}>Explore {cityName}</LinkPill>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────── */}
      <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center rounded-3xl px-6 py-10 text-white shadow-lg"
             style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to book your stay in {cityName}?
          </h2>
          <p className="text-sm text-teal-100 mb-6 max-w-xl mx-auto">
            Compare live prices, locations and guest reviews in one place.
          </p>
          <a href={expediaUrl} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-white hover:bg-teal-50 hover:scale-[1.02] transition-all shadow-md"
             style={{ color: '#022135' }}>
            View all hotels in {cityName} →
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
            <Link href="/hotels" className="hover:opacity-75 transition" style={{ color: '#03989e' }}>
              Hotels
            </Link>
            {countryHotelsHref && countrySlug && (
              <>
                <span className="text-gray-300">→</span>
                <Link href={countryHotelsHref} className="hover:opacity-75 transition" style={{ color: '#03989e' }}>
                  {countryName}
                </Link>
              </>
            )}
            <span className="text-gray-300">→</span>
            <span className="font-semibold" style={{ color: '#022135' }}>{cityName}</span>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  )
}