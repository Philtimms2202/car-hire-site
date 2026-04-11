'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from '@/context/localeContext'

interface City {
  city: string
  country: string
}

export default function HotelSearch() {
  const { language, currency } = useLocale()

  const [query, setQuery] = useState('')
  const [cityResults, setCityResults] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)

  const [loading, setLoading] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const PID = 'UK.DIRECT.PHG.1011l428377'

  // Debounced city search
  useEffect(() => {
    if (!query || selectedCity) return

    const timeout = setTimeout(async () => {
      setLoading(true)
      const res = await fetch(`/api/hotel-cities?q=${query}`)
      const data = await res.json()
      setCityResults(data)
      setLoading(false)
    }, 250)

    return () => clearTimeout(timeout)
  }, [query, selectedCity])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
        setCityResults([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = () => {
    if (!selectedCity) return

    const params = new URLSearchParams({
      destination: `${selectedCity.city}, ${selectedCity.country}`,
      affcid: PID,
      lang: language,
      currency,
      adults: adults.toString(),
    })

    if (checkIn) params.append('checkIn', checkIn)
    if (checkOut) params.append('checkOut', checkOut)

    const url = `https://www.expedia.co.uk/Hotel-Search?${params.toString()}`
    window.open(url, '_blank')
  }

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-[900px] bg-white shadow-md rounded-xl p-6">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Destination */}
          <div className="relative" ref={resultsRef}>
            <input
              type="text"
              placeholder="Where are you going?"
              value={selectedCity ? `${selectedCity.city}, ${selectedCity.country}` : query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedCity(null)
              }}
              className="w-full border rounded-lg px-4 py-2"
            />

            {/* Autocomplete dropdown */}
            {cityResults.length > 0 && !selectedCity && (
              <div className="absolute z-20 bg-white border rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-lg">
                {cityResults.map((c, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedCity(c)
                      setCityResults([])
                    }}
                  >
                    {c.city}, {c.country}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-in */}
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Check-out */}
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          {/* Adults */}
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2"
          >
            {[1,2,3,4,5,6].map(n => (
              <option key={n} value={n}>{n} adult{n > 1 ? 's' : ''}</option>
            ))}
          </select>

        </div>

        {/* Search button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search Hotels
          </button>
        </div>

      </div>
    </div>
  )
}
