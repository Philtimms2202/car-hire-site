'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale } from '@/context/localeContext'
import { format } from 'date-fns'

type City = {
  name: string
  country: string
  id: string
}

const EXPEDIA_DOMAIN_MAP: Record<string, string> = {
  GBP: 'https://www.expedia.co.uk',
  USD: 'https://www.expedia.com',
  EUR: 'https://www.expedia.de',
  AUD: 'https://www.expedia.com.au',
  CAD: 'https://www.expedia.ca',
  NZD: 'https://www.expedia.co.nz',
  SGD: 'https://www.expedia.com.sg',
  JPY: 'https://www.expedia.co.jp',
}

export default function HotelSearch() {
  const { language, currency } = useLocale()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  // ✅ SIMPLE MODEL (FIXES EVERYTHING)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  const [travellerOpen, setTravellerOpen] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')

  const travellerRef = useRef<HTMLDivElement>(null)

  const baseUrl =
    EXPEDIA_DOMAIN_MAP[currency] || EXPEDIA_DOMAIN_MAP.GBP

  // close dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (travellerRef.current && !travellerRef.current.contains(e.target as Node)) {
        setTravellerOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // autocomplete
  useEffect(() => {
    if (!query || selectedCity) return

    const t = setTimeout(async () => {
      const res = await fetch(`/api/hotel-cities?q=${query}`)
      const data = await res.json()
      setResults(data)
    }, 250)

    return () => clearTimeout(t)
  }, [query, selectedCity])

  const handleSearch = () => {
    if (!selectedCity) return

    const params = new URLSearchParams({
      destination: `${selectedCity.name}, ${selectedCity.country}`,
      affcid: 'UK.DIRECT.PHG.1011l428377',
      lang: language,
    })

    if (checkIn) {
      params.append('d1', checkIn)
      params.append('startDate', checkIn)
    }

    if (checkOut) {
      params.append('d2', checkOut)
      params.append('endDate', checkOut)
    }

    // ✅ SIMPLE + STABLE (NO ROOM LOGIC)
    params.append('adults', String(adults))
    params.append('children', String(children))
    params.append('rooms', '1')

    const url = `${baseUrl}/Hotel-Search?${params.toString()}`
    window.open(url, '_blank')
  }

  const label = `${adults} adult${adults !== 1 ? 's' : ''}${
    children ? `, ${children} child${children !== 1 ? 'ren' : ''}` : ''
  } · 1 room`

  return (
    <div className="space-y-6">

      {/* DESTINATION */}
      <div className="relative">
        <label className="text-sm text-gray-600">Where to?</label>
        <input
          className="input-field"
          value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedCity(null)
          }}
          placeholder="City, region or hotel"
        />

        {results.length > 0 && !selectedCity && (
          <div className="absolute z-30 bg-white border rounded-xl mt-2 w-full">
            {results.map(c => (
              <div
                key={c.id}
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedCity(c)
                  setQuery(`${c.name}, ${c.country}`)
                  setResults([])
                }}
              >
                {c.name}, {c.country}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DATES */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          min={today}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="input-field"
        />

        <input
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="input-field"
        />
      </div>

      {/* TRAVELLERS */}
      <div ref={travellerRef} className="relative">
        <button
          className="input-field w-full text-left"
          onClick={() => setTravellerOpen(!travellerOpen)}
        >
          {label}
        </button>

        {travellerOpen && (
          <div className="absolute z-40 bg-white border rounded-xl p-4 w-full mt-2 space-y-4">

            {/* ADULTS */}
            <div className="flex justify-between">
              <span>Adults</span>
              <div className="flex gap-2">
                <button onClick={() => setAdults(Math.max(1, adults - 1))}>-</button>
                <span>{adults}</span>
                <button onClick={() => setAdults(adults + 1)}>+</button>
              </div>
            </div>

            {/* CHILDREN */}
            <div className="flex justify-between">
              <span>Children</span>
              <div className="flex gap-2">
                <button onClick={() => setChildren(Math.max(0, children - 1))}>-</button>
                <span>{children}</span>
                <button onClick={() => setChildren(children + 1)}>+</button>
              </div>
            </div>

            <button
              className="btn-primary w-full"
              onClick={() => setTravellerOpen(false)}
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* SEARCH */}
      <button onClick={handleSearch} className="btn-primary w-full">
        Search hotels
      </button>

    </div>
  )
}