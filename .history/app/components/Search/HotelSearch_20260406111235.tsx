'use client'
import React from 'react'

export default function HotelSearch() {
  const ALLIANCE_ID = '8052073'
  const SID = '304662590'

  const go = (path: string) => {
    window.open(`${path}&Allianceid=${ALLIANCE_ID}&SID=${SID}`, '_blank')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button className="btn-primary" onClick={() => go('https://uk.trip.com/hotels/')}>
        Find Hotels
      </button>

      <button className="btn-primary" onClick={() => go('https://uk.trip.com/hotels/deals')}>
        Cheap Deals
      </button>

      <button className="btn-primary" onClick={() => go('https://uk.trip.com/hotels/last-minute')}>
        Last‑Minute Stays
      </button>

      <button className="btn-primary" onClick={() => go('https://uk.trip.com/hotels/luxury')}>
        Luxury Hotels
      </button>
    </div>
  )
}