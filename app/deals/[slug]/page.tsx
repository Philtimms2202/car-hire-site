import { notFound } from 'next/navigation'
import { DEAL_CATEGORIES } from '@/data/dealCategories'
import { buildMetadata } from '@/app/metadata'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import AirportSelector from '../../components/AirportSelector'
import DealCard from '../../components/DealCard'
import { getTeaserDeals } from '@/lib/getDealsForSlug'
import { filterDealsForCategory } from '@/lib/filterDeals'
import Link from 'next/link'

type DealParams = { slug: string }

export async function generateMetadata({ params }: { params: Promise<DealParams> }) {
  const { slug } = await params
  const categoryConfig = DEAL_CATEGORIES[slug as keyof typeof DEAL_CATEGORIES]

  if (!categoryConfig) {
    return buildMetadata({
      title: 'Flight Deals | Timms Travel',
      description: 'Find real-time discounted airfares and travel deals worldwide.',
    })
  }

  const title = `${categoryConfig.title} | Live Travel Drops | Timms Travel`
  const description = `${categoryConfig.subtitle} Select your departure airport to see live indicative pricing.`
  const canonical = `https://timmstravel.com/deals/${slug}`

  return buildMetadata({
    title,
    description,
    alternates: { canonical },
    openGraph: { url: canonical, title, description },
  })
}

export default async function DealPage({ params }: { params: Promise<DealParams> }) {
  const { slug } = await params
  const categoryConfig = DEAL_CATEGORIES[slug as keyof typeof DEAL_CATEGORIES]

  if (!categoryConfig) notFound()

  const rawTeaserDeals = await getTeaserDeals(slug)
  const teaserDeals = filterDealsForCategory(rawTeaserDeals, slug, categoryConfig).slice(0, 6)

  const popularAirports = ['manchester', 'london', 'birmingham', 'edinburgh']

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Navbar />

        <section
          className="text-white py-20 md:py-24 px-6 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #022135 0%, #03989e 100%)' }}
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <Link
              href="/deals"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10 mb-6 text-teal-100"
            >
              ← Back to All Categories
            </Link>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight leading-none">
              {categoryConfig.title}
            </h1>
            <p className="text-base md:text-lg text-teal-50 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
              {categoryConfig.subtitle} Select your departure airport to see live pricing.
            </p>

            <AirportSelector slug={slug} size="large" />

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {popularAirports.map((a) => (
                <Link
                  key={a}
                  href={`/deals/${slug}/${a}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-teal-50 capitalize"
                >
                  {a}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {teaserDeals.length > 0 && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
                  Trending Right Now
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  A sample of live drops from airports worldwide, select yours above for pricing tailored to you.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teaserDeals.map((deal, idx) => (
                  <DealCard key={idx} deal={deal} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  )
}