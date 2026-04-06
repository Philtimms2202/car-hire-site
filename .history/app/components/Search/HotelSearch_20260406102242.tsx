'use client'
import { useState } from 'react'

export default function HotelSearch() {
  const [location, setLocation] = useState('')
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')

  const ALLIANCE_ID = '8052073'
  const SID = '304662590'
  const SUB3 = 'D15167609' // optional but included for consistency

  const handleSearch = () => {
    if (!location || !checkin || !checkout) {
      alert("Please enter location, check-in, and check-out dates.")
      return
    }

    const url = `https://www.trip.com/hotels/list?city=${encodeURIComponent(
      location
    )}&checkin=${checkin}&checkout=${checkout}&Allianceid=${ALLIANCE_ID}&SID=${SID}&trip_sub3=${SUB3}`

    window.open(url, '_blank')
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

      <button onClick={handleSearch} className="btn-primary mt-5 w-full">
        Search Hotels
      </button>
    </div>
  )
}