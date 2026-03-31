'use client'
import { useState } from 'react'

export default function HotelSearch() {
  const [location, setLocation] = useState('')
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')

  const handleSearch = () => {
    if (!location) return
    const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(location)}&checkin=${checkin}&checkout=${checkout}`
    window.open(url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input className="input-field" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="date" className="input-field" value={checkin} onChange={(e) => setCheckin(e.target.value)} />
      <input type="date" className="input-field" value={checkout} onChange={(e) => setCheckout(e.target.value)} />

      <button onClick={handleSearch} className="btn-primary mt-5 w-full">
        Search Hotels
      </button>
    </div>
  )
}