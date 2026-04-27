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

function splitIntoParagraphs(text: string): string[] {
  if (!text) return []
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)

  const paragraphs: string[] = []
  let current: string[] = []

  sentences.forEach((sentence) => {
    current.push(sentence)
    if (current.length >= 3) {
      paragraphs.push(current.join(' '))
      current = []
    }
  })

  if (current.length) {
    paragraphs.push(current.join(' '))
  }

  return paragraphs
}

function splitIntoTips(text: string, maxTips = 10): string[] {
  if (!text) return []
  const raw = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
  return raw.slice(0, maxTips)
}

function SectionShell({
  children,
  background = 'white',
  borderTop = true,
}: {
  children: React.ReactNode
  background?: 'white' | 'gray'
  borderTop?: boolean
}) {
  return (
    <section
      className={[
        'py-14 px-6',
        background === 'gray' ? 'bg-gray-50' : 'bg-white',
        borderTop ? 'border-t border-gray-100' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  )
}

function SectionHeading({
  eyebrow,
  title,
  kicker,
}: {
  eyebrow?: string
  title: string
  kicker?: string
}) {
  return (
    <header className="mb-6">
      {eyebrow && (
        <p className="uppercase tracking-[0.18em] text-[11px] text-gray-400 mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
        {title}
      </h2>
      {kicker && <p className="text-sm text-gray-500 max-w-2xl">{kicker}</p>}
    </header>
  )
}

function ParagraphBlock({ text }: { text: string }) {
  const paragraphs = splitIntoParagraphs(text)
  return (
    <div className="space-y-3 text-gray-600 leading-relaxed text-[15px]">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

function NeighbourhoodCard({ n }: { n: Neighbourhood }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
      <h3 className="font-semibold text-base" style={{ color: '#232e4e' }}>
        {n.name}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">{n.description}</p>
    </article>
  )
}

function HighlightCardBox({ card }: { card: HighlightCard }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
      <h3 className="font-semibold text-sm" style={{ color: '#232e4e' }}>
        {card.title}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed">{card.description}</p>
    </article>
  )
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = React.useState(index === 0)
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-sm pr-4" style={{ color: '#232e4e' }}>
          {faq.question}
        </span>
        <span className="text-lg text-gray-400">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

function PillList({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-teal-50 text-teal-800 border border-teal-100"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

export default function HotelCityClient(props: Props) {
  const {
    cityName,
    countryName,
    emoji,
    heroDescription,
    citySlug,
    countrySlug,
    continentSlug,

    aiIntro,
    aiNeighbourhoods,
    aiFirstTimers,
    aiBudget,
    aiCouples,
    aiFamilies,
    aiWhenToVisit,
    aiNightlife,
    aiFood,
    aiSafety,
    aiTransport,
    aiLocalTips,
    aiHowManyDays,
    aiDigitalNomads,
    aiAreasToAvoid,
    aiFaqs,

    aiHighlightsIntro,
    aiHighlightCards,
  } = props

  const cityExpediaUrl = buildExpediaDeepLink(cityName, countryName)

  const needsAI =
    !aiIntro ||
    !aiNeighbourhoods?.length ||
    !aiFirstTimers ||
    !aiBudget ||
    !aiCouples ||
    !aiFamilies ||
    !aiWhenToVisit ||
    !aiNightlife ||
    !aiFood ||
    !aiSafety ||
    !aiTransport ||
    !aiLocalTips ||
    !aiHowManyDays ||
    !aiDigitalNomads ||
    !aiAreasToAvoid ||
    !aiFaqs?.length

  useEffect(() => {
    if (needsAI) {
      fetch(`/api/generate-ai?city=${citySlug}`, { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'created') window.location.reload()
        })
        .catch((err) => console.error('AI GENERATION ERROR:', err))
    }
  }, [needsAI, citySlug])

  const neighbourhoods: Neighbourhood[] =
    aiNeighbourhoods?.length
      ? aiNeighbourhoods
      : [
          {
            name: `Central ${cityName}`,
            description: `A convenient base close to major attractions and transport, ideal if you want to keep things simple.`,
          },
          {
            name: 'Historic quarter',
            description: `Full of character, older streets and classic architecture, with plenty of cafés and smaller hotels.`,
          },
        ]

  const faqSchema =
    aiFaqs?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: aiFaqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null

  const localTips = aiLocalTips ? splitIntoTips(aiLocalTips) : []
  const digitalNomadTips = aiDigitalNomads ? splitIntoTips(aiDigitalNomads, 6) : []

  return (
    <main className="min-h-screen bg-white">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Navbar />

      {/* HERO */}
      <section
        className="text-white py-20 px-6 text-center"
        style={{ background: 'radial-gradient(circle at top, #3b82f6 0, #232e4e 55%, #111827 100%)' }}
      >
        <div className="max-w-4xl mx-auto">
          {emoji && <div className="text-6xl mb-4">{emoji}</div>}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Where to stay in {cityName}
          </h1>
          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
            {heroDescription || aiIntro}
          </p>

          <a
            href={cityExpediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg"
            style={{ backgroundColor: '#03989e' }}
          >
            Search hotels in {cityName} →
          </a>

          <p className="text-xs text-gray-300 mt-4">
            Timms Travel may earn a commission on bookings made via this link at no extra cost to you.
          </p>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      {aiHighlightCards?.length ? (
        <SectionShell background="gray">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              eyebrow="Highlights"
              title={`Why stay in ${cityName}`}
              kicker={aiHighlightsIntro || undefined}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {aiHighlightCards.map((card, i) => (
                <HighlightCardBox key={i} card={card} />
              ))}
            </div>
          </div>
        </SectionShell>
      ) : null}

      {/* NEIGHBOURHOODS */}
      <SectionShell background="white">
        <SectionHeading
          eyebrow="Neighbourhoods"
          title={`Best areas to stay in ${cityName}`}
          kicker="A quick look at the main areas visitors use as a base, and who each one suits."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {neighbourhoods.map((n, i) => (
            <NeighbourhoodCard key={i} n={n} />
          ))}
        </div>
      </SectionShell>

      {/* FIRST-TIMERS */}
      {aiFirstTimers && (
        <SectionShell background="gray">
          <SectionHeading
            eyebrow="First-time visitors"
            title="Where to stay on your first trip"
            kicker={`If it’s your first time in ${cityName}, these are the areas that make everything feel easy.`}
          />
          <div className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
            <div>
              <ParagraphBlock text={aiFirstTimers} />
            </div>
            <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-5 text-sm text-teal-900">
              <h3 className="font-semibold mb-2">Quick take</h3>
              <p className="mb-2">
                First-timers usually do best somewhere central, with simple transport and plenty of places to eat
                within a short walk.
              </p>
              <p>
                If you’re unsure, pick the area that keeps you close to the sights you care about most, rather than
                trying to be near everything at once.
              </p>
            </div>
          </div>
        </SectionShell>
      )}

      {/* BUDGET / COUPLES / FAMILIES */}
      {(aiBudget || aiCouples || aiFamilies) && (
        <SectionShell background="white">
          <SectionHeading
            eyebrow="By travel style"
            title="Best areas by type of trip"
            kicker="Different parts of the city suit different kinds of trips — here’s how it breaks down."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {aiBudget && (
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-lg" style={{ color: '#232e4e' }}>
                  On a budget
                </h3>
                <ParagraphBlock text={aiBudget} />
              </div>
            )}
            {aiCouples && (
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-lg" style={{ color: '#232e4e' }}>
                  For couples
                </h3>
                <ParagraphBlock text={aiCouples} />
              </div>
            )}
            {aiFamilies && (
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-lg" style={{ color: '#232e4e' }}>
                  For families
                </h3>
                <ParagraphBlock text={aiFamilies} />
              </div>
            )}
          </div>
        </SectionShell>
      )}

      {/* WHEN TO VISIT */}
      {aiWhenToVisit && (
        <SectionShell background="gray">
          <SectionHeading
            eyebrow="Timing your trip"
            title={`When to visit ${cityName}`}
            kicker="Weather, crowds and prices all shift through the year — here’s what to keep in mind."
          />
          <div className="grid md:grid-cols-[3fr,2fr] gap-8 items-start">
            <ParagraphBlock text={aiWhenToVisit} />
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-gray-200 bg-white p-3">
                <p className="font-semibold mb-1" style={{ color: '#232e4e' }}>
                  Spring
                </p>
                <p className="text-gray-500">
                  Often a good balance of milder weather and manageable crowds, with prices that haven’t yet peaked.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-3">
                <p className="font-semibold mb-1" style={{ color: '#232e4e' }}>
                  Summer
                </p>
                <p className="text-gray-500">
                  Typically the busiest and most expensive period, but with the longest days and most going on.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-3">
                <p className="font-semibold mb-1" style={{ color: '#232e4e' }}>
                  Autumn
                </p>
                <p className="text-gray-500">
                  Can be a sweet spot for cooler temperatures, softer light and slightly calmer streets.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-3">
                <p className="font-semibold mb-1" style={{ color: '#232e4e' }}>
                  Winter
                </p>
                <p className="text-gray-500">
                  Often the quietest and cheapest time, though some attractions may run shorter hours or close.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>
      )}

      {/* NIGHTLIFE + FOOD */}
      {(aiNightlife || aiFood) && (
        <SectionShell background="white">
          <SectionHeading
            eyebrow="Evenings out"
            title="Nightlife and food"
            kicker={`Where to head in ${cityName} once the sun goes down, whether you’re out late or just after a good meal.`}
          />
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {aiNightlife && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="font-semibold text-lg mb-3" style={{ color: '#232e4e' }}>
                  Nightlife
                </h3>
                <ParagraphBlock text={aiNightlife} />
              </div>
            )}
            {aiFood && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="font-semibold text-lg mb-3" style={{ color: '#232e4e' }}>
                  Food & restaurants
                </h3>
                <ParagraphBlock text={aiFood} />
              </div>
            )}
          </div>
        </SectionShell>
      )}

      {/* SAFETY + TRANSPORT */}
      {(aiSafety || aiTransport) && (
        <SectionShell background="gray">
          <SectionHeading
            eyebrow="Practicalities"
            title="Safety and getting around"
            kicker="A few practical notes that make the city easier to read before you arrive."
          />
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {aiSafety && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <h3 className="font-semibold text-lg mb-3" style={{ color: '#232e4e' }}>
                    Safety
                  </h3>
                  <ParagraphBlock text={aiSafety} />
                </div>
                {aiAreasToAvoid && (
                  <div className="rounded-2xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-900">
                    <h4 className="font-semibold mb-2">Areas to be cautious about</h4>
                    <ParagraphBlock text={aiAreasToAvoid} />
                  </div>
                )}
              </div>
            )}
            {aiTransport && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold text-lg mb-3" style={{ color: '#232e4e' }}>
                  Getting around
                </h3>
                <ParagraphBlock text={aiTransport} />
              </div>
            )}
          </div>
        </SectionShell>
      )}

      {/* LOCAL TIPS + HOW MANY DAYS + DIGITAL NOMADS */}
      {(aiLocalTips || aiHowManyDays || aiDigitalNomads) && (
        <SectionShell background="white">
          <SectionHeading
            eyebrow="On-the-ground detail"
            title="Local tips and stay length"
            kicker="A few small details that make the city easier to settle into once you arrive."
          />
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {aiLocalTips && (
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#232e4e' }}>
                  Local tips
                </h3>
                <ParagraphBlock text={aiLocalTips} />
                <PillList items={localTips} />
              </div>
            )}
            {aiHowManyDays && (
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#232e4e' }}>
                  How many days?
                </h3>
                <ParagraphBlock text={aiHowManyDays} />
              </div>
            )}
            {aiDigitalNomads && (
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#232e4e' }}>
                  Digital nomads
                </h3>
                <ParagraphBlock text={aiDigitalNomads} />
                <PillList items={digitalNomadTips} />
              </div>
            )}
          </div>
        </SectionShell>
      )}

      {/* FAQ */}
      {aiFaqs?.length ? (
        <SectionShell background="gray">
          <SectionHeading
            eyebrow="Questions"
            title="Frequently asked questions"
            kicker={`A few quick answers to common questions about staying in ${cityName}.`}
          />
          <div className="flex flex-col gap-3 max-w-3xl">
            {aiFaqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </SectionShell>
      ) : null}

      {/* CTA */}
      <SectionShell background="white">
        <div className="max-w-3xl mx-auto text-center rounded-3xl border border-gray-200 bg-gradient-to-r from-[#03989e] to-[#0f766e] px-6 py-10 text-white shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to book your stay in {cityName}?
          </h2>
          <p className="text-sm md:text-base text-teal-50 mb-6 max-w-xl mx-auto">
            Compare prices, locations and guest reviews in one place. It’s the easiest way to see which
            neighbourhood really suits the trip you have in mind.
          </p>
          <a
            href={cityExpediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm md:text-base font-semibold bg-white text-[#03989e] hover:bg-teal-50 hover:scale-[1.02] transition-all shadow-md"
          >
            View all hotels in {cityName} →
          </a>
          <p className="text-[11px] text-teal-100 mt-4">
            Timms Travel may earn a commission on bookings made via this link at no extra cost to you.
          </p>
        </div>
      </SectionShell>

      {/* BREADCRUMBS + INTERNAL LINKS */}
      <SectionShell background="white" borderTop>
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link
              href="/hotels"
              className="hover:opacity-75 transition"
              style={{ color: '#2f797c' }}
            >
              Hotels
            </Link>

            {countrySlug && (
              <>
                <span className="text-gray-400">→</span>
                <Link
                  href={`/hotels/${countrySlug}`}
                  className="hover:opacity-75 transition"
                  style={{ color: '#2f797c' }}
                >
                  {countryName}
                </Link>
              </>
            )}

            <span className="text-gray-400">→</span>
            <span className="font-semibold" style={{ color: '#232e4e' }}>
              {cityName}
            </span>
          </nav>

          <div className="flex flex-wrap gap-4 text-sm">
            {continentSlug && countrySlug && citySlug && (
              <Link
                href={`/locations/${continentSlug}/${countrySlug}/${citySlug}`}
                className="font-semibold hover:opacity-75 transition"
                style={{ color: '#2f797c' }}
              >
                Explore more in {cityName} →
              </Link>
            )}

            {countrySlug && (
              <Link
                href={`/flights/`}
                className="font-semibold hover:opacity-75 transition"
                style={{ color: '#2f797c' }}
              >
                Flights to {countryName} →
              </Link>
            )}
          </div>
        </div>
      </SectionShell>

      <Footer />
    </main>
  )
}