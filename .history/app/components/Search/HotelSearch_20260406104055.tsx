'use client'
import { useState } from 'react'

export default function HotelSearch() {
  const [location, setLocation] = useState('')
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')

  const ALLIANCE_ID = '8052073'
  const SID = '304662590'

  const handleSearch = async () => {
    if (!location || !checkin || !checkout) {
      alert("Please enter location, check-in, and check-out dates.")
      return
    }

    // 1. Fetch Trip.com IDs
    const res = await fetch('/api/tripcom/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: location })
    })

    if (!res.ok) {
      alert("City not found on Trip.com")
      return
    }

    const { cityId, countryId, optionId, destName, searchType } = await res.json()

    // 2. Build Trip.com URL
    const url = `https://uk.trip.com/hotels/list?flexType=1&cityId=${cityId}&countryId=${countryId}&destName=${encodeURIComponent(
      destName
    )}&searchType=${searchType}&optionId=${optionId}&checkin=${checkin}&checkout=${checkout}&crn=1&adult=2&Allianceid=${ALLIANCE_ID}&SID=${SID}`

    // 3. Redirect
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