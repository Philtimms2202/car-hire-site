'use client'

import { useState, useEffect } from 'react'

export default function FlightSearch() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [depart, setDepart] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [roundTrip, setRoundTrip] = useState(true)

  const [fromResults, setFromResults] = useState<any[]>([])
  const [toResults, setToResults] = useState<any[]>([])
  const [loadingFrom, setLoadingFrom] = useState(false)
  const [loadingTo, setLoadingTo] = useState(false)

  // Debounce helper
  const debounce = (fn: Function, delay = 300) => {
    let timer: any
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }

  // Fetch from your local API route
  const fetchAirports = async (query: string, setter: Function, loader: Function) => {
    if (!query || query.length < 2) {
      setter([])
      return
    }

    loader(true)

    const res = await fetch(`/api/airports?q=${encodeURIComponent(query)}`)
    const data = await res.json()

    setter(data)
    loader(false)
  }

  const debouncedFromSearch = debounce((q: string) =>
    fetchAirports(q, setFromResults, setLoadingFrom)
  )
  const debouncedToSearch = debounce((q: string) =>
    fetchAirports(q, setToResults, setLoadingTo)
  )

  useEffect(() => debouncedFromSearch(from), [from])
  useEffect(() => debouncedToSearch(to), [to])

  const formatDate = (date: string) => {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${day}${month}`
  }

  const handleSearch = async () => {
    if (!from || !to || !depart) {
      alert('Please enter origin, destination, and departure date.')
      return
    }

    const fromCode = fromResults[0]?.iata_code
    const toCode = toResults[0]?.iata_code

    if (!fromCode || !toCode) {
      alert('Please select valid airports from the dropdown.')
      return
    }

    const departFormatted = formatDate(depart)
    const returnFormatted = returnDate ? formatDate(returnDate) : ''

    const aviaUrl = roundTrip
      ? `https://www.aviasales.com/search/${fromCode}${departFormatted}${toCode}${returnFormatted}11?currency=gbp`
      : `https://www.aviasales.com/search/${fromCode}${departFormatted}${toCode}1?currency=gbp`

    const encoded = encodeURIComponent(aviaUrl)
    const finalUrl = `https://aviasales.tpm.li/5tsfGPfB?u=${encoded}`

    window.open(finalUrl, '_blank')
  }

  const renderDropdown = (results: any[], setter: Function, inputSetter: Function) => {
    if (!results.length) return null

    return (
      <div className="absolute z-30 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-64 overflow-y-auto">
        {results.map((a) => (
          <div
            key={a.iata_code}
            className="px-4 py-2 cursor-pointer hover:bg-blue-50 transition"
            onClick={() => {
              inputSetter(`${a.city} (${a.iata_code})`)
              setter([])
            }}
          >
            <div className="font-medium text-gray-900">
              {a.city}, {a.country}
            </div>
            <div className="text-sm text-gray-500">
              {a.name} — <span className="font-semibold text-blue-600">{a.iata_code}</span>
            </div>
          </div>
        ))}
      </div>
    )
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

        {/* FROM */}
        <div className="relative">
          <label className="block text-gray-600 text-sm mb-1">From</label>
          <input
            className="input-field bg-white text-gray-900"
            placeholder="City or Airport"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          {renderDropdown(fromResults, setFromResults, setFrom)}
        </div>

        {/* TO */}
        <div className="relative">
          <label className="block text-gray-600 text-sm mb-1">To</label>
          <input
            className="input-field bg-white text-gray-900"
            placeholder="City or Airport"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          {renderDropdown(toResults, setToResults, setTo)}
        </div>

        {/* DEPART */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Departure Date</label>
          <input
            type="date"
            className="input-field bg-white text-gray-900"
            value={depart}
            onChange={(e) => setDepart(e.target.value)}
          />
        </div>

        {/* RETURN */}
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