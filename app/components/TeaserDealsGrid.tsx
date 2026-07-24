'use client'

import { useState } from 'react'
import DealCard from './DealCard'
import { TrendingDeal } from '@/lib/travelpayouts'

type Props = {
  deals: TrendingDeal[]
  initialCount?: number
}

export default function TeaserDealsGrid({ deals, initialCount = 6 }: Props) {
  const [showAll, setShowAll] = useState(false)
  const visibleDeals = showAll ? deals : deals.slice(0, initialCount)
  const hasMore = deals.length > initialCount

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleDeals.map((deal, idx) => (
          <DealCard key={idx} deal={deal} />
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90 shadow-md"
            style={{ backgroundColor: '#03989e' }}
          >
            View More Deals →
          </button>
        </div>
      )}
    </>
  )
}