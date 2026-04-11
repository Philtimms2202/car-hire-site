'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from '@/context/localeContext'
import { format } from 'date-fns'

interface City {
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
  const [cityResults, setCityResults] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [childrenAges, setChildrenAges] = useState<number[]>([])

  const [travellerOpen, setTravellerOpen] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const travellerRef = useRef<HTMLDivElement>(null)

  const PID = 'UK.DIRECT.PHG.1011l428377'
  const today = format(new Date(), 'yyyy-MM-dd')

  const supportedCurrency = EXPEDIA_DOMAIN_MAP[currency] ? currency : 'GBP'
  const baseUrl = EXPEDIA_DOMAIN_MAP[supportedCurrency]

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target as Node)) {
        setCityResults([])
      }
      if (travellerRef.current && !travellerRef.current.contains(e.target as Node)) {
        setTravellerOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Auto-fix checkout when check-in changes
  useEffect(() => {
    if (!checkIn) return
    if (!checkOut || checkOut < checkIn) {
      setCheckOut(checkIn)
    }
  }, [checkIn])

  // Keep childrenAges array in sync with children count
  useEffect(() => {
    setChildrenAges((prev) => {
      const next = [...prev]
      if (children > next.length) {
        while (next.length < children) next.push(5) // default age
      } else if (children < next.length) {
        next.length = children
      }
      return next
    })
  }, [children])

  const handleChildAgeChange = (index: number, value: number) => {
    setChildrenAges((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleSearch = () => {
    if (!selectedCity) return

    const params = new URLSearchParams({
      destination: `${selectedCity.name}, ${selectedCity.country}`,
      affcid: PID,
      lang: language,
      adults: adults.toString(),
      rooms: rooms.toString(),
    })

    // Dates
    if (checkIn) {
      params.append('d1', checkIn)
      params.append('startDate', checkIn)
    }
    if (checkOut) {
      params.append('d2', checkOut)
      params.append('endDate', checkOut)
    }

    // Children + ages
    if (children > 0) {
      params.append('children', children.toString())
      childrenAges.forEach((age, idx) => {
        params.append(`childAge${idx + 1}`, age.toString())
      })
    }

    const url = `${baseUrl}/Hotel-Search?${params.toString()}`
    window.open(url, '_blank')
  }

  const travellersLabel = `${adults + children} traveller${adults + children > 1 ? 's' : ''}, ${rooms} room${rooms > 1 ? 's' : ''}`

  const childAgeOptions = [
    { label: 'Under 1', value: 0 },
    ...Array.from({ length: 17 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 })),
  ]

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-[900px] bg-white shadow-lg rounded-xl p-6 border border-gray-100">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Destination */}
          <div className="relative" ref={resultsRef}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Where to?</label>
            <input
              type="text"
              placeholder="City, region, or landmark"
              value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedCity(null)
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {cityResults.length > 0 && !selectedCity && (
              <div className="absolute z-20 bg-white border rounded-lg mt-1 w-full max-h-60 overflow-y-auto shadow-xl">
                {cityResults.map((c) => (
                  <div
                    key={c.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition text-sm"
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

          {/* Dates */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Check-in</label>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition mb-2 md:mb-3"
            />
            <label className="block text-xs font-semibold text-gray-600 mb-1">Check-out</label>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Travellers */}
          <div className="relative" ref={travellerRef}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Travellers</label>
            <button
              type="button"
              onClick={() => setTravellerOpen((o) => !o)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-left text-sm flex justify-between items-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <span>{travellersLabel}</span>
              <span className="text-gray-500 text-xs">Edit</span>
            </button>

            {travellerOpen && (
              <div className="absolute z-30 mt-2 w-72 bg-white border rounded-xl shadow-xl p-4 text-sm right-0">
                {/* Adults */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-xs text-gray-500">Ages 18+</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults((a) => Math.max(1, a - 1))}
                      className="w-7 h-7 border rounded-full flex items-center justify-center text-gray-700"
                    >
                      -
                    </button>
                    <span>{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults((a) => a + 1)}
                      className="w-7 h-7 border rounded-full flex items-center justify-center text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-xs text-gray-500">Ages 0–17</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren((c) => Math.max(0, c - 1))}
                      className="w-7 h-7 border rounded-full flex items-center justify-center text-gray-700"
                    >
                      -
                    </button>
                    <span>{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren((c) => Math.min(6, c + 1))}
                      className="w-7 h-7 border rounded-full flex items-center justify-center text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children ages */}
                {children > 0 && (
                  <div className="mb-3 space-y-2">
                    {childrenAges.map((age, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-600">Child {idx + 1} age</span>
                        <select
                          value={age}
                          onChange={(e) => handleChildAgeChange(idx, Number(e.target.value))}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-xs"
                        >
                          {childAgeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rooms */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium">Rooms</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRooms((r) => Math.max(1, r - 1))}
                      className="w-7 h-7 border rounded-full flex items-center justify-center text-gray-700"
                    >
                      -
                    </button>
                    <span>{rooms}</span>
                    <button
                      type="button"
                      onClick={() => setRooms((r) => Math.min(9, r + 1))}
                      className="w-7 h-7 border rounded-full flex items-center justify-center text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setTravellerOpen(false)}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm text-sm font-medium"
            >
              Search hotels
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}