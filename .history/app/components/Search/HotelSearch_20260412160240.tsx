'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from '@/context/localeContext'
import { format } from 'date-fns'

interface City {
  name: string
  country: string
  id: string
}

type Room = {
  adults: number
  children: number[]
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
    { adults: 2, children: [] }
  ])

  const [travellerOpen, setTravellerOpen] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)
  const travellerRef = useRef<HTMLDivElement>(null)

  const today = format(new Date(), 'yyyy-MM-dd')
  const baseUrl = EXPEDIA_DOMAIN_MAP[currency] || EXPEDIA_DOMAIN_MAP.GBP
  const PID = 'UK.DIRECT.PHG.1011l428377'

  /* ---------------- CITY SEARCH ---------------- */

  useEffect(() => {
    if (!query || selectedCity) return

    const t = setTimeout(async () => {
      const res = await fetch(`/api/hotel-cities?q=${query}`)
      const data = await res.json()
      setCityResults(data)
    }, 250)

    return () => clearTimeout(t)
  }, [query, selectedCity])

  /* ---------------- OUTSIDE CLICK ---------------- */

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (travellerRef.current && !travellerRef.current.contains(e.target as Node)) {
        setTravellerOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ---------------- ROOM LOGIC ---------------- */

  const addRoom = () => {
    if (rooms.length >= 5) return
    setRooms([...rooms, { adults: 2, children: [] }])
  }

  const removeRoom = (i: number) => {
    if (rooms.length === 1) return
    setRooms(rooms.filter((_, idx) => idx !== i))
  }

  const updateAdults = (i: number, value: number) => {
    const copy = [...rooms]
    copy[i].adults = Math.max(1, value)
    setRooms(copy)
  }

  const addChild = (i: number) => {
    const copy = [...rooms]
    if (copy[i].children.length < 3) {
      copy[i].children.push(7)
    }
    setRooms(copy)
  }

  const updateChildAge = (roomIndex: number, childIndex: number, age: number) => {
    const copy = [...rooms]
    copy[roomIndex].children[childIndex] = age
    setRooms(copy)
  }

  const removeChild = (roomIndex: number) => {
    const copy = [...rooms]
    copy[roomIndex].children.pop()
    setRooms(copy)
  }

  /* ---------------- EXPEDIA BUILD (FIXED) ---------------- */

  const handleSearch = () => {
    if (!selectedCity) return

    const params = new URLSearchParams({
      destination: `${selectedCity.name}, ${selectedCity.country}`,
      affcid: PID,
      lang: language,
      sort: 'RECOMMENDED'
    })

    if (checkIn) {
      params.append('d1', checkIn)
      params.append('startDate', checkIn)
    }

    if (checkOut) {
      params.append('d2', checkOut)
      params.append('endDate', checkOut)
    }

    // adults per room
    params.append(
      'adults',
      rooms.map(r => r.adults).join(',')
    )

    // children per room (STABLE FORMAT)
    const childrenParam = rooms
      .map(room =>
        room.children.length > 0
          ? `${room.children.length}_${room.children.join('_')}`
          : '0'
      )
      .join(',')

    params.append('children', childrenParam)
    params.append('rooms', String(rooms.length))

    window.open(`${baseUrl}/Hotel-Search?${params.toString()}`, '_blank')
  }

  /* ---------------- LABEL ---------------- */

  const totalAdults = rooms.reduce((s, r) => s + r.adults, 0)
  const totalChildren = rooms.reduce((s, r) => s + r.children.length, 0)

  const label =
    `${totalAdults} adult${totalAdults !== 1 ? 's' : ''}` +
    (totalChildren > 0
      ? `, ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}`
      : '') +
    `, ${rooms.length} room${rooms.length !== 1 ? 's' : ''}`

  /* ---------------- UI (RESTORED STYLE) ---------------- */

  return (
    <div className="w-full">

      {/* CITY */}
      <div className="mb-4 relative" ref={resultsRef}>
        <label className="block text-xs font-semibold text-[#022135] mb-1">
          Where to?
        </label>

        <input
          value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedCity(null)
          }}
          placeholder="City, region, or landmark"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
        />

        {cityResults.length > 0 && !selectedCity && (
          <div className="absolute z-20 bg-white border rounded-lg mt-1 w-full shadow-xl">
            {cityResults.map(c => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedCity(c)
                  setCityResults([])
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                <span className="font-medium">{c.name}</span>, {c.country}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DATES */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-semibold text-[#022135]">Check-in</label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#022135]">Check-out</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-sm"
          />
        </div>
      </div>

      {/* ROOMS */}
      <div ref={travellerRef}>
        <label className="text-xs font-semibold text-[#022135]">
          Travellers & rooms
        </label>

        <button
          onClick={() => setTravellerOpen(!travellerOpen)}
          className="w-full border rounded-lg px-4 py-3 text-left text-sm"
        >
          {label}
        </button>

        {travellerOpen && (
          <div className="absolute z-30 mt-2 w-full bg-white border rounded-xl shadow-xl p-4">

            {rooms.map((room, i) => (
              <div key={i} className="mb-4 border-b pb-3">

                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Room {i + 1}</span>
                  {rooms.length > 1 && (
                    <button
                      className="text-red-500 text-xs"
                      onClick={() => removeRoom(i)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* adults */}
                <div className="flex justify-between items-center mb-2">
                  <span>Adults</span>
                  <div className="flex gap-2">
                    <button onClick={() => updateAdults(i, room.adults - 1)}>-</button>
                    <span>{room.adults}</span>
                    <button onClick={() => updateAdults(i, room.adults + 1)}>+</button>
                  </div>
                </div>

                {/* children */}
                <div>
                  <div className="flex justify-between items-center">
                    <span>Children</span>
                    <button onClick={() => addChild(i)} className="text-blue-600 text-xs">
                      + Add child
                    </button>
                  </div>

                  {room.children.map((age, ci) => (
                    <select
                      key={ci}
                      value={age}
                      onChange={(e) =>
                        updateChildAge(i, ci, Number(e.target.value))
                      }
                      className="mt-2 w-full border rounded p-2 text-sm"
                    >
                      {Array.from({ length: 17 }, (_, n) => (
                        <option key={n} value={n}>
                          Child {ci + 1} age {n}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>

              </div>
            ))}

            <button onClick={addRoom} className="text-[#03989e] text-sm">
              + Add room
            </button>

          </div>
        )}
      </div>

      {/* SEARCH */}
      <button
        onClick={handleSearch}
        className="w-full mt-4 bg-[#03989e] text-white py-3 rounded-lg"
      >
        Search hotels
      </button>

    </div>
  )
}