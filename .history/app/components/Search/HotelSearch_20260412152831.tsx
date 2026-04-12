'use client'

import { useState, useEffect, useRef } from 'react'
import { useLocale } from '@/context/localeContext'
import { format } from 'date-fns'

type City = {
  name: string
  country: string
  id: string
}

type Room = {
  adults: number
  children: number
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

  const [rooms, setRooms] = useState<Room[]>([
    { adults: 2, children: 0 }
  ])

  const [travellerOpen, setTravellerOpen] = useState(false)

  const travellerRef = useRef<HTMLDivElement>(null)
  const today = format(new Date(), 'yyyy-MM-dd')

  const baseUrl =
    EXPEDIA_DOMAIN_MAP[currency] || EXPEDIA_DOMAIN_MAP.GBP

  // ✅ FIX: prevents click lock issues
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (travellerRef.current && !travellerRef.current.contains(e.target as Node)) {
        setTravellerOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!query || selectedCity) return

    const t = setTimeout(async () => {
      const res = await fetch(`/api/hotel-cities?q=${query}`)
      const data = await res.json()
      setResults(data)
    }, 250)

    return () => clearTimeout(t)
  }, [query, selectedCity])

  const updateRoom = (i: number, field: keyof Room, value: number) => {
    const copy = [...rooms]
    copy[i][field] = value
    setRooms(copy)
  }

  const addRoom = () => {
    if (rooms.length >= 5) return
    setRooms([...rooms, { adults: 1, children: 0 }])
  }

  const removeRoom = (i: number) => {
    if (rooms.length === 1) return
    setRooms(rooms.filter((_, idx) => idx !== i))
  }

  // 🔥 EXPEDIA FIXED FORMAT (NO ZERO BUGS)
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

    params.append('rooms', String(rooms.length))

    params.append('adults', rooms.map(r => r.adults).join(','))

    // ONLY include actual children (prevents Expedia reset bug)
    const children = rooms
      .map(r => r.children)
      .filter(c => c > 0)

    if (children.length > 0) {
      params.append('children', children.join(','))
    }

    window.open(`${baseUrl}/Hotel-Search?${params.toString()}`, '_blank')
  }

  const label =
    `${rooms.reduce((a, r) => a + r.adults, 0)} adults` +
    (rooms.some(r => r.children > 0)
      ? `, ${rooms.reduce((a, r) => a + r.children, 0)} children`
      : '') +
    ` · ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`

  return (
    <div className="space-y-6">

      {/* DESTINATION */}
      <div className="relative z-10">
        <input
          className="input-field"
          value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedCity(null)
          }}
          placeholder="Where to?"
        />

        {results.length > 0 && !selectedCity && (
          <div className="absolute z-50 bg-white border rounded-xl mt-2 w-full">
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
        <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="input-field" />
        <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="input-field" />
      </div>

      {/* TRAVELLERS */}
      <div ref={travellerRef} className="relative z-20">
        <button
          className="input-field w-full text-left"
          onClick={() => setTravellerOpen(!travellerOpen)}
        >
          {label}
        </button>

        {travellerOpen && (
          <div className="absolute z-50 bg-white border rounded-xl p-4 w-full mt-2">
            {rooms.map((r, i) => (
              <div key={i} className="border-b pb-3">
                <div className="flex justify-between">
                  <strong>Room {i + 1}</strong>
                  {rooms.length > 1 && (
                    <button onClick={() => removeRoom(i)} className="text-red-500 text-sm">
                      Remove
                    </button>
                  )}
                </div>

                <div className="flex justify-between">
                  <span>Adults</span>
                  <div className="flex gap-2">
                    <button onClick={() => updateRoom(i, 'adults', Math.max(1, r.adults - 1))}>-</button>
                    <span>{r.adults}</span>
                    <button onClick={() => updateRoom(i, 'adults', r.adults + 1)}>+</button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span>Children</span>
                  <div className="flex gap-2">
                    <button onClick={() => updateRoom(i, 'children', Math.max(0, r.children - 1))}>-</button>
                    <span>{r.children}</span>
                    <button onClick={() => updateRoom(i, 'children', r.children + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}

            {rooms.length < 5 && (
              <button onClick={addRoom} className="text-[#03989e] text-sm">
                + Add room
              </button>
            )}

            <button className="btn-primary w-full mt-3" onClick={() => setTravellerOpen(false)}>
              Done
            </button>
          </div>
        )}
      </div>

      {/* SEARCH */}
      <button className="btn-primary w-full" onClick={handleSearch}>
        Search hotels
      </button>

    </div>
  )
}