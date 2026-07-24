import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import { DEAL_CATEGORIES } from '@/data/dealCategories'
import { buildMetadata } from '@/app/metadata'
import { getCategoryHasDeals } from '@/lib/getDealsForSlug'
import TravelPayoutsSearch from '../components/TravelPayoutsSearch'

export async function generateMetadata() {
  return buildMetadata({
    title: 'The Best Travel Deals | Timms Travel',
    description: 'Explore live travel deals. Real-time flight pricing tickers sorted by budget, destinations, and seasons.',
    alternates: { canonical: 'https://timmstravel.com/deals' }
  })
}

const FAQ_ITEMS = [
  {
    question: 'How often are these flight deals updated?',
    answer:
      'Our prices are pulled from live airline and travel data feeds and refreshed every few hours, so the fares you see reflect current market pricing rather than outdated averages. Because availability shifts constantly, we recommend clicking through to check the exact live price before booking.'
  },
  {
    question: 'Are the prices shown the final price I will pay?',
    answer:
      'Prices are shown per person in GBP and are indicative of what our data feed found at the last update. Final pricing, taxes, and any additional charges (such as luggage or seat selection) are confirmed on the airline or booking partner\'s site before you complete your purchase.'
  },
  {
    question: 'Do you charge a booking fee?',
    answer:
      'No. Timms Travel does not charge any booking fee. We work with trusted affiliate partners, and if you book after clicking through from our site, we may earn a small commission at no extra cost to you.'
  },
  {
    question: 'How do you choose which routes and deals to show?',
    answer:
      'Each collection is built around a theme, such as budget, season, or destination type, and pulls from live fare data matching that theme. Categories with no current live matches are automatically hidden until new deals become available.'
  },
  {
    question: 'Can I search for a specific route instead of browsing categories?',
    answer:
      'Yes. Use the search above to look up a specific origin and destination directly, or browse our full flight route directory for more targeted results.'
  }
]

export default async function DealsDashboard() {
  const categoryHasDeals = await getCategoryHasDeals()
  const visibleCategories = Object.entries(DEAL_CATEGORIES).filter(
    ([slug]) => categoryHasDeals[slug] !== false
  )

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section 
        className="text-white py-24 md:py-32 px-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-6xl md:text-7xl mb-6 animate-bounce duration-1000">✈️</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-none">
            The Best Flight & Travel Deals
          </h1>
          <p className="text-base md:text-xl text-teal-50 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Real-time price updates with deals on flights, ensuring you get the best experience for your money. Handpicked parameters engineered for your ideal vacation style without the endless searching.
          </p>
          <div className="p-3 inline-flex items-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs md:text-sm font-semibold tracking-wide text-teal-100">
            ⚡ Live pricing tickers updating constantly
          </div>
          <p className="text-xs text-teal-200/80 mt-6 max-w-md mx-auto italic">
            At Timms Travel, we use affiliate links. If you book a place through our links, we might earn a small commission at completely zero extra cost to you.
          </p>
        </div>
      </section>

      {/* ── INTRO / SEO CONTENT ───────────────────────────────────────── */}
      <section className="py-14 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#232e4e' }}>
            Live Flight Deals, Updated Around the Clock
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Finding a genuinely good flight deal usually means trawling through dozens of tabs, comparing dates, and
            second-guessing whether a price will still be there tomorrow. We built this page to take that legwork off
            your plate. Every collection below draws on live fare data, refreshed throughout the day, so you are
            seeing what airlines and travel partners are actually charging right now rather than a static list from
            last month.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you are chasing a cheap last-minute city break, planning a family trip around the February
            half-term, or simply want to see how far your budget stretches on a long-haul route, our categories are
            organised to get you to a bookable fare in a couple of clicks. Pick a collection below, or head straight
            to our{' '}
            <Link href="/flights" className="font-semibold text-[#03989e] hover:underline">
              flight search
            </Link>{' '}
            if you already know where you want to go.
          </p>
        </div>
      </section>

      {/* ── CATEGORIES DIRECTORY GRID ─────────────────────────────────── */}
      <section className="py-16 px-6 bg-white" aria-labelledby="directory-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Explore Collections</p>
            <h2 id="directory-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Browse Special Deal Categories
            </h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">
              Live pricing tickers segmented into tailored collections by budget, region, and season.
            </p>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCategories.map(([slug, config]) => (
              <li key={slug} className="list-none">
                <Link
                  href={`/deals/${slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:border-teal-200 hover:bg-teal-50/30 transition-all shadow-sm hover:shadow-md"
                  title={config.title}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xl group-hover:text-[#03989e] transition-colors" style={{ color: '#232e4e' }}>
                      {config.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">{config.subtitle}</p>
                  <span className="text-xs font-bold text-[#03989e] group-hover:underline flex items-center gap-1">
                    View Live Deals →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">How It Works</p>
            <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Finding Your Deal, Step by Step
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg" style={{ backgroundColor: '#03989e' }}>
                1
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#232e4e' }}>Pick a Vibe</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Choose a category above based on your budget, the season you want to travel, or the type of trip you
                have in mind.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg" style={{ backgroundColor: '#03989e' }}>
                2
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#232e4e' }}>Select Your Airport</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Tell us where you are flying from so we can show live pricing tailored to your nearest departure
                airport.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg" style={{ backgroundColor: '#03989e' }}>
                3
              </div>
              <h3 className="font-bold mb-2" style={{ color: '#232e4e' }}>Check Live Fares & Book</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Click through on any deal to confirm the current live price with our booking partner and complete
                your booking directly with them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALSO DO HOTELS ───────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative z-10">
              <p className="text-xs font-bold tracking-widest uppercase text-teal-100 mb-2">
                Don't Forget
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                We Do Hotels Too
              </h2>
              <p className="text-teal-50 max-w-xl mx-auto mb-8 leading-relaxed font-light">
                Sorted your flight? We also cover hotels worldwide, from budget stays to boutique picks, with city
                guides and neighbourhood insights to help you choose the right place to stay.
              </p>
              <Link
                href="/hotels"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 shadow-md border border-white/20 bg-white/10 hover:bg-white/20"
              >
                Browse Hotel Deals →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-t border-gray-100" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">Questions</p>
            <h2 id="faq-heading" className="text-3xl font-bold" style={{ color: '#232e4e' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 open:bg-teal-50/30 open:border-teal-200 transition-all"
              >
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between" style={{ color: '#232e4e' }}>
                  {item.question}
                  <span className="text-teal-600 text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-gray-600 leading-relaxed mt-3">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}