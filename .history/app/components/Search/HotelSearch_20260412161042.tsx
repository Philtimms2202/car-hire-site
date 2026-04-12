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

export default function HotelSearch() {
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

            {/* TAB MENU */}
        <div className="flex justify-center gap-6 mb-8">
          {['flights', 'hotels', 'experiences', 'cars'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-lg font-medium ${activeTab === tab ? 'border-b-2 border-white' : 'text-gray-400'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

  // -----------------------------
  // City search
  // -----------------------------
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

  // -----------------------------
  // Room logic
  // -----------------------------
  const addRoom = () => {
    if (rooms.length >= 5) return
    setRooms([...rooms, { adults: 2, children: 0, ages: [] }])
  }

  const removeRoom = (index: number) => {
    if (rooms.length === 1) return
    setRooms(rooms.filter((_, i) => i !== index))
  }

  const updateRoom = (
    index: number,
    field: 'adults' | 'children',
    value: number
  ) => {
    const updated = [...rooms]
    const room = updated[index]

    if (field === 'adults') {
      room.adults = Math.max(1, value)
    }

    if (field === 'children') {
      room.children = Math.max(0, value)

      // sync ages array
      const diff = room.children - room.ages.length

      if (diff > 0) {
        room.ages.push(...Array(diff).fill(7))
      } else if (diff < 0) {
        room.ages = room.ages.slice(0, room.children)
      }
    }

    setRooms(updated)
  }

  const updateAge = (roomIndex: number, childIndex: number, age: number) => {
    const updated = [...rooms]
    updated[roomIndex].ages[childIndex] = age
    setRooms(updated)
  }

  // -----------------------------
  // Expedia builder (FIXED)
  // -----------------------------
  const handleSearch = () => {
    if (!selectedCity) return

    const params = new URLSearchParams()

    params.set(
      'destination',
      `${selectedCity.name}, ${selectedCity.country}`
    )

    params.set('lang', language)
    params.set('rooms', String(rooms.length))

    if (checkIn) {
      params.set('d1', checkIn)
      params.set('startDate', checkIn)
    }

    if (checkOut) {
      params.set('d2', checkOut)
      params.set('endDate', checkOut)
    }

    // ✅ CRITICAL FIX: Expedia expects per-room child encoding
    const adults = rooms.map(r => r.adults).join(',')
    params.set('adults', adults)

    const children = rooms
      .map(r =>
        r.children > 0
          ? `${r.children}_${r.ages.join('_')}`
          : '0'
      )
      .join(',')

    // IMPORTANT: ALWAYS send children param (even if 0)
    params.set('children', children)

    const url = `${baseUrl}/Hotel-Search?${params.toString()}`
    window.open(url, '_blank')
  }

  // -----------------------------
  // UI labels
  // -----------------------------
  const totalAdults = rooms.reduce((s, r) => s + r.adults, 0)
  const totalChildren = rooms.reduce((s, r) => s + r.children, 0)

  const label = `${totalAdults} adult${totalAdults !== 1 ? 's' : ''}${
    totalChildren ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}` : ''
  }, ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl p-6 shadow-xl text-black">

        {/* DESTINATION */}
        <div className="relative mb-4" ref={resultsRef}>
          <label className="text-xs font-semibold">Where to?</label>
          <input
            className="w-full border rounded-lg px-4 py-3 text-sm"
            value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedCity(null)
            }}
            placeholder="City or destination"
          />

          {cityResults.length > 0 && !selectedCity && (
            <div className="absolute z-30 bg-white border rounded-lg mt-2 w-full max-w-[420px] shadow-xl max-h-64 overflow-y-auto">
              {cityResults.map((c) => (
                <div
                  key={c.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setSelectedCity(c)
                    setCityResults([])
                  }}
                >
                  <span className="font-medium">{c.name}</span>, {c.country}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* TRAVELLERS */}
        <div className="relative" ref={travellerRef}>
          <button
            className="w-full border rounded-lg px-4 py-3 text-left text-sm"
            onClick={() => setTravellerOpen(!travellerOpen)}
          >
            {label}
          </button>

          {travellerOpen && (
            <div className="absolute z-40 bg-white border rounded-xl shadow-xl mt-2 p-4 w-full max-w-[420px]">

              {rooms.map((room, i) => (
                <div key={i} className="border-b pb-3 mb-3">

                  <div className="flex justify-between mb-2">
                    <strong>Room {i + 1}</strong>

                    {rooms.length > 1 && (
                      <button
                        className="text-red-500 text-xs"
                        onClick={() => removeRoom(i)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Adults */}
                  <div className="flex justify-between mb-2">
                    <span>Adults</span>
                    <div className="flex gap-2">
                      <button onClick={() => updateRoom(i, 'adults', room.adults - 1)}>-</button>
                      <span>{room.adults}</span>
                      <button onClick={() => updateRoom(i, 'adults', room.adults + 1)}>+</button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex justify-between mb-2">
                    <span>Children</span>
                    <div className="flex gap-2">
                      <button onClick={() => updateRoom(i, 'children', room.children - 1)}>-</button>
                      <span>{room.children}</span>
                      <button onClick={() => updateRoom(i, 'children', room.children + 1)}>+</button>
                    </div>
                  </div>

                  {/* Ages */}
                  {room.children > 0 && (
                    <div className="space-y-2 mt-2">
                      {room.ages.map((age, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-xs">Child {idx + 1} age</span>
                          <select
                            className="border rounded px-2 py-1 text-xs"
                            value={age}
                            onChange={(e) =>
                              updateAge(i, idx, Number(e.target.value))
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
                className="w-full mt-3 bg-[#03989e] text-white rounded-lg py-2"
                onClick={() => setTravellerOpen(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* SEARCH */}
        <button
          onClick={handleSearch}
          className="w-full mt-4 bg-[#03989e] text-white rounded-lg py-3 font-medium"
        >
          Search hotels
        </button>

      </div>
    </div>
  )
}