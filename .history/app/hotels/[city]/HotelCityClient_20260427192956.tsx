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

  // AI fields from Sanity
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

function SectionText({ text }: { text: string }) {
  const parts = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  return (
    <div className="space-y-3 text-gray-600 leading-relaxed text-base">
      {parts.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

function NeighbourhoodCard({ n }: { n: Neighbourhood }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-bold text-base mb-1" style={{ color: '#232e4e' }}>
        {n.name}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">{n.description}</p>
    </div>
  )
}

function HighlightCardBox({ card }: { card: HighlightCard }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2">
      <h3 className="font-semibold text-base" style={{ color: '#232e4e' }}>
        {card.title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
    </div>
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
        <span className="text-lg text-gray-400">{open ? '−' : '+'}</span>
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

  const neighbourhoods =
    aiNeighbourhoods?.length
      ? aiNeighbourhoods
      : [
          { name: `Central ${cityName}`, description: `A convenient base close to major attractions.` },
          { name: `Historic Quarter`, description: `Full of culture, museums and traditional architecture.` },
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
      <section className="text-white py-20 px-6 text-center" style={{ backgroundColor: '#232e4e' }}>
        {emoji && <div className="text-6xl mb-4">{emoji}</div>}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Where to Stay in {cityName}</h1>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          {heroDescription || aiIntro}
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

      {/* HIGHLIGHTS */}
      {aiHighlightCards?.length > 0 && (
        <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            {aiHighlightsIntro && (
              <p className="text-gray-600 text-base leading-relaxed max-w-3xl mb-8">
                {aiHighlightsIntro}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {aiHighlightCards.map((card, i) => (
                <HighlightCardBox key={i} card={card} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEIGHBOURHOODS */}
      <section className="py-14 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#232e4e' }}>
            Best areas to stay in {cityName}
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            A breakdown of the key neighbourhoods — what they’re like and who they suit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {neighbourhoods.map((n, i) => (
              <NeighbourhoodCard key={i} n={n} />
            ))}
          </div>
        </div>
      </section>

      {/* FIRST TIMERS */}
      {aiFirstTimers && (
        <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
              Where to stay for first-time visitors
            </h2>
            <SectionText text={aiFirstTimers} />
          </div>
        </section>
      )}

      {/* BUDGET */}
      {aiBudget && (
        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
              Best areas on a budget
            </h2>
            <SectionText text={aiBudget} />
          </div>
        </section>
      )}

      {/* COUPLES */}
      {aiCouples && (
        <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
              Where to stay for couples
            </h2>
            <SectionText text={aiCouples} />
          </div>
        </section>
      )}

      {/* FAMILIES */}
      {aiFamilies && (
        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
              Best family-friendly areas
            </h2>
            <SectionText text={aiFamilies} />
          </div>
        </section>
      )}

      {/* WHEN TO VISIT */}
      {aiWhenToVisit && (
        <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
              When to visit {cityName}
            </h2>
            <SectionText text={aiWhenToVisit} />
          </div>
        </section>
      )}

      {/* NIGHTLIFE + FOOD */}
      {(aiNightlife || aiFood) && (
        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
            {aiNightlife && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#232e4e' }}>
                  Nightlife
                </h2>
                <SectionText text={aiNightlife} />
              </div>
            )}
            {aiFood && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#232e4e' }}>
                  Food & restaurants
                </h2>
                <SectionText text={aiFood} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* SAFETY + TRANSPORT */}
      {(aiSafety || aiTransport) && (
        <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
            {aiSafety && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#232e4e' }}>
                  Safety & areas to avoid
                </h2>
                <SectionText text={aiSafety} />
              </div>
            )}
            {aiTransport && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#232e4e' }}>
                  Getting around
                </h2>
                <SectionText text={aiTransport} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* LOCAL TIPS + HOW MANY DAYS + DIGITAL NOMADS */}
      {(aiLocalTips || aiHowManyDays || aiDigitalNomads) && (
        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
            {aiLocalTips && (
              <div>
                <h2 className="text-lg md:text-xl font-bold mb-3" style={{ color: '#232e4e' }}>
                  Local tips
                </h2>
                <SectionText text={aiLocalTips} />
              </div>
            )}
            {aiHowManyDays && (
              <div>
                <h2 className="text-lg md:text-xl font-bold mb-3" style={{ color: '#232e4e' }}>
                  How many days?
                </h2>
                <SectionText text={aiHowManyDays} />
              </div>
            )}
            {aiDigitalNomads && (
              <div>
                <h2 className="text-lg md:text-xl font-bold mb-3" style={{ color: '#232e4e' }}>
                  Digital nomads
                </h2>
                <SectionText text={aiDigitalNomads} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* AREAS TO AVOID */}
      {aiAreasToAvoid && (
        <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
              Areas to avoid
            </h2>
            <SectionText text={aiAreasToAvoid} />
          </div>
        </section>
      )}

      {/* FAQ */}
      {aiFaqs?.length > 0 && (
        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ color: '#232e4e' }}>
              Frequently asked questions
            </h2>
            <div className="flex flex-col gap-3">
              {aiFaqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
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

      {/* BREADCRUMBS + INTERNAL LINKS */}
      <section className="py-10 px-6 bg-white border-t border-gray-100">
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
      </section>

      <Footer />
    </main>
  )
}