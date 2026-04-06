'use client'
import { useState } from 'react'

export default function HotelSearch() {
  const [location, setLocation] = useState('')
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [loading, setLoading] = useState(false)

  const ALLIANCE_ID = '8052073'
  const SID = '304662590'

  const handleSearch = () => {
    if (!location || !checkin || !checkout) {
      alert("Please enter location, check-in, and check-out dates.")
      return
    }

    setLoading(true)

    // Build keyword-based Trip.com URL
    const url = `https://uk.trip.com/hotels/list?keyword=${encodeURIComponent(
      location
    )}&checkin=${checkin}&checkout=${checkout}&crn=1&adult=2&Allianceid=${ALLIANCE_ID}&SID=${SID}`

    window.open(url, '_blank')
    setLoading(false)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        className="input-field"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="date"
        className="input-field"
        value={checkin}
        onChange={(e) => setCheckin(e.target.value)}
      />

      <input
        type="date"
        className="input-field"
        value={checkout}
        onChange={(e) => setCheckout(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="btn-primary mt-5 w-full"
        disabled={loading}
      >
        {loading ? "Searching…" : "Search Hotels"}
      </button>
    </div>
  )
}