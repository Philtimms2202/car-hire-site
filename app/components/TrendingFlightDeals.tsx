import Link from 'next/link'
import { getTrendingDeals } from '@/lib/travelpayouts'
import { buildTrackedKiwiUrl } from '@/app/flights/FlightsPageClient' // adjust import path to wherever buildTrackedKiwiUrl is exported from

type Props = {
  /** Pass a UK origin IATA code to bias deals from that airport, or omit for sitewide cheapest deals */
  origin?: string
}

// Server component — fetches at request time but relies on the 6hr `revalidate`
// set inside getTrendingDeals(), so this is effectively ISR-cached, not live per-request.
export default async function TrendingFlightDeals({ origin }: Props) {
  const deals = await getTrendingDeals(origin, 'gbp', 9)

  if (!deals.length) return null

  return (
    <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">
            Live right now
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#232e4e' }}>
                Trending flight deals
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                The cheapest fares our search has spotted in the last 48 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {deals.map(deal => {
            const href = buildTrackedKiwiUrl({
              from: deal.origin,
              to: deal.destination,
              depart: deal.departDate,
              returnDate: deal.returnDate ?? undefined,
              currency: 'GBP',
            })

            return (
              <a
                key={`${deal.origin}-${deal.destination}-${deal.departDate}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-gray-100 bg-white px-5 py-4 flex items-center justify-between shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    {deal.origin} → {deal.destination}
                  </p>
                  <p className="font-bold text-lg mt-0.5" style={{ color: '#232e4e' }}>
                    £{deal.price}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(deal.departDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
                <span
                  className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 text-white"
                  style={{ backgroundColor: '#03989e' }}
                >
                  View →
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}