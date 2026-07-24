import Link from 'next/link'
import { getTrendingDeals } from '@/lib/travelpayouts'
import DealCard from '@/app/components/DealCard'

type Props = {
  /** Pass a UK origin IATA code to bias deals from that airport, or omit for sitewide cheapest deals */
  origin?: string
  /** How many deal cards to show */
  limit?: number
}

// Server component — fetches at request time but relies on the 6hr `revalidate`
// set inside getTrendingDeals(), so this is effectively ISR-cached, not live per-request.
export default async function TrendingFlightDeals({ origin, limit = 6 }: Props) {
  const deals = (await getTrendingDeals(origin, 'gbp', limit)).slice(0, limit)

  if (!deals.length) return null

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">
            Live right now
          </p>
          <h2 className="text-3xl font-bold" style={{ color: '#232e4e' }}>
            Trending Flight Deals
          </h2>
          <p className="text-gray-500 mt-2">
            The cheapest fares our search has spotted in the last 48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {deals.map(deal => (
            <DealCard
              key={`${deal.origin}-${deal.destination}-${deal.departDate}`}
              deal={deal}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/flights"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 shadow-md"
            style={{ backgroundColor: '#03989e' }}
          >
            View More Flights →
          </Link>
        </div>
      </div>
    </section>
  )
}