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
  const [selectedFrom, setSelectedFrom] = useState<any>(null)
  const [selectedTo, setSelectedTo] = useState<any>(null)

  const today = new Date().toISOString().split('T')[0]

  // Debounce helper
  const debounce = (fn: Function, delay = 300) => {
    let timer: any
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }

  // Fetch from your local API route
  const fetchAirports = async (query: string, setter: Function) => {
    if (!query || query.length < 2) {
      setter([])
      return
    }

    const res = await fetch(`/api/airports?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setter(data)
  }

  const debouncedFromSearch = debounce((q: string) =>
    fetchAirports(q, setFromResults)
  )
  const debouncedToSearch = debounce((q: string) =>
    fetchAirports(q, setToResults)
  )

  useEffect(() => debouncedFromSearch(from), [from])
  useEffect(() => debouncedToSearch(to), [to])

  // Build Kiwi deeplink
  const buildKiwiLink = () => {
    const fromCode = selectedFrom.iata_code
    const toCode = selectedTo.iata_code

    const base = `https://www.kiwi.com/en/search/results/${fromCode}/${toCode}/${depart}`

    const url = new URL(
      roundTrip && returnDate
        ? `${base}/${returnDate}`
        : base
    )

    // Travelpayouts Kiwi affiliate ID
    url.searchParams.set(
      'affilid',
      process.env.NEXT_PUBLIC_KIWI_AFFIL_ID || ''
    )

    // Optional defaults
    url.searchParams.set('adults', '1')
    url.searchParams.set('children', '0')
    url.searchParams.set('infants', '0')
    url.searchParams.set('cabinClass', 'economy')

    return url.toString()
  }

  const handleSearch = () => {
    if (!selectedFrom || !selectedTo || !depart) {
      alert('Please select valid airports from the dropdown.')
      return
    }

    const kiwiUrl = buildKiwiLink()
    window.open(kiwiUrl, '_blank')
  }

  const renderDropdown = (
    results: any[],
    setter: Function,
    inputSetter: Function,
    selectSetter: Function
  ) => {
    if (!results.length) return null

    return (
      <div
        className="
          absolute left-0 right-0 z-30 
          bg-white border border-gray-200 
          rounded-xl shadow-xl 
          mt-2 max-h-72 overflow-y-auto
          animate-fadeIn
        "
      >
        {results.map((a) => (
          <div
            key={a.iata_code}
            className="
              px-4 py-3 
              cursor-pointer 
              hover:bg-blue-50 
              active:bg-blue-100 
              transition 
              flex flex-col
            "
            onClick={() => {
              inputSetter(`${a.city} (${a.iata_code})`)
              selectSetter(a)
              setter([])
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900 text-base">
                {a.city}, {a.country}
              </span>
              <span className="text-blue-600 font-bold text-sm">
                {a.iata_code}
              </span>
            </div>

            <span className="text-gray-500 text-sm mt-1">
              {a.name}
            </span>
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
            onChange={(e) => {
              setFrom(e.target.value)
              setSelectedFrom(null)
            }}
          />
          {renderDropdown(fromResults, setFromResults, setFrom, setSelectedFrom)}
        </div>

        {/* TO */}
        <div className="relative">
          <label className="block text-gray-600 text-sm mb-1">To</label>
          <input
            className="input-field bg-white text-gray-900"
            placeholder="City or Airport"
            value={to}
            onChange={(e) => {
              setTo(e.target.value)
              setSelectedTo(null)
            }}
          />
          {renderDropdown(toResults, setToResults, setTo, setSelectedTo)}
        </div>

        {/* DEPART */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Departure Date</label>
          <input
            type="date"
            className="input-field bg-white text-gray-900"
            value={depart}
            min={today}
            onChange={(e) => {
              const newDepart = e.target.value
              setDepart(newDepart)

              if (returnDate && returnDate < newDepart) {
                setReturnDate(newDepart)
              }
            }}
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
              min={depart || today}
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
