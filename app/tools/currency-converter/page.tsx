import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import CurrencyToolsClient from '@/app/tools/components/CurrencyToolsClient'
import { getExchangeRates } from '@/lib/exchangeRates'
import { CountryCostData } from '@/app/tools/components/CountryCostExplorer'

// ----------------------------------------------------------------------------
// ASSUMPTION TO CHECK: this import path and the GROQ query below are written
// against a guessed schema, since I don't have your actual Sanity setup.
// Swap `@/sanity/lib/client` for wherever your client lives (it might be
// `@/lib/sanity` or similar), and rename fields below to match your real
// country document - the shape just needs to end up matching CountryCostData.
// ----------------------------------------------------------------------------
import { client } from '@/sanity/lib/client'
import { COUNTRY_PRICES } from '@/app/tools/data/countryPrices'

export const metadata: Metadata = {
  title: 'Currency Converter | Timms Travel',
  description: 'Convert between global currencies with daily exchange rates, plus see average local prices for beer, meals and dining out across dozens of destinations.',
  alternates: { canonical: 'https://timmstravel.com/tools/currency-converter' },
}

const FAQS = [
  { q: 'How often are the exchange rates updated?', a: 'Rates refresh once a day. This is plenty for trip planning and budgeting, and matches how most banks and exchange bureaus quote their daily rate. If you need true real-time rates for an actual money transfer, use your bank or a transfer service like Wise at the time of payment.' },
  { q: 'Why do average prices vary so much between countries?', a: 'Local cost of living, tourist demand, and exchange rate swings all play a part. A beer in Vietnam might cost a fraction of one in Norway. We update these figures periodically, but treat them as a helpful guide rather than an exact quote - prices vary by city, season and venue.' },
  { q: 'Are these prices for tourist areas or local areas?', a: 'We aim for a realistic average a visitor would actually pay - typically a mix of central, walkable areas rather than the cheapest possible backstreet find or the most expensive five-star hotel bar.' },
  { q: 'Can I use this to plan my holiday budget?', a: 'Yes - pick your destination here to see average prices, then head to our budget planner to build out a full day-by-day cost estimate for your trip.' },
]

const TIPS = [
  { title: 'Avoid airport currency exchange', body: 'Airport kiosks typically offer the worst rates of any option. Withdraw cash from an ATM after landing, or use a fee-free travel card, for a much better rate.' },
  { title: 'Always pay in the local currency', body: "When a card machine abroad asks 'pay in GBP or local currency', always choose local currency. The GBP conversion is calculated by the merchant, usually at a worse rate than your card provider would give you." },
  { title: 'Use a fee-free travel card', body: 'Cards designed for travel avoid the typical 2-3% foreign transaction fee charged by standard debit and credit cards, which adds up fast on a longer trip.' },
  { title: 'Carry a little local cash', body: 'Even in card-friendly destinations, small vendors, markets and some transport still expect cash. Withdraw a modest amount on arrival rather than relying entirely on card.' },
]

async function getCountryCostData(): Promise<CountryCostData[]> {
  // We only need the real name/slug/continent from Sanity here - the price
  // data itself lives in the static COUNTRY_PRICES file (see countryPrices.ts)
  // since there's no live source for beer/meal prices worth integrating.
  // ASSUMPTION - adjust field names below if your country schema differs
  // (e.g. if "continent" isn't the field name for the reference).
  const query = `
    *[_type == "country"] | order(name asc) {
      name,
      "countrySlug": slug.current,
      "continentSlug": continent->slug.current
    }
  `

  type SanityCountry = { name: string; countrySlug: string; continentSlug: string }

  try {
    const sanityCountries = await client.fetch<SanityCountry[]>(
      query,
      {},
      { next: { revalidate: 86400 } }
    )

    // Merge real Sanity data (name/slug/links) with static price estimates.
    // Countries without a matching entry in COUNTRY_PRICES are skipped
    // rather than shown with fake/zero prices.
    return (sanityCountries ?? [])
      .filter(c => COUNTRY_PRICES[c.countrySlug])
      .map(c => ({
        name: c.name,
        countrySlug: c.countrySlug,
        continentSlug: c.continentSlug,
        ...COUNTRY_PRICES[c.countrySlug],
      }))
  } catch (err) {
    console.error('Failed to fetch countries from Sanity:', err)
    return []
  }
}

export default async function CurrencyConverterPage() {
  const [exchangeRates, countries] = await Promise.all([
    getExchangeRates('GBP'),
    getCountryCostData(),
  ])

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="text-white py-16 px-6 text-center"
               style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.2em] text-xs font-medium text-teal-200 mb-3">Free travel tool</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Currency converter</h1>
          <p className="text-base text-teal-50 max-w-xl mx-auto leading-relaxed">
            Convert between global currencies with daily exchange rates, then see what your money actually buys - beer, meals and dining out - in destinations around the world.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <CurrencyToolsClient
            rates={exchangeRates.rates}
            base={exchangeRates.base}
            lastUpdatedUtc={exchangeRates.lastUpdatedUtc}
            countries={countries}
          />
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="uppercase tracking-[0.18em] text-[11px] font-medium" style={{ color: '#03989e' }}>About this tool</p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#022135' }}>How the currency converter works</h2>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            Exchange rates are pulled daily and cover over 150 currencies worldwide, so the figures stay current without needing to refresh constantly - daily is how most banks and bureaus quote rates anyway.
          </p>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            Pick a country below to see typical prices for a beer, a budget meal, a mid-range meal and a nicer meal out, converted automatically using today's rate. It's a quick way to get a feel for the cost of a destination before you book.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#022135' }}>Money tips for travellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TIPS.map(tip => (
              <div key={tip.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="font-semibold text-sm mb-2" style={{ color: '#022135' }}>{tip.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#022135' }}>Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map(faq => (
              <div key={faq.q} className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-semibold text-sm mb-2" style={{ color: '#022135' }}>{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">Also useful</p>
          <div className="flex flex-wrap gap-2">
            {[
              ['/tools', 'All travel tools'],
              ['/tools/budget-planner', 'Holiday budget planner'],
              ['/tools/flight-time-calculator', 'Flight time calculator'],
              ['/tools/packing-checklist', 'Packing checklist'],
              ['/other-services/travel-insurance', 'Travel insurance'],
              ['/flights', 'Search flights'],
              ['/hotels', 'Find hotels'],
            ].map(([href, label]) => (
              <Link key={href} href={href}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition hover:opacity-80"
                    style={{ borderColor: '#03989e', color: '#03989e' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <nav className="flex flex-wrap gap-2 items-center text-sm">
            <Link href="/" style={{ color: '#03989e' }} className="hover:opacity-75 transition">Home</Link>
            <span className="text-gray-300">→</span>
            <Link href="/tools" style={{ color: '#03989e' }} className="hover:opacity-75 transition">Travel tools</Link>
            <span className="text-gray-300">→</span>
            <span className="font-semibold" style={{ color: '#022135' }}>Currency converter</span>
          </nav>
        </div>
      </section>

      <Footer />
    </main>
  )
}