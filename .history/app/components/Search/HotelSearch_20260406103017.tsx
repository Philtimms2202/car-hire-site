'use client'
import { useState } from 'react'

export default function HotelSearch({ cityName }) {
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')

  const ALLIANCE_ID = '8052073'
  const SID = '304662590'

  const handleSearch = () => {
    if (!checkin || !checkout) {
      alert("Please enter check-in and check-out dates.")
      return
    }

    const url = `https://uk.trip.com/hotels/search?keyword=${encodeURIComponent(
      cityName
    )}&checkin=${checkin}&checkout=${checkout}&adult=2&crn=1&Allianceid=${ALLIANCE_ID}&SID=${SID}`

    window.open(url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <button onClick={handleSearch} className="btn-primary mt-5 w-full">
        Search Hotels
      </button>
    </div>
  )
}