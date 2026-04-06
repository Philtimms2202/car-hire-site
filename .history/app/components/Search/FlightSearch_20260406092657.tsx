'use client'
import { useState } from 'react'

export default function FlightSearch() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [depart, setDepart] = useState('')
  const [returnDate, setReturnDate] = useState('')

  const formatDate = (date: string) => {
    if (!date) return ''
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${day}${month}`
  }

  const handleSearch = () => {
    if (!from || !to || !depart) return

    const departFormatted = formatDate(depart)
    const returnFormatted = returnDate ? formatDate(returnDate) : ''

    // Build dynamic Aviasales URL
    const aviaUrl = returnFormatted
      ? `https://www.aviasales.com/search/${from}${departFormatted}${to}${returnFormatted}`
      : `https://www.aviasales.com/search/${from}${departFormatted}${to}`

    // Encode for Travelpayouts
    const encoded = encodeURIComponent(aviaUrl)

    // Your affiliate link
    const finalUrl = `https://aviasales.tpm.li/5tsfGPfB?u=${encoded}`

    window.open(finalUrl, '_blank')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        className="input-field"
        placeholder="From (MAN)"
        value={from}
        onChange={(e) => setFrom(e.target.value.toUpperCase())}
      />
      <input
        className="input-field"
        placeholder="To (LON)"
        value={to}
        onChange={(e) => setTo(e.target.value.toUpperCase())}
      />
      <input
        type="date"
        className="input-field"
        value={depart}
        onChange={(e) => setDepart(e.target.value)}
      />
      <input
        type="date"
        className="input-field"
        value={returnDate}
        onChange={(e) => setReturnDate(e.target.value)}
      />

      <button onClick={handleSearch} className="btn-primary mt-5 w-full">
        Search Flights
      </button>
    </div>
  )
}