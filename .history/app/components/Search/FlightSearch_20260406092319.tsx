'use client'
import { useState } from 'react'

export default function FlightSearch() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [depart, setDepart] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const handleSearch = () => {
    if (!from || !to) return

    // Kiwi does NOT support dynamic deep links via Travelpayouts
    // So we send users to your affiliate link with a SubID
    const url = `https://kiwi.tpm.li/XkSShRb7?subid=flightsearch`

    window.open(url, '_blank')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input className="input-field" placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} />
      <input className="input-field" placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
      <input type="date" className="input-field" value={depart} onChange={(e) => setDepart(e.target.value)} />
      <input type="date" className="input-field" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />

      <button onClick={handleSearch} className="btn-primary mt-5 w-full">
        Search Flights
      </button>
    </div>
  )
}