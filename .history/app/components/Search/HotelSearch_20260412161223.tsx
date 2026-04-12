'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale } from '@/context/localeContext'
import { format } from 'date-fns'

interface City {
  name: string
  country: string
  id: string
}

type Room = {
  adults: number
  children: number
  ages: number[]
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

export default function HotelSearch({
  activeTab,
  setActiveTab,
}: {
  activeTab?: string
  setActiveTab?: (tab: any) => void
}) {
  const { language, currency } = useLocale()

  const [query, setQuery] = useState('')
  const [cityResults, setCityResults] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const [rooms, setRooms] = useState<Room[]>([
    { adults: 2, children: 0, ages: [] },
  ])

  const [travellerOpen, setTravellerOpen] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const travellerRef = useRef<HTMLDivElement>(null)

  const today = format(new Date(), 'yyyy-MM-dd')

  const baseUrl =
    EXPEDIA_DOMAIN_MAP[currency as keyof typeof EXPEDIA_DOMAIN_MAP] ||
    EXPEDIA_DOMAIN_MAP.GBP

  // ----------------------------
  // City search
  // ----------------------------
  useEffect(() => {
    if (!query || selectedCity) return

    const t = setTimeout(async () => {
      const res = await fetch(`/api/hotel-cities?q=${query}`)
      const data = await res.json()
      setCityResults(data)
    }, 250)

    return () => clearTimeout(t)
  }, [query, selectedCity])

  // close dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node)
      ) {
        setCityResults([])
      }

      if (
        travellerRef.current &&
        !travellerRef.current.contains(e.target as Node)
      ) {
        setTravellerOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ----------------------------
  // Room logic
  // ----------------------------
  const addRoom = () => {
    if (rooms.length >= 5) return
    setRooms([...rooms, { adults: 1, children: 0, ages: [] }])
  }

  const updateRoom = (
    i: number,
    field: 'adults' | 'children',
    value: number
  ) => {
    const updated = [...rooms]
    const r = updated[i]

    if (field === 'adults') r.adults = Math.max(1, value)

    if (field === 'children') {
      r.children = Math.max(0, value)

      const diff = r.children - r.ages.length

      if (diff > 0) r.ages.push(...Array(diff).fill(7))
      else if (diff < 0) r.ages = r.ages.slice(0, r.children)
    }

    setRooms(updated)
  }

  const updateAge = (i: number, ci: number, age: number) => {
    const updated = [...rooms]
    updated[i].ages[ci] = age
    setRooms(updated)
  }

  // ----------------------------
  // Expedia builder (FIXED)
  // ----------------------------
  const handleSearch = () => {
    if (!selectedCity) return

    const params = new URLSearchParams()

    params.set(
      'destination',
      `${selectedCity.name}, ${selectedCity.country}`
    )

    params.set('lang', language)
    params.set('rooms', String(rooms.length))

    if (checkIn) params.set('d1', checkIn)
    if (checkOut) params.set('d2', checkOut)

    params.set('adults', rooms.map(r => r.adults).join(','))

    // ✅ CRITICAL FIX (multi-room children correct format)
    params.set(
      'children',
      rooms
        .map(r =>
          r.children > 0
            ? `${r.children}_${r.ages.join('_')}`
            : '0'
        )
        .join(',')
    )

    window.open(`${baseUrl}/Hotel-Search?${params.toString()}`, '_blank')
  }

  const totalAdults = rooms.reduce((s, r) => s + r.adults, 0)
  const totalChildren = rooms.reduce((s, r) => s + r.children, 0)

  const label = `${totalAdults} adult${totalAdults !== 1 ? 's' : ''}${
    totalChildren ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}` : ''
  }, ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`

  return (
    <div className="w-full">

      {/* ================= TABS (NEW) ================= */}
      {setActiveTab && activeTab && (
        <div className="flex justify-center gap-6 mb-6">
          {['flights', 'hotels', 'experiences', 'cars'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-lg font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-[#03989e] text-[#03989e]'
                  : 'text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* ================= SEARCH BOX ================= */}
      <div className="bg-white rounded-2xl p-6 shadow-xl text-black">

        {/* DESTINATION */}
        <div className="relative mb-4" ref={resultsRef}>
          <input
            className="w-full border rounded-lg px-4 py-3 text-sm"
            placeholder="Where are you going?"
            value={
              selectedCity
                ? `${selectedCity.name}, ${selectedCity.country}`
                : query
            }
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedCity(null)
            }}
          />

          {cityResults.length > 0 && !selectedCity && (
            <div className="absolute z-30 bg-white border rounded-lg mt-2 w-full max-w-[420px] shadow-xl max-h-60 overflow-y-auto">
              {cityResults.map((c) => (
                <div
                  key={c.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setSelectedCity(c)
                    setCityResults([])
                  }}
                >
                  {c.name}, {c.country}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            type="date"
            className="border rounded-lg px-3 py-2 text-sm"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
          <input
            type="date"
            className="border rounded-lg px-3 py-2 text-sm"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        {/* TRAVELLERS */}
        <div className="relative" ref={travellerRef}>
          <button
            onClick={() => setTravellerOpen(!travellerOpen)}
            className="w-full border rounded-lg px-4 py-3 text-left text-sm"
          >
            {label}
          </button>

          {travellerOpen && (
            <div className="absolute z-40 bg-white border rounded-xl shadow-xl mt-2 p-4 w-full max-w-[420px]">

              {rooms.map((r, i) => (
                <div key={i} className="border-b pb-3 mb-3">

                  <div className="flex justify-between mb-2">
                    <strong>Room {i + 1}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span>Adults</span>
                    <div className="flex gap-2">
                      <button onClick={() => updateRoom(i, 'adults', r.adults - 1)}>-</button>
                      <span>{r.adults}</span>
                      <button onClick={() => updateRoom(i, 'adults', r.adults + 1)}>+</button>
                    </div>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span>Children</span>
                    <div className="flex gap-2">
                      <button onClick={() => updateRoom(i, 'children', r.children - 1)}>-</button>
                      <span>{r.children}</span>
                      <button onClick={() => updateRoom(i, 'children', r.children + 1)}>+</button>
                    </div>
                  </div>

                  {/* CHILD AGE UI (cleaned) */}
                  {r.children > 0 && (
                    <div className="mt-2 space-y-2">
                      {r.ages.map((age, ci) => (
                        <div key={ci} className="flex justify-between text-xs">
                          <span>Child {ci + 1} age</span>
                          <select
                            className="border rounded px-2 py-1"
                            value={age}
                            onChange={(e) =>
                              updateAge(i, ci, Number(e.target.value))
                            }
                          >
                            {Array.from({ length: 18 }, (_, n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {rooms.length < 5 && (
                <button
                  className="text-[#03989e] text-sm"
                  onClick={addRoom}
                >
                  + Add room
                </button>
              )}

              <button
                onClick={() => setTravellerOpen(false)}
                className="w-full mt-3 bg-[#03989e] text-white rounded-lg py-2"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* SEARCH */}
        <button
          onClick={handleSearch}
          className="w-full mt-4 bg-[#03989e] text-white rounded-lg py-3"
        >
          Search hotels
        </button>

      </div>
    </div>
  )
}