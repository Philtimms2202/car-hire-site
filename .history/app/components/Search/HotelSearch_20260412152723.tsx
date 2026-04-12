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

  // 🔥 FIXED EXPEDIA FORMAT (THIS IS THE REAL FIX)
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

    // ✔ IMPORTANT: per-room alignment MUST stay intact
    params.append(
      'adults',
      rooms.map(r => r.adults).join(',')
    )

    params.append(
      'children',
      rooms.map(r => r.children).join(',')
    )

    const url = `${baseUrl}/Hotel-Search?${params.toString()}`
    window.open(url, '_blank')
  }

  const travellersLabel =
    `${rooms.reduce((a, r) => a + r.adults, 0)} adults` +
    (rooms.some(r => r.children > 0)
      ? `, ${rooms.reduce((a, r) => a + r.children, 0)} children`
      : '') +
    ` · ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`

  return (
    <div className="space-y-6">

      {/* WHERE TO */}
      <input
        className="input-field"
        placeholder="Where to?"
        value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : query}
        onChange={(e) => {
          setQuery(e.target.value)
          setSelectedCity(null)
        }}
      />

      {/* DATES */}
      <div className="grid grid-cols-2 gap-4">
        <input type="date" min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="input-field" />
        <input type="date" min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="input-field" />
      </div>

      {/* TRAVELLERS */}
      <div ref={travellerRef} className="relative">

        <button className="input-field w-full text-left" onClick={() => setTravellerOpen(!travellerOpen)}>
          {travellersLabel}
        </button>

        {travellerOpen && (
          <div className="absolute z-40 bg-white border rounded-xl p-4 w-full mt-2 space-y-4">

            {rooms.map((room, i) => (
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
                    <button onClick={() => updateRoom(i, 'adults', Math.max(1, room.adults - 1))}>-</button>
                    <span>{room.adults}</span>
                    <button onClick={() => updateRoom(i, 'adults', room.adults + 1)}>+</button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span>Children</span>
                  <div className="flex gap-2">
                    <button onClick={() => updateRoom(i, 'children', Math.max(0, room.children - 1))}>-</button>
                    <span>{room.children}</span>
                    <button onClick={() => updateRoom(i, 'children', room.children + 1)}>+</button>
                  </div>
                </div>

              </div>
            ))}

            {rooms.length < 5 && (
              <button onClick={addRoom} className="text-[#03989e] text-sm">
                + Add room
              </button>
            )}

            <button className="btn-primary w-full" onClick={() => setTravellerOpen(false)}>
              Done
            </button>
          </div>
        )}
      </div>

      <button onClick={handleSearch} className="btn-primary w-full">
        Search hotels
      </button>

    </div>
  )
}