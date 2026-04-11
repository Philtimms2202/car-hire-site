'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from '@/context/localeContext'
import { format } from 'date-fns'

interface City {
  name: string
  country: string
  id: string
}

export default function HotelSearch() {
  const { language, currency } = useLocale()

  const [query, setQuery] = useState('')
  const [cityResults, setCityResults] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)

  const resultsRef = useRef<HTMLDivElement>(null)

  const PID = 'UK.DIRECT.PHG.1011l428377'

  const today = format(new Date(), 'yyyy-MM-dd')

// When check-in changes, ensure check-out is valid
useEffect(() => {
  if (!checkIn) return

  // If checkout is empty OR before checkin → auto-fix it
  if (!checkOut || checkOut < checkIn) {
    setCheckOut(checkIn)
  }
}, [checkIn])


  // Debounced autocomplete search
  useEffect(() => {
    if (!query || selectedCity) return

    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/hotel-cities?q=${query}`)
      const data = await res.json()
      setCityResults(data)
    }, 250)

    return () => clearTimeout(timeout)
  }, [query, selectedCity])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
        setCityResults([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Auto‑fix checkout date if invalid
  useEffect(() => {
    if (checkIn && checkOut && checkOut < checkIn) {
      setCheckOut(checkIn)
    }
  }, [checkIn])

  const handleSearch = () => {
    if (!selectedCity) return

    const params = new URLSearchParams({
      destination: `${selectedCity.name}, ${selectedCity.country}`,
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
      <div className="w-full max-w-[900px] bg-white shadow-lg rounded-xl p-6 border border-gray-100">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Destination */}
          <div className="relative" ref={resultsRef}>
            <input
              type="text"
              placeholder="Where are you going?"
              value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedCity(null)
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            {/* Autocomplete dropdown */}
            {cityResults.length > 0 && !selectedCity && (
              <div className="absolute z-20 bg-white border rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-xl">
                {cityResults.map((c) => (
                  <div
                    key={c.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => {
                      setSelectedCity(c)
                      setCityResults([])
                    }}
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="text-gray-500">, {c.country}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-in */}
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          {/* Check-out */}
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          {/* Adults */}
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            {[1,2,3,4,5,6].map(n => (
              <option key={n} value={n}>{n} adult{n > 1 ? 's' : ''}</option>
            ))}
          </select>

        </div>

        {/* Search button */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Search Hotels
          </button>
        </div>

      </div>
    </div>
  )
}
