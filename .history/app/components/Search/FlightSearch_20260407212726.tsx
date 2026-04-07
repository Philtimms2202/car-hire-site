'use client'

import { useState } from 'react'

export default function FlightSearch() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [depart, setDepart] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [roundTrip, setRoundTrip] = useState(true)

  const airportCodes: Record<string, string> = {
    manchester: "MAN",
    london: "LON",
    orlando: "ORL",
    newyork: "NYC",
    paris: "PAR",
    dubai: "DXB",
    tokyo: "TYO",
    singapore: "SIN",
    sydney: "SYD",
    losangeles: "LAX",
    miami: "MIA",
    toronto: "YTO",
  }

  const toIATA = (value: string) => {
    const key = value.toLowerCase().replace(/\s+/g, "")
    return airportCodes[key] || value.toUpperCase()
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${day}${month}`
  }

  const handleSearch = () => {
    if (!from || !to || !depart) {
      alert("Please enter origin, destination, and departure date.")
      return
    }

    const fromCode = toIATA(from)
    const toCode = toIATA(to)
    const departFormatted = formatDate(depart)
    const returnFormatted = returnDate ? formatDate(returnDate) : ''

    const aviaUrl = roundTrip
      ? `https://www.aviasales.com/search/${fromCode}${departFormatted}${toCode}${returnFormatted}11?currency=gbp`
      : `https://www.aviasales.com/search/${fromCode}${departFormatted}${toCode}1?currency=gbp`

    const encoded = encodeURIComponent(aviaUrl)
    const finalUrl = `https://aviasales.tpm.li/5tsfGPfB?u=${encoded}`

    window.open(finalUrl, '_blank')
  }

  return (
    <div className="card space-y-6">

      {/* Round-trip toggle */}
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${roundTrip ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setRoundTrip(true)}
        >
          Round Trip
        </button>
        <button
          className={`px-4 py-2 rounded ${!roundTrip ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setRoundTrip(false)}
        >
          One Way
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div>
          <label className="block text-gray-600 text-sm mb-1">From</label>
          <input
            className="input-field bg-white text-gray-900"
            placeholder="City - e.g Manchester"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">To</label>
          <input
            className="input-field bg-white text-gray-900"
            placeholder="City or IATA"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm mb-1">Departure Date</label>
          <input
            type="date"
            className="input-field bg-white text-gray-900"
            value={depart}
            onChange={(e) => setDepart(e.target.value)}
          />
        </div>

        {roundTrip && (
          <div>
            <label className="block text-gray-600 text-sm mb-1">Return Date</label>
            <input
              type="date"
              className="input-field bg-white text-gray-900"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        )}

      </div>

      <button onClick={handleSearch} className="btn-primary w-full">
        Search Flights
      </button>
    </div>
  )
}